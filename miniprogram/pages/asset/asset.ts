// pages/asset/asset.ts
import wxbarcode from 'wxbarcode'
const app = getApp<IAppOption>()

Page({

    /**
     * 将数据库内存储的长时间格式去除 T .000Z 转换为正常显示时间格式
     * @param time 返回正常显示时间
     */
    dateFunction(time: string | number | Date) {
        var zoneDate = new Date(time).toJSON();
        var date = new Date(+new Date(zoneDate) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
        return date;
    },

    /**
     * 页面的初始数据
     */
    data: {
        asset: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(data) {
        let that = this;
        /**
         * 判断跳转至该页面是通过点击方式还是扫描条形码方式
         * data.type = scan -> 扫描条形码
         */
        if (data.type === 'scan') {
            console.log("条形码扫描跳转");

            wx.request({
                url: app.globalData.baseURL + 'asset/' + data.code,
                method: "GET",
                success(res: any) {
                    // console.log('资产获取成功：', res.data);
                    res.data.update_time = that.dateFunction(res.data.update_time);
                    wxbarcode.barcode('barcode', res.data.code, 400, 150);
                    // 扫描条形码获取的资产状态未替换文字，需要重新替换
                    switch (res.data.state) {
                        case 'unused':
                            res.data.state = '未使用'
                            break;

                        case 'using':
                            res.data.state = '使用中'
                            break;

                        case 'deactivate':
                            res.data.state = '已停用'
                            break;

                        case 'wreck':
                            res.data.state = '报废'
                            break;

                        default:
                            res.data.state = '未知'
                            break;
                    }

                    that.setData({
                        asset: res.data
                    })
                }
            })
        }
        const eventChannel = this.getOpenerEventChannel();
        // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据F
        eventChannel.on('indexToAssetPages', function (res) {
            // console.log('资产获取成功：', res.data);
            res.data.update_time = that.dateFunction(res.data.update_time);
            wxbarcode.barcode('barcode', res.data.code, 400, 150);
            that.setData({
                asset: res.data
            })
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