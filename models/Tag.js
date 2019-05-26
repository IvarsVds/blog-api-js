'use strict';

module.exports = (sequelize, DataTypes) => {
    const Tag = sequelize.define('Tag', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        tag: {
            type: DataTypes.STRING,
            allowNufll: false
        }
    }, {
        timestamps: false
    });

    Tag.associate = (models) => {
        Tag.belongsTo(models.Post);
    };

    return Tag;
};