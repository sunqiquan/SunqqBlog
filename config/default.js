/**
 * Created by sunqq on 2016/12/12.
 */

module.exports = {
    port: 3000,
    session: {
        secret: 'sunqqblog',
        key: 'sunqqblog',
        maxAge: 86400000
    },
    mongodb: 'mongodb://localhost:27017/sunqqblog'
};
