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
    // 获取的当前所有资产信息
    allAssetInfo: [],
    code: ''
  },

  getScanCode() {
    // 允许从相机和相册扫码
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['barCode'],
      success: (res) => {
        wx.redirectTo({
          url: `/pages/asset/asset?type=scan&code=${res.result}`
        })
      }
    })
  },

  /**
   * 获取当前点击的资产详细信息并传值给 asset 页面
   * @param e 
   */
  onAssetInfo(e: any) {
    // console.log(e.currentTarget.dataset.asset);
    wx.navigateTo({
      url: '/pages/asset/asset',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('indexToAssetPages', { data: e.currentTarget.dataset.asset })
      }
    })
  },

  /**
   * 需要初次加载、进入页面重新加载的所有方法写入到此方法中
   */
  loadFunctions() {
    this.getUserInfo();
    this.getAssetNumber();
    this.getAssetPrice();
    this.getAssetState();
    this.getAllAssetsInfo();
  },

  onLoad() {
    this.loadFunctions();
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
      data: {
        delete_flag: false
      },
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
   * 获取当前已投入资产数量
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
   * 获取当前全部资产，排除已删除资产
   */
  getAllAssetsInfo() {
    let that = this;
    wx.request({
      url: app.globalData.baseURL + 'asset/getAssetNumber',
      method: 'GET',
      data: {
        delete_flag: false
      },
      success(res: any) {
        // console.log('全部资产信息', res.data.data[0]);
        for (const key in res.data.data[0]) {
          // console.log(res.data.data[0][key].state);
          switch (res.data.data[0][key].state) {
            case 'unused':
              res.data.data[0][key].state = '未使用'
              break;

            case 'using':
              res.data.data[0][key].state = '使用中'
              break;

            case 'deactivate':
              res.data.data[0][key].state = '已停用'
              break;

            case 'wreck':
              res.data.data[0][key].state = '报废'
              break;

            default:
              res.data.data[0][key].state = '未知'
              break;
          }
        }
        that.setData({
          allAssetInfo: res.data.data[0]
        })
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.loadFunctions();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.loadFunctions();
  },
})
