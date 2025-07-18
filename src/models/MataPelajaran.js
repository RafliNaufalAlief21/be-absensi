import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../config/config.js";

const MataPelajaran = sequelize.define(
  "MataPelajaran",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama_mapel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    guru_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    tableName: "mata_pelajaran",
    timestamps: true, // Enable Sequelize's automatic timestamps
    createdAt: "created_at", // Map Sequelize's createdAt to created_at
    updatedAt: "updated_at", // Map Sequelize's updatedAt to updated_at
  }
);

MataPelajaran.associate = (models) => {
  MataPelajaran.belongsTo(models.Guru, { foreignKey: "guru_id", as: "guru" });
  MataPelajaran.hasMany(models.Jadwal, {
    foreignKey: "mapel_id",
    as: "jadwal",
  });
};

export default MataPelajaran;
