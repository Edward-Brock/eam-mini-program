// pages/me/me.ts
const app = getApp<IAppOption>()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {
            nickname: '',
            name: '',
            avatar: app.globalData.avatar,
            user_type: ''
        },
    },

    /**
     * 通过 OPENID 获取当前用户个人信息
     * 并针对头像进行拼接
     * 替换用户类型标签
     */
    getUserInfo() {
        let that = this;
        if (app.globalData.checkLoginStateFlag) {
            let userInfo: any = app.globalData.userInfo
            // 头像拼接
            userInfo.avatar = app.globalData.baseURL + userInfo.avatar;
            // 用户类型标签替换
            switch (userInfo.user_type) {
                case 'root':
                    userInfo.user_type = "超级管理员"
                    break;

                case 'admin':
                    userInfo.user_type = "管理员"
                    break;

                case 'staff':
                    userInfo.user_type = "员工"
                    break;

                default:
                    userInfo.user_type = "NONE"
                    break;
            }
            that.setData({
                userInfo
            })
            this.setData({

            })
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        this.getUserInfo()
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