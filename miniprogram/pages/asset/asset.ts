// pages/asset/asset.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {
        asset: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        let that = this;
        const eventChannel = this.getOpenerEventChannel();
        // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据F
        eventChannel.on('indexToAssetPages', function (res) {
            // console.log('资产获取成功：', res.data);
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