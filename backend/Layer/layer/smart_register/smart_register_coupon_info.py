"""
SmartRegisterCouponInfo操作用モジュール

"""
import os
from aws.dynamodb.base import DynamoDB


class SmartRegisterCouponInfo(DynamoDB):
    """SmartRegisterCouponInfo操作用クラス"""
    __slots__ = ['_table']

    def __init__(self):
        """初期化メソッド"""
        table_name = os.environ.get("LINE_PAY_COUPON_INFO_DB")
        super().__init__(table_name)
        self._table = self._db.Table(table_name)

    def get_item(self, coupon_id):
        """
        データ取得

        Parameters
        ----------
        coupon_id : str
            クーポンID

        Returns
        -------
        item : dict
            クーポン情報

        """
        key = {'couponId': coupon_id}

        try:
            item = self._get_item(key)
        except Exception as e:
            raise e
        return item

    def scan_not_deleted(self):
        """
        削除済みでないアイテムを取得する

        Returns
        -------
        items : list
            クーポン情報

        """
        try:
            items = self._scan('deleted', '')
        except Exception as e:
            raise e
        return items
