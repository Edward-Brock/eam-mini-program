// app.ts
const config = require('/utils/config.js')

App<IAppOption>({
  globalData: {
    // env 环境变量配置
    ...config,
    // 用户 openid
    openid: '',
    // 用户 session key
    session_key: ''
  },
  onLaunch() {
    let that = this;
    // 登录
    wx.login({
      success: res => {
        console.log("code:", res.code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: that.globalData.baseURL + 'option/getCodeToSession',
          method: 'GET',
          data: {
            js_code: res.code
          },
          success(res: any) {
            /**
             * 将获取的 openid 与 session_key 存至 globaldata
             * 并将其存至数据库中，与数据库进行比较判断是否存在 openid
             * 不存在跳转至注册界面
             */
            // console.log(res);
            that.globalData.openid = res.data.openid
            that.globalData.session_key = res.data.session_key
            if (that.globalData.openid && that.globalData.session_key) {
              // console.log('openid 与 session key 已成功存储至 globalData');
            }
            /**
             * 将 openid 传递至用户表中进行查询是否存在 openid
             * 如果存在则为已使用过的用户
             * 如果不存在则为未注册用户，跳转至注册页面
             */
            wx.request({
              url: that.globalData.baseURL + 'user/' + that.globalData.openid,
              method: "GET",
              success(res: any) {
                // console.log(res);
                // 如果返回 code 为 412 代表已存在用户，无需执行
                if (res.data === '') {
                  // 未注册用户，显示消息提示框并跳转至注册页面
                  wx.showToast({
                    title: '未授权用户',
                    icon: 'error',
                    duration: 3000,
                    mask: true,
                  })
                  wx.redirectTo({
                    url: '/pages/register/register'
                  })
                } else {
                  // console.log('该用户已存在于数据库中');
                  return;
                }
              }
            })
          }
        })
      },
    })
  },
})