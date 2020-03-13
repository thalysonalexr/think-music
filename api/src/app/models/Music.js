import { DataTypes, Model } from 'sequelize';

class Music extends Model {
  static init(sequelize) {
    super.init({
      link: DataTypes.STRING(255),
      title: DataTypes.STRING(100),
      description: DataTypes.STRING(280),
      letter: DataTypes.TEXT,
      author: DataTypes.STRING(255),
    }, { sequelize });
  }

  static associate(models) {
    this.belongsTo(models.Categories, { foreignKey: 'category_id', as: 'musics_category' });
  }
}

export default Music;
