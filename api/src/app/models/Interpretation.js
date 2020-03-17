import { DataTypes, Model } from 'sequelize';
import { paginate } from 'sequelize-paginate';

class Interpretation extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      interpretation: DataTypes.TEXT,
    }, {
      sequelize,
      tableName: 'interpretations'
    });
  }

  static associate(models) {
    this.belongsTo(models.Music, { foreignKey: 'music_id', as: 'music' });
    this.belongsTo(models.User, { foreignKey: 'author_id', as: 'author' });
    this.hasMany(models.Comment, { foreignKey: 'interpretation_id', as: 'comments_interpretation' });
  }
}

paginate(Interpretation);

export default Interpretation;
