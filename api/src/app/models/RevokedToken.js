import { DataTypes, Model } from 'sequelize';

class RevokedToken extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      token: DataTypes.STRING(255),
    }, { sequelize });
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'owner' });
  }
}

export default RevokedToken;
