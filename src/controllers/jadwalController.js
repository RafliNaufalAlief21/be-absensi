import * as jadwalService from "../services/jadwalService.js";
import Jadwal from "../models/Jadwal.js";

export const createJadwal = async (req, res) => {
  try {
    const jadwal = await jadwalService.createJadwal(Jadwal, req.body);
    return res.status(201).json({
      success: true,
      message: "Jadwal berhasil dibuat",
      data: jadwal,
    });
  } catch (error) {
    console.error("Create Jadwal error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat membuat jadwal",
      error: error.message,
    });
  }
};

export const getAllJadwal = async (req, res) => {
  try {
    const jadwalList = await jadwalService.getAllJadwal(Jadwal);
    return res.status(200).json({
      success: true,
      data: jadwalList,
    });
  } catch (error) {
    console.error("Get All Jadwal error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data jadwal",
      error: error.message,
    });
  }
};

export const getJadwalById = async (req, res) => {
  try {
    const jadwal = await jadwalService.getJadwalById(Jadwal, req.params.id);
    if (!jadwal) {
      return res.status(404).json({
        success: false,
        message: "Jadwal tidak ditemukan",
      });
    }
    return res.status(200).json({
      success: true,
      data: jadwal,
    });
  } catch (error) {
    console.error("Get Jadwal By ID error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data jadwal",
      error: error.message,
    });
  }
};

export const updateJadwal = async (req, res) => {
  try {
    const updated = await jadwalService.updateJadwal(
      Jadwal,
      req.params.id,
      req.body
    );
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Jadwal tidak ditemukan",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Jadwal berhasil diperbarui",
    });
  } catch (error) {
    console.error("Update Jadwal error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat memperbarui jadwal",
      error: error.message,
    });
  }
};

export const deleteJadwal = async (req, res) => {
  try {
    const deleted = await jadwalService.deleteJadwal(Jadwal, req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Jadwal tidak ditemukan",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Jadwal berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete Jadwal error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menghapus jadwal",
      error: error.message,
    });
  }
};
