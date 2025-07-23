import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../config/config.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: "unique_username",
        msg: "NIP sudah digunakan", // Pesan error jika username duplikat
      },
      validate: {
        notEmpty: {
          msg: "Username tidak boleh kosong",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Password tidak boleh kosong",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: "unique_email",
        msg: "Email sudah digunakan", // Pesan error jika email duplikat
      },
      validate: {
        isEmail: {
          msg: "Format email tidak valid",
        },
        notEmpty: {
          msg: "Email tidak boleh kosong",
        },
      },
    },
    nama_lengkap: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    no_telepon: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_level_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "user_level",
        key: "id",
      },
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    tableName: "user",
    timestamps: false,
  }
);

User.associate = (models) => {
  User.hasOne(models.Guru, { foreignKey: "user_id", as: "guru" }); // Relasi User ke Guru
  User.belongsTo(models.UserLevel, {
    foreignKey: "user_level_id",
    as: "userLevel",
  });
};

export default User;
