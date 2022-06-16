'use strict';
//云函数:查询日常账单
const db = uniCloud.database();
const collection = db.collection('money');
const $ = db.command.aggregate;
const dbCmd = db.command
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ' + event);
	let res = null;
	//日期范围查询
	if (event.startDate != null && event.endDate != null) {
		res = await collection.aggregate().addFields({
			formatDate: $.dateToString({
				date: '$date',
				format: '%Y-%m-%d %H:%M:%S'
			})
		}).match({
			openid: event.openid,
			date: dbCmd.gte(event.startDate).and(dbCmd.lte(event.endDate))
		}).sort({
			date: -1
		}).limit(1000).end();
	}
	//分页
	else if (event.pageNumber != null && event.pageSize != null) {
		//总数量
		let ct = await collection.where({
			openid: event.openid
		}).count();
		console.info('数量:' + ct.total);

		res = await collection.aggregate().addFields({
			formatDate: $.dateToString({
				date: '$date',
				format: '%Y-%m-%d %H:%M:%S'
			})
		}).match({
			openid: event.openid
		}).sort({
			date: -1
		}).skip((event.pageNumber - 1) * event.pageSize).limit(event.pageSize).end();

		res.total = ct.total;
	} else {
		res = await collection.aggregate().addFields({
			formatDate: $.dateToString({
				date: '$date',
				format: '%Y-%m-%d %H:%M:%S'
			})
		}).match({
			openid: event.openid
		}).sort({
			date: -1
		}).limit(1000).end();
	}
	//返回数据给客户端
	console.log('res : ' + res);
	return res
};
