module.exports = Behavior({
	behaviors: [],
	properties: {
		getTimePromptMethod: {
			type: String
		}
	},
	data: {
		nowTime: ''
	},
	methods: {
		getTimePromptMethod() {
			let that = this;
			let nowTimeStamp: any = new Date();
			let timestamp = Date.parse(nowTimeStamp);
			timestamp = timestamp / 1000;
			// console.log("当前时间戳为：" + timestamp);
			//获取当前时间
			var n = timestamp * 1000;
			var date = new Date(n);
			//获取时
			var h = date.getHours();
			console.log("现在的时间是 " + h + " 点")

			if (0 <= h && h <= 6) {
				that.setData({
					nowTime: '凌晨好'
				})
			} else if (6 <= h && h <= 11) {
				that.setData({
					nowTime: '早上好'
				})
			}
			else if (11 <= h && h <= 13) {
				that.setData({
					nowTime: '中午好'
				})
			} else if (13 <= h && h <= 16) {
				that.setData({
					nowTime: '下午好'
				})
			}
			else if (16 <= h && h <= 18) {
				that.setData({
					nowTime: '傍晚好'
				})
			}
			else if (18 <= h && h <= 22) {
				that.setData({
					nowTime: '晚上好'
				})
			}
			else {
				that.setData({
					nowTime: '深夜了'
				})
			}
			return that.data.nowTime;
		}
	}
})