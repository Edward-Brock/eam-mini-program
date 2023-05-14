/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo,
    baseURL?: string,
    checkLoginStateFlag?: boolean,
    openid?: string,
    session_key?: string
  },
  getWechatLogin?: WechatMiniprogram.getWechatLogin,
  getUserInfo?: WechatMiniprogram.getUserInfo,
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
}