from validation.param_check import ParamCheck


class SmartRegisterParamCheck(ParamCheck):
    def __init__(self, params):
        self.barcode = params['barcode'] if 'barcode' in params else None
        self.order_id = params['orderId'] if 'orderId' in params else None
        self.items = params['items'] if 'items' in params else None  # noqa:E501
        self.transaction_id = params['transactionId'] if 'transactionId' in params else None  # noqa:E501

        self.error_msg = []

    def check_api_get_item_info(self):
        self.check_barcode()

        return self.error_msg

    def check_api_get_order_info(self):

        return self.error_msg

    def check_api_put_cart_data(self):
        self.check_item()

        return self.error_msg

    def check_api_put_linepay_request(self):
        self.check_order_id()

        return self.error_msg

    def check_api_put_linepay_confirm(self):
        self.check_transaction_id()
        self.check_order_id()

        return self.error_msg

    def check_api_get_coupons_info(self):

        return self.error_msg

    def check_barcode(self):
        if error := self.check_required(self.barcode, 'barcode'):
            self.error_msg.append(error)
            return

    def check_order_id(self):
        if error := self.check_required(self.order_id, 'orderId'):
            self.error_msg.append(error)
            return

        if error := self.check_length(self.order_id, 'orderId', 1, None):  # noqa:E501
            self.error_msg.append(error)

    def check_transaction_id(self):
        if error := self.check_required(self.transaction_id, 'transactionId'):
            self.error_msg.append(error)
            return

        if error := self.check_length(self.transaction_id, 'transactionId', 1, None):  # noqa:E501
            self.error_msg.append(error)

    def check_item(self):
        def check_item_barcode(self, barcode):
            if error := self.check_required(barcode, 'barcode'):
                self.error_msg.append(error)
                return

        def check_order_quantity(self, quantity):
            if error := self.check_required(quantity, 'quantity'):
                self.error_msg.append(error)
                return

        # itemがあるか確認→ない場合は中身のチェック無し
        if error := self.check_required(self.items, 'items'):
            self.error_msg.append(error)
            return

        # itemの中身をループでチェック
        for item_single in self.items:
            check_item_barcode(self,
                               item_single['barcode']
                               if 'barcode' in item_single else None)
            check_order_quantity(self,
                                 item_single['quantity']
                                 if 'quantity' in item_single else None)
