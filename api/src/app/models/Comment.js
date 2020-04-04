import { DataTypes, Model } from "sequelize";
import { paginate } from "sequelize-paginate";

class Comment extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        comment: DataTypes.STRING(280),
      },
      {
        sequelize,
        tableName: "comments",
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Interpretation, {
      foreignKey: "interpretation_id",
      as: "comments_interpretation",
    });
    this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
  }
}

paginate(Comment);

export default Comment;
