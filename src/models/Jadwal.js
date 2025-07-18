import { Sequelize } from "sequelize";
import sequelize from "../config/config.js";

const Jadwal = sequelize.define(
  "Jadwal",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    kelas_id: {
      type: Sequelize.INTEGER,
      references: {
        model: "kelas", // Ensure table name matches the database
        key: "id",
      },
      allowNull: false,
    },
    mapel_id: {
      type: Sequelize.INTEGER,
      references: {
        model: "mata_pelajaran", // Ensure table name matches the database
        key: "id",
      },
      allowNull: false,
    },
    guru_id: {
      type: Sequelize.INTEGER,
      references: {
        model: "guru", // Ensure table name matches the database
        key: "id",
      },
      allowNull: false,
    },
    tahun_ajaran_id: {
      type: Sequelize.INTEGER,
      references: {
        model: "tahun_ajaran", // Ensure table name matches the database
        key: "id",
      },
      allowNull: false,
    },
    hari: {
      type: Sequelize.ENUM(
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu"
      ),
      allowNull: false,
    },
    jam_mulai: {
      type: Sequelize.TIME,
      allowNull: false,
    },
    jam_selesai: {
      type: Sequelize.TIME,
      allowNull: false,
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: true, // Allow NULL values
      onUpdate: Sequelize.NOW,
    },
  },
  {
    tableName: "jadwal",
    timestamps: false,
  }
);

// Hapus/comment seluruh asosiasi manual yang memakai alias selain "kelas"
// Pastikan hanya asosiasi berikut yang digunakan:
Jadwal.associate = (models) => {
  Jadwal.belongsTo(models.Guru, { foreignKey: "guru_id", as: "guru" });
  Jadwal.belongsTo(models.Kelas, {
    foreignKey: "kelas_id",
    as: "kelas", // HANYA gunakan alias "kelas"
  });
  Jadwal.belongsTo(models.MataPelajaran, {
    foreignKey: "mapel_id",
    as: "mataPelajaran",
  });
  Jadwal.belongsTo(models.TahunAjaran, {
    foreignKey: "tahun_ajaran_id",
    as: "tahunAjaran",
  });

  Jadwal.hasMany(models.Absensi, {
    foreignKey: "jadwal_id",
    as: "jadwalAbsensi",
  });
  Jadwal.hasMany(models.JadwalSiswa, {
    foreignKey: "jadwal_id",
    as: "jadwalSiswa",
  });
};

export default Jadwal;
