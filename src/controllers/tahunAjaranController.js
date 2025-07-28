import * as tahunAjaranService from "../services/tahunAjaranService.js";
import TahunAjaran from "../models/TahunAjaran.js";

export const createTahunAjaran = async (req, res) => {
  try {
    const tahunAjaran = await tahunAjaranService.createTahunAjaran(
      TahunAjaran,
      req.body
    );
    return res.status(201).json({
      success: true,
      message: "Tahun Ajaran created successfully",
      data: tahunAjaran,
    });
  } catch (error) {
    console.error("Create Tahun Ajaran error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create Tahun Ajaran",
      error: error.message,
    });
  }
};

export const getAllTahunAjaran = async (req, res) => {
  try {
    const tahunAjaranList = await tahunAjaranService.getAllTahunAjaran(
      TahunAjaran
    );
    console.log("TahunAjaran List from DB:", tahunAjaranList); // Debug logging
    return res.status(200).json({
      success: true,
      data: tahunAjaranList,
    });
  } catch (error) {
    console.error("Get All Tahun Ajaran error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve Tahun Ajaran",
      error: error.message,
    });
  }
};

export const getTahunAjaranById = async (req, res) => {
  try {
    const tahunAjaran = await tahunAjaranService.getTahunAjaranById(
      TahunAjaran,
      req.params.id
    );
    if (!tahunAjaran) {
      return res.status(404).json({
        success: false,
        message: "Tahun Ajaran not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: tahunAjaran,
    });
  } catch (error) {
    console.error("Get Tahun Ajaran By ID error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve Tahun Ajaran",
      error: error.message,
    });
  }
};

export const updateTahunAjaran = async (req, res) => {
  try {
    await tahunAjaranService.updateTahunAjaran(
      TahunAjaran,
      req.params.id,
      req.body
    );
    return res.status(200).json({
      success: true,
      message: "Tahun Ajaran updated successfully",
    });
  } catch (error) {
    console.error("Update Tahun Ajaran error:", error.message);
    return res
      .status(error.message === "Tahun Ajaran not found" ? 404 : 500)
      .json({
        success: false,
        message: error.message,
      });
  }
};

export const deleteTahunAjaran = async (req, res) => {
  try {
    await tahunAjaranService.deleteTahunAjaran(TahunAjaran, req.params.id);
    return res.status(200).json({
      success: true,
      message: "Tahun Ajaran deleted successfully",
    });
  } catch (error) {
    console.error("Delete Tahun Ajaran error:", error.message);
    return res
      .status(error.message === "Tahun Ajaran not found" ? 404 : 500)
      .json({
        success: false,
        message: error.message,
      });
  }
};
