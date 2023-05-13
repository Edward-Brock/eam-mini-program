// pages/register/register.ts
const app = getApp<IAppOption>()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 提示语中的系统名称
        eamName: '',
        popupInfo: {
            showGenderSelect: false, //性别选择弹层控制
        },
        genderArray: ['男', '女'],
        // 注册信息
        registerInfo: {
            name: '',
            gender: '',
        }
    },

    // 弹出选择性别
    onPopupGenderSelect() {
        wx.hideKeyboard();
        this.setData({
            'popupInfo.showGenderSelect': true
        });
    },

    // 性别选择确认
    onGenderSelectConfirm(event: any) {
        const {
            value
        } = event.detail;
        this.setData({
            'registerInfo.gender': value
        })
        this.onCloseGenderSelect();

    },

    // 性别选择取消关闭按钮
    onGenderSelectCancel() {
        this.onCloseGenderSelect();
    },

    // 性别选择弹窗关闭
    onCloseGenderSelect() {
        this.setData({
            'popupInfo.showGenderSelect': false
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        let that = this;
        wx.request({
            url: app.globalData.baseURL + 'option/getOption',
            method: 'GET',
            data: {
                option_name: 'eam_name'
            },
            success(res: any) {
                that.setData({
                    eamName: res.data.option_value
                })
            }
        })
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