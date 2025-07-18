import express from "express";
import * as mataPelajaranController from "../controllers/mataPelajaranController.js";
import MataPelajaran from "../models/MataPelajaran.js";
import * as mataPelajaranService from "../services/mataPelajaranService.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

const mataPelajaranServiceObj = {
  createMataPelajaran: (data) =>
    mataPelajaranService.createMataPelajaran(MataPelajaran, data),
  getAllMataPelajaran: () =>
    mataPelajaranService.getAllMataPelajaran(MataPelajaran),
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
 *   name: MataPelajaran
 *   description: API endpoints for managing Mata Pelajaran
 */

/**
 * @swagger
 * /mata-pelajaran:
 *   post:
 *     summary: Create a new Mata Pelajaran
 *     tags: [MataPelajaran]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama_mapel:
 *                 type: string
 *                 description: The name of the Mata Pelajaran
 *                 example: Matematika
 *               deskripsi:
 *                 type: string
 *                 description: Description of the Mata Pelajaran
 *                 example: Pelajaran Matematika untuk kelas 10
 *               guru_id:
 *                 type: integer
 *                 description: ID of the associated Guru
 *                 example: 1
 *               jenjang_id:
 *                 type: integer
 *                 description: ID of the associated Jenjang Pendidikan
 *                 example: 2
 *     responses:
 *       201:
 *         description: Mata Pelajaran created successfully.
 *       400:
 *         description: Validation error.
 *       500:
 *         description: Internal server error.
 */
router.post(
  "/",
  authMiddleware,
  mataPelajaranController.createMataPelajaran(mataPelajaranServiceObj)
);

/**
 * @swagger
 * /mata-pelajaran:
 *   get:
 *     summary: Retrieve all Mata Pelajaran
 *     tags: [MataPelajaran]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of Mata Pelajaran.
 *       500:
 *         description: Internal server error.
 */
router.get(
  "/",
  authMiddleware,
  mataPelajaranController.getAllMataPelajaran(mataPelajaranServiceObj)
);

/**
 * @swagger
 * /mata-pelajaran/{id}:
 *   get:
 *     summary: Retrieve a Mata Pelajaran by ID
 *     tags: [MataPelajaran]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The Mata Pelajaran ID
 *     responses:
 *       200:
 *         description: Mata Pelajaran retrieved successfully.
 *       404:
 *         description: Mata Pelajaran not found.
 *       500:
 *         description: Internal server error.
 */
router.get(
  "/:id",
  authMiddleware,
  mataPelajaranController.getMataPelajaranById(mataPelajaranServiceObj)
);

/**
 * @swagger
 * /mata-pelajaran/{id}:
 *   put:
 *     summary: Update a Mata Pelajaran
 *     tags: [MataPelajaran]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The Mata Pelajaran ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama_mapel:
 *                 type: string
 *                 description: The name of the Mata Pelajaran
 *                 example: Matematika
 *               deskripsi:
 *                 type: string
 *                 description: Description of the Mata Pelajaran
 *                 example: Pelajaran Matematika untuk kelas 10
 *               guru_id:
 *                 type: integer
 *                 description: ID of the associated Guru
 *                 example: 1
 *               jenjang_id:
 *                 type: integer
 *                 description: ID of the associated Jenjang Pendidikan
 *                 example: 2
 *     responses:
 *       200:
 *         description: Mata Pelajaran updated successfully.
 *       404:
 *         description: Mata Pelajaran not found.
 *       500:
 *         description: Internal server error.
 */
router.put(
  "/:id",
  authMiddleware,
  mataPelajaranController.updateMataPelajaran(mataPelajaranServiceObj)
);

/**
 * @swagger
 * /mata-pelajaran/{id}:
 *   delete:
 *     summary: Delete a Mata Pelajaran
 *     tags: [MataPelajaran]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The Mata Pelajaran ID
 *     responses:
 *       200:
 *         description: Mata Pelajaran deleted successfully.
 *       404:
 *         description: Mata Pelajaran not found.
 *       500:
 *         description: Internal server error.
 */
router.delete(
  "/:id",
  authMiddleware,
  mataPelajaranController.deleteMataPelajaran(mataPelajaranServiceObj)
);

export default router;
