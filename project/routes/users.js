var express = require('express');
var router = express.Router();
var model = require('../model');
const USERS_COLLECTION = "users"
/* GET users listing. */
router.get('/', function (req, res, next) {
	res.send('respond with a resource');
});
router.get('/login', function (req, res, next) {
	res.render("login");
});
//访问注册页面
router.get('/regist', function (req, res, next) {
	res.render('regist');

});
//注册账号
router.post('/regist', function (req, res, next) {
	console.log(req.body.username)
	console.log(req.body.password)
	console.log(req.body.password2)
	if (req.body.username != null && req.body.password != null && req.body.password == req.body.password2) {
		model.connect(function (db) {
			db.collection(USERS_COLLECTION).insertOne(req.body, function (err, doc) {
				if (err) {
					console.log(res, err.message, "Failed to create new user.");
				} else {
					res.redirect('/users/login');
				}
			});
		})
	} else {
		console.log(" req.body.username !=null && req.body.password !=null && req.body.password==req.body.password2");
		res.status(201).json(req.body);
	}
});



router.post('/login', function (req, res, next) {
	console.log(req.body.username)
	console.log(req.body.password)
	if (req.body.username != null && req.body.password != null) {
		model.connect(function (db) {
			console.log(" req.body")
			console.log(req.body)
			db.collection(USERS_COLLECTION).find(req.body, function (err, doc) {
				console.log(" doc")
				console.log(doc)
				if (err) {
					console.log(res, err.message, "Failed to find user.");
				} else {
					res.redirect('/');
				}
			});
		})
	} else {
		console.log(" req.body.username !=null && req.body.password !=null ");
		res.status(201).json(req.body);
	}
});

module.exports = router;
