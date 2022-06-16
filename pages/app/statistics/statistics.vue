<template>
	<view class="qiun-columns">
		<scroll-view scroll-x class="bg-pink nav text-center">
			<view class="cu-item" :class="0==tabCur?'text-black cur':''" @tap="tabSelect" data-id="0">
				<text class="cuIcon-triangleupfill"></text> 支出
			</view>
			<view class="cu-item" :class="1==tabCur?'text-black cur':''" @tap="tabSelect" data-id="1">
				<text class="cuIcon-triangledownfill"></text> 收入
			</view>
		</scroll-view>


		<view v-if="tabCur==0">
			<view class="qiun-bg-white qiun-title-bar qiun-common-mt" style="width: 100%;">
				<view class="qiun-title-dot-light">月统计情况:总支出:{{expenditureSum}}元</view>
			</view>
			<view class="qiun-charts">
				<!-- #ifdef MP-ALIPAY -->
				<canvas canvas-id="canvasPie" id="canvasPie" class="charts" :width="cWidth*pixelRatio" :height="cHeight*pixelRatio"
				 :style="{'width':cWidth+'px','height':cHeight+'px'}" @touchstart="touchPie"></canvas>
				<!-- #endif -->
				<!-- #ifndef MP-ALIPAY -->
				<canvas canvas-id="canvasPie" id="canvasPie" class="charts" @touchstart="touchPie"></canvas>
				<!-- #endif -->
			</view>
		</view>
		<view v-if="tabCur==1">
			<view class="qiun-bg-white qiun-title-bar qiun-common-mt" style="width: 100%;">
				<view class="qiun-title-dot-light">月统计情况:总收入:{{incomeSum}}元</view>
			</view>
			<view class="qiun-charts">
				<!-- #ifdef MP-ALIPAY -->
				<canvas canvas-id="incomeCanvasPie" id="incomeCanvasPie" class="charts" :width="cWidth*pixelRatio" :height="cHeight*pixelRatio"
				 :style="{'width':cWidth+'px','height':cHeight+'px'}" @touchstart="touchIncomeCanvasPie"></canvas>
				<!-- #endif -->
				<!-- #ifndef MP-ALIPAY -->
				<canvas canvas-id="incomeCanvasPie" id="incomeCanvasPie" class="charts" @touchstart="touchIncomeCanvasPie"></canvas>
				<!-- #endif -->
			</view>
		</view>

		<!-- 	<view>
			<button class="cu-btn round bg-gradual-blue" @click="getServerData">刷新</button>
		</view> -->
		<br>
		<view class="cu-form-group">
			<view class="title">日期</view>
			<picker mode="date" :value="date" fields="month" @change="dateChange">
				<view class="picker">
					{{date}}
				</view>
			</picker>
		</view>
		<view class="qiun-bg-white qiun-title-bar qiun-common-mt" style="width: 100%;">
			<view class="qiun-title-dot-light">日统计情况:总支出:{{daySum}}元</view>
		</view>
		<view class="qiun-charts">
			<!--#ifdef MP-ALIPAY -->
			<canvas canvas-id="dayPie" id="dayPie" class="charts" :width="cWidth*pixelRatio" :height="cHeight*pixelRatio" :style="{'width':cWidth+'px','height':cHeight+'px'}"
			 @touchstart="touchDayPie"></canvas>
			<!--#endif-->
			<!--#ifndef MP-ALIPAY -->
			<canvas canvas-id="dayPie" id="dayPie" class="charts" @touchstart="touchDayPie"></canvas>
			<!--#endif-->
		</view>
	</view>
</template>

<script>
	import uCharts from '@/components/u-charts/u-charts.js';
	import {
		isJSON
	} from '@/common/checker.js';

	import {
		callCloudFunction,
		getUserOpenid
	} from '@/common/public_util.js';

	var _self;
	let canvaPie = null; //月统计
	let dayPie = null; //日统计
	let incomeCanvasPie = null //月收入统计

	export default {
		data() {
			return {
				cWidth: '',
				cHeight: '',
				textarea: '',
				dayTextarea: '',
				expenditureSum: 0, //总支出
				daySum: 0, //日总支出
				incomeSum: 0, //月总收入
				date: '',
				pixelRatio: 1,
				tabCur: 0
			}
		},
		onShow() {
			_self.getServerData();
		},
		onLoad() {
			_self = this;
			var myDate = new Date();
			var year = myDate.getFullYear();
			var month = myDate.getMonth();
			var m = month + 1;
			if (m.toString().length == 1) {
				m = "0" + m;
			}
			_self.date = year + '-' + m;


			//#ifdef MP-ALIPAY
			uni.getSystemInfo({
				success: function(res) {
					if (res.pixelRatio > 1) {
						//正常这里给2就行，如果pixelRatio=3性能会降低一点
						//_self.pixelRatio =res.pixelRatio;
						_self.pixelRatio = 2;
					}
				}
			});
			//#endif
			this.cWidth = uni.upx2px(750);
			this.cHeight = uni.upx2px(500);
			this.getServerData();
		},
		methods: {
			getServerData() {

				//日统计
				let dayDate = new Date();
				uniCloud.callFunction({
					name:'money_query',
					data:{
						openid: getUserOpenid(),
						startDate: new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate(), 0, 0, 0),
						endDate: new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate(), 23, 59, 59)
					}
				}).then(dayRes =>{
					if (dayRes.result.data == null)
						return;
					let Pie = {
						series: []
					};
					let series = [];
					
					let sum = 0; //总数
					let typeMap = {};
					dayRes.result.data.forEach((data) => {
						if (data.mark == null || data.mark != 'income') {
							let type = data['type'];
							let money = new Number(data['money']);
							let moneySum = typeMap[type];
							if (moneySum == null || moneySum <= 0) {
								moneySum = money;
							} else {
								moneySum += money;
							}
							sum += money;
							typeMap[type] = moneySum;
						}
					});
					for (let key in typeMap) {
						let serie = {
							name: key,
							data: typeMap[key]
						};
						series.push(serie);
					}
					_self.daySum = sum.toFixed(2);
					
					Pie.series = series;
					// _self.textarea = JSON.stringify({
					// 	series: series
					// });
					_self.showPie("dayPie", Pie);
				})
				


				//月统计
				let yms = _self.date.split('-');
				let startDay = 1; //本月第一日
				let endDay = new Date(yms[0], yms[1], 0).getDate(); // 本月最后一天
				uniCloud.callFunction({
					name:'money_query',
					data:{
						openid: getUserOpenid(),
						startDate: new Date(yms[0], new Number(yms[1]) - 1, startDay, 0, 0, 0),
						endDate: new Date(yms[0], new Number(yms[1]) - 1, endDay, 23, 59, 59)
					}
				}).then(res =>{
					if (res.result.data == null)
						return;
					let Pie = {
						series: []
					};
					let series = [];
					
					let sum = 0; //支出总数
					let typeMap = {};
					let incomeTypeMap = {}; //收入分组
					let incomeSum = 0; //收入总数
					res.result.data.forEach((data) => {
						let type = data['type'];
						let money = new Number(data['money']);
						if (data.mark != null && data.mark == 'income') {
							let moneySum = incomeTypeMap[type];
							if (moneySum == null || moneySum <= 0) {
								moneySum = money;
							} else {
								moneySum += money;
							}
							incomeSum += money;
							incomeTypeMap[type] = moneySum;
						} else {
							let moneySum = typeMap[type];
							if (moneySum == null || moneySum <= 0) {
								moneySum = money;
							} else {
								moneySum += money;
							}
							sum += money;
							typeMap[type] = moneySum;
						}
					});
					//月支出
					for (let key in typeMap) {
						let serie = {
							name: key,
							data: typeMap[key]
						};
						series.push(serie);
					}
					_self.expenditureSum = sum.toFixed(2);
					
					Pie.series = series;
					// _self.textarea = JSON.stringify({
					// 	series: series
					// });
					_self.canvasPie = Pie;
					_self.showPie("canvasPie", Pie);
					
					series = [];
					Pie = {
						series: []
					};
					//月收入
					for (let key in incomeTypeMap) {
						let serie = {
							name: key,
							data: incomeTypeMap[key]
						};
						series.push(serie);
					}
					_self.incomeSum = incomeSum.toFixed(2);
					
					Pie.series = series;
					
					// _self.incomeTextarea = JSON.stringify({
					// 	series: series
					// });
					
					_self.incomeCanvasPie = Pie;
					_self.showPie("incomeCanvasPie", Pie);
				})
				 


			},
			showPie(canvasId, chartData) {
				if (canvasId == 'canvasPie') {
					canvaPie = new uCharts({
						$this: _self,
						canvasId: canvasId,
						type: 'pie',
						fontSize: 11,
						padding: [15, 15, 0, 15],
						legend: {
							show: true,
							padding: 5,
							lineHeight: 11,
							margin: 0,
						},
						background: '#FFFFFF',
						pixelRatio: _self.pixelRatio,
						series: chartData.series,
						animation: true,
						width: _self.cWidth * _self.pixelRatio,
						height: _self.cHeight * _self.pixelRatio,
						dataLabel: true,
						extra: {
							pie: {
								border: true,
								borderColor: '#FFFFFF',
								borderWidth: 3
							}
						},
					});
				} else if (canvasId == 'dayPie') {
					dayPie = new uCharts({
						$this: _self,
						canvasId: canvasId,
						type: 'pie',
						fontSize: 11,
						padding: [15, 15, 0, 15],
						legend: {
							show: true,
							padding: 5,
							lineHeight: 11,
							margin: 0,
						},
						background: '#FFFFFF',
						pixelRatio: _self.pixelRatio,
						series: chartData.series,
						animation: true,
						width: _self.cWidth * _self.pixelRatio,
						height: _self.cHeight * _self.pixelRatio,
						dataLabel: true,
						extra: {
							pie: {
								border: true,
								borderColor: '#FFFFFF',
								borderWidth: 3
							}
						},
					});
				} else if (canvasId == 'incomeCanvasPie') { //月收入统计
					incomeCanvasPie = new uCharts({
						$this: _self,
						canvasId: canvasId,
						type: 'pie',
						fontSize: 11,
						padding: [15, 15, 0, 15],
						legend: {
							show: true,
							padding: 5,
							lineHeight: 11,
							margin: 0,
						},
						background: '#FFFFFF',
						pixelRatio: _self.pixelRatio,
						series: chartData.series,
						animation: true,
						width: _self.cWidth * _self.pixelRatio,
						height: _self.cHeight * _self.pixelRatio,
						dataLabel: true,
						extra: {
							pie: {
								border: true,
								borderColor: '#FFFFFF',
								borderWidth: 3
							}
						},
					});
				}

			},
			/**
			 * 月支出统计
			 * @param {Object} e
			 */
			touchPie(e) {
				canvaPie.showToolTip(e, {
					format: function(item) {
						return item.name + ':' + item.data
					}
				});
				canvaPie.touchLegend(e, {
					animation: true
				});
			},
			/**
			 * 日支出统计
			 * @param {Object} e
			 */
			touchDayPie(e) {
				dayPie.showToolTip(e, {
					format: function(item) {
						return item.name + ':' + item.data
					}
				});
				dayPie.touchLegend(e, {
					animation: true
				});
			},
			/**
			 * 月收入统计
			 * @param {Object} e
			 */
			touchIncomeCanvasPie(e) {
				incomeCanvasPie.showToolTip(e, {
					format: function(item) {
						return item.name + ':' + item.data
					}
				});
				incomeCanvasPie.touchLegend(e, {
					animation: true
				});
			},


			/**
			 * 日期选择变更
			 */
			dateChange(event) {
				_self.date = event.detail.value;
				_self.getServerData();
			},
			/**
			 * tab切换
			 * @param {Object} e
			 */
			tabSelect(e) {
				_self.tabCur = e.currentTarget.dataset.id;
				if (_self.tabCur == 0 && _self.canvasPie != null) { //支出
					_self.showPie("canvasPie", _self.canvasPie);
				} else if (_self.tabCur == 1 && _self.incomeCanvasPie != null) { //收入
					_self.showPie("incomeCanvasPie", _self.incomeCanvasPie);
				}
			},
		}
	}
</script>

<style>
	/*样式的width和height一定要与定义的cWidth和cHeight相对应*/
	.qiun-charts {
		width: 750upx;
		height: 500upx;
		background-color: #FFFFFF;
	}

	.charts {
		width: 750upx;
		height: 500upx;
		background-color: #FFFFFF;
	}
</style>
