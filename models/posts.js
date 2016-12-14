/**
 * Created by sunqq on 2016/12/13.
 */

var marked = require('marked');
var Post = require('../lib/mongo').Post;
var CommentModel = require('./comments');

Post.plugin('contentToHtml', {
    afterFind: function (posts) {
        return posts.map(function (post) {
            post.content = marked(post.content);
            return post;
        });
    },

    afterFindOne: function (post) {
        if(post) {
            post.content = marked(post.content);
        }
        return post;
    }
});

Post.plugin('addCommentsCount', {
    afterFind: function (posts) {
        return Promise.all(
            posts.map(function (post) {
                return CommentModel
                    .getCommentsCount(post._id)
                    .then(function (commentsCount) {
                        post.commentsCount = commentsCount;
                        return post;
                    });
            })
        );
    },

    afterFindOne: function (post) {
        if(post) {
            return CommentModel
                .getCommentsCount(post._id)
                .then(function (commentsCount) {
                    post.commentsCount = commentsCount;
                    return post;
                });
        }
        return post;
    }
});

module.exports = {
    // 创建一篇文章
    create: function (post) {
        return Post.create(post).exec();
    },

    // 通过文章 id 获取一篇文章
    getPostById: function (postId) {
        return Post
            .findOne({_id: postId})
            .populate({path: 'author', model: 'User'})
            .addCreatedAt()
            .addCommentsCount()
            .contentToHtml()
            .exec();
    },

    getPosts: function (author) {
        var query = {};
        if(author) {
            query.author = author;
        }

        return Post
            .find(query)
            .populate({path: 'author', model: 'User'})
            .sort({_id: -1})
            .addCreatedAt()
            .addCommentsCount()
            .contentToHtml()
            .exec();
    },

    incPv: function (postId) {
        return Post
            .update({_id: postId}, {$inc: {pv: 1}})
            .exec();
    },
    
    getRawPostById: function (postId) {
        return Post
            .findOne({_id: postId})
            .populate({path: 'author', model: 'User'})
            .exec();
    },
    
    updatePostById: function (postId, author, data) {
        return Post.update({_id: postId, author: author}, {$set: data}).exec();
    },

    delPostById: function (postId, author) {
        return Post
            .remove({_id: postId, author: author})
            .exec()
            .then(function (res) {
                if(res.result.ok && res.result.n > 0) {
                    return CommentModel.delCommentById(postId);
                }
            });
    }
};