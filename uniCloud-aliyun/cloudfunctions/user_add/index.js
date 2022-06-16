'use strict';
const db = uniCloud.database();
const collection = db.collection('user');
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('参数event : ' + event);

	let res = await collection.where({
		openid: event.openid
	}).get();
	console.log('查询结果res : ' + JSON.stringify(res));

	//存在则更新
	if (res.affectedDocs > 0) {
		res = await collection.doc(res.data[0]._id).update(event);
		console.log('更新数据 : ' + JSON.stringify(event));
	} else { //新增
		//返回数据给客户端
		res = await collection.add(event);
	}
	console.log('返回结果res : ' + JSON.stringify(res));
	return res
};
