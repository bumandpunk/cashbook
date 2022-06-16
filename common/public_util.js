/**
 * 公共模块
 */
module.exports = {
	/**
	 * 调用云函数
	 */
	callCloudFunction: (name, data, successFun, failFun) => {
		uni.showLoading({
			title: '加载中...'
		});
		uniCloud.callFunction({
			name: name,
			data: data,
			success: (res) => {
				console.log('云函数:' + name + '参数:' + JSON.stringify(data) + '调用成功返回:' + JSON.stringify(res.result))
				uni.hideLoading();
				if (res.success) {
					if (successFun != null)
						successFun(res.result);
				} else {
					if (failFun != null)
						failFun(res.result);
				}

			},
			fail: (fail) => {
				uni.showToast({
					icon: "none",
					title: '云函数调用失败',
					duration: 3000
				});
				console.log('云函数:' + name + '参数:' + JSON.stringify(data) + '调用失败返回:' + JSON.stringify(fail))

				uni.hideLoading();
				if (failFun != null)
					failFun(fail);
			}
		});
	},
	/**
	 * 获取当前用户信息
	 */
	getUserInfo: () => {
		let userInfo = uni.getStorageSync('userInfo');
		return userInfo;
	},
	/**
	 * 获取当前用户唯一标志
	 */
	getUserOpenid: () => {
		let userInfo = uni.getStorageSync('userInfo');
		if (userInfo != null)
			return userInfo.openid;
		return '';
	}
}
