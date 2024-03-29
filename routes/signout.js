/**
 * Created by sunqq on 2016/12/12.
 */
var express = require('express');
var router = express.Router();

var checkLogin = require('../middle/check').checkLogin;

// GET /signout 登出
router.get('/', checkLogin, function (req, res, next) {
    // 清空 session 中用户信息
    req.session.user = null;
    req.flash('success', '登出成功');

    // 跳转到主页
    res.redirect('/posts');
});

module.exports = router;