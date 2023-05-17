// index.ts
// 获取应用实例
const app = getApp<IAppOption>()
const TimePromptBehavior = require('../../behaviors/timePrompt');

Page({
  behaviors: [TimePromptBehavior],
  data: {
    // 时间提示语
    timePrompt: '',
    // 当前用户昵称
    userInfo: '',
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
    if (!app.globalData.checkLoginStateFlag) {
      app.userInfoReadyCallback = (res: any) => {
        this.setData({
          timePrompt: (this as any).getTimePromptMethod(),
          userInfo: res.data,
          'userInfo.nickname_temp': '，' + res.data.nickname + '！'
        })
      }
    }
    this.getAssetNumber();
    this.getAssetPrice();
    this.getAssetState();
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
  }
})
