import { DataTypes, Model } from 'sequelize';
import sequelizePaginate from 'sequelize-paginate';

class Category extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      title: DataTypes.STRING(45),
      description: DataTypes.STRING(255),
    }, {
      sequelize,
      tableName: 'categories'
    });
  }

  static associate(models) {
    this.hasMany(models.Music, { foreignKey: 'category_id', as: 'musics_category' });
  }
}

sequelizePaginate.paginate(Category);

export default Category;
