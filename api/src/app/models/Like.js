import { DataTypes, Model } from "sequelize";
import { paginate } from "sequelize-paginate";

class Like extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        like: DataTypes.BOOLEAN,
        dislike: DataTypes.BOOLEAN,
      },
      {
        sequelize,
        tableName: "likes",
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    this.belongsTo(models.Interpretation, {
      foreignKey: "interpretation_id",
      as: "interpretation",
    });
  }
}

paginate(Like);

export default Like;
