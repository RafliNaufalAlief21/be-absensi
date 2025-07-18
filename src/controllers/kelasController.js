import Kelas from "../models/Kelas.js";
// import JenjangPendidikan from "../models/JenjangPendidikan.js"; // HAPUS INI
import TahunAjaran from "../models/TahunAjaran.js";
import Guru from "../models/Guru.js";
import sequelize from "../config/config.js";

export const getAllKelas = async (req, res) => {
  try {
    const kelas = await Kelas.findAll({
      include: [
        // {
        //   model: JenjangPendidikan,
        //   as: "jenjangPendidikan",
        //   attributes: ["id", "nama_jenjang"],
        // },
        {
          model: TahunAjaran,
          as: "tahunAjaran",
          attributes: ["id", "nama_tahun_ajaran"],
        },
        {
          model: Guru,
          as: "guru",
          attributes: ["id", "nama_guru", "nip", "no_telepon"],
        },
      ],
      order: [["created_at", "DESC"]],
    });
    res.status(200).json({
      success: true,
      message: "Kelas retrieved successfully",
      data: kelas,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve kelas",
      error: error.message,
    });
  }
};

export const getKelasById = async (req, res) => {
  try {
    const kelas = await Kelas.findByPk(req.params.id, {
      include: [
        // {
        //   model: JenjangPendidikan,
        //   as: "jenjangPendidikan",
        //   attributes: ["id", "nama_jenjang"],
        // },
        {
          model: TahunAjaran,
          as: "tahunAjaran",
          attributes: ["id", "nama_tahun_ajaran"],
        },
        {
          model: Guru,
          as: "guru",
          attributes: ["id", "nama_guru", "nip", "no_telepon"],
        },
      ],
    });
    if (!kelas) {
      return res.status(404).json({
        success: false,
        message: "Kelas not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Kelas retrieved successfully",
      data: kelas,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve kelas",
      error: error.message,
    });
  }
};

export const createKelas = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { nama_kelas, /*jenjang_pendidikan,*/ tahun_ajaran, guru_id } =
      req.body;

    // 1. Cari atau buat data Jenjang Pendidikan
    // const [jenjang] = await JenjangPendidikan.findOrCreate({
    //   where: { nama_jenjang: jenjang_pendidikan },
    //   defaults: { nama_jenjang: jenjang_pendidikan },
    //   transaction,
    // });

    // 2. Cari atau buat data Tahun Ajaran
    const [tahunAjaran] = await TahunAjaran.findOrCreate({
      where: { nama_tahun_ajaran: tahun_ajaran },
      defaults: { nama_tahun_ajaran: tahun_ajaran },
      transaction,
    });

    // 3. Buat data Kelas
    const kelas = await Kelas.create(
      {
        nama_kelas,
        // jenjang_id: jenjang.id,
        tahun_ajaran_id: tahunAjaran.id,
        guru_id,
      },
      { transaction }
    );

    // Commit transaksi jika semua berhasil
    await transaction.commit();

    res.status(201).json({
      success: true,
      message: "Kelas created successfully",
      data: kelas,
    });
  } catch (error) {
    // Rollback transaksi jika terjadi kesalahan
    await transaction.rollback();
    res.status(500).json({
      success: false,
      message: "Failed to create kelas",
      error: error.message,
    });
  }
};

export const updateKelas = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { nama_kelas, /*jenjang_pendidikan,*/ tahun_ajaran, guru_id } =
      req.body;

    // Cari data Kelas berdasarkan ID
    const kelas = await Kelas.findByPk(id, { transaction });
    if (!kelas) {
      return res.status(404).json({
        success: false,
        message: "Kelas not found",
      });
    }

    // 1. Cari atau buat data Jenjang Pendidikan
    // const [jenjang] = await JenjangPendidikan.findOrCreate({
    //   where: { nama_jenjang: jenjang_pendidikan },
    //   defaults: { nama_jenjang: jenjang_pendidikan },
    //   transaction,
    // });

    // 2. Cari atau buat data Tahun Ajaran
    const [tahunAjaran] = await TahunAjaran.findOrCreate({
      where: { nama_tahun_ajaran: tahun_ajaran },
      defaults: { nama_tahun_ajaran: tahun_ajaran },
      transaction,
    });

    // 3. Perbarui data Kelas
    await kelas.update(
      {
        nama_kelas,
        // jenjang_id: jenjang.id,
        tahun_ajaran_id: tahunAjaran.id,
        guru_id,
      },
      { transaction }
    );

    // Commit transaksi jika semua berhasil
    await transaction.commit();

    res.status(200).json({
      success: true,
      message: "Kelas updated successfully",
      data: kelas,
    });
  } catch (error) {
    // Rollback transaksi jika terjadi kesalahan
    await transaction.rollback();
    res.status(500).json({
      success: false,
      message: "Failed to update kelas",
      error: error.message,
    });
  }
};

export const deleteKelas = async (req, res) => {
  try {
    const kelas = await Kelas.findByPk(req.params.id);
    if (!kelas)
      return res.status(404).json({
        success: false,
        message: "Kelas not found",
        data: null,
      });

    await kelas.destroy();
    res.status(200).json({
      success: true,
      message: "Kelas deleted successfully",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete kelas",
      data: null,
    });
  }
};
