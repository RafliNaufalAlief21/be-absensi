import sequelize from "../config/config.js";
import User from "./User.js";
import Guru from "./Guru.js";
import Siswa from "./Siswa.js";
import UserLevel from "./UserLevel.js";
import Kelas from "./Kelas.js";
import TahunAjaran from "./TahunAjaran.js";
import MataPelajaran from "./MataPelajaran.js";
import Absensi from "./Absensi.js";
import Jadwal from "./Jadwal.js";
import JadwalSiswa from "./JadwalSiswa.js"; // Ensure JadwalSiswa is imported

// Initialize models
const models = {
  User,
  Guru,
  Siswa,
  UserLevel,
  Kelas,
  TahunAjaran,
  MataPelajaran,
  Absensi,
  Jadwal,
  JadwalSiswa,
};

// Call associate functions to define relationships
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    console.log(`Associating model: ${modelName}`); // Logs associations
    models[modelName].associate(models);
  }
});

export { sequelize };
export default models;
