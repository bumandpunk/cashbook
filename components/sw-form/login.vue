<template>
  <div class="account-wrap">
		<!-- 登陆 -->
		<div class="login-box">
			<div class="list" >
				<div class="name">国家和地区</div>
				<div class="value">中国大陆</div>
			</div>
			<div class="list" @tap="focus('phone')">
				<div class="name">+86</div>
				<div class="value">
					<text :class="{'show-bl':borderFor=='phone' && !login.phone, 'show-br':borderFor=='phone' && login.phone}">{{login.phone || '请输入手机号'}}</text>
				</div>
			</div>
			<div class="list" @tap="focus('idcard')">
				<div class="name">身份证号</div>
				<div class="value">
					<text :class="{'show-bl':borderFor=='idcard' && !login.idcard, 'show-br':borderFor=='idcard' && login.idcard}">{{login.idcard || '请输入身份证'}}</text>
				</div>
			</div>
			<div class="list" @tap="focus('plateNumber')">
				<div class="name">车牌号</div>
				<div class="value">
					<text :class="{'show-bl':borderFor=='plateNumber' && !login.plateNumber, 'show-br':borderFor=='plateNumber' && login.plateNumber}">{{login.plateNumber || '请输入车牌号'}}</text>
				</div>
			</div>
			<div class="list" @tap="focus('checkcode')">
				<div class="name">验证码</div>
				<div class="value flex">
					<text :class="{'show-bl':borderFor=='checkcode' && !login.checkcode, 'show-br':borderFor=='checkcode' && login.checkcode}">{{login.checkcode || '请输入验证码'}}</text>
					<div class="send-btn" :class="{sending:loginCodeText!=='发送验证码'}" @tap="sendMsg(0)" v-text="loginCodeText=='发送验证码' ? loginCodeText : loginCodeText+'(s)'"></div>
				</div>
			</div>
			<div class="submit" @tap="submit(0)" >登陆</div>
			<!-- <div class="login-type">
				<p>使用第三方登录</p>
				<image src="/static/img/qq.png" @tap="login"></image>
				<image src="/static/img/wechat.png"></image>
			</div> -->
		</div>
		<keyboard-package :disableDot="true" :type="keyboardType"  @input="inputVal" ref="keyboard"></keyboard-package>
	</div>
</template>

<script>
// import { loginByPhone, getCode } from '@/api/api.js'
import keyboardPackage from '@/components/keyboard-package/keyboard-package.vue'
export default {
	components:{keyboardPackage},
  data () {
    return {
			borderFor:false, //当前是哪个输入框
			keyboardFor: false, //当前键盘是给谁用的
			loginCodeText:'发送验证码',
			keyboardType: 1, //键盘类型   1-数字 2-身份证 3-车牌号
			timer:false, //定时器
			login:{
				classfy:1,
				type:1,
				idcard:'',
				phone:'', //手机号
				checkcode:'' ,//验证码
				plateNumber:'' //车牌号
			},
    }
  },
  methods: {
		focus ( type ) {
			let typeArr = {
				phone: 1,
				checkcode:1,
				idcard: 2,
				plateNumber: 3
			}
			if(this.borderFor != type)	{
				this.keyboardFor = type
				this.keyboardType = typeArr[type]
				clearInterval(this.timer)
				this.timer = setInterval(()=>{
					this.borderFor = this.borderFor == type ? false : type
				},500)
			}
			this.$refs.keyboard.open()
		},
		inputVal ( val ) {
			val = val.toString()
			let key = this.keyboardFor
			let _this = this
			
			const writeValue = (key, maxlength)=>{
				let len = _this.login[key].length
				if(!val){
					_this.login[key] = _this.login[key].substring(0, len-1)
					return
				}
				if(len === maxlength) return
				_this.login[key] += val
			}
			
			const funArr = {
				phone () {
					writeValue (key, 11)
				},
				idcard () {
					writeValue (key, 18)
				},
				plateNumber () {
					writeValue (key, 7)
				},
				checkcode () {
					writeValue (key, 6)
				}
			}
			funArr[key]()

		},
		//发送验证码
		sendMsg ( type ) {
			//检测手机号是否符合规则
			let regPhone = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/
			if( !regPhone.test(this.login.phone) ){
			  uni.showToast({
			    title:'您的手机号输入不合法',
			    icon:'none'
			  })
			  return
			}
			// getCode({userid:this.login.phone,classfy:1})
			// .then(res=>{
			// 	this.log(res)
			// 	let icon = 'none'
			// 	let title = res.msg
			// 	if( res.code === '200' ){
			// 		icon = 'succes'
			// 		title = '短信发送成功'
			// 		this.loginCodeText = 60
			// 		this.timer = setInterval(()=> {
			// 			this.loginCodeText -= 1
			// 			if( this.loginCodeText === 0){
			// 				clearInterval(this.timer)
			// 				this.loginCodeText = '发送验证码'
			// 			}
			// 		}, 1000)
			// 	}
			// 	uni.showToast({title,icon})
			// })
			
		},
		//登陆、注册
		submit ( type ) {
			//检测手机号是否符合规则
			let regPhone = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/
			if( !regPhone.test(this.login.phone) ){
			  uni.showToast({
			    title:'您的手机号输入不合法',
			    icon:'none'
			  })
			  return
			}
			let code = /^\d{6}$/
			if(!this.login.checkcode || !code.test(this.login.checkcode)){
				uni.showToast({
					title:'验证码填写有误',
					icon:'none'
				})
				return
			}
			//请求登录
		}
	}
}
</script>

<style scoped lang="scss">
	.account-wrap{
		.change-bar div{
			width: 50%;text-align: center;color: #777;padding: 3px 0;
		}
		.login-box{
			margin-top: 10px;
		}
		.line{
			width: 40%;left: 5%;top: 45px;background:#A7CF2B;height: 2px;position: fixed;border-radius: 5px;
		}
		.list{
			border-bottom: 1px solid #efefef;color: #777; padding: 5px 10px;margin: 5px auto;
			display: flex;justify-content: space-between;align-items: center;font-size: .9rem;
			.name{
				width: 32%;
			}
			.value{
				width: 68%;
				text{border: 4upx solid transparent;}
				.show-bl{border-left-color:#ccc}
				.show-br{border-right-color:#ccc}
				.send-btn{
					width:50%;font-size: .8rem;text-align: center;
					color: #A7CF2B;
				}
				.sending{color: #ccc !important;}
			}
		}
		.submit{
			width: 80%;padding: 8px 0;margin: 40px auto;background: #A7CF2B;text-align: center;
			color: #fff;border-radius: 20px;box-shadow: 0 0 3px 1px #ccc;
		}
		.login-type{
			text-align: center;color: #777;font-size: .7rem;
			image{width: 30px;height: 30px;margin: 5px 10px;}
		}
	}
</style>
