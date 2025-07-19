import Siswa from "../models/Siswa.js";
import Kelas from "../models/Kelas.js";
import Jadwal from "../models/Jadwal.js";
import MataPelajaran from "../models/MataPelajaran.js";
import Guru from "../models/Guru.js";
import QRCode from "qrcode";

export async function createSiswa(data, file, baseUrl) {
  try {
    // Validasi data sebelum membuat siswa
    if (!data.nis || !data.nama_siswa || !data.kelas_id) {
      throw new Error("NIS, Nama Siswa, dan Kelas ID wajib diisi");
    }

    // Tambahkan barcode_id dari nis
    data.barcode_id = data.nis;

    // Generate QR code dari barcode_id
    data.qr_code = await QRCode.toDataURL(data.barcode_id);

    // Tambahkan URL lengkap foto jika ada file yang diunggah
    if (file) {
      data.foto = `${baseUrl}/uploads/${file.filename}`; // Simpan URL lengkap
    }
    // Buat data siswa
    const siswa = await Siswa.create({
      nis: data.nis,
      nama_siswa: data.nama_siswa,
      kelas_id: data.kelas_id,
      jenis_kelamin: data.jenis_kelamin,
      tempat_lahir: data.tempat_lahir,
      tanggal_lahir: data.tanggal_lahir,
      agama: data.agama,
      alamat: data.alamat,
      foto: data.foto, // Simpan URL lengkap foto
      barcode_id: data.barcode_id,
      qr_code: data.qr_code,
    });

    return siswa;
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      const field = error.errors[0].path; // Ambil field yang menyebabkan error
      if (field === "nis") {
        console.error("Error: NIS sudah digunakan");
        throw new Error("NIS sudah digunakan");
      }
    }
    console.error("Error in createSiswa:", error.message);
    throw error; // Lempar error ke controller
  }
}

export async function getAllSiswa() {
  try {
    const siswa = await Siswa.findAll({
      include: [
        {
          model: Kelas,
          as: "kelas",
          attributes: ["id", "nama_kelas"],
        },
      ],
      attributes: { exclude: [] }, // Ambil semua atribut dari tabel siswa
      order: [["created_at", "DESC"]],
    });

    return siswa;
  } catch (error) {
    console.error("Error in getAllSiswa:", error.message);
    throw error;
  }
}

export async function getSiswaById(id) {
  try {
    const siswa = await Siswa.findByPk(id, {
      include: [
        {
          model: Kelas,
          as: "kelas",
          attributes: ["id", "nama_kelas"], // Ambil data kelas terkait
        },
      ],
      attributes: { exclude: [] }, // Ambil semua atribut dari tabel siswa
    });

    if (!siswa) {
      throw new Error("Siswa not found");
    }

    return siswa;
  } catch (error) {
    console.error("Error in getSiswaById:", error.message);
    throw error;
  }
}

export async function getSiswaByNis(nis) {
  return await Siswa.findOne({ where: { nis } });
}

export async function getSiswaByUserId(userId) {
  return await Siswa.findOne({ where: { user_id: userId } });
}

export async function updateSiswa(id, siswaData, file, baseUrl) {
  try {
    console.log("Data received in service:", siswaData);

    // Ambil data siswa berdasarkan ID
    const siswa = await Siswa.findByPk(id);
    if (!siswa) {
      throw new Error("Siswa not found");
    }

    // Jika ada file foto baru, tambahkan ke data siswa
    if (file) {
      siswaData.foto = `${baseUrl}/uploads/${file.filename}`;
    }

    // Update data siswa di tabel Siswa
    const [affectedRows] = await Siswa.update(siswaData, {
      where: { id },
    });

    // Kembalikan true jika siswa ditemukan, meskipun tidak ada perubahan data
    return affectedRows > 0 || true;
  } catch (error) {
    console.error("Error in updateSiswa:", error.message);
    throw error;
  }
}

export async function deleteSiswa(id) {
  try {
    // Hapus data siswa berdasarkan ID
    const siswa = await Siswa.findByPk(id);
    if (!siswa) {
      throw new Error("Siswa not found");
    }

    // Hapus data siswa
    await Siswa.destroy({ where: { id } });

    return { message: "Siswa deleted successfully" };
  } catch (error) {
    console.error("Error in deleteSiswa:", error.message);
    throw error;
  }
}

export async function getSiswaDetails(id) {
  try {
    const siswaDetails = await Siswa.findByPk(id, {
      include: [
        {
          model: Kelas,
          as: "kelas",
          include: [
            {
              model: Guru,
              as: "guru",
              attributes: ["id", "nama_guru", "nip"],
            },
          ],
        },
        {
          model: Jadwal,
          as: "jadwal",
          include: [
            {
              model: MataPelajaran,
              as: "mataPelajaran",
              attributes: ["id", "nama_mapel"],
            },
          ],
        },
      ],
    });

    if (!siswaDetails) {
      throw new Error("Siswa not found");
    }

    return siswaDetails;
  } catch (error) {
    console.error("Error in getSiswaDetails:", error.message);
    throw error;
  }
}

export async function getSiswaByGuruId(guru_id) {
  try {
    // Cari semua kelas yang diampu oleh guru ini
    const kelasList = await Kelas.findAll({
      where: { guru_id },
      attributes: ["id", "nama_kelas"],
    });
    const kelasIds = kelasList.map((k) => k.id);
    if (kelasIds.length === 0) return [];
    // Cari semua siswa yang kelas_id-nya ada di kelasIds
    const siswa = await Siswa.findAll({
      where: { kelas_id: kelasIds },
      include: [
        {
          model: Kelas,
          as: "kelas",
          attributes: ["id", "nama_kelas"],
        },
      ],
      order: [["created_at", "DESC"]],
    });
    return siswa;
  } catch (error) {
    console.error("Error in getSiswaByGuruId:", error.message);
    throw error;
  }
}
