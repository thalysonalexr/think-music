import { DataTypes, Model } from "sequelize";
import { paginate } from "sequelize-paginate";

class Music extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        link: DataTypes.STRING(255),
        title: DataTypes.STRING(100),
        description: DataTypes.STRING(280),
        letter: DataTypes.TEXT,
        author: DataTypes.STRING(255),
      },
      {
        sequelize,
        tableName: "musics",
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Category, {
      foreignKey: "category_id",
      as: "category",
    });
  }
}

paginate(Music);

export default Music;
