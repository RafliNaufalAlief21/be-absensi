import Kelas from "../models/Kelas.js";
import Guru from "../models/Guru.js";
import TahunAjaran from "../models/TahunAjaran.js";
import sequelize from "../config/config.js";
import md5 from "md5";

export async function createKelas(data) {
  const transaction = await sequelize.transaction();
  try {
    const kelas = await Kelas.create(
      {
        nama_kelas: data.nama_kelas,
        tahun_ajaran_id: data.tahun_ajaran_id,
      },
      { transaction }
    );

    await transaction.commit();
    return kelas;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function updateKelas(id, data) {
  const transaction = await sequelize.transaction();
  try {
    const kelas = await Kelas.findByPk(id, { transaction });
    if (!kelas) throw new Error("Kelas not found");

    await kelas.update(
      {
        nama_kelas: data.nama_kelas,
        tahun_ajaran_id: data.tahun_ajaran_id,
      },
      { transaction }
    );

    await transaction.commit();
    return kelas;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function createGuru(data) {
  const transaction = await sequelize.transaction();
  try {
    const kelas = await Kelas.findByPk(data.kelas_id, { transaction });
    if (!kelas) throw new Error("Kelas not found");

    const user = await sequelize.models.User.create(
      {
        username: data.nip,
        email: data.email,
        password: md5(data.password),
        nama_lengkap: data.nama_guru,
        user_level_id: 2,
      },
      { transaction }
    );

    const guru = await Guru.create(
      {
        nip: data.nip,
        nama_guru: data.nama_guru,
        jenis_kelamin: data.jenis_kelamin,
        alamat: data.alamat,
        no_telepon: data.no_telepon,
        user_id: user.id,
        kelas_id: kelas.id,
      },
      { transaction }
    );

    await transaction.commit();
    return guru;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function updateGuru(id, data) {
  const transaction = await sequelize.transaction();
  try {
    const guru = await Guru.findByPk(id, { transaction });
    if (!guru) throw new Error("Guru not found");

    const user = await sequelize.models.User.findByPk(guru.user_id, {
      transaction,
    });
    if (!user) throw new Error("User not found");

    await user.update(
      {
        email: data.email,
        password: data.password ? md5(data.password) : user.password,
        nama_lengkap: data.nama_guru,
      },
      { transaction }
    );

    await guru.update(
      {
        nip: data.nip,
        nama_guru: data.nama_guru,
        jenis_kelamin: data.jenis_kelamin,
        alamat: data.alamat,
        no_telepon: data.no_telepon,
        kelas_id: data.kelas_id,
      },
      { transaction }
    );

    await transaction.commit();
    return guru;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function getAllData() {
  try {
    const [kelas, guru] = await Promise.all([
      Kelas.findAll(),
      Guru.findAll({
        include: [
          {
            model: sequelize.models.User,
            as: "user",
            attributes: ["email", "password"],
          },
        ],
        attributes: [
          "id",
          "nama_guru",
          "nip",
          "jenis_kelamin",
          "alamat",
          "no_telepon",
          "kelas_id",
        ],
      }),
    ]);

    return { kelas, guru };
  } catch (error) {
    throw new Error("Failed to retrieve data: " + error.message);
  }
}

export async function getDataById(id) {
  try {
    const kelas = await Kelas.findByPk(id, {
      include: [
        { model: TahunAjaran, as: "tahunAjaran" },
        {
          model: Guru,
          as: "guru",
          include: [
            {
              model: sequelize.models.User,
              as: "user",
              attributes: ["email", "password"],
            },
          ],
          attributes: [
            "id",
            "nama_guru",
            "nip",
            "jenis_kelamin",
            "alamat",
            "no_telepon",
            "kelas_id",
          ],
        },
      ],
    });
    return kelas || null;
  } catch (error) {
    throw new Error("Failed to retrieve data: " + error.message);
  }
}

export async function getKelasByGuruId(guru_id) {
  try {
    const kelas = await Kelas.findAll({
      where: { guru_id },
      include: [
        {
          model: TahunAjaran,
          as: "tahunAjaran",
          attributes: [
            "id",
            "nama_tahun_ajaran",
            "tanggal_mulai",
            "tanggal_selesai",
          ],
        },
        {
          model: Guru,
          as: "guru",
          include: [
            {
              model: sequelize.models.User,
              as: "user",
              attributes: ["email", "password"],
            },
          ],
          attributes: [
            "id",
            "nama_guru",
            "nip",
            "jenis_kelamin",
            "alamat",
            "no_telepon",
            "kelas_id",
          ],
        },
      ],
    });
    return kelas;
  } catch (error) {
    throw new Error("Failed to retrieve data: " + error.message);
  }
}
