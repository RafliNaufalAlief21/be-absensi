import express from "express";
import {
  createTahunAjaran,
  getAllTahunAjaran,
  getTahunAjaranById,
  updateTahunAjaran,
  deleteTahunAjaran,
} from "../controllers/tahunAjaranController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: TahunAjaran
 *   description: API endpoints for managing Tahun Ajaran
 */

/**
 * @swagger
 * /tahun-ajaran:
 *   post:
 *     summary: Create a new Tahun Ajaran
 *     tags: [TahunAjaran]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama_tahun_ajaran:
 *                 type: string
 *                 description: The name of the Tahun Ajaran
 *               tanggal_mulai:
 *                 type: string
 *                 format: date
 *                 description: Start date of the Tahun Ajaran
 *               tanggal_selesai:
 *                 type: string
 *                 format: date
 *                 description: End date of the Tahun Ajaran
 *               is_active:
 *                 type: boolean
 *                 description: Whether the Tahun Ajaran is active
 *     responses:
 *       201:
 *         description: Tahun Ajaran created successfully.
 *       400:
 *         description: Validation error.
 *       500:
 *         description: Internal server error.
 */
router.post("/", authMiddleware, createTahunAjaran);

/**
 * @swagger
 * /tahun-ajaran:
 *   get:
 *     summary: Retrieve all Tahun Ajaran
 *     tags: [TahunAjaran]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of Tahun Ajaran.
 *       500:
 *         description: Internal server error.
 */
router.get("/", authMiddleware, getAllTahunAjaran);

/**
 * @swagger
 * /tahun-ajaran/{id}:
 *   get:
 *     summary: Retrieve a Tahun Ajaran by ID
 *     tags: [TahunAjaran]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The Tahun Ajaran ID
 *     responses:
 *       200:
 *         description: Tahun Ajaran retrieved successfully.
 *       404:
 *         description: Tahun Ajaran not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/:id", authMiddleware, getTahunAjaranById);

/**
 * @swagger
 * /tahun-ajaran/{id}:
 *   put:
 *     summary: Update a Tahun Ajaran
 *     tags: [TahunAjaran]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The Tahun Ajaran ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama_tahun_ajaran:
 *                 type: string
 *               tanggal_mulai:
 *                 type: string
 *                 format: date
 *               tanggal_selesai:
 *                 type: string
 *                 format: date
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Tahun Ajaran updated successfully.
 *       404:
 *         description: Tahun Ajaran not found.
 *       500:
 *         description: Internal server error.
 */
router.put("/:id", authMiddleware, updateTahunAjaran);

/**
 * @swagger
 * /tahun-ajaran/{id}:
 *   delete:
 *     summary: Delete a Tahun Ajaran
 *     tags: [TahunAjaran]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The Tahun Ajaran ID
 *     responses:
 *       200:
 *         description: Tahun Ajaran deleted successfully.
 *       404:
 *         description: Tahun Ajaran not found.
 *       500:
 *         description: Internal server error.
 */
router.delete("/:id", authMiddleware, deleteTahunAjaran);

export default router;
