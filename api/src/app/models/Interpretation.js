import { DataTypes, Model } from 'sequelize';

class Interpretation extends Model {
  static init(sequelize) {
    super.init({
      interpretation: DataTypes.TEXT,
    }, { sequelize });
  }

  static associate(models) {
    this.belongsTo(models.Music, { foreignKey: 'music_id', as: 'interpretations_music' });
    this.belongsTo(models.User, { foreignKey: 'author_id', as: 'interpretations_user' });
    this.hasMany(models.Comment, { foreignKey: 'interpretation_id', as: 'comments_interpretation' });
  }
}

export default Interpretation;
