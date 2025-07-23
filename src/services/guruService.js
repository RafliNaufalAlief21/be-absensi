import Guru from "../models/Guru.js";
import User from "../models/User.js";
import md5 from "md5";

export async function createGuru(data) {
  try {
    // Validasi data sebelum membuat guru
    if (!data.nip || !data.nama_guru || !data.email || !data.password) {
      throw new Error("NIP, Nama Guru, Email, dan Password wajib diisi");
    }

    // Debugging: Log data yang diterima
    console.log("Data received for createGuru:", data);

    // Hash password menggunakan md5
    const hashedPassword = md5(data.password);

    // Buat user baru di tabel User
    const user = await User.create({
      username: data.nip, // Gunakan NIP sebagai username
      password: hashedPassword, // Simpan password yang sudah di-hash
      email: data.email,
      nama_lengkap: data.nama_guru,
      user_level_id: 2, // Asumsikan level 2 untuk guru
    });

    // Debugging: Log user yang berhasil dibuat
    console.log("User created:", user);

    // Tambahkan user_id ke data guru
    data.user_id = user.id;

    // Debugging: Log data guru sebelum insert
    console.log("Data for Guru insert:", data);

    // Buat data guru
    const guru = await Guru.create({
      nip: data.nip,
      nama_guru: data.nama_guru,
      jenis_kelamin: data.jenis_kelamin,
      alamat: data.alamat,
      no_telepon: data.no_telepon, // Simpan no_telepon di tabel Guru
      user_id: data.user_id, // Pastikan user_id diteruskan
    });

    // Debugging: Log guru yang berhasil dibuat
    console.log("Guru created:", guru);

    return guru;
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      const field = error.errors[0].path; // Ambil field yang menyebabkan error
      if (field === "email") {
        console.error("Error: Email sudah digunakan");
        throw new Error("Email sudah digunakan");
      } else if (field === "nip") {
        console.error("Error: NIP sudah digunakan");
        throw new Error("NIP sudah digunakan");
      } else if (field === "username") {
        console.error("Error: NIP sudah digunakan");
        throw new Error("NIP sudah digunakan");
      }
    }
    console.error("Error in createGuru:", error.message);
    throw error; // Lempar error ke controller
  }
}

export async function getAllGuru() {
  try {
    return await Guru.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "email", "nama_lengkap"], // Hapus no_telepon dari tabel User
        },
      ],
      order: [["id", "DESC"]], // Order by created_at descending
    });
  } catch (error) {
    console.error("Error in getAllGuru:", error.message); // Tambahkan log error
    throw error;
  }
}

export async function getGuruById(id) {
  return await Guru.findByPk(id, {
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "username", "email", "nama_lengkap"], // Hapus no_telepon dari tabel User
      },
    ],
  });
}

export async function getGuruByUserId(userId) {
  return await Guru.findOne({ where: { user_id: userId } });
}

export async function updateGuru(id, guruData) {
  try {
    const guru = await Guru.findByPk(id);
    if (!guru) {
      throw new Error("Guru not found");
    }

    // Jika password disertakan, hash password baru
    if (guruData.password) {
      const hashedPassword = md5(guruData.password);
      await User.update(
        { password: hashedPassword },
        { where: { id: guru.user_id } }
      );
    }

    // Jika email disertakan, perbarui email di tabel User
    if (guruData.email) {
      await User.update(
        { email: guruData.email },
        { where: { id: guru.user_id } }
      );
    }

    // Update data guru di tabel Guru
    const [affectedRows] = await Guru.update(guruData, {
      where: { id },
    });

    return affectedRows > 0 || true;
  } catch (error) {
    console.error("Error in updateGuru:", error.message);
    throw error;
  }
}

export async function deleteGuru(id) {
  return await Guru.destroy({ where: { id } });
}

export async function getUserById(userId) {
  return await User.findByPk(userId, {
    attributes: ["id", "username", "email", "nama_lengkap"],
  });
}
