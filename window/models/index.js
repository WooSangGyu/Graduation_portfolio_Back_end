'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.window = require('./window')(sequelize, Sequelize);
db.blind = require('./blind')(sequelize, Sequelize);
db.indust = require('./indust')(sequelize, Sequelize);
db.outdust = require('./outdust')(sequelize, Sequelize);
db.address = require('./address')(sequelize, Sequelize);

// 사용자의 주소 값과 외부 미세먼지 테이블의 주소값 1:N 관계 설정
db.address.hasMany(db.outdust, {foreignKey: 'userregion', sourceKey: 'region', onDelete:'cascade', onUpdate: 'cascade'});
db.outdust.belongsTo(db.address, {foreignKey: 'userregion', targetKey: 'region'});

module.exports = db;
