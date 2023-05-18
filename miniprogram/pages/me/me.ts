// pages/me/me.ts
const app = getApp<IAppOption>()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 页面内可以更改的编辑数据
        userInfo: {
            nickname: '',
            name: '',
            avatar: app.globalData.avatar,
            user_type: ''
        }
    },

    /**
     * 修改用户信息
     */
    onEditUserInfo() {
        wx.navigateTo({
            url: '/pages/register/register?type=update',
            success: function (res) {
                // 通过eventChannel向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromOpenerPage', wx.getStorageSync('userInfo'))
            }
        })
    },

    /**
     * 针对传入的日期进行格式化，将 T16:00:00.000Z 转换为正常时间
     * 2019-11-06T16:00:00.000Z --> 2019-11-06
     * @param datetime 
     */
    formateDate(datetime: string | number | Date) {
        // let  = "2019-11-06T16:00:00.000Z"
        function addDateZero(num: string | number) {
            return (num < 10 ? "0" + num : num);
        }
        let d = new Date(datetime);
        let formatdatetime = d.getFullYear() + '-' + addDateZero(d.getMonth() + 1) + '-' + addDateZero(d.getDate() + 1);
        return formatdatetime;
    },

    /**
     * 通过 OPENID 获取当前用户个人信息
     * 并针对头像进行拼接
     * 替换用户类型标签
     */
    getUserInfo() {
        let that = this;
        wx.request({
            url: app.globalData.baseURL + 'user/' + app.globalData.openid,
            method: "GET",
            success(res: any) {
                console.log('获取用户信息：', res.data);
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
                    userInfo: res.data,
                    'userInfo.avatar': app.globalData.baseURL + wx.getStorageSync('userInfo').avatar
                })

                // 用户类型标签替换
                switch (that.data.userInfo.user_type) {
                    case 'root':
                        that.setData({
                            'userInfo.user_type': '超级管理员'
                        })
                        break;

                    case 'admin':
                        that.setData({
                            'userInfo.user_type': '管理员'
                        })
                        break;

                    case 'staff':
                        that.setData({
                            'userInfo.user_type': '员工'
                        })
                        break;

                    default:
                        that.setData({
                            'userInfo.user_type': 'NONE'
                        })
                        break;
                }
                wx.stopPullDownRefresh();
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.getUserInfo();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
        this.getUserInfo();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})