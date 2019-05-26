'use strict';

const config = require('./config');
const { createLogger, format, transports } = require('winston');

module.exports = createLogger({
    level: config.logging.level,
    format: format.combine(
        format.colorize(),
        format.timestamp({
            format: 'DD/MM/YYYY HH:mm:ss'
        }),
        format.printf(info => `[${info.level} ${info.timestamp}] ${info.message}`)
    ),
    transports: [
        new transports.Console(),
        //new transports.File({ filename: 'combined.log' })
    ],
    exitOnError: false
});