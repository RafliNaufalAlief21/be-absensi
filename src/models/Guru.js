import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../config/config.js";
import Kelas from "./Kelas.js"; // Import the Kelas model

const Guru = sequelize.define(
  "Guru",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nip: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: "unique_nip",
        msg: "NIP sudah digunakan",
      },
      validate: {
        notEmpty: {
          msg: "NIP tidak boleh kosong",
        },
      },
    },
    nama_guru: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Nama guru tidak boleh kosong",
        },
      },
    },
    jenis_kelamin: {
      type: DataTypes.ENUM("Laki-laki", "Perempuan"),
      allowNull: false,
    },
    alamat: {
      type: DataTypes.TEXT, // Tambahkan field alamat
      allowNull: true,
    },
    no_telepon: {
      type: DataTypes.STRING,
      allowNull: true, // Simpan no_telepon di tabel Guru
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "user",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    kelas_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "kelas",
        key: "id",
      },
      onDelete: "SET NULL",
    },
  },
  {
    tableName: "guru", // Pastikan nama tabel sesuai dengan database
    timestamps: false,
  }
);

Guru.associate = (models) => {
  Guru.belongsTo(models.User, {
    foreignKey: "user_id",
    as: "user",
  });
  Guru.belongsTo(models.Kelas, {
    foreignKey: "kelas_id",
    as: "kelas",
  });
  Guru.hasMany(models.Jadwal, { foreignKey: "guru_id", as: "jadwal" });
};

export default Guru;
