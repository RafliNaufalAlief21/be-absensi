import express from "express";
import {
  getAllGuru,
  getGuruById,
  createGuru,
  updateGuru,
  deleteGuru,
} from "../controllers/guruController.js"; // Gunakan named imports
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /guru:
 *   get:
 *     summary: Get all guru
 *     tags: [Guru]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all guru
 *       401:
 *         description: Unauthorized
 */
router.get("/", authMiddleware, getAllGuru);

/**
 * @swagger
 * /guru/{id}:
 *   get:
 *     summary: Get a guru by ID
 *     tags: [Guru]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Guru ID
 *     responses:
 *       200:
 *         description: Guru data
 *       404:
 *         description: Guru not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", authMiddleware, getGuruById);

/**
 * @swagger
 * /guru:
 *   post:
 *     summary: Create a new guru
 *     tags: [Guru]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nip:
 *                 type: string
 *                 description: Nomor Induk Pegawai (digunakan sebagai username)
 *                 example: 987654321
 *               nama_guru:
 *                 type: string
 *                 description: Nama lengkap guru
 *                 example: Jane Doe
 *               jenis_kelamin:
 *                 type: string
 *                 enum: [Laki-laki, Perempuan]
 *                 description: Jenis kelamin guru
 *                 example: Perempuan
 *               alamat:
 *                 type: string
 *                 description: Alamat guru
 *                 example: Jl. Pendidikan No. 2
 *               email:
 *                 type: string
 *                 description: Email guru (digunakan untuk akun user)
 *                 example: janedoe@example.com
 *               password:
 *                 type: string
 *                 description: Password guru (akan di-hash menggunakan md5)
 *                 example: securepassword
 *               no_telepon:
 *                 type: string
 *                 description: Nomor telepon guru
 *                 example: 08123456789
 *     responses:
 *       201:
 *         description: Guru created successfully
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
 *                   example: Guru created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nip:
 *                       type: string
 *                       example: 987654321
 *                     nama_guru:
 *                       type: string
 *                       example: Jane Doe
 *                     jenis_kelamin:
 *                       type: string
 *                       example: Perempuan
 *                     alamat:
 *                       type: string
 *                       example: Jl. Pendidikan No. 2
 *                     email:
 *                       type: string
 *                       example: janedoe@example.com
 *                     no_telepon:
 *                       type: string
 *                       example: 08123456789
 *                     user_id:
 *                       type: integer
 *                       example: 10
 *       400:
 *         description: Validation error
 *       500:
 *         description: Failed to create guru
 */
router.post("/", authMiddleware, createGuru);

/**
 * @swagger
 * /guru/{id}:
 *   put:
 *     summary: Update a guru by ID
 *     tags: [Guru]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Guru ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama_guru:
 *                 type: string
 *               jenis_kelamin:
 *                 type: string
 *               alamat:
 *                 type: string
 *               email:
 *                 type: string
 *                 description: Email baru guru (opsional)
 *                 example: janedoe_updated@example.com
 *               password:
 *                 type: string
 *                 description: Password baru guru (opsional)
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Guru updated successfully
 *       404:
 *         description: Guru not found
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", authMiddleware, updateGuru);

/**
 * @swagger
 * /guru/{id}:
 *   delete:
 *     summary: Delete a guru by ID
 *     tags: [Guru]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Guru ID
 *     responses:
 *       200:
 *         description: Guru deleted successfully
 *       404:
 *         description: Guru not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", authMiddleware, deleteGuru);

export default router;
