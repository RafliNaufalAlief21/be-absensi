import Kelas from "../models/Kelas.js";
import Guru from "../models/Guru.js";
import TahunAjaran from "../models/TahunAjaran.js";
import User from "../models/User.js";
import sequelize from "../config/config.js";
import md5 from "md5";

export const getAllWalikelas = async (req, res) => {
  try {
    const [kelas, guru] = await Promise.all([
      Kelas.findAll({
        include: [
          {
            model: TahunAjaran,
            as: "tahunAjaran",
            attributes: [
              "id",
              "nama_tahun_ajaran",
              "tanggal_mulai",
              "tanggal_selesai",
              "is_active",
            ],
          },
          {
            model: Guru,
            as: "guru",
            include: [
              {
                model: User,
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
        order: [["created_at", "DESC"]],
      }),
      Guru.findAll({
        include: [
          {
            model: User,
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
        order: [["id", "DESC"]],
      }),
    ]);
    res.status(200).json({
      success: true,
      message: "Data retrieved successfully",
      data: {
        kelas,
        guru,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve data",
    });
  }
};

export const getWalikelasById = async (req, res) => {
  const { id } = req.params;
  try {
    const kelas = await Kelas.findByPk(id, {
      include: [
        {
          model: TahunAjaran,
          as: "tahunAjaran",
          attributes: [
            "id",
            "nama_tahun_ajaran",
            "tanggal_mulai",
            "tanggal_selesai",
            "is_active",
          ],
        },
        {
          model: Guru,
          as: "guru",
          include: [
            {
              model: User,
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
      message: error.message || "Failed to retrieve data",
    });
  }
};

export const editWalikelas = async (req, res) => {
  const { id } = req.params;
  const { namaKelas, jenjangId, tahunAjaranId, guruId } = req.body;

  const transaction = await sequelize.transaction();
  try {
    const kelas = await Kelas.findByPk(id, { transaction });
    if (!kelas) {
      return res.status(404).json({
        success: false,
        message: "Kelas not found",
      });
    }

    await kelas.update(
      {
        nama_kelas: namaKelas,
        jenjang_id: jenjangId,
        tahun_ajaran_id: tahunAjaranId,
        guru_id: guruId,
      },
      { transaction }
    );

    await transaction.commit();
    res.status(200).json({
      success: true,
      message: "Data updated successfully",
      data: kelas,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update data",
    });
  }
};

export const deletewalikelas = async (req, res) => {
  const { type } = req.query;
  const { id } = req.params;
  if (!type) {
    return res.status(400).json({
      success: false,
      message: "Type is required",
    });
  }
  try {
    let result;
    switch (type) {
      case "kelas":
        result = await Kelas.destroy({ where: { id } });
        break;
      case "guru":
        result = await Guru.destroy({ where: { id } });
        break;
      default:
        throw new Error("Invalid type");
    }
    if (!result) {
      return res.status(404).json({
        success: false,
        message: `${type} not found`,
      });
    }
    res.status(200).json({
      success: true,
      message: `${type} deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete data",
    });
  }
};

export const createWalikelas = async (req, res) => {
  const { tahunAjaran, guru, kelas } = req.body;
  const transaction = await sequelize.transaction();
  try {
    const results = {
      tahunAjaran: [],
      guru: [],
      kelas: [],
    };

    // Cek/insert Tahun Ajaran
    let tahunAjaranId;
    if (Array.isArray(tahunAjaran)) {
      for (const item of tahunAjaran) {
        // Generate nama tahun ajaran otomatis
        const tahunMulai = new Date(item.tanggalMulai).getFullYear();
        const tahunAkhir = new Date(item.tanggalSelesai).getFullYear();
        const namaTahunAjaran = `${tahunMulai}/${tahunAkhir}`;
        let ta = await TahunAjaran.findOne({
          where: { nama_tahun_ajaran: namaTahunAjaran },
          transaction,
        });
        if (!ta) {
          ta = await TahunAjaran.create(
            {
              nama_tahun_ajaran: namaTahunAjaran,
              tanggal_mulai: item.tanggalMulai,
              tanggal_selesai: item.tanggalSelesai,
              is_active: item.isActive,
            },
            { transaction }
          );
        }
        tahunAjaranId = ta.id;
        results.tahunAjaran.push(ta);
      }
    }

    // Cek/insert Kelas
    let kelasId;
    if (Array.isArray(kelas)) {
      for (const item of kelas) {
        let kls = await Kelas.findOne({
          where: {
            nama_kelas: item.namaKelas,
            tahun_ajaran_id: tahunAjaranId,
          },
          transaction,
        });
        if (!kls) {
          kls = await Kelas.create(
            {
              nama_kelas: item.namaKelas,
              tahun_ajaran_id: tahunAjaranId,
            },
            { transaction }
          );
        }
        kelasId = kls.id;
        results.kelas.push(kls);
      }
    }

    // Cek/insert Guru
    if (Array.isArray(guru)) {
      for (const item of guru) {
        // Cek apakah guru sudah ada di kelas dan tahun ajaran ini
        const existingGuru = await Guru.findOne({
          where: {
            nip: item.nip,
            kelas_id: kelasId,
          },
          transaction,
        });
        if (existingGuru) {
          throw new Error(
            "Guru sudah terdaftar pada kelas dan tahun ajaran ini"
          );
        }
        // Assign the first created kelas_id to the Guru
        const user = await User.create(
          {
            username: item.nip,
            email: item.email,
            password: md5(item.password),
            nama_lengkap: item.namaGuru,
            user_level_id: 2,
          },
          { transaction }
        );

        const result = await Guru.create(
          {
            nip: item.nip,
            nama_guru: item.namaGuru,
            jenis_kelamin: item.jenisKelamin,
            alamat: item.alamat,
            no_telepon: item.noTelepon,
            user_id: user.id,
            kelas_id: kelasId,
          },
          { transaction }
        );
        // Update guru_id pada kelas setelah create Guru
        await Kelas.update(
          { guru_id: result.id },
          { where: { id: kelasId }, transaction }
        );
        results.guru.push(result);
      }
    }

    await transaction.commit();
    res.status(200).json({
      success: true,
      message: "Data created successfully",
      data: {
        tahunAjaran: results.tahunAjaran.map((item) => ({
          id: item.id,
          nama_tahun_ajaran: item.nama_tahun_ajaran,
          tanggal_mulai: item.tanggal_mulai,
          tanggal_selesai: item.tanggal_selesai,
          is_active: item.is_active,
        })),
        guru: results.guru,
        kelas: results.kelas.map((item) => ({
          id: item.id,
          nama_kelas: item.nama_kelas,
          tahun_ajaran_id: item.tahun_ajaran_id,
          guru_id: item.guru_id,
        })),
      },
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create data",
    });
  }
};

export const updateWalikelas = async (req, res) => {
  const { id } = req.params;
  const { tahunAjaran, guru, kelas } = req.body;

  console.log("Update Walikelas - Request Body:", req.body); // Debug logging

  const transaction = await sequelize.transaction();
  try {
    // Update Tahun Ajaran
    if (Array.isArray(tahunAjaran)) {
      for (const item of tahunAjaran) {
        console.log("Processing Tahun Ajaran:", item); // Debug logging
        
        const tahunAjaranRecord = await TahunAjaran.findByPk(item.id, {
          transaction,
        });
        if (tahunAjaranRecord) {
          console.log("Updating existing Tahun Ajaran:", item.id); // Debug logging
          await tahunAjaranRecord.update(
            {
              nama_tahun_ajaran: item.namaTahunAjaran,
              tanggal_mulai: item.tanggalMulai,
              tanggal_selesai: item.tanggalSelesai,
              is_active: item.isActive,
            },
            { transaction }
          );
        } else {
          console.log("Creating new Tahun Ajaran"); // Debug logging
          await TahunAjaran.create(
            {
              nama_tahun_ajaran: item.namaTahunAjaran,
              tanggal_mulai: item.tanggalMulai,
              tanggal_selesai: item.tanggalSelesai,
              is_active: item.isActive,
            },
            { transaction }
          );
        }
      }
    }

    // Update Kelas
    if (Array.isArray(kelas)) {
      for (const item of kelas) {
        console.log("Processing Kelas:", item); // Debug logging
        
        const kelasRecord = await Kelas.findByPk(item.id, { transaction });
        if (kelasRecord) {
          console.log("Updating existing Kelas:", item.id); // Debug logging
          
          // Cari tahun ajaran yang sesuai untuk mendapatkan ID
          let tahunAjaranId = item.tahunAjaranId;
          if (!tahunAjaranId && Array.isArray(tahunAjaran) && tahunAjaran.length > 0) {
            const tahunAjaranRecord = await TahunAjaran.findOne({
              where: {
                nama_tahun_ajaran: tahunAjaran[0].namaTahunAjaran
              },
              transaction
            });
            tahunAjaranId = tahunAjaranRecord?.id;
          }
          
          console.log("Using tahun_ajaran_id:", tahunAjaranId); // Debug logging
          
          await kelasRecord.update(
            {
              nama_kelas: item.namaKelas,
              tahun_ajaran_id: tahunAjaranId,
            },
            { transaction }
          );
        } else {
          console.log("Creating new Kelas"); // Debug logging
          await Kelas.create(
            {
              nama_kelas: item.namaKelas,
              tahun_ajaran_id: item.tahunAjaranId,
            },
            { transaction }
          );
        }
      }
    }

    // Update Guru
    if (Array.isArray(guru)) {
      for (const item of guru) {
        console.log("Processing Guru:", item); // Debug logging
        
        const guruRecord = await Guru.findByPk(item.id, { transaction });
        if (guruRecord) {
          const user = await User.findByPk(guruRecord.user_id, { transaction });
          if (user) {
            await user.update(
              {
                username: item.nip,
                email: item.email,
                password: item.password ? md5(item.password) : user.password,
                nama_lengkap: item.namaGuru,
              },
              { transaction }
            );
          }

          await guruRecord.update(
            {
              nip: item.nip,
              nama_guru: item.namaGuru,
              jenis_kelamin: item.jenisKelamin,
              alamat: item.alamat,
              no_telepon: item.noTelepon,
              kelas_id: item.kelasId,
            },
            { transaction }
          );
        } else {
          const user = await User.create(
            {
              username: item.nip,
              email: item.email,
              password: md5(item.password),
              nama_lengkap: item.namaGuru,
              user_level_id: 2,
            },
            { transaction }
          );

          await Guru.create(
            {
              nip: item.nip,
              nama_guru: item.namaGuru,
              jenis_kelamin: item.jenisKelamin,
              alamat: item.alamat,
              no_telepon: item.noTelepon,
              user_id: user.id,
              kelas_id: item.kelasId,
            },
            { transaction }
          );
        }
      }
    }

    await transaction.commit();
    console.log("Update Walikelas - Success"); // Debug logging
    
    // Fetch updated data to return in response
    const updatedKelas = await Kelas.findByPk(id, {
      include: [
        {
          model: TahunAjaran,
          as: "tahunAjaran",
          attributes: [
            "id",
            "nama_tahun_ajaran",
            "tanggal_mulai",
            "tanggal_selesai",
            "is_active",
          ],
        },
        {
          model: Guru,
          as: "guru",
          include: [
            {
              model: User,
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
    
    res.status(200).json({
      success: true,
      message: "Data updated successfully",
      data: updatedKelas,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Update Walikelas - Error:", error); // Debug logging
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update data",
    });
  }
};

export const deleteWalikelas = async (req, res) => {
  const { id } = req.params;

  const transaction = await sequelize.transaction();
  try {
    // Delete related Guru and their associated User
    const guruRecords = await Guru.findAll({
      where: { kelas_id: id },
      transaction,
    });
    for (const guru of guruRecords) {
      await User.destroy({ where: { id: guru.user_id }, transaction });
      await Guru.destroy({ where: { id: guru.id }, transaction });
    }

    // Delete related Tahun Ajaran
    await TahunAjaran.destroy({ where: { id }, transaction });

    // Delete the Kelas record
    const kelasResult = await Kelas.destroy({ where: { id }, transaction });

    if (!kelasResult) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    await transaction.commit();
    res.status(200).json({
      success: true,
      message: "All related data, including users, deleted successfully",
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete data",
    });
  }
};

export const getWalikelasByGuruId = async (req, res) => {
  const { guru_id } = req.params;
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
            "is_active",
          ],
        },
        {
          model: Guru,
          as: "guru",
          include: [
            {
              model: User,
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
    if (!kelas || kelas.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Kelas for this guru_id not found",
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
      message: error.message || "Failed to retrieve data",
    });
  }
};
