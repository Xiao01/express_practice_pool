var express = require('express');
var router = express.Router();
var model = require('../model');
const USERS_COLLECTION = "users";
/* 访问用户列表页 */
router.get('/', function(req, res, next) {
	model.connect(function(db){
		db.collection(USERS_COLLECTION).find().toArray(function(arr,docs){
			console.log("用户列表："+ JSON.stringify(docs));
			res.render('users', { title: '用户列表页面',data: docs});
		})
	})
});

//访问登录页面
router.get('/login', function (req, res, next) {
	res.render("login",{title:"登录页面"});
});
//访问注册页面
router.get('/regist', function (req, res, next) {
	res.render('regist',{title:"注册页面"});
});


//提交用户登出
router.get('/logout', function (req, res, next) {
	req.session.username=null;
	req.session.password=null;
	res.redirect("/users/login");
});

//提交注册账号
router.post('/regist', function (req, res, next) {
	console.log(req.body.username)
	console.log(req.body.password)
	console.log(req.body.password2)
	var data={
		username:req.body.username,
		password:req.body.password,
		password2:req.body.password2
	}
	if (req.body.username != null && req.body.password != null && req.body.password == req.body.password2) {
		model.connect(function (db) {
			db.collection(USERS_COLLECTION).insertOne(data, function (err, doc) {
				if (err) {
					console.log(res, err.message, "Failed to create new user.");
					res.send("<br>  注册失败,<a href='/users/regist'>重新注册</a>");
				} else {
					res.redirect('login');
				}
			});
		})
	} else {
		console.log(" req.body.username !=null && req.body.password !=null && req.body.password==req.body.password2");
		res.send("<br> 注册失败, <a href='/users/regist'>重新注册</a>"+" <br>用户名："+ req.body.username  +" <br>密码："+req.body.password +" ,<br>确认密码："+req.body.password2 );
	}
});


//提交登录账号
router.post('/login', function (req, res, next) {
	console.log(req.body.username)
	console.log(req.body.password)
	var data={
		username:req.body.username,
		password:req.body.password
	}
	if (req.body.username != null && req.body.password != null) {
		model.connect(function (db) {
			db.collection(USERS_COLLECTION).find(data).toArray( function (err, docs) {			
				if (err) {
					res.send("<br>  登录失败,<a href='/users/login'>重新登录</a>");
				} else {
					if( docs.length>0){
						//登录成功，进行session存储
						req.session.username=data.username;
						req.session.password=data.password;
						res.redirect('/');
					}else{
						res.send("<br> 账号密码错误，<a href='/users/login'>重新登录</a>");
					}
					
				}
			});
		})
	} else {
		res.send("<br> 登录失败, <a href='/users/login'>重新登录</a>"+" <br>用户名："+ req.body.username  +" <br>密码："+req.body.password );
	}
});


module.exports = router;
