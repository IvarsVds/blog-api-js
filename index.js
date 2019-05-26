'use strict';

const koa = require('koa');
const bodyParser  = require('koa-bodyparser');
const config = require('./lib/config');
const db = require('./models');
const logger = require('./lib/logger');
const routes = require('./controllers');

const server = new koa();
server.use(bodyParser({
    enableTypes: 'json',
    onerror: function (err, ctx) {
        // maybe add something else here
        logger.error(err);
    }
}));

// routes
server.use(routes.middleware());

// db stuff
db.sequelize.sync().catch(e => {
        logger.error(e);
    });

server.listen(config.port, () => { logger.info(`Server started on port: ${config.port}`) });