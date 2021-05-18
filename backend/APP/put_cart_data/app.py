import json
import logging
import os
import uuid
import math
import requests
import sys
import time
from decimal import Decimal
from datetime import (datetime, timedelta)
from dateutil.tz import gettz
from botocore.exceptions import ClientError

from common import (common_const, line, utils, flex_message)
from validation.smart_register_param_check import SmartRegisterParamCheck
from smart_register.smart_register_item_info import SmartRegisterItemInfo
from smart_register.smart_register_order_info import SmartRegisterOrderInfo
from smart_register.smart_register_coupon_info import SmartRegisterCouponInfo
from common.channel_access_token import ChannelAccessToken


# 環境変数の取得
LIFF_CHANNEL_ID = int(os.environ.get("LIFF_CHANNEL_ID"))
LIFF_URL = os.environ.get("LIFF_URL")
DETAILS_PASS = os.environ.get("DETAILS_PASS")
LOGGER_LEVEL = os.environ.get("LOGGER_LEVEL")
# 定数の定義
DISCOUNT_BY_PERCENTAGE = 1
DISCOUNT_BY_PRICE = 2
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

# テーブル操作クラスの初期化
item_info_table = SmartRegisterItemInfo()
order_info_table = SmartRegisterOrderInfo()
coupon_info_table = SmartRegisterCouponInfo()
accesstoken_table = ChannelAccessToken()


def create_payment_info(params, now):
    """
    新規のカート情報を登録する

    Parameters
    ----------
    params : dict
        postで送られてきたbodyの中身
    now : datetime
        現在時刻 [yyyy-m-d H:m:s] の形式

    Returns
    -------
    string
        新規発行したorderId
    """
    order_id = str(uuid.uuid4())
    user_id = params['userId']
    order_items = get_order_item_info(params['items'])
    amount_discount_way = None
    amount_discount_rate = None
    # クーポンがある場合は、クーポン情報を付与して合計金額を算出
    if 'couponId' in params :
        if params['couponId']:
            amount_coupon_info = coupon_info_table.get_item(params['couponId'])
            amount_discount_way = amount_coupon_info['discountWay']
            amount_discount_rate = amount_coupon_info['discountRate']
    amount = calc_amount(order_items, amount_discount_way, amount_discount_rate)
    # 翌日の0時
    delete_day = int(datetime.strptime(
        str(now.replace(hour=0, minute=0, second=0,
                        microsecond=0) + timedelta(days=1)),
        '%Y-%m-%d %H:%M:%S%z').timestamp())
    order_info = {
        'order_id': order_id,
        'user_id': user_id,
        'amount': amount,
        'discount_way': amount_discount_way,
        'discount_rate': amount_discount_rate,
        'transaction_id': 0,
        'expiration_date': delete_day,
        'item': order_items,
    }
    logger.debug('order_info: %s', order_info)
    try:
        order_info_table.put_item(**order_info)
        # ０円決済の場合はメッセージ送信
        if amount <= 0:
            msg_info = {'orderId': order_id,
                        'userId': user_id, 
                        'amount': amount}
            send_messages(msg_info, now.strftime('%Y/%m/%d %H:%M:%S'))
    except ClientError as e:
        if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
            logger.error("ID[%s]は重複しています。", order_id)
            order_info['order_id'] = str(uuid.uuid4())
            order_info_table.put_item(**order_info)
        raise

    # 決済金額が０円の場合は、フロント側で動作制御できるようorderIdをNullで返却
    order_id = None if amount <= 0 else order_id
    return order_id


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
        flex_obj = flex_message.create_receipt(order_info, datetime_now, details_url)

        line.send_push_message(
            channel_access_token['channelAccessToken'],
            flex_obj, order_info['userId'])


def calc_amount(order_items, amount_discount_way=None, amount_discount_rate=None):
    """
    注文合計金額を算出する
    割引計算は切り捨て処理を行う
    Parameters
    ----------
    order_items : dict
        追加する注文情報
    amount_discount_way: int
        合計金額に対するクーポンの割引種別
    amount_discount_rate: int
        合計金額に対するクーポンの割引率/額
    Returns
    -------
    amount : decimal
        注文合計金額
    """
    amount = 0
    # 商品単位割引計算
    for item in order_items:
        price = item['itemPrice']
        if 'discountWay' in item:
            if item['discountWay'] == DISCOUNT_BY_PRICE:
                price = price - item['discountRate']
            elif item['discountWay'] == DISCOUNT_BY_PERCENTAGE:
                price = float(price) * (1 - float(item['discountRate']) * 0.01)
        amount = amount + float(price) * float(item['quantity'])
    # 全体割引計算
    if amount_discount_way:
        if amount_discount_way == DISCOUNT_BY_PRICE:
            amount = amount - float(amount_discount_rate)
        elif amount_discount_way == DISCOUNT_BY_PERCENTAGE:
            amount = float(amount) * (1 - float(amount_discount_rate) * 0.01)
    amount = Decimal(math.floor(amount))
    # 0以下の場合は０円とする
    amount = 0 if amount <= 0 else amount
    return amount


def set_order_item(barcode, item_name, item_price, quantity, item_url,
                   coupon_id=None):
    """
    DB登録の形式に1商品情報のデータセットする

    Parameters
    ----------
    barcode : string
        商品バーコード
    item_name : string
        商品名
    item_price : int
        商品単価
    quantity : int
        注文数量
    item_url : string
        商品画像URL
    coupon_id : String
        クーポンID

    Returns
    -------
    order_item:dict
        注文商品情報
    """
    order_item = {
        'barcode': barcode,
        'itemName': item_name,
        'itemPrice': item_price,
        'quantity': quantity,
        'itemUrl': item_url,
        'couponId': coupon_id,
    }

    # 商品のクーポン情報を取得
    if coupon_id:
        coupon_info = coupon_info_table.get_item(coupon_id)
        order_item['discountWay'] = coupon_info['discountWay']
        order_item['discountRate'] = coupon_info['discountRate']

    return order_item


def get_order_item_info(items):
    """
    barcodeを元に注文登録用の商品情報を取得する

    Parameters
    ----------
    item : list
        postで送られてきたbodyの中身

    Returns
    -------
    order_items:dict
        注文商品情報
    """
    order_items = []    # DBに登録する商品リスト
    for item in items:
        barcode = item['barcode']
        item_info = item_info_table.get_item(barcode)
        order_item = set_order_item(
            barcode, item_info['itemName'], item_info['itemPrice'],
            item['quantity'], item_info['imageUrl'], item['couponId']
        )

        order_items.append(order_item)

    return order_items


def update_payment_info(params, now):
    """
    注文情報を更新する

    Parameters
    ----------
    params : dict
        postで送られてきたbodyの中身
    now : datetime
        現在時刻 [yyyy-m-d H:m:s] の形式

    Returns
    -------
    string
        更新したドキュメントのorderId
    """
    order_id = params['orderId']
    user_id = params['userId']
    order_items = get_order_item_info(params['items'])
    # クーポンがある場合は、クーポン情報を付与して合計金額を算出
    amount_discount_way = None
    amount_discount_rate = None
    if 'couponId' in params:
        if params['couponId']:
            amount_coupon_info = coupon_info_table.get_item(params['couponId'])
            amount_discount_way = amount_coupon_info['discountWay']
            amount_discount_rate = amount_coupon_info['discountRate']
    amount = calc_amount(order_items, amount_discount_way, amount_discount_rate)
    # 翌日の0時
    delete_day = int(datetime.strptime(
        str(now.replace(hour=0, minute=0, second=0, microsecond=0) +
            timedelta(days=1)),
        '%Y-%m-%d %H:%M:%S%z').timestamp())
    try:
        order_info_table.update_item(order_id, order_items, amount, delete_day,
                                     amount_discount_way, amount_discount_rate)
        # ０円決済の場合はメッセージ送信
        if amount <= 0:
            msg_info = {'orderId': order_id,
                        'userId': user_id, 
                        'amount': amount}
            send_messages(msg_info, now.strftime('%Y/%m/%d %H:%M:%S'))
    except ClientError as e:
        if e.response['Error']['Code'] == 'ConditionalCheckFailedException':  # noqa: E501
            logger.error(
                "会計済みか、注文IDが誤っています。[order_id: %s]",
                order_id)
        raise

    # 決済金額が０円の場合は、フロント側で動作制御できるようorderIdをNullで返却
    order_id = None if amount <= 0 else order_id
    return order_id


def put_order(params):
    """
    カート情報をDBに登録

    Parameters
    ----------
    terms : dict
        APIGatewayのGETパラメータ

    Returns
    -------
    list[dict]
        {カラム名: 値}のリスト
    """
    now = datetime.now(gettz('Asia/Tokyo'))

    if 'orderId' in params and params['orderId']:
        # 注文IDが存在しない場合は新規登録とする
        order_info = order_info_table.get_item(params['orderId'])
        if order_info:
            return update_payment_info(params, now)

    return create_payment_info(params, now)


def lambda_handler(event, context):
    """
    注文情報を登録する
    Parameters
    ----------
    event : dict
        フロントより渡されたパラメータ
    context : dict
        コンテキスト内容
    Returns
    -------
    order_id : dict
        注文ID
    """
    # パラメータログ
    logger.info(event)
    body = json.loads(event['body'])

    if body is None:
        error_msg_display = common_const.const.MSG_ERROR_NOPARAM
        return utils.create_error_response(error_msg_display, 400)
    # ユーザーID取得
    try:
        user_profile = line.get_profile(
            body['idToken'], LIFF_CHANNEL_ID)
        if 'error' in user_profile and 'expired' in user_profile['error_description']:  # noqa 501
            return utils.create_error_response('Forbidden', 403)
        else:
            body['userId'] = user_profile['sub']
    except Exception:
        logger.exception('不正なIDトークンが使用されています')
        return utils.create_error_response('Error')

    # パラメータバリデーションチェック
    param_checker = SmartRegisterParamCheck(body)

    if error_msg := param_checker.check_api_put_cart_data():
        error_msg_disp = ('\n').join(error_msg)
        logger.error(error_msg_disp)
        return utils.create_error_response(error_msg_disp, status=400)  # noqa: E501

    try:
        order_id = put_order(body)
    except Exception as e:
        logger.error('Occur Exception: %s', e)
        return utils.create_error_response('ERROR')
        
    body = json.dumps({'orderId': order_id})
    return utils.create_success_response(body)
