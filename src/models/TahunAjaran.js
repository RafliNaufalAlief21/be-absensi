import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../config/config.js";

const TahunAjaran = sequelize.define(
  "TahunAjaran",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama_tahun_ajaran: {
      // Gunakan nama kolom yang benar
      type: DataTypes.STRING,
      allowNull: false,
    },
    tanggal_mulai: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    tanggal_selesai: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    tableName: "tahun_ajaran",
    timestamps: false,
  }
);

TahunAjaran.associate = (models) => {
  TahunAjaran.hasMany(models.Kelas, {
    foreignKey: "tahun_ajaran_id",
    as: "kelas", // Ensure alias is correct
  });
};

export default TahunAjaran;
