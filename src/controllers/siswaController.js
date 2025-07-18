import path from "path";
import { fileURLToPath } from "url";
import * as siswaService from "../services/siswaService.js";
import XLSX from "xlsx";

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllSiswa = async (req, res) => {
  try {
    const siswa = await siswaService.getAllSiswa();
    if (!siswa || siswa.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No siswa found",
        data: null,
      });
    }
    res.status(200).json({
      success: true,
      message: "Siswa retrieved successfully",
      data: siswa,
    });
  } catch (error) {
    console.error("Error retrieving siswa:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve siswa",
      data: null,
    });
  }
};

export const getSiswaById = async (req, res) => {
  try {
    const { id } = req.params;

    // Ambil data siswa berdasarkan ID
    const siswa = await siswaService.getSiswaById(id);

    res.status(200).json({
      success: true,
      message: "Siswa retrieved successfully",
      data: siswa,
    });
  } catch (error) {
    console.error("Error retrieving siswa by ID:", error.message);
    res.status(404).json({
      success: false,
      message: error.message || "Failed to retrieve siswa",
    });
  }
};

export const createSiswa = async (req, res) => {
  try {
    console.log("=== Create Siswa Request ===");
    console.log("Body:", req.body);
    console.log("File:", req.file);
    console.log("Headers:", req.headers);
    
    const file = req.file; // Ambil file yang diunggah
    
    // Validate required fields
    const requiredFields = ['nis', 'nama_siswa', 'kelas_id', 'jenis_kelamin'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          message: `Field ${field} is required`,
        });
      }
    }
    
    const siswa = await siswaService.createSiswa(req.body, file);

    res.status(201).json({
      success: true,
      message: "Siswa created successfully",
      data: siswa,
    });
  } catch (error) {
    console.error("=== Error creating siswa ===");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("Request body:", req.body);
    console.error("Request file:", req.file);
    
    // Handle specific error types
    if (error.message.includes('duplicate') || error.message.includes('UNIQUE')) {
      return res.status(400).json({
        success: false,
        message: "NIS sudah terdaftar dalam sistem",
      });
    }
    
    if (error.message.includes('permission') || error.message.includes('EACCES')) {
      return res.status(500).json({
        success: false,
        message: "Server error: Permission denied for file upload",
      });
    }
    
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create siswa",
    });
  }
};

export const updateSiswa = async (req, res) => {
  try {
    const { id } = req.params;
    const siswaData = req.body;
    const file = req.file; // Ambil file yang diunggah jika ada

    // Debugging: Log data yang diterima
    console.log("Data received for updateSiswa:", siswaData);

    const result = await siswaService.updateSiswa(id, siswaData, file);

    // Periksa apakah siswa ditemukan berdasarkan ID
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Siswa not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Siswa updated successfully",
    });
  } catch (error) {
    console.error("Error updating siswa:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update siswa",
    });
  }
};

export const deleteSiswa = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await siswaService.deleteSiswa(id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Error deleting siswa:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete siswa",
    });
  }
};

export const getSiswaByGuruId = async (req, res) => {
  try {
    const { guru_id } = req.params;
    if (!guru_id) {
      return res.status(400).json({
        success: false,
        message: "guru_id harus diisi",
      });
    }
    const siswa = await siswaService.getSiswaByGuruId(guru_id);
    res.status(200).json({
      success: true,
      message: "Siswa by guru_id retrieved successfully",
      data: siswa,
    });
  } catch (error) {
    console.error("Error retrieving siswa by guru_id:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve siswa by guru_id",
    });
  }
};

export const importSiswaFromExcel = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }
    const workbook = XLSX.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    // Loop data dan buat siswa satu per satu
    const results = [];
    for (const siswa of data) {
      try {
        // Pastikan mapping kolom Excel ke field DB sesuai kebutuhan
        const siswaData = {
          nis: siswa.nis || siswa.NIS,
          nama_siswa: siswa.nama_siswa || siswa.NAMA_SISWA,
          kelas_id: siswa.kelas_id || siswa.KELAS_ID,
          jenis_kelamin: siswa.jenis_kelamin || siswa.JENIS_KELAMIN,
          tempat_lahir: siswa.tempat_lahir || siswa.TEMPAT_LAHIR,
          tanggal_lahir: siswa.tanggal_lahir || siswa.TANGGAL_LAHIR,
          agama: siswa.agama || siswa.AGAMA,
          alamat: siswa.alamat || siswa.ALAMAT,
          email: siswa.email || siswa.EMAIL,
          password: siswa.password || siswa.PASSWORD || siswa.nis || siswa.NIS, // Default password = NIS
          no_telepon: siswa.no_telepon || siswa.NO_TELEPON,
        };
        const created = await siswaService.createSiswa(siswaData, null);
        results.push({ success: true, siswa: created });
      } catch (err) {
        results.push({ success: false, error: err.message, siswa });
      }
    }
    res.status(200).json({
      success: true,
      message: "Import selesai",
      results,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const handleError = (res, error, message) => {
  console.error(message, error.message);
  res.status(500).json({ error: error.message });
};
