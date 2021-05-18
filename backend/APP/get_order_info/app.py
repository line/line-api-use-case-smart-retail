import json
import os
import logging

from common import (common_const, line, utils)
from validation.smart_register_param_check import SmartRegisterParamCheck
from smart_register.smart_register_order_info import SmartRegisterOrderInfo


# 環境変数
LIFF_CHANNEL_ID = int(os.environ.get("LIFF_CHANNEL_ID"))
LOGGER_LEVEL = os.environ.get("LOGGER_LEVEL")

# ログ出力の設定
logger = logging.getLogger()
if LOGGER_LEVEL == 'DEBUG':
    logger.setLevel(logging.DEBUG)
else:
    logger.setLevel(logging.INFO)

# テーブル操作クラスの初期化
order_info_table = SmartRegisterOrderInfo()


def lambda_handler(event, context):
    """
    ユーザーまたは注文IDをもとに購入履歴を取得する
    Parameters
    ----------
        event : dict
            POST時に渡されたパラメータ
        context : dict
            コンテキスト内容。
    Returns
    -------
        response : dict
            購入履歴情報
    """
    # パラメータログ
    logger.info(event)
    params = event['queryStringParameters']

    if params is None:
        error_msg_display = common_const.const.MSG_ERROR_NOPARAM
        return utils.create_error_response(error_msg_display, 400)
    # ユーザーID取得
    try:
        user_profile = line.get_profile(
            params['idToken'], LIFF_CHANNEL_ID)
        if 'error' in user_profile and 'expired' in user_profile['error_description']:  # noqa 501
            return utils.create_error_response('Forbidden', 403)
        else:
            params['userId'] = user_profile['sub']
    except Exception:
        logger.exception('不正なIDトークンが使用されています')
        return utils.create_error_response('Error')

    # パラメータバリデーションチェック
    param_checker = SmartRegisterParamCheck(params)
    if error_msg := param_checker.check_api_get_order_info():
        error_msg_disp = ('\n').join(error_msg)
        logger.error(error_msg_disp)
        return utils.create_error_response(error_msg_disp, status=400)  # noqa: E501

    # 注文履歴を取得
    try:
        if 'orderId' in params:
            order_info = order_info_table.query_index_hash_range(
                params['userId'], params['orderId'])
        else:
            order_info = order_info_table.query_index_hash(params['userId'])

    except Exception as e:
        logger.exception('Occur Exception: %s', e)
        return utils.create_error_response('Error')

    response = utils.create_success_response(
        json.dumps(order_info, default=utils.decimal_to_int,
                   ensure_ascii=False))
    return response
