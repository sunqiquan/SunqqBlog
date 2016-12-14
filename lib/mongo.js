/**
 * Created by sunqq on 2016/12/12.
 */

var config = require('config-lite');
var Mongolass = require('mongolass');
var mongolass = new Mongolass();
mongolass.connect(config.mongodb);

var moment = require('moment');
var objectIdToTimestamp = require('objectid-to-timestamp');

mongolass.plugin('addCreatedAt', {
    afterFind: function (results) {
        results.forEach(function (item) {
            item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
        });
        return results;
    },

    afterFindOne: function (result) {
        if(result) {
            result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
        }
        return result;
    }
});

// 用户
exports.User = mongolass.model('User', {
    name: {type: 'string'},
    password: {type: 'string'},
    gender: {type: 'string', enum: ['m', 'f', 'x']},
    avatar: {type: 'string'},
    bio: {type: 'string'}
});

// 根据用户名找到用户, 用户名全局唯一
exports.User.index({name: 1}, {unique: true}).exec();

// 文章
exports.Post = mongolass.model('Post', {
    author: {type: Mongolass.Types.ObjectId},
    title: {type: 'string'},
    content: {type: 'string'},
    pv: {type: 'number'}
});

// 按创建时间降序查看用户的文章列表
exports.Post.index({author: 1, _id: -1}).exec();

// 留言
exports.Comment = mongolass.model('Comment', {
    author: {type: Mongolass.Types.ObjectId},
    content: {type: 'string'},
    postId: {type: Mongolass.Types.ObjectId}
});

// 通过文章id获取该文章的所以留言, 按留言创建时间升序
exports.Comment.index({postId: 1, _id: 1}).exec();

// 通过用户id和留言id删除一个留言
exports.Comment.index({author: 1, _id: 1}).exec();