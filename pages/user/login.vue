<template>
	<view style="padding-top: 40upx;">
		<view class="inputArea" style="text-align: center;">
			<image class="logo-img" src="/static/images/money.png"></image>
		</view>
		<view class="text-xl padding text-center">
			<text class="text-black text-bold">记账本</text>
		</view>

		<view class="inputArea">
			<button class="login-button bg-gradual-orange"  @click="getInfo">翻开记账本</button>
		</view>
	</view>
</template>

<script>
	import {
		callCloudFunction
	} from '@/common/public_util.js';

	let _self;
	export default {
		components: {},
		data() {
			return {
				code:'',
				openid:''
			}
		},
		onLoad() {
			_self = this;
			// let userInfo = uni.getStorageSync('userInfo');
			// if (userInfo != null && userInfo.openid != null) {
			// 	console.log('用户信息:' + JSON.stringify(userInfo));
			// 	uni.switchTab({
			// 		url: '/pages/app/bookkeeping/bookkeeping'
			// 	});
			// }else{
			// 	_self.getUserInfo();
			// }
			_self.getUserInfo()
		},
		methods: {
			// goLogin() {
			// 	// uni.authorize({
			// 	// 	scope: 'scope.userInfo',
			// 	// 	success() {
			// 	// 		_self.getUserInfo();
			// 	// 	},
			// 	// 	fail: (fail) => {
			// 	// 		console.log('授权错误：' + JSON.stringify(fail));
			// 	// 	}
			// 	// })
			// 	_self.getUserInfo();
			// },
			getInfo(){
				uni.getUserProfile({
					desc:'用户记录用户数据',
					success: (infoRes) => {
						// uniCloud.callFunction(
						// {
						// 	name:'get_openid',
						// 	data: {
						// 		code: loginRes.code
						// 	}
						// }).then(res =>{
							
							uni.hideLoading();
							//获取到openid
							let openid = _self.openid;
							let userInfo = infoRes.userInfo;
							userInfo.openid = openid;
							uni.setStorageSync('userInfo', userInfo);
							
							uniCloud.callFunction({
								name:'user_add',
								data:userInfo
							}).then(rs =>{
								
							})
							
							
							// console.log('用户信息:' + JSON.stringify(userInfo));
							uni.switchTab({
								url: '/pages/app/bookkeeping/bookkeeping'
							});
						// })
						
				
					},
					fail: (fail) => {
						console.log(fail)
						uni.hideLoading();
						uni.showToast({
							icon: "none",
							title: '翻开记账本要允许授权'
						});
					}
				});
			},
			getUserInfo: () => {
				uni.showLoading({
					title: '正在授权登录...'
				});
				uni.login({
					provider: 'weixin',
					success: (loginRes) => {
						// 获取用户信息
						uni.getUserInfo({
							
							
							success: (infoRes) => {
								_self.code = infoRes.code;
								uniCloud.callFunction(
								{
									name:'get_openid',
									data: {
										code: loginRes.code
									}
								}).then(res =>{
									console.log(res,'hahaahah')
									uni.hideLoading();
									//获取到openid
									_self.openid = res.result.openid;
									// let userInfo = infoRes.userInfo;
									// userInfo.openid = openid;
									// uni.setStorageSync('userInfo', userInfo);
									// uniCloud.callFunction({
									// 	name:'user_add',
									// 	data:userInfo
									// }).then(rs =>{
										
									// })
									
								
								})
								

							},
							fail: (fail) => {
								console.log(fail)
								uni.hideLoading();
								uni.showToast({
									icon: "none",
									title: '翻开记账本要允许授权'
								});
							}
						});
					},
					fail: (fail) => {
						uni.hideLoading();
						console.log(JSON.stringify(fail));
					}
				});
			}
		}
	}
</script>

<style>
	.inputArea {
		padding: 30upx 10%;
	}

	.inputClass {
		border: 2px solid #ccc;
		border-radius: 44upx;
		outline: 0;
		width: 90%;
		padding: 16upx 30upx;
		background-color: #FFFFFF;
	}

	.logo-img {
		width: 150upx;
		height: 150upx;
		border-radius: 150upx;
	}

	.login-button {
		/* background: #2fc25b; */
		color: #FFFFFF;
		border-radius: 54upx;
		font-size: 36upx;
		text-align: center;
		padding: 20upx;
	}
</style>
