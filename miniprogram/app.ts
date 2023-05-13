// app.ts
const config = require('/utils/config.js')

App<IAppOption>({
  globalData: {
    ...config
  },
  onLaunch() {
    // 登录
    wx.login({
      success: res => {
        console.log("code:", res.code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
    })
  },
})