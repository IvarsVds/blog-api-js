'use strict';

const config = require('../lib/config');
const logger = require('../lib/logger');
const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');

const db = {};

const sequelize = new Sequelize(config.db.name, config.db.user, config.db.pass, {
    dialect: 'mariadb',
    logging: logger.verbose.bind(logger)
});

fs.readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = sequelize.import((path.join(__dirname, file)));
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;