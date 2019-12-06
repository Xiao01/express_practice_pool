var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//session配置
app.use(session({
  secret: 'session',
  resave: true,
  saveUninitialized:true,
  cookie: { maxAge:1000*60*50 }
}))
// //登录拦截
// app.get('*',function(req,res,next){
// 	var path = req.path;
// 	var username =req.session.username;
// 	console.log("登录拦截",username  ," ,path:",path);
// 	if( path =="/" || path =="/write"){
// 		if(!username){
// 			console.log("跳转到登录页面")
// 			res.redirect("/users/login");
// 		}
// 	}
// 	next()
// })
//登录拦截






//登录拦截
app.use(function (req, res, next) {
  console.log("登录拦截")
  if (req.session.username) {  // 判断用户是否登录
    next();
  } else {
    console.log(req.url )
    // 解析用户请求的路径
    var arr = req.url.split('/');
    // 去除 GET 请求路径上携带的参数
    for (var i = 0, length = arr.length; i < length; i++) {
      arr[i] = arr[i].split('?')[0];
    }
    // 判断请求路径是否为根、登录、注册、登出，如果是不做拦截
    if (arr.length > 1 && arr[1] == '') {
      next();
    } else if (arr.length > 2 && arr[1] == 'users' && (arr[2] == 'regist' || arr[2] == 'login' || arr[2] == 'logout')) {
      next();
    } else {  // 登录拦截
      req.session.originalUrl = req.originalUrl ? req.originalUrl : null;  // 记录用户原始请求路径
     
      res.redirect('/users/login');  // 将用户重定向到登录页面
    }
  }
});




app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
