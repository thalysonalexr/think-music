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
      password_reset_expires: DataTypes.DATE,
      password_reset_token: DataTypes.STRING(255),
    }, {
      hooks: {
        beforeCreate: async (user, options) => {
          user.password = await bcrypt.hash(user.password, 10);
        },
      },
      sequelize
    });
  }

  async validatePassword (password) {
    return await bcrypt.compare(password, this.password);
  }
}

sequelizePaginate.paginate(User);

export default User;
