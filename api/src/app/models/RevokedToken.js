import { DataTypes, Model } from 'sequelize';

class RevokedTokens extends Model {
  static init(sequelize) {
    super.init({
      token: DataTypes.STRING(255),
    }, { sequelize });
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'owner' });
  }
}

export default RevokedTokens;
