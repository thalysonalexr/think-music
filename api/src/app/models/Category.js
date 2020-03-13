import { DataTypes, Model } from 'sequelize';

class Category extends Model {
  static init(sequelize) {
    super.init({
      title: DataTypes.STRING(45),
      description: DataTypes.STRING(255),
    }, { sequelize });
  }

  static associate(models) {
    this.hasMany(models.Musics, { foreignKey: 'category_id', as: 'musics_category' });
  }
}

export default Category;
