'use strict';
//云函数:删除日常账单记录
const db = uniCloud.database(); //打开链接
const collection = db.collection('money'); //指定表
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ' + event);
	let res = collection.doc(event._id).remove();
	console.log('res : ' + res);
	//返回数据给客户端
	return res;
};
