'use strict';
//云函数:新增日常账单记录
const db = uniCloud.database(); //打开链接
const collection = db.collection('money'); //指定表
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('传入event : ' + event);
	let res = null;
	if (event.id != null && event.id != '') {
		res = await collection.doc(event.id).update({
			money: event.money,
			type: event.type,
			url: event.url,
			url1: event.url1,
			desc: event.desc
		});
	} else {
		event['date'] = new Date(+new Date()+8*3600*1000).toISOString();
		res = await collection.add(event);
	}
	//返回数据给客户端
	console.log('返回res : ' + res);
	return res;
};
