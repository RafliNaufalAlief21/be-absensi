import * as AbsensiService from "../services/absensiService.js";

const scanBarcode = async (req, res) => {
  const { barcode, type, jadwal_id } = req.body;
  if (!barcode || !type || !jadwal_id) {
    return res.status(400).json({
      success: false,
      message: "Barcode, type, dan jadwal_id harus diisi",
    });
  }
  try {
    const result = await AbsensiService.scanBarcode(barcode, type, jadwal_id);
    if (result.status === 400 && result.response && !result.response.success) {
      return res.status(400).json(result.response);
    }
    if (type === "masuk" && result.response.success) {
      await AbsensiService.updateAbsensi(result.response.data.id, {
        waktu_keluar: result.response.data.waktu_masuk,
      });
    }
    return res.status(result.status).json(result.response);
  } catch (error) {
    console.error("Attendance error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mencatat absensi",
      error: error.message,
    });
  }
};

const markAttendance = async (req, res) => {
  const { barcode, jadwal_id, status } = req.body;
  if (!barcode || !jadwal_id || !status) {
    return res.status(400).json({
      success: false,
      message: "Barcode, jadwal_id, dan status harus diisi",
    });
  }
  if (!["Izin", "Sakit", "Tidak Hadir"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Status harus 'Izin', 'Sakit', atau 'Tidak Hadir'",
    });
  }
  try {
    const result = await AbsensiService.scanBarcode(
      barcode,
      null,
      jadwal_id,
      status
    );
    return res.status(result.status).json(result.response);
  } catch (error) {
    console.error("Controller: Error marking attendance:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to mark attendance",
      error: error.message,
    });
  }
};

const getAbsensi = async (req, res) => {
  const id = req.params.id || req.query.id;
  try {
    if (typeof AbsensiService.getAbsensiWithDetails === "function") {
      const result = await AbsensiService.getAbsensiWithDetails(id);
      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.message || "Data absensi tidak ditemukan",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Data absensi berhasil diambil",
        data: result.data,
      });
    } else {
      const result = await AbsensiService.getAbsensi(id);
      if (result.status !== 200) {
        return res.status(result.status).json(result.response);
      }
      return res.status(200).json({
        success: true,
        message: "Data absensi berhasil diambil",
        data: result.response.data,
      });
    }
  } catch (error) {
    console.error("Get Absensi error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil absensi",
      error: error.message,
    });
  }
};

const updateAbsensi = async (req, res) => {
  const { id } = req.params;
  const {
    siswa_id,
    jadwal_id,
    tanggal_absensi,
    waktu_masuk,
    waktu_keluar,
    status,
    keterangan,
    user_id,
  } = req.body;
  try {
    const result = await AbsensiService.updateAbsensi(id, {
      siswa_id,
      jadwal_id,
      tanggal_absensi,
      waktu_masuk,
      waktu_keluar,
      status,
      keterangan,
      user_id,
    });
    return res.status(result.status).json(result.response);
  } catch (error) {
    console.error("Update Absensi error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat memperbarui absensi",
      error: error.message,
    });
  }
};

const deleteAbsensi = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await AbsensiService.deleteAbsensi(id);
    return res.status(result.status).json(result.response);
  } catch (error) {
    console.error("Delete Absensi error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menghapus absensi",
      error: error.message,
    });
  }
};

const getMonthlyReport = async (req, res) => {
  const { siswa_id, bulan, tahun } = req.query;

  if (!siswa_id || !bulan || !tahun) {
    return res.status(400).json({
      success: false,
      message: "Parameter siswa_id, bulan, dan tahun harus diisi",
    });
  }

  try {
    const result = await AbsensiService.generateMonthlyReport(
      siswa_id,
      bulan,
      tahun
    );

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message || "Data absensi tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Monthly report generated successfully",
      data: result.data,
    });
  } catch (error) {
    console.error("Error generating monthly report:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to generate monthly report",
      error: error.message,
    });
  }
};

const getRekapBulanan = async (req, res) => {
  const { siswa_id, bulan, tahun } = req.query;

  if (!siswa_id || !bulan || !tahun) {
    return res.status(400).json({
      success: false,
      message: "Parameter siswa_id, bulan, dan tahun harus diisi",
    });
  }

  try {
    const result = await AbsensiService.getRekapBulanan(siswa_id, bulan, tahun);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message || "Data absensi tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Rekap bulanan berhasil diambil",
      data: result.data,
    });
  } catch (error) {
    console.error("Error generating monthly report:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to generate monthly report",
      error: error.message,
    });
  }
};

const getAbsensiBySiswa = async (req, res) => {
  const { siswa_id } = req.query;

  if (!siswa_id) {
    console.warn("Controller: siswa_id is missing in the request."); // Debug log
    return res.status(400).json({
      success: false,
      message: "Parameter siswa_id harus diisi",
    });
  }

  try {
    console.log("Controller: siswa_id received:", siswa_id); // Debug log
    const result = await AbsensiService.getAbsensiBySiswa(parseInt(siswa_id));
    console.log("Controller: Service result:", JSON.stringify(result, null, 2)); // Debug log

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message || "Absensi tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data absensi berhasil diambil",
      data: result.data,
    });
  } catch (error) {
    console.error(
      "Controller: Error fetching absensi by siswa:",
      error.message
    );
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data absensi",
      error: error.message,
    });
  }
};

const getFilteredAbsensiByKelas = async (
  req,
  res,
  formattedTanggalMulai,
  formattedTanggalSelesai
) => {
  const { kelas_id, status, mapel_id } = req.query; // tambahkan mapel_id

  try {
    console.log("Controller: Filtering absensi with parameters:");
    console.log("kelas_id:", kelas_id);
    console.log("status:", status);
    console.log("mapel_id:", mapel_id);
    console.log("formattedTanggalMulai:", formattedTanggalMulai);
    console.log("formattedTanggalSelesai:", formattedTanggalSelesai);

    const result = await AbsensiService.getFilteredAbsensiByKelas(
      parseInt(kelas_id),
      status,
      formattedTanggalMulai,
      formattedTanggalSelesai,
      mapel_id // tambahkan mapel_id ke parameter
    );

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message || "Data absensi tidak ditemukan",
      });
    }

    // Serialize the data to remove circular references
    const serializedData = JSON.parse(JSON.stringify(result.data));
    const responseData = serializedData.map((item) => ({
      ...item,
      jadwal: item.jadwal
        ? {
            id: item.jadwal.id,
            mapel_id: item.jadwal.mapel_id,
            jam_mulai: item.jadwal.jam_mulai,
            jam_selesai: item.jadwal.jam_selesai,
            mataPelajaran: item.jadwal.mataPelajaran
              ? {
                  id: item.jadwal.mataPelajaran.id,
                  nama_mapel: item.jadwal.mataPelajaran.nama_mapel,
                }
              : null,
          }
        : null,
    }));

    return res.status(200).json({
      success: true,
      message: "Data absensi berhasil diambil",
      data: responseData,
    });
  } catch (error) {
    console.error(
      "Controller: Error fetching filtered absensi by kelas:",
      error.message
    );
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data absensi",
      error: error.message,
    });
  }
};

const getAllAbsensi = async (req, res) => {
  try {
    const result = await AbsensiService.getAllAbsensi();

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: "Data absensi tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data absensi berhasil diambil",
      data: result.data,
    });
  } catch (error) {
    console.error("Controller: Error fetching all absensi:", error.message);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data absensi",
      error: error.message,
    });
  }
};

const getAbsensiByJadwal = async (req, res) => {
  const { jadwal_id } = req.query;

  if (!jadwal_id || isNaN(parseInt(jadwal_id))) {
    return res.status(400).json({
      success: false,
      message: "Parameter jadwal_id harus berupa angka dan tidak boleh kosong",
    });
  }

  try {
    const result = await AbsensiService.getAbsensiByJadwal(parseInt(jadwal_id));

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message || "Data tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data absensi berhasil diambil",
      data: result.data,
    });
  } catch (error) {
    console.error(
      "Controller: Error fetching absensi by jadwal:",
      error.message
    );
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data absensi",
      error: error.message,
    });
  }
};

const getAbsensiSummaryByJadwal = async (req, res) => {
  const { jadwal_id } = req.query;

  if (!jadwal_id || isNaN(parseInt(jadwal_id))) {
    return res.status(400).json({
      success: false,
      message: "Parameter jadwal_id harus berupa angka dan tidak boleh kosong",
    });
  }

  try {
    const result = await AbsensiService.getAbsensiSummaryByJadwal(
      parseInt(jadwal_id)
    );

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message || "Data absensi tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data absensi berhasil diambil",
      data: result.data,
    });
  } catch (error) {
    console.error(
      "Controller: Error fetching absensi summary by jadwal:",
      error.message
    );
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data absensi",
      error: error.message,
    });
  }
};

const getAllAbsensiWithDetails = async (req, res) => {
  try {
    const result = await AbsensiService.getAllAbsensiWithDetails();

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message || "Data absensi tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data absensi berhasil diambil",
      data: result.data,
    });
  } catch (error) {
    console.error(
      "Controller: Error fetching all absensi with details by kelas:",
      error.message
    );
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data absensi",
      error: error.message,
    });
  }
};

const getAbsensiByMataPelajaran = async (req, res) => {
  const { mapel_id } = req.query;

  if (!mapel_id || isNaN(parseInt(mapel_id))) {
    return res.status(400).json({
      success: false,
      message: "Parameter mapel_id harus berupa angka dan tidak boleh kosong",
    });
  }

  try {
    const result = await AbsensiService.getAbsensiByMataPelajaran(
      parseInt(mapel_id)
    );

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message || "Data absensi tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data absensi berdasarkan mata pelajaran berhasil diambil",
      data: result.data,
    });
  } catch (error) {
    console.error(
      "Controller: Error fetching absensi by mata pelajaran:",
      error.message
    );
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data absensi",
      error: error.message,
    });
  }
};

const getAllAttendanceByGuru = async (req, res) => {
  const guru_id = req.params.guru_id;
  if (!guru_id || isNaN(parseInt(guru_id))) {
    return res.status(400).json({
      success: false,
      message: "Parameter guru_id harus berupa angka dan tidak boleh kosong",
    });
  }

  try {
    const result = await AbsensiService.getAllAttendanceByGuru(
      parseInt(guru_id)
    );

    // Jika tidak ada jadwal, tetap success: true dan data: []
    if (result.success && Array.isArray(result.data)) {
      return res.status(200).json({
        success: true,
        message: "Data absensi berdasarkan guru berhasil diambil",
        data: result.data,
      });
    }

    // Jika error lain
    return res.status(404).json({
      success: false,
      message: result.message || "Data absensi tidak ditemukan",
    });
  } catch (error) {
    console.error(
      "Controller: Error fetching all attendance by guru:",
      error.message
    );
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data absensi berdasarkan guru",
      error: error.message,
    });
  }
};

const getAbsensiByJadwalId = async (req, res) => {
  const { jadwal_id } = req.params;
  if (!jadwal_id || isNaN(parseInt(jadwal_id))) {
    return res.status(400).json({
      success: false,
      message: "Parameter jadwal_id harus berupa angka dan tidak boleh kosong",
    });
  }
  try {
    const result = await AbsensiService.getAbsensiByJadwalId(
      parseInt(jadwal_id)
    );
    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message || "Data absensi tidak ditemukan",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Data absensi berhasil diambil",
      data: result.data,
    });
  } catch (error) {
    console.error(
      "Controller: Error fetching absensi by jadwal_id:",
      error.message
    );
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data absensi",
      error: error.message,
    });
  }
};

export default {
  scanBarcode,
  markAttendance,
  getAbsensi,
  updateAbsensi,
  deleteAbsensi,
  getMonthlyReport,
  getRekapBulanan,
  getAbsensiBySiswa,
  getFilteredAbsensiByKelas,
  getAllAbsensi,
  getAbsensiByJadwal,
  getAbsensiSummaryByJadwal,
  getAllAbsensiWithDetails,
  getAbsensiByMataPelajaran,
  getAllAttendanceByGuru,
  getAbsensiByJadwalId,
};
