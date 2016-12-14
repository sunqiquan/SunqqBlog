var path = require('path');
var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var config = require('config-lite');
var flash = require('connect-flash');
var pkg = require('./package');
var winston = require('winston');
var expressWinston = require('express-winston');
var routes = require('./routes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// session
app.use(session({
    // cookie 中保存 session id 的名称
    name: config.session.key,
    // 设置secret来计算hash值并放在cookie中,使产生的signedCookie防篡改
    secret: config.session.secret,
    cookie: {
        // 过期时间
        maxAge: config.session.maxAge
    },
    // 将 session 存储到 mongodb
    store: new MongoStore({
        // mongodb 地址
        url: config.mongodb
    }),

    resave: true,
    saveUninitialized: false
}));

// flash中间件,显示通知
app.use(flash());

// 处理表单及文件上传的中间件
app.use(require('express-formidable')({
    // 上传文件目录
    uploadDir: path.join(__dirname, 'public/images'),
    //保留后缀
    keepExtensions: true
}));

// 设置模板全局长廊
app.locals.blog = {
    title: pkg.name,
    description: pkg.description
};

// 设置模板必需的三个变量
app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    next();
});

// 正常请求日志
app.use(expressWinston.logger({
    transports: [
        new (winston.transports.Console)({
            json: true,
            colorize: true
        }),

        new winston.transports.File({
            filename: 'logs/success.log'
        })
    ]
}));

// 路由
routes(app);

// 错误请求日志
app.use(expressWinston.errorLogger({
    transports: [
        new (winston.transports.Console)({
            json: true,
            colorize: true
        }),

        new winston.transports.File({
            filename: 'logs/error.log'
        })
    ]
}));

// error handler
app.use(function(err, req, res, next) {
    res.render('error', {
      error: err
    });
});

module.exports = app;
