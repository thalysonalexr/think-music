import sequelize from "../../src/services/database";

export default async () => {
  const connection = await sequelize();

  return await Promise.all(
    Object.keys(connection.models).map(async (key) => {
      return await connection.models[key].truncate();
    })
  );
};
