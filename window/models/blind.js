'use strict';

module.exports = (sequelize, DataType) => {
    var blind = sequelize.define('blind', {
        status : {
            type : DataType.INTEGER,
            primaryKey: true,
            allowNull: false
        }
    },
    {
        timestamps: false
    });
    return blind;
};