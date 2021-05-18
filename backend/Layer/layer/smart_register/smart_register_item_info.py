"""
SmartRegisterItemInfo操作用モジュール

"""
import os

from aws.dynamodb.base import DynamoDB


class SmartRegisterItemInfo(DynamoDB):
    """SmartRegisterItemInfo"""
    __slots__ = ['_table']

    def __init__(self):
        """初期化メソッド"""
        table_name = os.environ.get("LINE_PAY_ITEM_INFO_DB")
        super().__init__(table_name)
        self._table = self._db.Table(table_name)

    def get_item(self, barcode):
        """
        データ取得

        Parameters
        ----------
        barcode : str
            バーコードナンバー

        Returns
        -------
        item : dict
            クーポン情報

        """
        key = {'barcode': barcode}

        try:
            item = self._get_item(key)
        except Exception as e:
            raise e
        return item
