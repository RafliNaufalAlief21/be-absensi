import express from "express";

import authMiddleware from "../middlewares/authMiddleware.js";
import {
  createWalikelas,
  deleteWalikelas,
  getAllWalikelas,
  getWalikelasById,
  updateWalikelas,
  getWalikelasByGuruId, // tambahkan import ini
  // importWalikelasExcel,
} from "../controllers/waliKelasController.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: walikelas
 *   description: API for managing walikelas data
 */

/**
 * @swagger
 * /walikelas:
 *   post:
 *     summary: Create new records for Jenjang Pendidikan, Tahun Ajaran, Guru, and Kelas
 *     tags: [walikelas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jenjangId:
 *                 type: integer
 *                 description: ID of the Jenjang Pendidikan
 *                 example: 1
 *               tahunAjaran:
 *                 type: array
 *                 description: List of Tahun Ajaran to be added
 *                 items:
 *                   type: object
 *                   properties:
 *                     namaTahunAjaran:
 *                       type: string
 *                       example: "2023-2024"
 *                     tanggalMulai:
 *                       type: string
 *                       format: date
 *                       example: "2023-07-01"
 *                     tanggalSelesai:
 *                       type: string
 *                       format: date
 *                       example: "2024-06-30"
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *               guru:
 *                 type: array
 *                 description: List of Guru to be added
 *                 items:
 *                   type: object
 *                   properties:
 *                     nip:
 *                       type: string
 *                       example: "123456"
 *                     namaGuru:
 *                       type: string
 *                       example: "Jane Doe"
 *                     email:
 *                       type: string
 *                       example: "jane.doe21@example.com"
 *                     jenisKelamin:
 *                       type: string
 *                       example: "laki-laki"
 *                     password:
 *                       type: string
 *                       example: "password123"
 *                     noTelepon:
 *                       type: string
 *                       example: "08123456789"
 *                     alamat:
 *                       type: string
 *                       example: "Jl. Merdeka No. 123"
 *               kelas:
 *                 type: array
 *                 description: List of Kelas to be added
 *                 items:
 *                   type: object
 *                   properties:
 *                     namaKelas:
 *                       type: string
 *                       example: "7-2"
 *     responses:
 *       200:
 *         description: Data created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Data created successfully"
 *                 data:
 *                   type: object
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post("/", authMiddleware, createWalikelas);

/**
 * @swagger
 * /walikelas/{id}:
 *   put:
 *     summary: Update an existing record for Jenjang Pendidikan, Tahun Ajaran, Guru, and Kelas
 *     tags: [walikelas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the record to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jenjangId:
 *                 type: integer
 *                 description: ID of the Jenjang Pendidikan
 *                 example: 1
 *               tahunAjaran:
 *                 type: array
 *                 description: List of Tahun Ajaran to be updated
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: ID of the Tahun Ajaran
 *                       example: 1
 *                     namaTahunAjaran:
 *                       type: string
 *                       example: "2023-2024"
 *                     tanggalMulai:
 *                       type: string
 *                       format: date
 *                       example: "2023-07-01"
 *                     tanggalSelesai:
 *                       type: string
 *                       format: date
 *                       example: "2024-06-30"
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *               guru:
 *                 type: array
 *                 description: List of Guru to be updated
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: ID of the Guru
 *                       example: 1
 *                     nip:
 *                       type: string
 *                       example: "123456"
 *                     namaGuru:
 *                       type: string
 *                       example: "Jane Doe"
 *                     email:
 *                       type: string
 *                       example: "jane.doe21@example.com"
 *                     jenisKelamin:
 *                       type: string
 *                       example: "laki-laki"
 *                     password:
 *                       type: string
 *                       example: "password123"
 *                     noTelepon:
 *                       type: string
 *                       example: "08123456789"
 *                     alamat:
 *                       type: string
 *                       example: "Jl. Merdeka No. 123"
 *               kelas:
 *                 type: array
 *                 description: List of Kelas to be updated
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: ID of the Kelas
 *                       example: 1
 *                     namaKelas:
 *                       type: string
 *                       example: "7-2"
 *     responses:
 *       200:
 *         description: Data updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Data updated successfully"
 *       404:
 *         description: Record not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", authMiddleware, updateWalikelas);

/**
 * @swagger
 * /walikelas/{id}:
 *   delete:
 *     summary: Delete a specific record by ID
 *     tags: [walikelas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the record to delete
 *     responses:
 *       200:
 *         description: Data deleted successfully
 *       404:
 *         description: Record not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", authMiddleware, deleteWalikelas);

/**
 * @swagger
 * /walikelas:
 *   get:
 *     summary: Retrieve all data for Kelas, Guru, and Jenjang Pendidikan
 *     tags: [walikelas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get("/", authMiddleware, getAllWalikelas);

/**
 * @swagger
 * /walikelas/{id}:
 *   get:
 *     summary: Retrieve a specific record by ID
 *     tags: [walikelas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the record to retrieve
 *     responses:
 *       200:
 *         description: Record retrieved successfully
 *       404:
 *         description: Record not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", authMiddleware, getWalikelasById);

/**
 * @swagger
 * /walikelas/guru/{guru_id}:
 *   get:
 *     summary: Get kelas data by guru_id
 *     tags: [walikelas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: guru_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The guru_id to filter kelas
 *     responses:
 *       200:
 *         description: Data retrieved successfully
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
router.get("/guru/:guru_id", authMiddleware, getWalikelasByGuruId);

// Endpoint import excel
// router.post(
//   "/import-excel",
//   authMiddleware,
//   upload.single("file"),
//   importWalikelasExcel
// );

export default router;


