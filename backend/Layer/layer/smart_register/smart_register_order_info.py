"""
SmartRegisterOrderInfo操作用モジュール
# TODO: 動作確認後docString記載
"""
from logging import Logger
import os
from boto3.dynamodb.conditions import Key
from datetime import datetime
from dateutil.tz import gettz


from aws.dynamodb.base import DynamoDB


class SmartRegisterOrderInfo(DynamoDB):
    """SmartRegisterOrderInfo操作用クラス"""
    __slots__ = ['_table']

    def __init__(self):
        """初期化メソッド"""
        table_name = os.environ.get("LINE_PAY_ORDER_INFO_DB")
        super().__init__(table_name)
        self._table = self._db.Table(table_name)

    def get_item(self, order_id):
        """
        データ取得

        Parameters
        ----------
        order_id : str
            注文ID

        Returns
        -------
        item : dict
            注文情報

        """
        key = {'orderId': order_id}

        try:
            item = self._get_item(key)
        except Exception as e:
            raise e
        return item

    def update_date(self, order_id):
        """
        更新日を更新する

        Parameters
        ----------
        order_id : str
            注文ID

        Returns
        -------
        item: dict
            注文情報

        """
        now_str = datetime.now(
            gettz('Asia/Tokyo')).strftime("%Y/%m/%d %H:%M:%S")
        key = {'orderId': order_id}
        update_expression = 'set #updateDateTime = :updateDateTime'
        condition_expression = ''
        expression_attribute_names = {
            '#updateDateTime': 'updateDateTime'
        }
        expression_value = {
            ':updateDateTime': now_str
        }
        return_value = 'UPDATED_NEW'
        try:
            item = self._update_item(
                key, update_expression,
                condition_expression, expression_attribute_names,
                expression_value, return_value)
        except Exception as e:
            raise e
        return item

    def update_item(self, order_id,
                    item, amount, expiration_date,
                    amount_discount_way, amount_discount_rate):
        """
        データ更新を行う

        Parameters
        ----------
        order_id : str
            注文ID
        item : dict
            注文情報
        amount : int
            合計金額
        expiration_date : str
            TTLの削除日

        Returns
        -------
        item : dict
            注文情報

        """
        now_str = datetime.now(
            gettz('Asia/Tokyo')).strftime("%Y/%m/%d %H:%M:%S")
        key = {'orderId': order_id}
        update_expression = (
            'set #item = :item, '
            '#amount = :amount, '
            '#discountWay = :discountWay, '
            '#discountRate = :discountRate, '
            '#orderDateTime = :orderDateTime, '
            '#updateDateTime = :updateDateTime, '
            '#expirationDate = :expirationDate')
        condition_expression = 'orderId = :oid'
        expression_attribute_names = {
            '#item': 'item',
            '#amount': 'amount',
            '#discountWay': 'discountWay',
            '#discountRate': 'discountRate',
            '#orderDateTime': 'orderDateTime',
            '#updateDateTime': 'updateDateTime',
            '#expirationDate': 'expirationDate',
        }
        expression_value = {
            ':item': item,
            ':amount': amount,
            ':discountWay': amount_discount_way,
            ':discountRate': amount_discount_rate,
            ':oid': order_id,
            ':orderDateTime': now_str,
            ':updateDateTime': now_str,
            ':expirationDate': expiration_date,
        }
        # 決済金額が0以下の場合は、支払処理を実施
        if amount <= 0:
            update_expression = update_expression + ', #paidDateTime = :paidDateTime'  # noqa: E501
            expression_attribute_names['#paidDateTime'] = 'paidDateTime'
            expression_value[':paidDateTime'] = now_str
        return_value = 'UPDATED_NEW'
        try:
            item = self._update_item_optional(
                key, update_expression,
                condition_expression, expression_attribute_names,
                expression_value, return_value)
        except Exception as e:
            raise e
        return item

    def update_transaction(self, order_id,
                           transaction_id,
                           expiration_date):
        """
        トランザクションIDを更新する

        Parameters
        ----------
        order_id : str
            注文ID
        transaction_id : str
            トランザクションID
        expiration_date : str
            TTLで削除する日付

        Returns
        -------
        item : dict
            注文情報
        """
        now_str = datetime.now(
            gettz('Asia/Tokyo')).strftime("%Y/%m/%d %H:%M:%S")
        key = {'orderId': order_id}
        update_expression = (
            'set transactionId = :transactionId, '
            'paidDateTime = :paidDateTime, '
            'updateDateTime = :updateDateTime, '
            'expirationDate = :expirationDate')
        expression_value = {
            ':transactionId': transaction_id,
            ':paidDateTime': now_str,
            ':expirationDate': expiration_date,
            ':updateDateTime': now_str
        }
        return_value = 'UPDATED_NEW'
        try:
            item = self._update_item(
                key, update_expression,
                expression_value,
                return_value)
        except Exception as e:
            raise e
        return item

    def put_item(self, order_id, user_id, item, amount, 
                 discount_way, discount_rate, transaction_id, expiration_date):
        now_str = datetime.now(
            gettz('Asia/Tokyo')).strftime("%Y/%m/%d %H:%M:%S")
        item = {
            'orderId': order_id,
            'userId': user_id,
            'amount': amount,
            'discountWay': discount_way,
            'discountRate': discount_rate,
            'transactionId': transaction_id,
            'expirationDate': expiration_date,
            'item': item,
            'orderDateTime': now_str,
            'updateDateTime': now_str,
        }
        # 決済金額が0以下の場合は、支払処理を実施
        if amount<=0:
            item['paidDateTime'] = now_str
        print(item)
        try:
            self._put_item(item)
        except Exception as e:
            raise e
        return item

    def query_index_hash(self, user_id):
        """
        userId-orderId-indexのインデックスで検索を行う

        Parameters
        ----------
        user_id : str
            ユーザーID

        Returns
        -------
        items : list
            注文情報

        """
        index = 'userId-orderId-index'
        expression = Key('userId').eq(user_id)

        try:
            items = self._query_index(index, expression)
        except Exception as e:
            raise e
        return items

    def query_index_hash_range(self, user_id, order_id):
        """
        userId-orderId-indexのインデックスで検索を行う

        Parameters
        ----------
        user_id : str
            ユーザーID
        order_id : str
            注文ID
        Returns
        -------
        items : list
            注文情報

        """
        index = 'userId-orderId-index'
        expression = Key('userId').eq(user_id) & Key('orderId').eq(order_id)

        try:
            items = self._query_index(index, expression)
        except Exception as e:
            raise e
        return items
