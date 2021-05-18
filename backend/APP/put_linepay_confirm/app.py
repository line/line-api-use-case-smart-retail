import json
import os
import logging
import sys
from datetime import datetime
from dateutil.tz import gettz


from linepay import LinePayApi
from common import (common_const, line, utils, flex_message)
from validation.smart_register_param_check import SmartRegisterParamCheck
from common.channel_access_token import ChannelAccessToken
from smart_register.smart_register_order_info import SmartRegisterOrderInfo


# 環境変数
LIFF_CHANNEL_ID = int(os.environ.get("LIFF_CHANNEL_ID"))
LIFF_URL = os.environ.get("LIFF_URL")
LOGGER_LEVEL = os.environ.get("LOGGER_LEVEL")
LINE_PAY_ORDER_INFO_DB = os.environ.get("LINE_PAY_ORDER_INFO_DB")
CHANNEL_ACCESS_TOKEN_DB = os.environ.get("CHANNEL_ACCESS_TOKEN_DB")
DETAILS_PASS = os.environ.get("DETAILS_PASS")
# LINE Pay API
LINE_PAY_CHANNEL_ID = os.environ.get("LINE_PAY_CHANNEL_ID")
LINE_PAY_CHANNEL_SECRET = os.environ.get("LINE_PAY_CHANNEL_SECRET")
if (os.environ.get("LINE_PAY_IS_SANDBOX") == 'True'
        or os.environ.get("LINE_PAY_IS_SANDBOX") == 'true'):
    LINE_PAY_IS_SANDBOX = True
else:
    LINE_PAY_IS_SANDBOX = False
api = LinePayApi(LINE_PAY_CHANNEL_ID,
                 LINE_PAY_CHANNEL_SECRET, is_sandbox=LINE_PAY_IS_SANDBOX)

# ログ出力の設定
logger = logging.getLogger()
if LOGGER_LEVEL == 'DEBUG':
    logger.setLevel(logging.DEBUG)
else:
    logger.setLevel(logging.INFO)
# LINEリソースの宣言
OA_CHANNEL_ID = os.getenv('OA_CHANNEL_ID', None)
if OA_CHANNEL_ID is None:
    logger.error('Specify CHANNEL_ID as environment variable.')
    sys.exit(1)

# AWSリソースの生成
order_info_table = SmartRegisterOrderInfo()
accesstoken_table = ChannelAccessToken()


def send_messages(order_info, datetime_now):
    """
    OAへメッセージを送信をする
    Parameters
    ----------
        order_info:dict
            該当ユーザーの注文情報
        datetime_now:string
            決済日時
    Returns
    -------
        なし
    """
    # DBより短期チャネルアクセストークンを取得
    channel_access_token = accesstoken_table.get_item(OA_CHANNEL_ID)
    if channel_access_token is None:
        logger.error(
            'CHANNEL_ACCESS_TOKEN in Specified CHANNEL_ID: %s is not exist.',
            OA_CHANNEL_ID)
    else:
        order_id = order_info['orderId']
        details_url = LIFF_URL + DETAILS_PASS + '?orderId=' + order_id
        flex_obj = flex_message.create_receipt(
            order_info, datetime_now, details_url)

        line.send_push_message(
            channel_access_token['channelAccessToken'],
            flex_obj, order_info['userId'])


def lambda_handler(event, context):
    """
    LINE Pay API(confirm)の通信結果を返す
    Parameters
    ----------
        event : dict
            POST時に渡されたパラメータ
        context : dict
            コンテキスト内容。
    Returns
    -------
        response : dict
            LINE Pay APIの通信結果
    """
    # パラメータログ
    logger.info(event)
    body = json.loads(event['body'])
    if body is None:
        error_msg_display = common_const.const.MSG_ERROR_NOPARAM
        return utils.create_error_response(error_msg_display, 400)

    # パラメータバリデーションチェック
    param_checker = SmartRegisterParamCheck(body)
    if error_msg := param_checker.check_api_put_linepay_confirm():
        error_msg_disp = ('\n').join(error_msg)
        logger.error(error_msg_disp)
        return utils.create_error_response(error_msg_disp, status=400)  # noqa: E501

    order_id = body['orderId']
    # 注文履歴から決済金額を取得
    order_info = order_info_table.get_item(order_id)

    amount = float(order_info['amount'])
    transaction_id = int(body['transactionId'])
    currency = 'JPY'
    datetime_now = datetime.now(gettz('Asia/Tokyo'))

    try:
        api_response = api.confirm(transaction_id, amount, currency)
        # DB更新
        order_info_table.update_transaction(
            order_id, transaction_id, utils.get_ttl_time(datetime_now))

        # メッセージ送信処理
        send_messages(order_info,
                      datetime_now.strftime('%Y/%m/%d %H:%M:%S'))

    except Exception as e:
        logger.exception('Occur Exception: %s', e)
        return utils.create_error_response('Error')

    response = utils.create_success_response(
        json.dumps(api_response))
    logger.info('response %s', response)
    return response
