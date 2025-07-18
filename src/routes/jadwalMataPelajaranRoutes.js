import express from "express";
import * as jadwalMataPelajaranController from "../controllers/jadwalMataPelajaranController.js";
import Jadwal from "../models/Jadwal.js";
import MataPelajaran from "../models/MataPelajaran.js";
import * as jadwalService from "../services/jadwalService.js";
import * as mataPelajaranService from "../services/mataPelajaranService.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Dependency injection
const jadwalServiceObj = {
  createJadwal: (data) => jadwalService.createJadwal(Jadwal, data),
  getAllJadwal: () => jadwalService.getAllJadwal(Jadwal),
  getJadwalById: (id) => jadwalService.getJadwalById(Jadwal, id),
  getJadwalByKelasId: (kelas_id) =>
    jadwalService.getJadwalByKelasId(Jadwal, kelas_id),
  updateJadwal: (id, data) => jadwalService.updateJadwal(Jadwal, id, data),
  deleteJadwal: (id) => jadwalService.deleteJadwal(Jadwal, id),
};
const mataPelajaranServiceObj = {
  createMataPelajaran: (data) =>
    mataPelajaranService.createMataPelajaran(MataPelajaran, data),
  getMataPelajaranById: (id) =>
    mataPelajaranService.getMataPelajaranById(MataPelajaran, id),
  updateMataPelajaran: (id, data) =>
    mataPelajaranService.updateMataPelajaran(MataPelajaran, id, data),
  deleteMataPelajaran: (id) =>
    mataPelajaranService.deleteMataPelajaran(MataPelajaran, id),
};

/**
 * @swagger
 * tags:
 *   name: JadwalMataPelajaran
 *   description: API endpoints for managing Jadwal and Mata Pelajaran relations
 */

/**
 * @swagger
 * /jadwal-mata-pelajaran:
 *   post:
 *     summary: Create a new Jadwal with Mata Pelajaran
 *     tags: [JadwalMataPelajaran]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jadwalData:
 *                 type: object
 *                 description: Data for Jadwal
 *                 properties:
 *                   kelas_id:
 *                     type: integer
 *                     description: ID of the associated Kelas
 *                     example: 1
 *                   guru_id:
 *                     type: integer
 *                     description: ID of the associated Guru
 *                     example: 2
 *                   tahun_ajaran_id:
 *                     type: integer
 *                     description: ID of the associated Tahun Ajaran
 *                     example: 3
 *                   hari:
 *                     type: string
 *                     enum: [Senin, Selasa, Rabu, Kamis, Jumat, Sabtu]
 *                     description: Day of the schedule
 *                     example: Senin
 *                   jam_mulai:
 *                     type: string
 *                     format: time
 *                     description: Start time
 *                     example: "08:00:00"
 *                   jam_selesai:
 *                     type: string
 *                     format: time
 *                     description: End time
 *                     example: "10:00:00"
 *
 *               mataPelajaranData:
 *                 type: object
 *                 description: Data for Mata Pelajaran
 *                 properties:
 *                   nama_mapel:
 *                     type: string
 *                     description: The name of the Mata Pelajaran
 *                     example: Matematika
 *                   deskripsi:
 *                     type: string
 *                     description: Description of the Mata Pelajaran
 *                     example: Pelajaran Matematika untuk kelas 10
 *                   guru_id:
 *                     type: integer
 *                     description: ID of the associated Guru
 *                     example: 2
 *                   jenjang_id:
 *                     type: integer
 *                     description: ID of the associated Jenjang Pendidikan
 *                     example: 1
 *     responses:
 *       201:
 *         description: Jadwal with Mata Pelajaran created successfully.
 *       400:
 *         description: Validation error.
 *       500:
 *         description: Internal server error.
 */
router.post(
  "/",
  authMiddleware,
  jadwalMataPelajaranController.createJadwalWithMataPelajaran(
    jadwalServiceObj,
    mataPelajaranServiceObj
  )
);

/**
 * @swagger
 * /jadwal-mata-pelajaran:
 *   get:
 *     summary: Retrieve all Jadwal with Mata Pelajaran
 *     tags: [JadwalMataPelajaran]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of Jadwal with Mata Pelajaran.
 *       500:
 *         description: Internal server error.
 */
router.get(
  "/",
  authMiddleware,
  jadwalMataPelajaranController.getJadwalWithMataPelajaran(jadwalServiceObj)
);

/**
 * @swagger
 * /jadwal-mata-pelajaran/{id}:
 *   put:
 *     summary: Update a Jadwal with Mata Pelajaran
 *     tags: [JadwalMataPelajaran]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the Jadwal to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jadwalData:
 *                 type: object
 *                 description: Data for Jadwal
 *                 properties:
 *                   kelas_id:
 *                     type: integer
 *                     description: ID of the associated Kelas
 *                     example: 1
 *                   guru_id:
 *                     type: integer
 *                     description: ID of the associated Guru
 *                     example: 2
 *                   tahun_ajaran_id:
 *                     type: integer
 *                     description: ID of the associated Tahun Ajaran
 *                     example: 3
 *                   hari:
 *                     type: string
 *                     enum: [Senin, Selasa, Rabu, Kamis, Jumat, Sabtu]
 *                     description: Day of the schedule
 *                     example: Senin
 *                   jam_mulai:
 *                     type: string
 *                     format: time
 *                     description: Start time
 *                     example: "08:00:00"
 *                   jam_selesai:
 *                     type: string
 *                     format: time
 *                     description: End time
 *                     example: "10:00:00"
 *
 *               mataPelajaranData:
 *                 type: object
 *                 description: Data for Mata Pelajaran
 *                 properties:
 *                   nama_mapel:
 *                     type: string
 *                     description: The name of the Mata Pelajaran
 *                     example: Matematika
 *                   deskripsi:
 *                     type: string
 *                     description: Description of the Mata Pelajaran
 *                     example: Pelajaran Matematika untuk kelas 10
 *                   guru_id:
 *                     type: integer
 *                     description: ID of the associated Guru
 *                     example: 2
 *                   jenjang_id:
 *                     type: integer
 *                     description: ID of the associated Jenjang Pendidikan
 *                     example: 1
 *     responses:
 *       200:
 *         description: Jadwal with Mata Pelajaran updated successfully.
 *       404:
 *         description: Jadwal or Mata Pelajaran not found.
 *       500:
 *         description: Internal server error.
 */
router.put(
  "/:id",
  authMiddleware,
  jadwalMataPelajaranController.updateJadwalWithMataPelajaran(
    jadwalServiceObj,
    mataPelajaranServiceObj
  )
);

/**
 * @swagger
 * /jadwal-mata-pelajaran/{id}:
 *   delete:
 *     summary: Delete a Jadwal with Mata Pelajaran
 *     tags: [JadwalMataPelajaran]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the Jadwal to delete
 *     responses:
 *       200:
 *         description: Jadwal with Mata Pelajaran deleted successfully.
 *       404:
 *         description: Jadwal not found.
 *       500:
 *         description: Internal server error.
 */
router.delete(
  "/:id",
  authMiddleware,
  jadwalMataPelajaranController.deleteJadwalWithMataPelajaran(
    jadwalServiceObj,
    mataPelajaranServiceObj
  )
);

/**
 * @swagger
 * /jadwal-mata-pelajaran/{id}:
 *   get:
 *     summary: Retrieve a specific Jadwal with Mata Pelajaran by ID
 *     tags: [JadwalMataPelajaran]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the Jadwal to retrieve
 *     responses:
 *       200:
 *         description: Jadwal with Mata Pelajaran retrieved successfully.
 *       404:
 *         description: Jadwal not found.
 *       500:
 *         description: Internal server error.
 */
router.get(
  "/:id",
  authMiddleware,
  jadwalMataPelajaranController.getJadwalWithMataPelajaranById(jadwalServiceObj)
);

/**
 * @swagger
 * /jadwal-mata-pelajaran/kelas/{kelas_id}:
 *   get:
 *     summary: Retrieve Jadwal with Mata Pelajaran by kelas_id
 *     tags: [JadwalMataPelajaran]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: kelas_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the Kelas to retrieve Jadwal for
 *     responses:
 *       200:
 *         description: Jadwal with Mata Pelajaran retrieved successfully.
 *       400:
 *         description: kelas_id is required.
 *       500:
 *         description: Internal server error.
 */
router.get(
  "/kelas/:kelas_id",
  authMiddleware,
  jadwalMataPelajaranController.getJadwalWithMataPelajaranByKelasId(
    jadwalServiceObj
  )
);

export default router;
