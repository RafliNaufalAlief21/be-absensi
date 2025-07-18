import {
  createGuru as createGuruService,
  getAllGuru as getAllGuruService,
  getGuruById as getGuruByIdService,
  updateGuru as updateGuruService,
  deleteGuru as deleteGuruService,
} from "../services/guruService.js";

export const createGuru = async (req, res) => {
  try {
    const guru = await createGuruService(req.body);
    res.status(201).json({
      success: true,
      message: "Guru created successfully",
      data: {
        id: guru.id,
        nip: guru.nip,
        nama_guru: guru.nama_guru,
        jenis_kelamin: guru.jenis_kelamin,
        alamat: guru.alamat,
        no_telepon: guru.no_telepon,
        email: guru.user?.email,
        user_id: guru.user_id,
      },
    });
  } catch (error) {
    console.error("Error creating guru:", error.message);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create guru",
    });
  }
};

export const getAllGuru = async (req, res) => {
  try {
    const guru = await getAllGuruService();
    res.status(200).json({
      success: true,
      message: "Guru retrieved successfully",
      data: guru.map((g) => ({
        id: g.id,
        nip: g.nip,
        nama_guru: g.nama_guru,
        jenis_kelamin: g.jenis_kelamin,
        alamat: g.alamat,
        no_telepon: g.no_telepon,
        email: g.user?.email,
      })),
    });
  } catch (error) {
    console.error("Error retrieving guru:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve guru",
      data: null,
    });
  }
};

export const getGuruById = async (req, res) => {
  try {
    const guru = await getGuruByIdService(req.params.id);
    if (!guru)
      return res.status(404).json({
        success: false,
        message: "Guru not found",
        data: null,
      });
    res.status(200).json({
      success: true,
      message: "Guru retrieved successfully",
      data: {
        id: guru.id,
        nip: guru.nip,
        nama_guru: guru.nama_guru,
        jenis_kelamin: guru.jenis_kelamin,
        alamat: guru.alamat,
        no_telepon: guru.no_telepon,
        email: guru.user?.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve guru",
      data: null,
    });
  }
};

export const updateGuru = async (req, res) => {
  try {
    const guru = await updateGuruService(req.params.id, req.body);
    if (!guru)
      return res.status(404).json({
        success: false,
        message: "Guru not found",
        data: null,
      });
    res.status(200).json({
      success: true,
      message: "Guru updated successfully",
    });
  } catch (error) {
    console.error("Error updating guru:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update guru",
    });
  }
};

export const deleteGuru = async (req, res) => {
  try {
    const result = await deleteGuruService(req.params.id);
    if (!result)
      return res.status(404).json({
        success: false,
        message: "Guru not found",
        data: null,
      });
    res.status(200).json({
      success: true,
      message: "Guru deleted successfully",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete guru",
      data: null,
    });
  }
};
