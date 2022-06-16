'use strict';
//替换成自己小程序的appid和secret
const appid = 'xxxxxxxxxxxxx'; //小程序的appid
const secret = 'xxxxxxxxxxxxx'; //小程序的secret
const loginUrl = 'https://api.weixin.qq.com/sns/jscode2session';//请求网址
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ' + event)
	let res = await uniCloud.httpclient.request(loginUrl, {
		data: {
			appid: appid,
			secret: secret,
			js_code: event.code,
			grant_type: 'authorization_code'
		},
		dataType: 'json'
	})
	console.log('res : ' + res)
	return res.data
};
