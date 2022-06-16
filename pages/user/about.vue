<!--
 * @Date: 2022-06-16 15:43:07
 * @LastEditors: Zfj
 * @LastEditTime: 2022-06-16 15:49:50
 * @FilePath: \cashbook\pages\user\about.vue
 * @Description: 
-->
<template>

	<view class="qiun-columns">
		<view class="qiun-bg-white qiun-title-bar qiun-common-mt" style="width: 100%;">
			<view class="qiun-title-dot-light">联系人:bumandpunk</view>
		</view>
		<view class="qiun-bg-white qiun-title-bar qiun-common-mt" style="width: 100%;">
			<view class="qiun-title-dot-light" @click="copyText('844788189@qq.com')">邮箱:844788189@qq.com</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		onLoad() {

		},
		methods: {
			copyText(text) {
				uni.setClipboardData({
					data: text,
					success: function() {
						uni.showToast({
							icon:"none",
							title: '复制成功'
						})
					}
				});
			}

		}
	}
</script>

<style>

</style>
