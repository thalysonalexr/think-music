import sequelize from "../../src/services/database";

export default () => {
  return Promise.all(
    Object.keys(sequelize.models).map(async (key) => {
      return await sequelize.models[key].destroy({
        truncate: true,
        force: true,
      });
    })
  );
};
