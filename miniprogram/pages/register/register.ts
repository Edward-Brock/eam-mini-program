// pages/register/register.ts
const app = getApp<IAppOption>()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 提示语中的系统名称
        eamName: '',
        // 点击按钮后弹窗显示相关结果
        toast: false,
        // 存储当前页面显示的状态，register - 注册用户，update - 更新用户信息
        pageState: '',
        // 根据返回的 type 值判断是否显示欢迎语，false - 不显示，true - 显示
        registerDisplay: false,
        // 性别默认值
        genderIndex: 0,
        genderArray: [
            { name: '男', value: 'male' },
            { name: '女', value: 'female' },
        ],
        // 最晚出生日期，不少于 16 岁
        lastBirthday: '',
        // 最晚入职日期，不超过当日
        lastJoinedDate: '',
        // 获取的用户信息不可修改
        userInfo: {},
        // 注册信息可以进行修改
        editUserInfo: {
            openid: '',
            // 本地临时头像，仅用于显示不进行提交
            fileAvatar: app.globalData.avatar,
            // 向服务器传值的真实头像地址，向服务器提交该字段
            avatar: '',
            nickname: '',
            name: '',
            gender: 'male',
            birthday: '',
            joined_date: '',
            tel: ''
        },
        // 按钮显示文案
        btnText: ''
    },

    /**
     * 将表单数据发送至服务器
     * @param e 获取到的表单信息
     */
    formSubmit(e: any) {
        // 将昵称传递给 editUserInfo.nickname
        this.setData({
            'editUserInfo.openid': app.globalData.openid,
            'editUserInfo.nickname': e.detail.value.nickname
        })
        // console.log(this.data.editUserInfo);

        if (this.data.pageState === 'register') {
            // 页面状态为注册页面
            wx.request({
                url: app.globalData.baseURL + 'user',
                method: 'POST',
                data: {
                    ...this.data.editUserInfo
                },
                success(res: any) {
                    console.log(res);
                    if (res.data.code === 200 && res.data.state === 'success') {
                        // 将登录验证存储至本地缓存中
                        wx.setStorage({
                            key: "login_verification",
                            data: true
                        })
                        // 将用户信息存储至本地缓存中
                        wx.setStorage({
                            key: "userInfo",
                            data: res.data
                        })
                        wx.reLaunch({
                            url: '/pages/index/index'
                        })
                    } else if (res.data.code === 412 && res.data.state === 'error') {
                        wx.showToast({
                            title: '账号等待审核中',
                            icon: 'error',
                            duration: 2000
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
        } else if (this.data.pageState === 'update') {
            // 页面状态为更新页面
            delete this.data.editUserInfo.fileAvatar && this.data.editUserInfo.nickname_temp && this.data.editUserInfo.user_type
            let reg = new RegExp(app.globalData.baseURL, "g"); // 加'g'，删除字符串里所有的"a"
            this.data.editUserInfo.avatar = this.data.editUserInfo.avatar.replace(reg, "");
            wx.request({
                url: app.globalData.baseURL + 'user/' + app.globalData.openid,
                method: 'POST',
                data: {
                    ...this.data.editUserInfo
                },
                success(res: any) {
                    // console.log(res);
                    if (res.data.affected === 1) {
                        // 将登录验证存储至本地缓存中
                        wx.setStorage({
                            key: "login_verification",
                            data: true
                        })
                        wx.showToast({
                            title: '更新成功',
                            icon: 'success',
                            duration: 2000
                        })
                        wx.reLaunch({
                            url: '/pages/me/me'
                        })
                    }
                }
            })
        }

        this.openToast();
    },

    /**
     * 展示弹窗能力
     */
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
     * 头像方法
     * @param e 
     */
    onChooseAvatar(e: any) {
        let that = this;
        const { avatarUrl } = e.detail  //获取图片临时路径

        this.setData({
            'editUserInfo.fileAvatar': avatarUrl,
        })
        // 将获取的图片临时路径传到服务端进行存储并返回调用地址
        wx.uploadFile({
            url: app.globalData.baseURL + 'upload/uploadFile',
            filePath: avatarUrl,
            name: 'avatar',	//自定义name
            header: {
                "Content-Type": "multipart/form-data",
                'accept': 'application/json',
            },
            success(res: any) {
                // 与 wx.request 不同，wx.uploadFile 返回的是[字符串]，需要自己转为 JSON 格式，如果不转换，直接用点运算符是获取不到后台返回的值的
                let datas = JSON.parse(res.data)
                // console.log('头像存储路径：', datas.files[0].path)
                that.setData({
                    'editUserInfo.avatar': datas.files[0].path
                })
                wx.showToast({
                    title: '头像保存成功',
                    icon: 'success',
                    duration: 2000
                })
            },
            fail(err) {
                console.log('err', err);
            }
        })
    },

    /**
     * 昵称输入
     * @param evt 
     */
    onNickNameInput(evt: any) {
        const { value } = evt.detail;
        this.setData({
            'editUserInfo.nickname': value
        });
    },

    /**
     * 真实姓名输入
     * @param evt 
     */
    onNameInput(evt: any) {
        const { value } = evt.detail;
        this.setData({
            'editUserInfo.name': value
        });
    },

    /**
     * 用于计算相关日期，通过传入的 value 进行判断
     * birthday - 出生日期，不小于16周岁
     * now - 入职日期，不晚于当日
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
            'editUserInfo.gender': this.data.genderArray[e.detail.value].value
        })
    },

    // 出生日期选择
    bindBirthdayChange(e: any) {
        this.setData({
            'editUserInfo.birthday': e.detail.value,
        });
    },

    // 入职日期选择
    bindJoinedDateChange(e: any) {
        this.setData({
            'editUserInfo.joined_date': e.detail.value,
        });
    },

    /**
     * 联系方式输入
     * @param evt 
     */
    onTelInput(evt: any) {
        const { value } = evt.detail;
        this.setData({
            'editUserInfo.tel': value
        });
    },

    /**
     * 判断 onLoad 传回的值，根据不同值显示配置不能同内容
     * register - 注册用户信息，update - 更新用户信息
     * @param option 
     */
    welcomeTipsDetermine(option: string) {
        let that = this;
        // console.log('当前页面状态：', option);
        if (option === 'register') {
            // 注册用户信息
            wx.setNavigationBarTitle({
                title: '审核注册'
            })
            this.setData({
                pageState: option,
                registerDisplay: true,
                btnText: '提交审核'
            })
        } else if (option === 'update') {
            // 更新用户信息
            const eventChannel = this.getOpenerEventChannel()
            eventChannel.on('acceptDataFromOpenerPage', function (data) {
                // console.log(data);
                wx.setNavigationBarTitle({
                    title: '个人资料'
                })
                // 通过传递过来的值判断当前用户性别，根据不同性别重置对应数据
                if (data.gender === 'male') {
                    that.setData({
                        'genderIndex': 0,
                        'editUserInfo.gender': data.gender
                    })
                } else {
                    that.setData({
                        'genderIndex': 1,
                        'editUserInfo.gender': data.gender
                    })
                }
                that.setData({
                    pageState: option,
                    registerDisplay: false,
                    btnText: '更新',
                    userInfo: data,
                    editUserInfo: data,
                    'editUserInfo.fileAvatar': app.globalData.baseURL + data.avatar,
                })
            })
        }
    },
    /**
     * 获取当前资产管理系统的全程
     * @param option 
     */
    getEAMName() {
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
     * 生命周期函数--监听页面加载
     */
    onLoad(option: any) {
        this.welcomeTipsDetermine(option.type);
        this.getEAMName();
        // 调用并设置最晚出生日期和入职日期
        this.setData({
            // 'editUserInfo.birthday': this.nowDate('birthday'),
            // 'editUserInfo.joined_date': this.nowDate('now'),
            lastBirthday: this.nowDate('birthday'),
            lastJoinedDate: this.nowDate('now')
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
        // 页面为注册用户时隐藏返回首页按钮
        wx.hideHomeButton();
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