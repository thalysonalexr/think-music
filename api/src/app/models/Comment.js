import { DataTypes, Model } from 'sequelize';

class Comment extends Model {
  static init(sequelize) {
    super.init({
      comment: DataTypes.STRING(280),
    }, {
      sequelize,
      tableName: 'comments'
    });
  }

  static associate(models) {
    this.belongsTo(models.Interpretation, { foreignKey: 'interpretation_id', as: 'comments_interpretation' });
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'comments_user' });
  }
}

export default Comment;
