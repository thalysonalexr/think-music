import bcrypt from 'bcryptjs';
import sequelizePaginate from 'sequelize-paginate';
import { Model, DataTypes } from 'sequelize';

class User extends Model {
  static init(sequelize) {
    super.init({
      role: DataTypes.ENUM('user', 'admin'),
      name: DataTypes.STRING(255),
      email: DataTypes.STRING(255),
      password: DataTypes.STRING(255),
      passwordResetExpires: DataTypes.DATE,
      passwordResetToken: DataTypes.STRING(255),
      status: DataTypes.BOOLEAN,
    }, {
      hooks: {
        beforeCreate: async (user, options) => {
          user.password = await bcrypt.hash(user.password, 10);
        },
        beforeUpdate: async (user, options) => {
          user.password = await bcrypt.hash(user.password, 10);
        },
      },
      sequelize,
      tableName: 'users'
    });
  }

  async validatePassword (password) {
    return await bcrypt.compare(password, this.password);
  }

  static associate(models) {
    this.hasMany(models.RevokedToken, { foreignKey: 'user_id', as: 'tokens_user' });
    this.hasMany(models.Comment, { foreignKey: 'user_id', as: 'comments_user' });
    this.hasMany(models.Like, { foreignKey: 'user_id', as: 'likes_user' });
  }
}

sequelizePaginate.paginate(User);

export default User;
