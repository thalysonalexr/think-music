import { QueryTypes } from "sequelize";
import sequelize from "../../../services/database";

import User from "../../models/User";
import Category from "../../models/Category";

export async function isAdmin(id) {
  const user = await User.findOne({
    where: {
      id,
      role: "admin",
    },
  });

  if (user) return user.role === "admin";

  return false;
}

export async function findOrCreateCategory(category) {
  const [model] = await sequelize.query(
    "SELECT * FROM categories AS c WHERE UPPER(c.title) LIKE UPPER(:title)",
    {
      replacements: { title: `%${category}%` },
      type: QueryTypes.SELECT,
      model: Category,
      mapToModel: true,
    }
  );

  if (model) return model;

  return await Category.create({
    title: category,
    description: "no description.",
  });
}
