// index.ts
// 获取应用实例
const app = getApp<IAppOption>()
const TimePromptBehavior = require('../../behaviors/timePrompt');

Page({
  behaviors: [TimePromptBehavior],
  data: {
    // 时间提示语
    timePrompt: '',
    // 当前用户信息
    userInfo: {
      nickname: ''
    },
    // 资产总览标题
    assetBlockTitle: '资产总览',
    // 资产总信息
    assetInfo: [
      { number: 0, title: '资产总数量' },
      { number: 0, title: '资产总金额' },
      { number: 0, title: '资产投入使用量' }
    ],
  },

  onLoad() {
    this.getUserInfo();
    this.getAssetNumber();
    this.getAssetPrice();
    this.getAssetState();
  },

  /**
   * 获取当前用户信息
   */
  getUserInfo() {
    let that = this;
    wx.request({
      url: app.globalData.baseURL + 'user/' + wx.getStorageSync('userInfo').openid,
      method: "GET",
      success(res: any) {
        // console.log('获取用户信息：', res);
        // 如果未获取到用户信息
        if (res.data.length == 0) {
          // console.log("未获取到用户信息");
          wx.removeStorage({
            key: 'userInfo'
          })
          // 将登录验证存储至本地缓存中
          wx.setStorage({
            key: "login_verification",
            data: false
          })
          that.setData({
            'userInfo.nickname': '未授权用户'
          })
        }
        // 将用户信息存储至本地缓存中
        wx.setStorage({
          key: "userInfo",
          data: res.data
        })
        // 将登录验证存储至本地缓存中
        wx.setStorage({
          key: "login_verification",
          data: true
        })
        that.setData({
          timePrompt: (that as any).getTimePromptMethod() + `，${that.data.userInfo.nickname}！`,
          userInfo: res.data
        })
        wx.stopPullDownRefresh();
      }
    })
  },

  /**
   * 获取当前资产总数量
   */
  getAssetNumber() {
    let that = this;
    wx.request({
      url: app.globalData.baseURL + 'asset/getAssetNumber',
      method: 'GET',
      success(res: any) {
        // console.log(res);
        that.setData({
          'assetInfo[0].number': res.data.data[1] || 0
        })
      }
    })
  },

  /**
   * 获取当前资产总金额
   */
  getAssetPrice() {
    let that = this;
    wx.request({
      url: app.globalData.baseURL + 'asset/getAssetPrice',
      method: 'GET',
      success(res: any) {
        // console.log(res);
        that.setData({
          'assetInfo[1].number': '￥' + res.data.data || 0
        })
      }
    })
  },

  /**
   * 获取当前资产
   */
  getAssetState() {
    let that = this;
    wx.request({
      url: app.globalData.baseURL + 'asset/getAssetNumber',
      method: 'GET',
      data: {
        state: 'using'
      },
      success(res: any) {
        // console.log(res);
        that.setData({
          'assetInfo[2].number': res.data.data[1] || 0
        })
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.getUserInfo();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 页面为注册用户时隐藏返回首页按钮
    this.getUserInfo();
  },
})
