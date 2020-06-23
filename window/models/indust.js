'use strict';

module.exports = (sequelize, DataType) => {
    var indust = sequelize.define('indust', {
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