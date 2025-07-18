import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../config/config.js";

const Siswa = sequelize.define(
  "Siswa",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nis: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: "unique_nis",
        msg: "NIS sudah digunakan", // Pesan error jika NIS duplikat
      },
      validate: {
        notEmpty: {
          msg: "NIS tidak boleh kosong",
        },
      },
    },
    nama_siswa: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Nama siswa tidak boleh kosong",
        },
      },
    },
    kelas_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Ubah dari false ke true agar bisa SET NULL
      references: {
        model: "kelas",
        key: "id",
      },
      onDelete: "SET NULL",
    },
    jenis_kelamin: {
      type: DataTypes.ENUM("Laki-laki", "Perempuan"),
      allowNull: false,
    },
    tempat_lahir: {
      type: DataTypes.STRING,
    },
    tanggal_lahir: {
      type: DataTypes.DATEONLY,
    },
    agama: {
      type: DataTypes.STRING,
    },
    alamat: {
      type: DataTypes.TEXT,
    },
    foto: {
      type: DataTypes.STRING,
      allowNull: true, // Foto bersifat opsional
    },
    qr_code: {
      type: Sequelize.TEXT,
      allowNull: true, // QR code bersifat opsional
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
    tableName: "siswa",
    timestamps: false,
  }
);

Siswa.associate = (models) => {
  Siswa.belongsTo(models.Kelas, { foreignKey: "kelas_id", as: "kelas" }); // Gunakan alias "kelas" saja
  Siswa.hasMany(models.Absensi, { foreignKey: "siswa_id", as: "absensi" });
  Siswa.hasMany(models.JadwalSiswa, {
    foreignKey: "siswa_id",
    as: "jadwalsiswa",
  });
  Siswa.belongsToMany(models.Jadwal, {
    through: models.JadwalSiswa,
    foreignKey: "siswa_id",
    as: "jadwal",
  });
};

export default Siswa;
