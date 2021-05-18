"""
Constant types in Python.
定数上書きチェック用
"""
import os
from common import const
from datetime import timedelta

from linebot.models import (
    TemplateSendMessage, CarouselTemplate, CarouselColumn, MessageAction,
    QuickReplyButton, CameraAction, CameraRollAction, LocationAction
)

const.API_PROFILE_URL = 'https://api.line.me/v2/profile'
const.API_NOTIFICATIONTOKEN_URL = 'https://api.line.me/message/v3/notifier/token'  # noqa: E501
const.API_ACCESSTOKEN_URL = 'https://api.line.me/v2/oauth/accessToken'
const.API_SENDSERVICEMESSAGE_URL = 'https://api.line.me/message/v3/notifier/send?target=service'  # noqa 501
const.API_USER_ID_URL = 'https://api.line.me/oauth2/v2.1/verify'

const.MSG_ERROR_NOPARAM = 'パラメータ未設定エラー'
const.DATA_LIMIT_TIME = 60 * 60 * 12
const.ONE_WEEK = timedelta(days=7)
const.JST_UTC_TIMEDELTA = timedelta(hours=9)
