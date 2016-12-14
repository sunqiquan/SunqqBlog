module.exports = function (app) {
    app.get('/', function (req, res) {
        res.redirect('/posts');
    });

    app.use('/signup', require('./signup'));
    app.use('/signin', require('./signin'));
    app.use('/signout', require('./signout'));
    app.use('/posts', require('./posts'));

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        if (!res.headersSent) {
            res.render('404');
        }
    });
};
