'use strict';

module.exports = (sequelize, DataType) => {
    var outdust = sequelize.define('outdust', {
        no : {
            type : DataType.INTEGER,
            autoIncrement: true,
            unique: true,
            primaryKey:true
        },
        outdust : {
            type : DataType.INTEGER,
            allowNull: false
        },
        time : {
            type : DataType.DATE,
            primaryKey: true,
            allowNull: false
        },
        weather : {
            type : DataType.INTEGER,
            allowNull: false
        },
        userregion : {
            type : DataType.STRING,
            allowNull: false
        }
    },
    {
        timestamps: false
    });
    return outdust;
};