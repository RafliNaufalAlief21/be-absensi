import { Sequelize } from "sequelize";
import sequelize from "../config/config.js";

const Absensi = sequelize.define(
  "Absensi",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    siswa_id: {
      type: Sequelize.INTEGER,
      references: {
        model: "siswa",
        key: "id",
      },
      allowNull: false,
    },
    tanggal_absensi: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM("Hadir", "Izin", "Sakit", "Tidak Hadir"), // Hapus "Alpa"
      allowNull: false,
    },
    keterangan: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    jadwal_id: {
      type: Sequelize.INTEGER,
      references: {
        model: "jadwal",
        key: "id",
      },
      allowNull: false,
    },
    kelas_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "kelas", // Name of the referenced table
        key: "id", // Primary key in the referenced table
      },
    },
    waktu_masuk: {
      type: Sequelize.TIME,
      allowNull: true,
    },
    waktu_keluar: {
      type: Sequelize.TIME,
      allowNull: true,
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
    tableName: "absensi",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["siswa_id", "jadwal_id", "tanggal_absensi"],
      },
    ],
  }
);

Absensi.associate = (models) => {
  Absensi.belongsTo(models.Siswa, { foreignKey: "siswa_id", as: "siswa" });
  Absensi.belongsTo(models.Kelas, { foreignKey: "kelas_id", as: "kelas" });
  Absensi.belongsTo(models.Jadwal, {
    foreignKey: "jadwal_id",
    as: "jadwal",
    include: [
      {
        model: models.MataPelajaran,
        as: "mataPelajaran",
      },
      {
        model: models.Guru,
        as: "guru",
      },
    ],
  });
};

export default Absensi;
