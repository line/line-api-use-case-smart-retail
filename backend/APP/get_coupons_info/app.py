import json
import os
import logging

from common import (common_const, utils)
from validation.smart_register_param_check import SmartRegisterParamCheck
from smart_register.smart_register_coupon_info import SmartRegisterCouponInfo

LOGGER_LEVEL = os.environ.get("LOGGER_LEVEL")

# ログ出力の設定
logger = logging.getLogger()
if LOGGER_LEVEL == 'DEBUG':
    logger.setLevel(logging.DEBUG)
else:
    logger.setLevel(logging.INFO)

# テーブル操作クラスの初期化
coupon_info_table = SmartRegisterCouponInfo()


def lambda_handler(event, context):
    """
    使用可能なクーポン情報を返す
    Parameters
    ----------
    event : dict
        フロントより渡されたパラメータ
    context : dict
        コンテキスト内容。
    Returns
    -------
    response : dict
        クーポン情報
    """
    # パラメータログ
    logger.info(event)

    # パラメータバリデーションチェック
    params = event['queryStringParameters']
    if params is None:
        error_msg_display = common_const.const.MSG_ERROR_NOPARAM
        return utils.create_error_response(error_msg_display, 400)

    param_checker = SmartRegisterParamCheck(params)
    if error_msg := param_checker.check_api_get_coupons_info():
        error_msg_disp = ('\n').join(error_msg)
        logger.error(error_msg_disp)
        return utils.create_error_response(error_msg_disp, status=400)  # noqa: E501

    try:
        item_info = coupon_info_table.scan_not_deleted()
    except Exception as e:
        logger.exception('Occur Exception: %s', e)
        return utils.create_error_response('Error')

    response = utils.create_success_response(
        json.dumps(item_info, default=utils.decimal_to_int,
                   ensure_ascii=False))
    logger.debug('response: %s', response)
    return response
