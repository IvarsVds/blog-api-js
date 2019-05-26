'use strict';
/*
    Split this file up, if it grows too big
*/
const Router = require('koa-better-router')().loadMethods();
const logger = require('../lib/logger');
const { convertToNum } = require('../lib/utils');
const db = require('../models');
const Op = db.Sequelize.Op;

Router.get('/posts', async (ctx, next) => {
    // get all Posts
    try {
        // maybe flatten this stuff out? util function to rescue!
        ctx.body = await db.Post.findAll({
            include: [{
                model: db.Tag,
                attributes: ['tag']
            }]
        });
    } catch (e) {
        ctx.status = 500;
        logger.error(e);
    }
    return next();
});

Router.get('/posts/:id', async (ctx, next) => {
    // get a post by id
    // retuns 204 if no post is found
    try {
        const postId = convertToNum(ctx.params.id);

        if (isNaN(postId)) {
            throw new Error('NaN');
        }

        ctx.body = await db.Post.findByPk(postId);
    } catch (e) {
        if (e.message === 'NaN') {
            ctx.status = 400;
            ctx.body = JSON.stringify({
                message: 'ID must be an integer!'
            });
        } else {
            ctx.status = 500;
            logger.error(e);
        }
    }

    return next();
});

Router.get('/posts/tagged/:tag', async (ctx, next) => {
    try {
        // flatten out tagas array
        const taggedPosts = await db.Post.findAll({
            include: [{
                model: db.Tag,
                attributes: ['tag'],
                where: {
                    tag: ctx.params.tag
                }
            }]
        });

        ctx.body = JSON.stringify(taggedPosts);
    } catch (e) {
        ctx.status = 500;
        logger.error(e);
    }
    return next();
});

Router.post('/posts/', async (ctx, next) => {
    // create a post
    const title = ctx.request.body.title;
    const post = ctx.request.body.post;
    const tags = ctx.request.body.tags;

    if (title && post && tags) {
        try {
            const newPost = await db.Post.create({
                title,
                post
            });
            const PostId = newPost.dataValues.id;
    
            tags.forEach(tag => {
                db.Tag.create({
                    tag,
                    PostId
                });
            });
    
            ctx.body = JSON.stringify({
                message: 'Post created!'
            });
        } catch (e) {
            ctx.status = 500;
            logger.error(e);
        }
    } else {
        ctx.status = 400;
        ctx.body = JSON.stringify({
            message: 'Missing "title","body" and/or "tags"!'
        });
    }

    return next();
});

Router.put('/posts/:id', async (ctx, next) => {
    // edit a post

    const title = ctx.request.body.title;
    const post = ctx.request.body.post;

    if (title && post) {
        try {
            const id = convertToNum(ctx.params.id);
    
            if (isNaN(id)) {
                throw new Error('NaN');
            }
    
            await db.Post.update({
                title,
                post
            }, {
                where: {
                    id
                }
            });

            ctx.body = JSON.stringify({
                message: `Post ID: ${ctx.params.id} updated!`
            });
        } catch (e) {
            if (e.message === 'NaN') {
                ctx.status = 400;
                ctx.body = JSON.stringify({
                    message: 'ID must be an integer!'
                });
            } else {
                ctx.status = 500;
                logger.error(e);
            }
        }
    } else {
        ctx.status = 400;
        ctx.body = JSON.stringify({
            message: 'Missing "title" and/or "body"'
        });
    }

    return next();
});

Router.del('/posts/', async (ctx, next) => {
    // delete post(s)
    const id = ctx.request.body.id;

    if (id) {
        try {
            await db.Post.destroy({where:{
                id: {
                    [Op.in]: id
                }
            }});
            ctx.body = JSON.stringify({
                message: `Post(s) with ID('s): ${id.toString()} deleted!`
            });
        } catch (e) {
            ctx.status = 500;
            logger.error(e);
        }
    } else {
        ctx.status = 400;
        ctx.body = JSON.stringify({
            message: 'Missing "id" array!'
        });
    }

    return next();
});

module.exports = Router;