var express = require('express');
var router = express.Router();
var model = require('../model');
var moment = require('moment');

const USERS_COLLECTION = "users";
/* 访问用户列表页 */
router.get('/', function (req, res, next) {
	var username = req.session.username || "";
	model.connect(function (db) {
		db.collection(USERS_COLLECTION).find().toArray(function (arr, docs) {
			console.log("用户列表：" + JSON.stringify(docs));
			res.render('users', { title: '用户列表页面', data: docs, username: username });
		})
	})
});

//访问登录页面
router.get('/login', function (req, res, next) {
	res.render("login", { title: "登录页面" });
});
//访问注册页面
router.get('/regist', function (req, res, next) {
	res.render('regist', { title: "注册页面" });
});


//提交用户登出
router.get('/logout', function (req, res, next) {
	var username = req.session.username || "" ;
	if( username){
		res.render("logout",{title:req.session.username+"，您是否确认退出?"});
	}else{
		res.send("会话过期，无需退出, <a href='/'>返回主页</a>")
	}
});

router.get('/logout_conform', function (req, res, next) {
	req.session.username ="" ;
	req.session.password ="" ;
	
		res.send("退出成功, <a href='/'>返回主页</a>");
	
});

//提交注册账号
router.post('/regist', function (req, res, next) {
	console.log("//提交注册账号")
	console.log(req.body.username)
	console.log(req.body.password)
	console.log(req.body.password2)
	var is_new = false;
	moment.locale('zh-cn');
	var _today = moment().format('YYYY-MM-DD HH:mm:ss');
	var whereData = { username: req.body.username }
	var data = {
		username: req.body.username,
		password: req.body.password,
		phone: req.body.phone,
		last_datetime: _today
	}
	if (req.body.username != null && req.body.password != null && req.body.password == req.body.password2
		&& req.body.phone != null) {

		model.connect(function (db) {
			db.collection(USERS_COLLECTION).insertOne(data, function (err, doc) {
				if (err) {
					console.log(res,"---------", err.message);
					res.send("<br>  注册失败,<a href='/users/regist'>重新注册</a>");
				} else {
					//登录成功，进行session存储
					req.session.username = data.username;
					req.session.password = data.password;
					res.redirect('/');
				}
			});
		})
	} else {
		console.log(" req.body.username !=null && req.body.password !=null && req.body.password==req.body.password2");
		res.send("<br> 注册失败, <a href='/users/regist'>重新注册</a>" + " <br>用户名：" + req.body.username + " <br>密码：" + req.body.password + " ,<br>确认密码：" + req.body.password2);
	}
});


//提交登录账号
router.post('/login', function (req, res, next) {
	console.log(req.body.username)
	console.log(req.body.password)
	var data = {
		username: req.body.username,
		password: req.body.password
	}
	if (req.body.username != null && req.body.password != null) {
		model.connect(function (db) {
			db.collection(USERS_COLLECTION).find(data).toArray(function (err, docs) {
				if (err) {
					res.send("<br>  登录失败,<a href='/users/login'>重新登录</a>");
				} else {
					if (docs.length > 0) {
						//登录成功，进行session存储
						req.session.username = data.username;
						req.session.password = data.password;
						res.redirect('/');
					} else {
						res.send("<br> 账号密码错误，<a href='/users/login'>重新登录</a>");
					}

				}
			});
		})
	} else {
		res.send("<br> 登录失败, <a href='/users/login'>重新登录</a>" + " <br>用户名：" + req.body.username + " <br>密码：" + req.body.password);
	}
});



//获取用户详情

router.get('/userinfo', function (req, res, next) {
	var username = req.session.username || "";
	var data = { username: username }
	if (username != null) {
		model.connect(function (db) {
			db.collection(USERS_COLLECTION).find(data).toArray(function (err, docs) {
				if (err) {
					res.send("<br>获取用户信息失败,<a href='/users/userinfo'>重新获取用户信息</a>");
				} else {
					if (docs.length > 0) {
						res.render('userinfo', { title: "修改用户信息", username: docs[0].username, phone: docs[0].phone });
					} else {
						res.send("<br>获取用户信息失败,<a href='/users/userinfo'>重新获取用户信息</a>");
					}

				}
			});
		})
	} else {
		res.send("<br> 登录失败, <a href='/users/login'>重新登录</a>" + " <br>用户名：" + req.body.username + " <br>密码：" + req.body.password);
	}

});


//修改用户详情页
router.post('/userinfo_update', function (req, res, next) {
	console.log("/修改用户详情页");
	var username = req.session.username || "";
	var whereData = { "username": req.session.username };
	moment.locale('zh-cn');
	var _today = moment().format('YYYY-MM-DD HH:mm:ss');
	var data = {
		password: req.body.password,
		phone: req.body.phone,
		last_datetime: _today
	}
	var updateDat = { $set: data };
	if (req.body.password != null && req.body.password2 != null && req.body.password == req.body.password2) {
		model.connect(function (db) {
			db.collection(USERS_COLLECTION).updateOne(whereData, updateDat, function (err, result) {
				if (err) {
					console.log('Error:' + err);
				} else {
					console.log(result);
					
					req.session.password =req.body.password
					res.render('index', { title: "密码修改成功，返回主页", username: username });
				}
			});
		})
	} else {
		res.render('userinfo', { title: "用户详情页面", username: username });
	}
});



module.exports = router;
