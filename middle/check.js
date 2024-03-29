/**
 * Created by sunqq on 2016/12/12.
 */
module.exports = {
    checkLogin: function (req, res, next) {
        if(!req.session.user) {
            req.flash('error', '未登录');
            return res.redirect('/signin');
        }
        next();
    },

    checkNotLogin: function (req, res, next) {
        if(req.session.user) {
            req.flash('error', '已登录');
            return res.redirect('/posts');
        }
        next();
    }
};