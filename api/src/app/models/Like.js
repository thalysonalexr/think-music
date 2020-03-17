import { DataTypes, Model } from 'sequelize';
import { paginate } from 'sequelize-paginate';

class Like extends Model {
  static init(sequelize) {
    super.init({
      interpretation_id: {
        type: DataTypes.UUID,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.UUID,
        primaryKey: true
      },
      like: DataTypes.BOOLEAN,
      dislike: DataTypes.BOOLEAN,
    }, {
      sequelize,
      tableName: 'likes'
    });
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.Interpretation, { foreignKey: 'interpretation_id', as: 'interpretation' });
  }
}

paginate(Like);

export default Like;
