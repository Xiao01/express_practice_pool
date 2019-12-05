var express = require('express');
var router = express.Router();
var model = require('../model');
var moment = require('moment');



const USERS_COLLECTION = "users"
const ARTICLES_COLLECTION = "articles"
/* GET home page. */
router.get('/', function (req, res, next) {
	model.connect(function (db) {
		db.collection(USERS_COLLECTION).find().toArray(function (arr, docs) {
			console.log("用户列表：" + JSON.stringify(docs));
			var username = req.session.username || ""

			res.render('index', { title: '首页', data: JSON.stringify(docs), username: username });
		})
	})
});

router.get('/bootstarp', function (req, res, next) {
	res.render('bootstarp');
});
//访问写文章
router.get('/write', function (req, res, next) {
	var username = req.session.username || ""
	res.render('write', { title: '写文章页', username: username });
});
//删除文章
router.get('/article_info_delete', function (req, res, next) {
	var username = req.session.username || ""
	var data = req.query || "";
	if (data != null) {
		model.connect(function (db) {
			db.collection(ARTICLES_COLLECTION).remove(data, function (error, result) {
				if (error) {
					res.send("<br>删除文章失败,<a href='/articles'>重新访问文章列表</a>");
				} else {
					console.log(result.result.n);
					res.redirect('articles');
				}
			});
		})
	} else {
		res.send("<br>删除文章失败,<a href='/articles'>重新访问文章列表</a>");
	}
});
//提交文章内容
router.post('/write', function (req, res, next) {
	console.log("提交文章内容")
	console.log(req.body)
	moment.locale('zh-cn');
	var _today = moment().format('YYYY-MM-DD HH:mm:ss');
	console.log(_today)
	var data = {
		title: req.body.title,
		type: req.body.type,
		substance: req.body.substance,
		uploadpic: req.body.uploadpic,
		author: req.session.username,
		datetime: _today,
		last_datetime: _today
	}
	console.log(data)
	if (data.title != null && data.type != null && data.substance != null && data.uploadpic != null && data.author != null) {
		model.connect(function (db) {
			db.collection(ARTICLES_COLLECTION).insertOne(data, function (err, doc) {
				if (err) {
					console.log(res, err.message, "写文章失败.");
					res.send("<br>写文章失败,<a href='/write'>重新编写文章</a>");
				} else {
					res.redirect('articles');
				}
			});
		})
	} else {
		res.send("<br>写文章失败,<a href='/write'>重新编写文章</a>");
	}
});

//更新文章内容
router.post('/write_update', function (req, res, next) {
	if(req.session.username  ){
		
	console.log("更新文章内容(req.body) ")
	moment.locale('zh-cn');
	var _today = moment().format('YYYY-MM-DD HH:mm:ss');
	var data = {
		title: req.body.title,
		type: req.body.type,
		substance: req.body.substance,
		uploadpic: req.body.uploadpic,
		last_datetime: _today
	}
	console.log(data)
	var old_title = req.body.old_title;
	console.log(old_title)
	var whereData = { "title": old_title };
	var updateDat = { $set: data };
	if (data.title != null && data.type != null && data.substance != null && data.uploadpic != null) {
		model.connect(function (db) {
			//	db.collection(ARTICLES_COLLECTION).find(whereData).toArray(function (err, docs) {
			db.collection(ARTICLES_COLLECTION).updateOne(whereData, updateDat, function (err, result) {
				if (err) {
					console.log('Error:' + err);
				} else {
					console.log(result);
					res.redirect('articles');
				}
			});
		})
	} else {
		res.send("<br>修改文章失败,<a href='/articles?author="+req.session.username+"'>查看本人的文章列表</a>");
	}

}else{
	res.redirect('/users/login');
}
});

/* 访问文章列表页 */
router.get('/articles', function (req, res, next) {
	var username = req.session.username || "";
	var whereData = null
	var data = req.query || "";
	if( data!= "" ){
		whereData = data
	}
	model.connect(function (db) {
		db.collection(ARTICLES_COLLECTION).find(whereData).toArray(function (arr, docs) {
			console.log("文章列表：" + JSON.stringify(docs));
			res.render('articles', { title: '文章列表页面', data: docs, username: username });
		})
	})
});


/* 访问文章详情页 */
router.get('/article_info', function (req, res, next) {
	console.log("访问文章详情页 ");
	console.log(req.query)
	var data = req.query || "";
	var username = req.session.username || "";
	model.connect(function (db) {
		db.collection(ARTICLES_COLLECTION).find(data).toArray(function (err, docs) {
			if (err) {
				res.send("<br>  文章详情页访问失败,<a href='/articles'>重新访问文章列表页</a>");
			} else {
				if (docs.length > 0) {
					console.log(docs);
					res.render('article_info', { title: '文章详情页面', article: docs[0], username: username });
				} else {
					res.send("<br>  文章详情页访问失败,<a href='/articles'>重新访问文章列表页</a>");
				}

			}
		});
	})
});

module.exports = router;
