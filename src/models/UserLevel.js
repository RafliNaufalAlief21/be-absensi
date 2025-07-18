import { Sequelize } from "sequelize";
import sequelize from "../config/config.js";

const UserLevel = sequelize.define(
  "UserLevel",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama_level: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    level_akses: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      onUpdate: Sequelize.NOW,
    },
  },
  {
    tableName: "user_level",
    timestamps: false,
  }
);

export default UserLevel;
