var express = require('express');
var router = express.Router();
var model = require('../model');
var moment = require('moment');



const USERS_COLLECTION ="users"
const ARTICLES_COLLECTION ="articles"
/* GET home page. */
router.get('/', function(req, res, next) {
  model.connect(function(db){
	  db.collection(USERS_COLLECTION).find().toArray(function(arr,docs){
		  console.log("用户列表："+ JSON.stringify(docs));
		  var username = req.session.username || ""
		 
		  res.render('index', { title: '首页',data: JSON.stringify(docs),username: username});
	  })
  })
});

router.get('/bootstarp', function(req, res, next) {
	res.render('bootstarp');
});
//访问写文章
router.get('/write', function(req, res, next) {
	var username = req.session.username || ""
	res.render('write',{ title: '写文章页',username: username});
});

//提交文章内容
router.post('/write', function (req, res, next) {
	console.log("提交文章内容")
	console.log(req.body)
	moment.locale('zh-cn');
	var _today = moment().format('YYYY-MM-DD HH:mm:ss');
	console.log(_today)
	var data={
		title:req.body.title,
		type:req.body.type,
		substance:req.body.substance,
		uploadpic:req.body.uploadpic,
		author:req.session.username,
		datetime:_today
	}
	console.log(data)
		if (data.title != null && data.type != null && data.substance != null  && data.uploadpic != null && data.author != null) {
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
		res.send("<br>写文章失败,<a href='/write'>重新编写文章</a>" );
	}
});

/* 访问文章列表页 */
router.get('/articles', function(req, res, next) {
	var username =req.session.username || "";
	model.connect(function(db){
		db.collection(ARTICLES_COLLECTION).find().toArray(function(arr,docs){
			console.log("文章列表："+ JSON.stringify(docs));
			res.render('articles', { title: '文章列表页面',data: docs,username: username});
		})
	})
});


/* 访问文章详情页 */
router.get('/article_info',function(req, res, next) {
	console.log("访问文章详情页 ");
	console.log(req.query)
	var data =req.query || "";
	var username =req.session.username || "";
	model.connect(function(db){
	db.collection(ARTICLES_COLLECTION).find(data).toArray( function (err, docs) {			
		if (err) {
			res.send("<br>  文章详情页访问失败,<a href='/articles'>重新访问文章列表页</a>");
		} else {
			if( docs.length>0){
				console.log(docs);
				res.render('article_info',{ title: '文章详情页面',article:docs[0],username:username});
			}else{
				res.send("<br>  文章详情页访问失败,<a href='/articles'>重新访问文章列表页</a>");
			}
			
		}
	});
})
	// model.connect(function(db){
	// 	db.collection(ARTICLES_COLLECTION).find().toArray(function(arr,docs){
	// 		console.log("用户列表："+ JSON.stringify(docs));
	// 		res.render('article_info', { title: '文章列表页面',data: docs});
	// 	})
	// })
});

module.exports = router;
