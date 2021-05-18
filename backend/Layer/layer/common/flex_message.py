from common import utils

def create_receipt(order_info, datetime_now, details_url):
     
    receipt = {
        "type": "flex",
        "altText": "この度は、Use Case Storeにてスマホレジをご利用いただきありがとうございました。",
        "contents": {
            "type": "bubble",
            "altText": "ご来店ありがとうございました。またのご来店をお待ちしています。次回ご来店時に使用できるクーポンを発行します。",
            "header": {
                "type": "box",
                "layout": "vertical",
                "flex": 0,
                "contents": [
                {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                    {
                        "type": "text",
                        "text": "Use Case Store ○×△ストア△□店",
                        "weight": "bold",
                        "size": "md",
                        "contents": []
                    },
                    {
                        "type": "text",
                        "text": datetime_now,
                        "color": "#767676",
                        "contents": []
                    }
                    ]
                }
                ]
            },
            "body": {
                "type": "box",
                "layout": "vertical",
                "spacing": "lg",
                "contents": [
                {
                    "type": "text",
                    "text": "この度は、Use Case Storeにてスマホレジをご利用いただきありがとうございました。\nご購入いただいた商品の明細は下記のリンクよりご確認いただけます。",
                    "size": "md",
                    "gravity": "center",
                    "wrap": True,
                    "contents": []
                },
                {
                    "type": "box",
                    "layout": "vertical",
                    "spacing": "sm",
                    "margin": "lg",
                    "contents": [
                    {
                        "type": "box",
                        "layout": "baseline",
                        "spacing": "sm",
                        "contents": [
                        {
                            "type": "text",
                            "text": "税込合計金額",
                            "size": "md",
                            "color": "#AAAAAA",
                            "flex": 2,
                            "contents": []
                        },
                        {
                            "type": "text",
                            "text": "¥" + utils.separate_comma(order_info['amount']),
                            "size": "md",
                            "color": "#666666",
                            "flex": 2,
                            "wrap": True,
                            "contents": []
                        }
                        ]
                    },
                        {
                            "type": "button",
                            "action": {
                                "type": "uri",
                                "label": "購入商品明細",
                                "uri": details_url
                            }
                        }
                    ]
                }
                ]
            }
        }
    }
    return receipt