import { Sequelize } from "sequelize";
import sequelize from "../config/config.js";

const Kelas = sequelize.define(
  "Kelas",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama_kelas: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    guru_id: {
      type: Sequelize.INTEGER,
      references: {
        model: "guru",
        key: "id",
      },
      onDelete: "SET NULL",
    },
    tahun_ajaran_id: {
      type: Sequelize.INTEGER,
      references: {
        model: "tahun_ajaran",
        key: "id",
      },
      onDelete: "SET NULL",
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
    tableName: "kelas",
    timestamps: false,
  }
);

Kelas.associate = (models) => {
  Kelas.belongsTo(models.TahunAjaran, {
    foreignKey: "tahun_ajaran_id",
    as: "tahunAjaran",
  });
  Kelas.belongsTo(models.Guru, { foreignKey: "guru_id", as: "guru" });
  Kelas.hasMany(models.Siswa, { foreignKey: "kelas_id", as: "siswa" });
  Kelas.hasMany(models.Absensi, { foreignKey: "kelas_id", as: "absensi" });
  Kelas.hasMany(models.Jadwal, { foreignKey: "kelas_id", as: "jadwalList" });
};

export default Kelas;
