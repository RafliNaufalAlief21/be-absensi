import express from "express";
import {
  getAllKelas,
  getKelasById,
  createKelas,
  updateKelas,
  deleteKelas,
} from "../controllers/kelasController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Kelas
 *   description: API endpoints for managing kelas
 */

/**
 * @swagger
 * /kelas:
 *   get:
 *     summary: Retrieve a list of kelas
 *     tags: [Kelas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of kelas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   nama_kelas:
 *                     type: string
 *                     example: Kelas 7 SMP
 *                   jenjangPendidikan:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 2
 *                       nama_jenjang:
 *                         type: string
 *                         example: SMP
 *                   tahunAjaran:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       nama_tahun_ajaran:
 *                         type: string
 *                         example: 2023-2024
 *                   guru:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 5
 *                       nama_guru:
 *                         type: string
 *                         example: Budi Santoso
 *       401:
 *         description: Unauthorized
 */
router.get("/", authMiddleware, getAllKelas);

/**
 * @swagger
 * /kelas/{id}:
 *   get:
 *     summary: Retrieve a single kelas by ID
 *     tags: [Kelas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The kelas ID
 *     responses:
 *       200:
 *         description: A single kelas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 nama_kelas:
 *                   type: string
 *                   example: Kelas 7 SMP
 *                 jenjangPendidikan:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 2
 *                     nama_jenjang:
 *                       type: string
 *                       example: SMP
 *                 tahunAjaran:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nama_tahun_ajaran:
 *                       type: string
 *                       example: 2023-2024
 *                 guru:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 5
 *                     nama_guru:
 *                       type: string
 *                       example: Budi Santoso
 *       404:
 *         description: Kelas not found.
 */
router.get("/:id", authMiddleware, getKelasById);

/**
 * @swagger
 * /kelas:
 *   post:
 *     summary: Create a new kelas
 *     tags: [Kelas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama_kelas:
 *                 type: string
 *                 description: Nama kelas
 *                 example: Kelas 7 SMP
 *               jenjang_pendidikan:
 *                 type: string
 *                 description: Nama jenjang pendidikan
 *                 example: SMP
 *               tahun_ajaran:
 *                 type: string
 *                 description: Tahun ajaran
 *                 example: 2023-2024
 *               guru_id:
 *                 type: integer
 *                 description: ID guru yang bertanggung jawab
 *                 example: 5
 *     responses:
 *       201:
 *         description: Kelas created successfully
 *       500:
 *         description: Internal server error
 */
router.post("/", authMiddleware, createKelas);

/**
 * @swagger
 * /kelas/{id}:
 *   put:
 *     summary: Update an existing kelas
 *     tags: [Kelas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The kelas ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama_kelas:
 *                 type: string
 *                 description: Nama kelas
 *                 example: Kelas 7 SMP
 *               jenjang_pendidikan:
 *                 type: string
 *                 description: Nama jenjang pendidikan
 *                 example: SMP
 *               tahun_ajaran:
 *                 type: string
 *                 description: Tahun ajaran
 *                 example: 2023-2024
 *               guru_id:
 *                 type: integer
 *                 description: ID guru yang bertanggung jawab
 *                 example: 5
 *     responses:
 *       200:
 *         description: Kelas updated successfully
 *       404:
 *         description: Kelas not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", authMiddleware, updateKelas);

/**
 * @swagger
 * /kelas/{id}:
 *   delete:
 *     summary: Delete a kelas
 *     tags: [Kelas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The kelas ID
 *     responses:
 *       200:
 *         description: Kelas deleted successfully.
 *       404:
 *         description: Kelas not found.
 */
router.delete("/:id", authMiddleware, deleteKelas);

export default router;
