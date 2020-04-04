import bcrypt from "bcryptjs";
import { generateTokenJwt } from "../utils";
import { paginate } from "sequelize-paginate";
import { Model, DataTypes } from "sequelize";

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        role: DataTypes.ENUM("user", "admin"),
        name: DataTypes.STRING(255),
        email: DataTypes.STRING(255),
        password: DataTypes.STRING(255),
        passwordResetExpires: DataTypes.DATE,
        passwordResetToken: DataTypes.STRING(255),
      },
      {
        hooks: {
          beforeCreate: async (user, options) => {
            user.password = await bcrypt.hash(user.password, 10);
          },
          beforeUpdate: async (user, options) => {
            if (options.fields.includes("password")) {
              user.password = await bcrypt.hash(user.password, 10);
            }
          },
        },
        sequelize,
        tableName: "users",
      }
    );
  }

  async validatePassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  async generateTokenJwt() {
    return generateTokenJwt(process.env.TM_SECRET, { id: this.id });
  }

  static associate(models) {
    this.hasMany(models.RevokedToken, {
      foreignKey: "user_id",
      as: "tokens_user",
    });
    this.hasMany(models.Comment, {
      foreignKey: "user_id",
      as: "comments_user",
    });
    this.hasMany(models.Like, { foreignKey: "user_id", as: "likes_user" });
  }
}

paginate(User);

export default User;
