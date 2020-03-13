import { DataTypes, Model } from 'sequelize';

class Like extends Model {
  static init(sequelize) {
    super.init({
      like: DataTypes.BOOLEAN,
      dislike: DataTypes.BOOLEAN,
    }, { sequelize });
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'likes_user' });
    this.belongsTo(models.Interpretation, { foreignKey: 'interpretation_id', as: 'likes_interpretation' });
  }
}

export default Like;
