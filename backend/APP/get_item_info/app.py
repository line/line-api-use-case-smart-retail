import json
import os
import logging

from common import (common_const, utils)
from validation.smart_register_param_check import SmartRegisterParamCheck
from smart_register.smart_register_item_info import SmartRegisterItemInfo
from smart_register.smart_register_coupon_info import SmartRegisterCouponInfo

LOGGER_LEVEL = os.environ.get("LOGGER_LEVEL")

# ログ出力の設定
logger = logging.getLogger()
if LOGGER_LEVEL == 'DEBUG':
    logger.setLevel(logging.DEBUG)
else:
    logger.setLevel(logging.INFO)

# テーブル操作クラスの初期化
item_info_table = SmartRegisterItemInfo()
coupon_info_table = SmartRegisterCouponInfo()


def lambda_handler(event, context):
    """
    読み取ったバーコードの商品情報を返す
    Parameters
    ----------
    event : dict
        フロントより渡されたパラメータ
    context : dict
        コンテキスト内容。
    Returns
    -------
    response : dict
        商品情報
    """
    # パラメータログ
    logger.info(event)

    # パラメータバリデーションチェック
    params = event['queryStringParameters']
    if params is None:
        error_msg_display = common_const.const.MSG_ERROR_NOPARAM
        return utils.create_error_response(error_msg_display, 400)

    param_checker = SmartRegisterParamCheck(params)
    if error_msg := param_checker.check_api_get_item_info():
        error_msg_disp = ('\n').join(error_msg)
        logger.error(error_msg_disp)
        return utils.create_error_response(error_msg_disp, status=400)  # noqa: E501

    barcode = params['barcode']
    logger.debug(barcode)
    try:
        item_info = item_info_table.get_item(barcode)
        if item_info:
            target_product = {
                'Name': item_info['itemName'],
                'Price': item_info['itemPrice'],
                'ImageUrl': item_info['imageUrl']
            }
            # クーポン保持している商品はクーポン情報を返却
            if ('couponId' in params) and params['couponId']:
                coupon_info = coupon_info_table.get_item(item_info['couponId'])
                if coupon_info:
                    target_product['discountRate'] = item_info['discountRate'] if 'discountRate' in item_info.keys() else None  # noqa: E501
                    target_product['discountWay'] = item_info['discountWay'] if 'discountWay' in item_info.keys() else None  # noqa: E501
        else:
            # 未登録データの場合はERRORを返す
            target_product = {
                'Name': 'ERROR',
                'Price': 'ERROR',
                'ImageUrl': 'ERROR'
            }
    except Exception as e:
        logger.exception('Occur Exception: %s', e)
        return utils.create_error_response('Error')

    response = utils.create_success_response(
        json.dumps(target_product, default=utils.decimal_to_int,
                   ensure_ascii=False))
    logger.debug('response: %s', response)
    return response
