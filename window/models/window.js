'use strict';

module.exports = (sequelize, DataType) => {
    var window = sequelize.define('window', {
        no : {
            type: DataType.INTEGER,
            autoIncrement:true,
            primaryKey: true
        },
        status : {
            type : DataType.STRING,
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