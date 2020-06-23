'use strict';

module.exports = (sequelize, DataType) => {
    var address = sequelize.define('address', {
        region : {
            type : DataType.STRING,
            primaryKey: true,
            allowNull: false
        }
    },
    {
        timestamps: false
    });
    return address;
};