'use strict';

module.exports = (sequelize, DataType) => {
    var indust = sequelize.define('indust', {
        no : {
            type : DataType.INTEGER,
            autoIncrement: true,
            unique: true,
            primaryKey:true
        },
        indust : {
            type : DataType.INTEGER,
            allowNull: false
        },
        time : {
            type : DataType.DATE,
            primaryKey: true,
            allowNull: false
        }
    },
    {
        timestamps: false
    });
    return indust;
};