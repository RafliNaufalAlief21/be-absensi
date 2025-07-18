import express from "express";
import {
  createSiswa,
  getAllSiswa,
  getSiswaById,
  updateSiswa,
  deleteSiswa,
  getSiswaByGuruId,
  importSiswaFromExcel, // import controller baru
} from "../controllers/siswaController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { upload, handleUploadErrors } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /siswa:
 *   get:
 *     summary: Get all siswa
 *     tags: [Siswa]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all siswa
 *       401:
 *         description: Unauthorized
 */
router.get("/", authMiddleware, getAllSiswa);

/**
 * @swagger
 * /siswa/{id}:
 *   get:
 *     summary: Get a siswa by ID
 *     tags: [Siswa]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Siswa ID
 *     responses:
 *       200:
 *         description: Siswa data
 *       404:
 *         description: Siswa not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", authMiddleware, getSiswaById);

/**
 * @swagger
 * /siswa/guru/{guru_id}:
 *   get:
 *     summary: Get all siswa by guru_id
 *     tags: [Siswa]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: guru_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Guru ID
 *     responses:
 *       200:
 *         description: List of siswa by guru_id
 *       404:
 *         description: Siswa not found
 *       401:
 *         description: Unauthorized
 */
router.get("/guru/:guru_id", authMiddleware, getSiswaByGuruId);

/**
 * @swagger
 * /siswa:
 *   post:
 *     summary: Create a new siswa
 *     tags: [Siswa]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nis:
 *                 type: string
 *                 description: Nomor Induk Siswa (digunakan sebagai username)
 *                 example: 123456789
 *               nama_siswa:
 *                 type: string
 *                 description: Nama lengkap siswa
 *                 example: John Doe
 *               kelas_id:
 *                 type: integer
 *                 description: ID kelas siswa
 *                 example: 1
 *               jenis_kelamin:
 *                 type: string
 *                 enum: [Laki-laki, Perempuan]
 *                 description: Jenis kelamin siswa
 *                 example: Laki-laki
 *               tempat_lahir:
 *                 type: string
 *                 description: Tempat lahir siswa
 *                 example: Jakarta
 *               tanggal_lahir:
 *                 type: string
 *                 format: date
 *                 description: Tanggal lahir siswa
 *                 example: 2005-02-15
 *               agama:
 *                 type: string
 *                 description: Agama siswa
 *                 example: Islam
 *               alamat:
 *                 type: string
 *                 description: Alamat siswa
 *                 example: Jl. Contoh No. 1
 *               email:
 *                 type: string
 *                 description: Email siswa
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 description: Password siswa
 *                 example: securepassword
 *               no_telepon:
 *                 type: string
 *                 description: Nomor telepon siswa
 *                 example: 08123456789
 *               foto:
 *                 type: string
 *                 format: binary
 *                 description: Foto siswa (opsional)
 *     responses:
 *       201:
 *         description: Siswa created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post("/", authMiddleware, upload.single("foto"), handleUploadErrors, createSiswa);

/**
 * @swagger
 * /siswa/import:
 *   post:
 *     summary: Import siswa data from Excel file
 *     tags: [Siswa]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File Excel yang berisi data siswa
 *     responses:
 *       200:
 *         description: Siswa data imported successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post(
  "/import",
  authMiddleware,
  upload.single("file"),
  handleUploadErrors,
  importSiswaFromExcel
);

/**
 * @swagger
 * /siswa/{id}:
 *   put:
 *     summary: Update a siswa by ID
 *     tags: [Siswa]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Siswa ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nis:
 *                 type: string
 *                 description: Nomor Induk Siswa (digunakan sebagai username)
 *                 example: 12345678933
 *               nama_siswa:
 *                 type: string
 *                 description: Nama lengkap siswa
 *                 example: John Doe
 *               kelas_id:
 *                 type: integer
 *                 description: ID kelas siswa
 *                 example: 1
 *               jenis_kelamin:
 *                 type: string
 *                 enum: [Laki-laki, Perempuan]
 *                 description: Jenis kelamin siswa
 *                 example: Laki-laki
 *               tempat_lahir:
 *                 type: string
 *                 description: Tempat lahir siswa
 *                 example: Jakarta
 *               tanggal_lahir:
 *                 type: string
 *                 format: date
 *                 description: Tanggal lahir siswa
 *                 example: 2005-02-15
 *               agama:
 *                 type: string
 *                 description: Agama siswa
 *                 example: Islam
 *               alamat:
 *                 type: string
 *                 description: Alamat siswa
 *                 example: Jl. Contoh No. 1
 *               no_telepon:
 *                 type: string
 *                 description: Nomor telepon siswa
 *                 example: 08123456789
 *               foto:
 *                 type: string
 *                 format: binary
 *                 description: Foto siswa (opsional)
 *               email:
 *                 type: string
 *                 description: Email baru siswa (opsional)
 *                 example: johndoe_updated@example.com
 *               password:
 *                 type: string
 *                 description: Password baru siswa (opsional)
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Siswa updated successfully
 *       404:
 *         description: Siswa not found
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", authMiddleware, upload.single("foto"), updateSiswa);

/**
 * @swagger
 * /siswa/{id}:
 *   delete:
 *     summary: Delete a siswa by ID
 *     tags: [Siswa]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Siswa ID
 *     responses:
 *       200:
 *         description: Siswa deleted successfully
 *       404:
 *         description: Siswa not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", authMiddleware, deleteSiswa);

export default router;
