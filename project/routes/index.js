var express = require('express');
var router = express.Router();
var model = require('../model');
const USERS_COLLECTION ="users"
/* GET home page. */
router.get('/', function(req, res, next) {
  model.connect(function(db){
	  db.collection(USERS_COLLECTION).find().toArray(function(arr,docs){
		  console.log("用户列表："+ JSON.stringify(docs));
		  res.render('index', { title: 'Express',data: JSON.stringify(docs)});
	  })
  })
});

router.get('/bootstart', function(req, res, next) {
	res.render('bootstart');
});




module.exports = router;
