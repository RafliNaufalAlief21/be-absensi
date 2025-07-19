import { Op } from "sequelize";
import Siswa from "../models/Siswa.js";
import Absensi from "../models/Absensi.js";
import Jadwal from "../models/Jadwal.js";
import Kelas from "../models/Kelas.js";
import sequelize from "../config/config.js";
import {
  getJakartaTimeString,
  getJakartaDateString,
} from "../utils/dateTimeUtils.js";
import nodeCron from "node-cron";

let isProcessingAbsensi = false; // ⚠️ penting untuk mencegah dobel proses

export function determineAttendanceStatus(jam_mulai, waktu_masuk) {
  try {
    if (waktu_masuk <= jam_mulai) {
      return "Tepat Waktu";
    } else {
      return "Terlambat";
    }
  } catch (error) {
    console.error("Error menentukan status keterlambatan:", error);
    return "Hadir"; // Default jika terjadi error
  }
}

export async function scanBarcode(barcode, type, jadwal_id, status = "Hadir") {
  try {
    const siswa = await Siswa.findOne({ where: { nis: barcode } });

    if (!siswa) {
      return {
        status: 404,
        response: {
          success: false,
          message: "Siswa tidak ditemukan",
        },
      };
    }

    // Validasi siswa hanya bisa absen pada jadwal yang sesuai kelasnya
    const jadwal = await Jadwal.findByPk(jadwal_id);
    if (!jadwal) {
      return {
        status: 404,
        response: {
          success: false,
          message: "Jadwal tidak ditemukan",
        },
      };
    }
    if (siswa.kelas_id !== jadwal.kelas_id) {
      return {
        status: 400,
        response: {
          success: false,
          message:
            "Siswa hanya dapat absen pada jadwal yang sesuai dengan kelasnya.",
        },
      };
    }

    const todayDate = getJakartaDateString();
    const currentTime = getJakartaTimeString();

    // Handle "Izin" or "Sakit" status
    if (status === "Izin" || status === "Sakit") {
      const existingEntry = await Absensi.findOne({
        where: {
          siswa_id: siswa.id,
          jadwal_id,
          tanggal_absensi: todayDate,
        },
      });

      if (existingEntry) {
        return {
          status: 400,
          response: {
            success: false,
            message: `Absensi dengan status ${status} sudah tercatat untuk hari ini`,
          },
        };
      }

      // Tidak perlu fetch jadwal lagi, gunakan jadwal hasil validasi di atas
      const newAttendance = await Absensi.create({
        siswa_id: siswa.id,
        jadwal_id,
        kelas_id: jadwal.kelas_id, // Set kelas_id from Jadwal
        tanggal_absensi: todayDate,
        status,
        keterangan: status,
        user_id: siswa.id,
        created_at: currentTime,
        updated_at: currentTime,
      });

      return {
        status: 201,
        response: {
          success: true,
          message: `Absensi dengan status ${status} berhasil dicatat`,
          data: newAttendance,
        },
      };
    }

    let newAttendance;

    if (type === "masuk") {
      // Cek apakah sudah ada absensi masuk hari ini untuk jadwal yang sama
      const existingEntry = await Absensi.findOne({
        where: {
          siswa_id: siswa.id,
          jadwal_id,
          tanggal_absensi: todayDate,
        },
      });

      if (existingEntry) {
        return {
          status: 400,
          response: {
            success: false,
            message:
              "Absensi sudah tercatat untuk jadwal dan tanggal ini. Tidak bisa mengabsen 2 kali.",
            data: existingEntry,
          },
        };
      }

      // Tidak perlu fetch jadwal lagi, gunakan jadwal hasil validasi di atas
      const timeOnly = currentTime.split(" ")[1];
      const attendanceStatus = determineAttendanceStatus(
        jadwal.jam_mulai,
        timeOnly
      );

      try {
        newAttendance = await Absensi.create({
          siswa_id: siswa.id,
          jadwal_id,
          tanggal_absensi: todayDate,
          waktu_masuk: timeOnly,
          waktu_keluar: timeOnly,
          status: "Hadir",
          keterangan: attendanceStatus,
          kelas_id: jadwal.kelas_id,
          user_id: siswa.id,
          created_at: currentTime,
          updated_at: currentTime,
        });
      } catch (err) {
        if (
          err.name === "SequelizeUniqueConstraintError" ||
          err.name === "SequelizeValidationError"
        ) {
          return {
            status: 400,
            response: {
              success: false,
              message:
                "Absensi sudah tercatat untuk jadwal dan tanggal ini. Tidak bisa mengabsen 2 kali.",
            },
          };
        }
        throw err;
      }
    } else if (type === "pulang") {
      // Cari semua record absensi hari ini untuk debugging
      const allTodayRecords = await Absensi.findAll({
        where: {
          siswa_id: siswa.id,
          tanggal_absensi: todayDate, // Gunakan tanggal_absensi
        },
      });

      console.log(
        `Ditemukan ${allTodayRecords.length} record absensi hari ini:`,
        allTodayRecords.map((r) => r.toJSON())
      );

      // Cari record absensi hari ini dengan jadwal_id yang sesuai
      const existingRecord = await Absensi.findOne({
        where: {
          siswa_id: siswa.id,
          jadwal_id,
          tanggal_absensi: todayDate, // Gunakan tanggal_absensi
        },
        order: [["created_at", "DESC"]],
      });

      if (!existingRecord) {
        // Jika tidak ada record dengan jadwal_id yang sama, gunakan record lain sebagai fallback
        if (allTodayRecords.length > 0) {
          const fallbackRecord = allTodayRecords[0];
          console.log("Menggunakan record fallback:", fallbackRecord.toJSON());

          // Extract just the time part (HH:MM:SS) from the current time string
          const timeOnly = currentTime.split(" ")[1];

          await fallbackRecord.update({
            waktu_keluar: timeOnly,
            updated_at: currentTime,
          });

          newAttendance = await Absensi.findByPk(fallbackRecord.id);

          return {
            status: 201,
            response: {
              success: true,
              message:
                "Absensi keluar berhasil dicatat (menggunakan jadwal lain)",
              data: newAttendance,
            },
          };
        }

        return {
          status: 404,
          response: {
            success: false,
            message: "Record absensi tidak ditemukan untuk hari ini",
          },
        };
      }

      // Extract just the time part (HH:MM:SS) from the current time string
      const timeOnly = currentTime.split(" ")[1];

      // Update record yang ada
      await existingRecord.update({
        waktu_keluar: timeOnly,
        updated_at: currentTime,
      });

      // Ambil record yang sudah diupdate
      newAttendance = await Absensi.findByPk(existingRecord.id);
      console.log("Record absensi setelah update:", newAttendance.toJSON());
    } else {
      return {
        status: 400,
        response: {
          success: false,
          message: "Type harus 'masuk' atau 'pulang'",
        },
      };
    }

    return {
      status: 201,
      response: {
        success: true,
        message: "Absensi berhasil dicatat",
        data: newAttendance,
      },
    };
  } catch (error) {
    // Tangkap error validasi unik jika belum tertangkap di atas
    if (
      error.name === "SequelizeUniqueConstraintError" ||
      error.name === "SequelizeValidationError"
    ) {
      return {
        status: 400,
        response: {
          success: false,
          message:
            "Absensi sudah tercatat untuk jadwal dan tanggal ini. Tidak bisa mengabsen 2 kali.",
        },
      };
    }
    console.error("Attendance error:", error.message);
    console.error("Stack trace:", error.stack);
    return {
      status: 500,
      response: {
        success: false,
        message: "Terjadi kesalahan saat mencatat absensi",
        error: error.message,
      },
    };
  }
}

export async function getAbsensi(id) {
  try {
    const absensi = await Absensi.findByPk(id);
    if (!absensi) {
      return {
        status: 404,
        response: {
          success: false,
          message: "Absensi tidak ditemukan",
        },
      };
    }
    return {
      status: 200,
      response: {
        success: true,
        data: absensi,
      },
    };
  } catch (error) {
    console.error("Get Absensi error:", error.message);
    throw new Error("Terjadi kesalahan saat mengambil absensi");
  }
}

export async function updateAbsensi(id, data) {
  try {
    const currentTime = getJakartaTimeString();

    // Jika data berisi status keluar, tambahkan waktu keluar
    if (data.status === "keluar" && !data.waktu_keluar) {
      // Extract just the time part (HH:MM:SS) from the current time string
      const timeOnly = currentTime.split(" ")[1];
      data.waktu_keluar = timeOnly;
    }

    // Set updated_at
    data.updated_at = currentTime;

    // Jika status diubah menjadi "Izin" atau "Sakit", sesuaikan keterangan
    if (["Izin", "Sakit", "Tidak Hadir"].includes(data.status)) {
      // Hapus "Alpa"
      data.keterangan = data.status;
    } else if (data.waktu_masuk && data.jadwal_id) {
      // Jika ada perubahan waktu_masuk dan jadwal_id, update status keterlambatan
      const jadwal = await Jadwal.findByPk(data.jadwal_id);
      if (jadwal) {
        data.keterangan = determineAttendanceStatus(
          jadwal.jam_mulai,
          data.waktu_masuk
        );
      }
    } else if (data.waktu_masuk) {
      // Jika hanya waktu_masuk yang diubah, ambil jadwal_id dari record yang ada
      const existingRecord = await Absensi.findByPk(id);
      if (existingRecord && existingRecord.jadwal_id) {
        const jadwal = await Jadwal.findByPk(existingRecord.jadwal_id);
        if (jadwal) {
          data.keterangan = determineAttendanceStatus(
            jadwal.jam_mulai,
            data.waktu_masuk
          );
        }
      }
    }

    const [updated] = await Absensi.update(data, {
      where: { id },
    });

    if (!updated) {
      return {
        status: 404,
        response: {
          success: false,
          message: "Absensi tidak ditemukan",
        },
      };
    }

    const updatedAbsensi = await Absensi.findByPk(id);
    return {
      status: 200,
      response: {
        success: true,
        message: "Absensi berhasil diperbarui",
        data: updatedAbsensi,
      },
    };
  } catch (error) {
    console.error("Update Absensi error:", error.message);
    throw new Error("Terjadi kesalahan saat memperbarui absensi");
  }
}

export async function deleteAbsensi(id) {
  try {
    const deleted = await Absensi.destroy({
      where: { id },
    });
    if (!deleted) {
      return {
        status: 404,
        response: {
          success: false,
          message: "Absensi tidak ditemukan",
        },
      };
    }
    return {
      status: 200,
      response: {
        success: true,
        message: "Absensi berhasil dihapus",
      },
    };
  } catch (error) {
    console.error("Delete Absensi error:", error.message);
    throw new Error("Terjadi kesalahan saat menghapus absensi");
  }
}

export async function getAbsensiBySiswa(siswa_id) {
  try {
    console.log("Service: siswa_id received:", siswa_id); // Debug log

    const absensi = await Absensi.findAll({
      where: { siswa_id }, // Filter berdasarkan siswa_id
      attributes: [
        "id",
        "siswa_id",
        "jadwal_id",
        "kelas_id",
        "tanggal_absensi",
        "waktu_masuk",
        "waktu_keluar",
        "status",
        "keterangan",
        "created_at",
        "updated_at",
      ],
      include: [
        {
          model: Siswa,
          as: "siswa",
          attributes: ["nama_siswa"], // Ambil nama siswa
        },
        {
          model: Jadwal,
          as: "jadwal", // Tambahkan asosiasi ke Jadwal
          attributes: ["hari", "jam_mulai", "jam_selesai"],
        },
        {
          model: sequelize.models.Kelas, // Pastikan asosiasi ke Kelas sudah ada
          as: "kelas",
          attributes: ["nama_kelas"], // Ambil nama kelas
        },
        {
          model: sequelize.models.Jadwal,
          as: "jadwal",
          attributes: ["id", "mapel_id", "jam_mulai"],
          include: [
            {
              model: sequelize.models.MataPelajaran,
              as: "mataPelajaran", // Include mataPelajaran association
              attributes: ["id", "nama_mapel"],
            },
          ],
        },
      ],
      order: [["tanggal_absensi", "DESC"]], // Urutkan berdasarkan tanggal
    });

    console.log("Service: Query result:", JSON.stringify(absensi, null, 2)); // Debug log

    if (!absensi || absensi.length === 0) {
      console.warn("Service: No data found for the given siswa_id.");
      return {
        success: false,
        message: "Absensi tidak ditemukan untuk siswa ini",
      };
    }

    return {
      success: true,
      data: absensi,
    };
  } catch (error) {
    console.error("Error fetching absensi by siswa:", error.message);
    console.error("Stack trace:", error.stack);
    throw new Error("Failed to fetch absensi by siswa");
  }
}

export async function getAbsensiBySiswaDetails(siswaId) {
  try {
    const absensiDetails = await Absensi.findAll({
      where: { siswa_id: siswaId },
      include: [
        {
          model: Siswa,
          as: "siswa",
          attributes: ["id", "nama_siswa", "nis"],
        },
        {
          model: Kelas,
          as: "kelas",
          attributes: ["id", "nama_kelas"],
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
          attributes: ["id", "hari", "jam_mulai", "jam_selesai"],
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

    if (!absensiDetails || absensiDetails.length === 0) {
      throw new Error("No absensi records found for the given siswa ID");
    }

    return absensiDetails;
  } catch (error) {
    console.error(
      "Error in AbsensiService.getAbsensiBySiswaDetails:",
      error.message
    );
    throw error;
  }
}

export async function getAllAbsensi() {
  try {
    const absensi = await Absensi.findAll({
      attributes: [
        "id",
        "siswa_id",
        "jadwal_id",
        "kelas_id",
        "tanggal_absensi",
        "waktu_masuk",
        "waktu_keluar",
        "status",
        "keterangan",
        "created_at",
        "updated_at",
      ],
      include: [
        {
          model: Siswa,
          as: "siswa",
          attributes: ["id", "nama_siswa"],
        },
        {
          model: Jadwal,
          as: "jadwal",
          attributes: ["id", "hari", "jam_mulai", "jam_selesai"],
          include: [
            {
              model: sequelize.models.MataPelajaran,
              as: "mataPelajaran",
              attributes: ["id", "nama_mapel"],
            },
          ],
        },
        {
          model: sequelize.models.Kelas,
          as: "kelas",
          attributes: ["id", "nama_kelas"],
        },
      ],
      order: [["tanggal_absensi", "DESC"]],
    });

    return {
      success: true,
      data: absensi,
    };
  } catch (error) {
    console.error("Service: Error fetching all absensi:", error.message);
    throw new Error("Failed to fetch all absensi");
  }
}

export async function getAllAbsensiWithDetails() {
  try {
    // Fetch all kelas
    const kelasList = await sequelize.models.Kelas.findAll({
      include: [
        {
          model: sequelize.models.Siswa,
          as: "siswa",
          include: [
            {
              model: sequelize.models.Absensi,
              as: "absensi",
              attributes: [
                "id",
                "tanggal_absensi",
                "waktu_masuk",
                "waktu_keluar",
                "status",
                "keterangan",
              ],
              include: [
                {
                  model: sequelize.models.Jadwal,
                  as: "jadwal",
                  include: [
                    {
                      model: sequelize.models.MataPelajaran,
                      as: "mataPelajaran",
                      attributes: ["id", "nama_mapel"],
                    },
                  ],
                },
              ],
            },
          ],
          attributes: ["id", "nama_siswa"], // <-- FIX: hanya ambil kolom yang ada di tabel siswa
        },
      ],
      attributes: ["id", "nama_kelas"],
    });

    // Fetch all jadwal and group by kelas_id
    const jadwalList = await sequelize.models.Jadwal.findAll({
      include: [
        {
          model: sequelize.models.MataPelajaran,
          as: "mataPelajaran",
          attributes: ["id", "nama_mapel"],
        },
        {
          model: sequelize.models.Guru,
          as: "guru",
          attributes: ["id", "nama_guru"],
        },
      ],
      attributes: ["id", "kelas_id", "hari", "jam_mulai", "jam_selesai"],
    });

    if (!kelasList || kelasList.length === 0) {
      return {
        success: false,
        message: "Data kelas tidak ditemukan",
      };
    }

    const data = kelasList.map((kelas) => {
      // Filter jadwal for this kelas
      const jadwalForKelas = jadwalList.filter(
        (jadwal) => jadwal.kelas_id === kelas.id
      );
      return {
        kelas: kelas.nama_kelas,
        jadwal: jadwalForKelas.map((jadwal) => ({
          id: jadwal.id,
          mataPelajaran: jadwal.mataPelajaran
            ? {
                id: jadwal.mataPelajaran.id,
                nama_mapel: jadwal.mataPelajaran.nama_mapel,
              }
            : null,
          guru: jadwal.guru
            ? {
                id: jadwal.guru.id,
                nama_guru: jadwal.guru.nama_guru,
              }
            : null,
          hari: jadwal.hari,
          jam_mulai: jadwal.jam_mulai,
          jam_selesai: jadwal.jam_selesai,
        })),
        siswa: kelas.siswa.map((siswa) => ({
          id: siswa.id,
          nama_siswa: siswa.nama_siswa,
          absensi: jadwalForKelas.map((jadwal) => {
            const absensiForMapel = siswa.absensi.find(
              (absensi) =>
                absensi.jadwal &&
                absensi.jadwal.mataPelajaran &&
                absensi.jadwal.mataPelajaran.id ===
                  (jadwal.mataPelajaran ? jadwal.mataPelajaran.id : null)
            );
            if (absensiForMapel) {
              return {
                mataPelajaran: jadwal.mataPelajaran
                  ? {
                      id: jadwal.mataPelajaran.id,
                      nama_mapel: jadwal.mataPelajaran.nama_mapel,
                    }
                  : null,
                absensi: {
                  id: absensiForMapel.id,
                  tanggal_absensi: absensiForMapel.tanggal_absensi,
                  waktu_masuk: absensiForMapel.waktu_masuk,
                  waktu_keluar: absensiForMapel.waktu_keluar,
                  status: absensiForMapel.status,
                  keterangan: absensiForMapel.keterangan,
                },
              };
            } else {
              return {
                mataPelajaran: jadwal.mataPelajaran
                  ? {
                      id: jadwal.mataPelajaran.id,
                      nama_mapel: jadwal.mataPelajaran.nama_mapel,
                    }
                  : null,
                absensi: {
                  status: "Belum Absen",
                },
              };
            }
          }),
        })),
      };
    });

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error(
      "Service: Error fetching all absensi with details:",
      error.message
    );
    throw new Error("Failed to fetch all absensi with details");
  }
}

export async function processAutomaticAbsensi() {
  try {
    const currentDate = getJakartaDateString();
    const timeString = getJakartaTimeString();
    if (
      !timeString ||
      typeof timeString !== "string" ||
      !timeString.includes(":")
    ) {
      console.error(
        "[AbsensiService] Invalid time string from getJakartaTimeString():",
        timeString
      );
      return;
    }
    const splitTime = timeString.split(" ");
    if (!splitTime[1] || !/^\d{2}:\d{2}:\d{2}$/.test(splitTime[1])) {
      console.error(
        "[AbsensiService] Invalid time format after split:",
        splitTime
      );
      return;
    }
    const currentTime = splitTime[1];
    const currentTimeInMinutes = currentTime
      .split(":")
      .map(Number)
      .reduce((h, m) => h * 60 + m);
    const currentDay = new Date().toLocaleString("id-ID", {
      weekday: "long",
    });

    // Fetch all jadwal for today
    const completedSchedules = await Jadwal.findAll({
      where: {
        hari: currentDay,
      },
      attributes: ["id", "kelas_id", "jam_selesai"],
    });

    // Fetch all kelas with siswa
    const kelasMap = {};
    const kelasList = await Kelas.findAll({
      include: [
        {
          model: Siswa,
          as: "siswa",
          attributes: ["id"],
        },
      ],
      attributes: ["id"],
    });
    for (const kelas of kelasList) {
      kelasMap[kelas.id] = kelas;
    }

    for (const jadwal of completedSchedules) {
      const jamSelesaiInMinutes = jadwal.jam_selesai
        .split(":")
        .map(Number)
        .reduce((h, m) => h * 60 + m);

      if (currentTimeInMinutes < jamSelesaiInMinutes + 10) {
        continue;
      }

      // Get siswa from kelas
      const kelas = kelasMap[jadwal.kelas_id];
      if (!kelas || !kelas.siswa) continue;
      const siswaIds = kelas.siswa.map((siswa) => siswa.id);

      // Cari siswa yang belum absen
      const existingAbsensi = await Absensi.findAll({
        where: {
          siswa_id: { [Op.in]: siswaIds },
          jadwal_id: jadwal.id,
          tanggal_absensi: currentDate,
        },
        attributes: ["siswa_id"],
      });

      const siswaAlreadyAbsen = existingAbsensi.map(
        (absensi) => absensi.siswa_id
      );

      const siswaBelumAbsen = siswaIds.filter(
        (id) => !siswaAlreadyAbsen.includes(id)
      );

      if (siswaBelumAbsen.length === 0) {
        continue;
      }

      for (const siswaId of siswaBelumAbsen) {
        try {
          await Absensi.create({
            siswa_id: siswaId,
            jadwal_id: jadwal.id,
            kelas_id: jadwal.kelas_id,
            tanggal_absensi: currentDate,
            status: "Tidak Hadir",
            keterangan: "Tidak Hadir",
            created_at: new Date(),
            updated_at: new Date(),
          });
        } catch (error) {
          if (error.name === "SequelizeUniqueConstraintError") {
            // skip
          } else {
            console.error(
              `Error saat menambahkan absensi untuk siswa ${siswaId} pada jadwal ${jadwal.id}:`,
              error.message
            );
          }
        }
      }
    }

    console.log("Absensi otomatis berhasil diproses.");
  } catch (error) {
    console.error("Error processing automatic absensi:", error.message);
  }
}

export async function getFilteredAbsensiByKelas(
  kelas_id,
  status,
  tanggal_mulai,
  tanggal_selesai,
  mapel_id // tambahkan mapel_id
) {
  try {
    const whereClause = {
      kelas_id,
    };
    if (status) {
      whereClause.status = status;
    }
    if (tanggal_mulai && tanggal_selesai) {
      whereClause.tanggal_absensi = {
        [Op.between]: [
          tanggal_mulai.split(" ")[0],
          tanggal_selesai.split(" ")[0],
        ],
      };
    } else if (tanggal_mulai) {
      whereClause.tanggal_absensi = {
        [Op.gte]: tanggal_mulai.split(" ")[0],
      };
    } else if (tanggal_selesai) {
      whereClause.tanggal_absensi = {
        [Op.lte]: tanggal_selesai.split(" ")[0],
      };
    }

    // Tambahkan filter mapel_id jika ada
    const jadwalWhere = {};
    if (mapel_id) {
      jadwalWhere.mapel_id = mapel_id;
    }

    const absensi = await Absensi.findAll({
      where: whereClause,
      include: [
        {
          model: Siswa,
          as: "siswa",
          attributes: ["id", "nama_siswa"],
        },
        {
          model: Jadwal,
          as: "jadwal",
          attributes: ["id", "mapel_id", "jam_mulai", "jam_selesai"],
          where: Object.keys(jadwalWhere).length > 0 ? jadwalWhere : undefined,
          include: [
            {
              model: sequelize.models.MataPelajaran,
              as: "mataPelajaran",
              attributes: ["id", "nama_mapel"],
            },
          ],
        },
        {
          model: Kelas,
          as: "kelas",
          attributes: ["id", "nama_kelas"],
        },
      ],
      order: [["tanggal_absensi", "DESC"]],
    });

    if (!absensi || absensi.length === 0) {
      return {
        success: false,
        message: "Data absensi tidak ditemukan",
      };
    }

    return {
      success: true,
      data: absensi,
    };
  } catch (error) {
    console.error(
      "Service: Error fetching filtered absensi by kelas:",
      error.message
    );
    throw new Error("Failed to fetch filtered absensi by kelas");
  }
}

export async function getAllAttendanceByGuru(guru_id) {
  try {
    // Ambil semua jadwal yang diampu guru ini
    const jadwalList = await Jadwal.findAll({
      where: { guru_id },
      attributes: ["id", "kelas_id", "hari", "jam_mulai", "jam_selesai"],
      include: [
        {
          model: sequelize.models.MataPelajaran,
          as: "mataPelajaran",
          attributes: ["id", "nama_mapel"],
        },
        {
          model: sequelize.models.Kelas,
          as: "kelas",
          attributes: ["id", "nama_kelas"],
          include: [
            {
              model: sequelize.models.Siswa,
              as: "siswa",
              attributes: ["id", "nama_siswa"],
            },
          ],
        },
        {
          model: sequelize.models.Guru,
          as: "guru",
          attributes: ["id", "nama_guru"],
        },
      ],
    });

    if (!jadwalList || jadwalList.length === 0) {
      return {
        success: true,
        data: [],
      };
    }

    const data = await Promise.all(
      jadwalList.map(async (jadwal) => {
        const siswaList =
          jadwal.kelas && jadwal.kelas.siswa ? jadwal.kelas.siswa : [];

        // Ambil SEMUA absensi siswa untuk jadwal ini (bukan hanya absensi terakhir)
        const siswaWithAbsensi = await Promise.all(
          siswaList.map(async (siswa) => {
            const absensiList = await Absensi.findAll({
              where: {
                siswa_id: siswa.id,
                jadwal_id: jadwal.id,
              },
              order: [["tanggal_absensi", "DESC"]],
            });
            // Kembalikan array absensi, bukan hanya satu
            return {
              ...siswa.toJSON(),
              absensi: absensiList.map((a) => a.toJSON()),
            };
          })
        );

        // Ambil nama guru dari relasi
        let guruNama = null;
        if (jadwal.guru && jadwal.guru.nama_guru) {
          guruNama = jadwal.guru.nama_guru;
        } else if (jadwal.get && typeof jadwal.get === "function") {
          // fallback jika eager loading tidak jalan
          guruNama = jadwal.get("guru")?.nama_guru || null;
        }

        return {
          jadwal_id: jadwal.id,
          kelas: jadwal.kelas ? jadwal.kelas.nama_kelas : null,
          mataPelajaran: jadwal.mataPelajaran
            ? jadwal.mataPelajaran.nama_mapel
            : null,
          guru: guruNama,
          hari: jadwal.hari,
          jam_mulai: jadwal.jam_mulai,
          jam_selesai: jadwal.jam_selesai,
          siswa: siswaWithAbsensi,
        };
      })
    );

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error(
      "Service: Error fetching all attendance by guru:",
      error.message
    );
    throw new Error("Failed to fetch all attendance by guru");
  }
}

// Endpoint baru: getAbsensiByJadwalId
export async function getAbsensiByJadwalId(jadwal_id) {
  try {
    // Ambil jadwal beserta kelas, mapel, guru
    const jadwal = await Jadwal.findByPk(jadwal_id, {
      include: [
        {
          model: Kelas,
          as: "kelas",
          include: [
            {
              model: Siswa,
              as: "siswa",
              attributes: ["id", "nama_siswa"],
            },
          ],
          attributes: ["id", "nama_kelas"],
        },
        {
          model: sequelize.models.MataPelajaran,
          as: "mataPelajaran",
          attributes: ["id", "nama_mapel"],
        },
        {
          model: sequelize.models.Guru,
          as: "guru",
          attributes: ["id", "nama_guru"],
        },
      ],
    });

    if (!jadwal || !jadwal.kelas) {
      return {
        success: false,
        message: "Jadwal atau kelas tidak ditemukan",
      };
    }

    // Ambil semua absensi untuk jadwal_id ini
    const absensiList = await Absensi.findAll({
      where: { jadwal_id },
      attributes: [
        "id",
        "siswa_id",
        "jadwal_id",
        "tanggal_absensi",
        "waktu_masuk",
        "waktu_keluar",
        "status",
        "keterangan",
      ],
      order: [["tanggal_absensi", "DESC"]],
    });

    // Buat map absensi by siswa_id
    const absensiMap = {};
    absensiList.forEach((a) => {
      if (!absensiMap[a.siswa_id]) absensiMap[a.siswa_id] = [];
      absensiMap[a.siswa_id].push({
        id: a.id,
        siswa_id: a.siswa_id,
        jadwal_id: a.jadwal_id,
        tanggal_absensi: a.tanggal_absensi,
        waktu_masuk: a.waktu_masuk,
        waktu_keluar: a.waktu_keluar,
        status: a.status,
        keterangan: a.keterangan,
      });
    });

    // Format response agar sesuai dengan contoh yang diinginkan
    const data = {
      kelas: jadwal.kelas.nama_kelas,
      jadwal: [
        {
          id: jadwal.id,
          mataPelajaran: jadwal.mataPelajaran
            ? {
                id: jadwal.mataPelajaran.id,
                nama_mapel: jadwal.mataPelajaran.nama_mapel,
              }
            : null,
          guru: jadwal.guru
            ? {
                id: jadwal.guru.id,
                nama_guru: jadwal.guru.nama_guru,
              }
            : null,
          hari: jadwal.hari,
          jam_mulai: jadwal.jam_mulai,
          jam_selesai: jadwal.jam_selesai,
        },
      ],
      siswa: jadwal.kelas.siswa.map((s) => ({
        id: s.id,
        nama_siswa: s.nama_siswa,
        absensi:
          absensiMap[s.id] && absensiMap[s.id].length > 0
            ? absensiMap[s.id].map((abs) => ({
                id: abs.id,
                siswa_id: abs.siswa_id,
                jadwal_id: abs.jadwal_id,
                tanggal_absensi: abs.tanggal_absensi,
                waktu_masuk: abs.waktu_masuk,
                waktu_keluar: abs.waktu_keluar,
                status: abs.status,
                keterangan: abs.keterangan,
              }))
            : [
                {
                  status: "Belum Absen",
                },
              ],
      })),
    };

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error(
      "Service: Error fetching absensi by jadwal_id:",
      error.message
    );
    throw new Error("Failed to fetch absensi by jadwal_id");
  }
}

// ⏰ Cron tiap menit
nodeCron.schedule("* * * * *", async () => {
  if (isProcessingAbsensi) {
    console.log("⚠️ Proses absensi sedang berjalan, skip eksekusi berikutnya.");
    return;
  }
  isProcessingAbsensi = true;
  console.log("🟢 Menjalankan absensi otomatis...");

  try {
    await processAutomaticAbsensi();
  } catch (err) {
    console.error("❌ Error absensi otomatis:", err.message);
  } finally {
    isProcessingAbsensi = false;
    console.log("✅ Absensi otomatis selesai.");
  }
});
