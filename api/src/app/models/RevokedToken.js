import { DataTypes, Model } from 'sequelize';

class RevokedToken extends Model {
  static init(sequelize) {
    super.init({
      token: DataTypes.STRING(255),
    }, {
      sequelize,
      tableName: 'rovoked_tokens'
    });
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'owner' });
  }
}

export default RevokedToken;
