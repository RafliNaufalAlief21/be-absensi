import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../config/config.js";

const JadwalSiswa = sequelize.define(
  "JadwalSiswa",
  {
    siswa_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "siswa",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    jadwal_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "jadwal",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "jadwalsiswa", // Ensure the table name matches the database
    timestamps: false,
  }
);

JadwalSiswa.associate = (models) => {
  JadwalSiswa.belongsTo(models.Siswa, { foreignKey: "siswa_id", as: "siswa" });
  JadwalSiswa.belongsTo(models.Jadwal, {
    foreignKey: "jadwal_id",
    as: "jadwal",
  });
};

export default JadwalSiswa;
