/**
 * Created by sunqq on 2016/12/14.
 */

var marked = require('marked');
var Comment = require('../lib/mongo').Comment;

Comment.plugin('contentToHtml', {
    afterFind: function (comments) {
        return comments.map(function (comment) {
            comment.content = marked(comment.content);
            return comment;
        });
    }
});

module.exports = {
    // 创建一个留言
    create: function (comment) {
        return Comment.create(comment).exec();
    },

    // 通过留言id和用户id删除留言
    delCommentById: function (commentId, author) {
        return Comment.remove({_id: commentId, author: author}).exec();
    },

    // 通过文章id删除该文章的所有留言
    delCommentByPostId: function (postId) {
        return Comment.remove({postId: postId}).exec();
    },

    // 通过文章id获取该文章的所有留言, 按留言创建时间升序
    getComments: function (postId) {
        return Comment
            .find({postId: postId})
            .populate({path: 'author', model: 'User'})
            .sort({_id: 1})
            .addCreatedAt()
            .contentToHtml()
            .exec();
    },

    // 通过文章id获取该文章的留言数
    getCommentsCount: function (postId) {
        return Comment.count({postId: postId}).exec();
    }
};