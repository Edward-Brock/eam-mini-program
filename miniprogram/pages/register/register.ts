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
            showGenderSelect: false, // 性别选择弹层控制
            showBirthdaySelect: false, // 出生日期选择弹层控制
            showJoinedDateSelect: false // 入职日期选择弹层控制
        },
        minBirthdayDate: new Date(1973, 0, 1).getTime(),
        maxBirthdayDate: new Date().getTime() - 1000 * 60 * 60 * 24 * 365 * 18,
        minJoinedDate: new Date(2013, 6, 19).getTime(),
        maxJoinedDate: new Date().getTime(),
        genderArray: ['男', '女'],
        formatter(type: string, value: any) {
            if (type === 'year') {
                return `${value}年`;
            }
            if (type === 'month') {
                return `${value}月`;
            }
            return value;
        },
        // 注册信息
        registerInfo: {
            nickname: '',
            name: '',
            gender: '',
            birthday: '',
            joined_date: '',
            tel: ''
        }
    },

    /**
     * 将表单数据发送至服务器
     * @param e 获取到的表单信息
     */
    formSubmit(e: any) {
        console.log('form发生了submit事件，携带数据为：', e.detail.value)
    },

    // 弹出选择性别
    onPopupGenderSelect() {
        wx.hideKeyboard();
        this.setData({
            'popupInfo.showGenderSelect': true
        });
    },

    // 弹出选择出生日期
    onPopupBirthdaySelect() {
        wx.hideKeyboard();
        this.setData({
            'popupInfo.showBirthdaySelect': true
        });
    },

    // 弹出选择入职日期
    onPopupJoinedDateSelect() {
        wx.hideKeyboard();
        this.setData({
            'popupInfo.showJoinedDateSelect': true
        });
    },

    // 性别选择确认
    onGenderSelectConfirm(event: any) {
        const { value } = event.detail;
        this.setData({
            'registerInfo.gender': value,
            'popupInfo.showGenderSelect': false
        })
    },

    // 出生日期选择确认
    onBirthdaySelectConfirm(event: any) {
        this.setData({
            'registerInfo.birthday': event.detail,
            'popupInfo.showBirthdaySelect': false
        })
    },

    // 入职日期选择确认
    onJoinedDateSelectConfirm(event: any) {
        this.setData({
            'registerInfo.joined_date': event.detail,
            'popupInfo.showJoinedDateSelect': false
        })
    },

    // 性别选择取消关闭按钮
    onGenderSelectCancel() {
        this.setData({
            'popupInfo.showGenderSelect': false
        });
    },

    // 出生日期选择取消关闭按钮
    onBirthdaySelectCancel() {
        this.setData({
            'popupInfo.showBirthdaySelect': false
        });
    },

    // 入职日期选择取消关闭按钮
    onJoinedDateSelectCancel() {
        this.setData({
            'popupInfo.showJoinedDateSelect': false
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