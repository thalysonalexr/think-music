import Sequelize from "sequelize";

import models from "../../app/models";
import config from "../../config/database";

const connection = new Sequelize(config[process.env.NODE_ENV]);

Object.keys(models).forEach((model) => {
  models[model].init(connection);
});

Object.keys(models).forEach((model) => {
  models[model].associate(connection.models);
});

export default async () => {
  await connection.authenticate();
  await connection.sync();

  return connection;
};
