'use strict';

module.exports = (sequelize, DataType) => {
    var window = sequelize.define('window', {
        status : {
            type : DataType.STRING,
            primaryKey: true,
            allowNull: false
        },
        auto : {
            type : DataType.INTEGER,
            allowNull: false
        }
    },
    {
        timestamps: false
    });
    return window;
};