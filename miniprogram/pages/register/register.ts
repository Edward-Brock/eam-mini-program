// pages/register/register.ts
const app = getApp<IAppOption>()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 提示语中的系统名称
        eamName: '',
        toast: false,
        genderIndex: 0,
        genderArray: [
            { name: '男', value: 'male' },
            { name: '女', value: 'female' },
        ],
        lastBirthday: '',
        lastJoinedDate: '',
        // 注册信息
        registerInfo: {
            openid: '',
            session_key: '',
            nickname: '',
            name: '',
            gender: 'male',
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
        // 将昵称传递给 registerInfo.nickname
        this.setData({
            'registerInfo.openid': app.globalData.openid,
            'registerInfo.session_key': app.globalData.session_key,
            'registerInfo.nickname': e.detail.value.nickname
        })
        // console.log(this.data.registerInfo);

        wx.request({
            url: app.globalData.baseURL + 'user',
            method: 'POST',
            data: {
                ...this.data.registerInfo
            },
            success(res: any) {
                console.log(res);
                if (res.data.code === 200 && res.data.state === 'success') {
                    wx.reLaunch({
                        url: '/pages/index/index'
                    })
                } else {
                    wx.showToast({
                        title: '提交审核失败',
                        icon: 'error',
                        duration: 2000
                    })
                }
            }
        })

        this.openToast();
    },

    openToast() {
        this.setData({
            toast: true,
        });
        setTimeout(() => {
            this.setData({
                hideToast: true,
            });
            setTimeout(() => {
                this.setData({
                    toast: false,
                    hideToast: false,
                });
            }, 300);
        }, 3000);
    },

    /**
     * 昵称输入
     * @param evt 
     */
    onNickNameInput(evt: any) {
        const { value } = evt.detail;
        this.setData({
            'registerInfo.nickname': value
        });
    },

    /**
     * 真实姓名输入
     * @param evt 
     */
    onNameInput(evt: any) {
        const { value } = evt.detail;
        this.setData({
            'registerInfo.name': value
        });
    },

    /**
     * 用来计算出生日期，截止时间截止到 16 周岁之前
     */
    nowDate(value: string): string {
        let date = new Date();
        let year;
        if (value === 'birthday') {
            year = date.getFullYear() - 16;
        } else {
            year = date.getFullYear();
        }
        let month: number | string = date.getMonth() + 1;
        let day: number | string = date.getDate();
        month = (month > 9) ? month : ("0" + month);
        day = (day < 10) ? ("0" + day) : day;
        return year + "-" + month + "-" + day;
    },

    // 性别选择
    genderChange(e: any) {
        // console.log('radio发生change事件，携带value值为：', this.data.genderArray[e.detail.value].value)
        this.setData({
            genderIndex: e.detail.value,
            'registerInfo.gender': this.data.genderArray[e.detail.value].value
        })
    },

    // 出生日期选择
    bindBirthdayChange(e: any) {
        this.setData({
            'registerInfo.birthday': e.detail.value,
        });
    },

    // 入职日期选择
    bindJoinedDateChange(e: any) {
        this.setData({
            'registerInfo.joined_date': e.detail.value,
        });
    },

    /**
     * 联系方式输入
     * @param evt 
     */
    onTelInput(evt: any) {
        const { value } = evt.detail;
        this.setData({
            'registerInfo.tel': value
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        let that = this;
        // 调用计算出生日期最晚截止日期，截止到 16 周岁前
        this.setData({
            'registerInfo.birthday': this.nowDate('birthday'),
            'registerInfo.joined_date': this.nowDate('now'),
            lastBirthday: this.nowDate('birthday'),
            lastJoinedDate: this.nowDate('now')
        })
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