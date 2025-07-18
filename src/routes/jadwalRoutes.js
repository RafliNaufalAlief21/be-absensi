import express from "express";
import {
  createJadwal,
  getAllJadwal,
  getJadwalById,
  updateJadwal,
  deleteJadwal,
} from "../controllers/jadwalController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Jadwal
 *   description: API endpoints for managing Jadwal
 */

/**
 * @swagger
 * /jadwal:
 *   post:
 *     summary: Create a new Jadwal
 *     tags: [Jadwal]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               kelas_id:
 *                 type: integer
 *                 description: ID of the associated Kelas
 *               mapel_id:
 *                 type: integer
 *                 description: ID of the associated Mata Pelajaran
 *               guru_id:
 *                 type: integer
 *                 description: ID of the associated Guru
 *               tahun_ajaran_id:
 *                 type: integer
 *                 description: ID of the associated Tahun Ajaran
 *               hari:
 *                 type: string
 *                 enum: [Senin, Selasa, Rabu, Kamis, Jumat, Sabtu]
 *                 description: Day of the schedule
 *               jam_mulai:
 *                 type: string
 *                 format: time
 *                 description: Start time
 *               jam_selesai:
 *                 type: string
 *                 format: time
 *                 description: End time
 *               ruangan:
 *                 type: string
 *                 description: Room
 *     responses:
 *       201:
 *         description: Jadwal created successfully.
 *       400:
 *         description: Validation error.
 *       500:
 *         description: Internal server error.
 */
router.post("/", authMiddleware, createJadwal);

/**
 * @swagger
 * /jadwal:
 *   get:
 *     summary: Retrieve all Jadwal
 *     tags: [Jadwal]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of Jadwal.
 *       500:
 *         description: Internal server error.
 */
router.get("/", authMiddleware, getAllJadwal);

/**
 * @swagger
 * /jadwal/{id}:
 *   get:
 *     summary: Retrieve a Jadwal by ID
 *     tags: [Jadwal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The Jadwal ID
 *     responses:
 *       200:
 *         description: Jadwal retrieved successfully.
 *       404:
 *         description: Jadwal not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/:id", authMiddleware, getJadwalById);

/**
 * @swagger
 * /jadwal/{id}:
 *   put:
 *     summary: Update a Jadwal
 *     tags: [Jadwal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The Jadwal ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               kelas_id:
 *                 type: integer
 *               mapel_id:
 *                 type: integer
 *               guru_id:
 *                 type: integer
 *               tahun_ajaran_id:
 *                 type: integer
 *               hari:
 *                 type: string
 *                 enum: [Senin, Selasa, Rabu, Kamis, Jumat, Sabtu]
 *               jam_mulai:
 *                 type: string
 *                 format: time
 *               jam_selesai:
 *                 type: string
 *                 format: time
 *               ruangan:
 *                 type: string
 *     responses:
 *       200:
 *         description: Jadwal updated successfully.
 *       404:
 *         description: Jadwal not found.
 *       500:
 *         description: Internal server error.
 */
router.put("/:id", authMiddleware, updateJadwal);

/**
 * @swagger
 * /jadwal/{id}:
 *   delete:
 *     summary: Delete a Jadwal
 *     tags: [Jadwal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The Jadwal ID
 *     responses:
 *       200:
 *         description: Jadwal deleted successfully.
 *       404:
 *         description: Jadwal not found.
 *       500:
 *         description: Internal server error.
 */
router.delete("/:id", authMiddleware, deleteJadwal);

export default router;
