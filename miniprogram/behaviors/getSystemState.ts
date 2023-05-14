const app = getApp<IAppOption>()

module.exports = Behavior({
	behaviors: [],
	properties: {
		getSystemStateMethod: {
			type: String
		}
	},
	data: {
		state: ''
	},
	methods: {
		getSystemStateMethod() {
			setInterval(
				function () {
					wx.request({
						url: app.globalData.baseURL + 'option/getSystemState',
						method: 'GET',
						success(res) {
							console.log(res);
						}
					})
				}, 5000);
		},
	}
})