'use strict';

require('dotenv').config();

module.exports = {
    port: parseInt(process.env.PORT, 10),
    db: {
        name: process.env.DB_NAME || 'blog',
        user: process.env.DB_USER || 'blogapi',
        pass: process.env.DB_PASS || ''
    },
    logging: {
        level : process.env.LOGGING_LEVEL || 'info'
    }
};