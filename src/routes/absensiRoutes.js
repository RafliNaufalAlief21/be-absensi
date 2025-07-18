import express from "express";
import absensiController from "../controllers/absensiController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /absensi/scan:
 *   post:
 *     summary: Scan barcode for attendance
 *     tags: [Absensi]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               barcode:
 *                 type: string
 *                 description: Barcode ID siswa
 *               type:
 *                 type: string
 *                 enum: [masuk, pulang]
 *                 description: Jenis absensi
 *               jadwal_id:
 *                 type: integer
 *                 description: ID jadwal
 *     responses:
 *       201:
 *         description: Absensi berhasil dicatat
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
 *                   example: "Absensi berhasil dicatat"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     siswa_id:
 *                       type: integer
 *                       example: 101
 *                     jadwal_id:
 *                       type: integer
 *                       example: 11
 *                     kelas_id:
 *                       type: integer
 *                       example: 5
 *                     tanggal_absensi:
 *                       type: string
 *                       format: date
 *                       example: "2025-04-13"
 *                     waktu_masuk:
 *                       type: string
 *                       format: time
 *                       example: "09:00:00"
 *                     waktu_keluar:
 *                       type: string
 *                       format: time
 *                       example: "17:00:00"
 *                     status:
 *                       type: string
 *                       enum: [Hadir, Izin, Sakit, Tidak Hadir]
 *                       example: "Hadir"
 *                     keterangan:
 *                       type: string
 *                       example: "Tepat Waktu"
 *       400:
 *         description: Data tidak valid
 *       404:
 *         description: Siswa atau jadwal tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan server
 */
router.post("/scan", authMiddleware, absensiController.scanBarcode);

/**
 * @swagger
 * /absensi/by-id:
 *   get:
 *     summary: Get absensi by ID
 *     tags: [Absensi]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID absensi
 *     responses:
 *       200:
 *         description: Data absensi berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Absensi'
 *       404:
 *         description: Absensi tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan server
 */
router.get("/by-id", authMiddleware, absensiController.getAbsensi);

/**
 * @swagger
 * /absensi/{id}:
 *   put:
 *     summary: Update absensi by ID
 *     tags: [Absensi]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID absensi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Absensi'
 *     responses:
 *       200:
 *         description: Absensi berhasil diperbarui
 *       404:
 *         description: Absensi tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan server
 */
router.put("/:id", authMiddleware, absensiController.updateAbsensi);

/**
 * @swagger
 * /absensi/{id}:
 *   delete:
 *     summary: Delete absensi by ID
 *     tags: [Absensi]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID absensi
 *     responses:
 *       200:
 *         description: Absensi berhasil dihapus
 *       404:
 *         description: Absensi tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan server
 */
router.delete("/:id", authMiddleware, absensiController.deleteAbsensi);

/**
 * @swagger
 * /absensi/mark:
 *   post:
 *     summary: Mark attendance as Izin or Sakit
 *     tags: [Absensi]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               barcode:
 *                 type: string
 *                 description: Barcode ID siswa
 *               jadwal_id:
 *                 type: integer
 *                 description: ID jadwal
 *               status:
 *                 type: string
 *                 enum: [Izin, Sakit]
 *                 description: Status absensi
 *     responses:
 *       201:
 *         description: Absensi berhasil dicatat
 *       400:
 *         description: Data tidak valid
 *       404:
 *         description: Siswa atau jadwal tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan server
 */
router.post("/mark", authMiddleware, absensiController.markAttendance);

/**
 * @swagger
 * /absensi/by-id:
 *   get:
 *     summary: Get absensi by ID
 *     tags: [Absensi]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID absensi
 *     responses:
 *       200:
 *         description: Data absensi berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Absensi'
 *       404:
 *         description: Absensi tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan server
 */
router.get("/by-id", authMiddleware, absensiController.getAbsensi);

/**
 * @swagger
 * /absensi/{id}:
 *   put:
 *     summary: Update absensi by ID
 *     tags: [Absensi]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID absensi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Absensi'
 *     responses:
 *       200:
 *         description: Absensi berhasil diperbarui
 *       404:
 *         description: Absensi tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan server
 */
router.put("/:id", authMiddleware, absensiController.updateAbsensi);

/**
 * @swagger
 * /absensi/{id}:
 *   delete:
 *     summary: Delete absensi by ID
 *     tags: [Absensi]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID absensi
 *     responses:
 *       200:
 *         description: Absensi berhasil dihapus
 *       404:
 *         description: Absensi tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan server
 */
router.delete("/:id", authMiddleware, absensiController.deleteAbsensi);

/**
 * @swagger
 * /absensi/mark:
 *   post:
 *     summary: Mark attendance as Izin or Sakit
 *     tags: [Absensi]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               barcode:
 *                 type: string
 *                 description: Barcode ID siswa
 *               jadwal_id:
 *                 type: integer
 *                 description: ID jadwal
 *               status:
 *                 type: string
 *                 enum: [Izin, Sakit]
 *                 description: Status absensi
 *     responses:
 *       201:
 *         description: Absensi berhasil dicatat
 *       400:
 *         description: Data tidak valid
 *       404:
 *         description: Siswa atau jadwal tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan server
 */
router.post("/mark", authMiddleware, absensiController.markAttendance);

/**
 * @swagger
 * /absensi/by-kelas-filter:
 *   get:
 *     summary: Get filtered absensi by kelas ID
 *     tags: [Absensi]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: kelas_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID kelas
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [Hadir, Izin, Sakit, Tidak Hadir]
 *         description: Filter by status (optional)
 *       - in: query
 *         name: tanggal_mulai
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by start date (optional)
 *       - in: query
 *         name: tanggal_selesai
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by end date (optional)
 *     responses:
 *       200:
 *         description: Filtered absensi data successfully retrieved
 *       400:
 *         description: Parameter tidak valid
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan server
 */
router.get("/by-kelas-filter", authMiddleware, async (req, res) => {
  const { kelas_id, status, tanggal_mulai, tanggal_selesai } = req.query;

  // Validasi parameter kelas_id
  if (!kelas_id || isNaN(parseInt(kelas_id))) {
    return res.status(400).json({
      success: false,
      message: "Parameter kelas_id harus berupa angka dan tidak boleh kosong",
    });
  }

  // Validasi dan format tanggal_mulai dan tanggal_selesai jika diberikan
  let formattedTanggalMulai = null;
  let formattedTanggalSelesai = null;

  if (tanggal_mulai) {
    const parsedTanggalMulai = new Date(tanggal_mulai);
    if (isNaN(parsedTanggalMulai.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Parameter tanggal_mulai harus berupa tanggal yang valid",
      });
    }
    formattedTanggalMulai =
      parsedTanggalMulai.toISOString().split("T")[0] + " 00:00:00";
  }

  if (tanggal_selesai) {
    const parsedTanggalSelesai = new Date(tanggal_selesai);
    if (isNaN(parsedTanggalSelesai.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Parameter tanggal_selesai harus berupa tanggal yang valid",
      });
    }
    formattedTanggalSelesai =
      parsedTanggalSelesai.toISOString().split("T")[0] + " 23:59:59";
  }

  try {
    // Panggil controller untuk mendapatkan data yang difilter
    const result = await absensiController.getFilteredAbsensiByKelas(
      req,
      res,
      formattedTanggalMulai,
      formattedTanggalSelesai
    );

    // Debug log untuk memastikan hasil tidak undefined
    if (!result || !result.data) {
      console.error("Filtered Absensi Data: Result is undefined or empty");
    } else {
      console.log(
        "Filtered Absensi Data:",
        JSON.stringify(result.data, null, 2)
      );
    }
  } catch (error) {
    console.error("Error in /by-kelas-filter route:", error.message);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat memproses permintaan",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /absensi:
 *   get:
 *     summary: Get all absensi data
 *     tags: [Absensi]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data absensi berhasil diambil
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
 *                   example: "Data absensi berhasil diambil"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       siswa_id:
 *                         type: integer
 *                         example: 101
 *                       jadwal_id:
 *                         type: integer
 *                         example: 11
 *                       kelas_id:
 *                         type: integer
 *                         example: 5
 *                       tanggal_absensi:
 *                         type: string
 *                         format: date
 *                         example: "2025-04-13"
 *                       waktu_masuk:
 *                         type: string
 *                         format: time
 *                         example: "09:00:00"
 *                       waktu_keluar:
 *                         type: string
 *                         format: time
 *                         example: "17:00:00"
 *                       status:
 *                         type: string
 *                         enum: [Hadir, Izin, Sakit, Tidak Hadir]
 *                         example: "Hadir"
 *                       keterangan:
 *                         type: string
 *                         example: "Tepat Waktu"
 *       500:
 *         description: Terjadi kesalahan server
 */
router.get("/", authMiddleware, (req, res) =>
  absensiController.getAllAbsensi(req, res)
);

/**
 * @swagger
 * /absensi/summary-by-jadwal:
 *   get:
 *     summary: Get absensi summary by jadwal ID
 *     tags: [Absensi]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: jadwal_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID jadwal
 *     responses:
 *       200:
 *         description: Data absensi berhasil diambil
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
 *                   example: "Data absensi berhasil diambil"
 *                 data:
 *                   type: object
 *                   properties:
 *                     mataPelajaran:
 *                       type: string
 *                       example: "Matematika"
 *                     kelas:
 *                       type: string
 *                       example: "Kelas A"
 *                     guru:
 *                       type: string
 *                       example: "John Doe"
 *                     hari:
 *                       type: string
 *                       example: "Senin"
 *                     jam_mulai:
 *                       type: string
 *                       example: "08:00:00"
 *                     jam_selesai:
 *                       type: string
 *                       example: "09:30:00"
 *                     siswa:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           nama_siswa:
 *                             type: string
 *                             example: "Jane Doe"
 *                           status:
 *                             type: string
 *                             example: "Sudah Absen"
 *       400:
 *         description: Parameter tidak valid
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan server
 */
router.get("/summary-by-jadwal", authMiddleware, (req, res) =>
  absensiController.getAbsensiSummaryByJadwal(req, res)
);

/**
 * @swagger
 * /absensi/all:
 *   get:
 *     summary: Get all absensi data grouped by kelas
 *     tags: [Absensi]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data absensi berhasil diambil
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
 *                   example: "Data absensi berhasil diambil"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       kelas:
 *                         type: string
 *                         example: "Kelas A"
 *                       jadwal:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 1
 *                             mataPelajaran:
 *                               type: string
 *                               example: "Matematika"
 *                             guru:
 *                               type: string
 *                               example: "John Doe"
 *                             hari:
 *                               type: string
 *                               example: "Senin"
 *                             jam_mulai:
 *                               type: string
 *                               example: "08:00:00"
 *                             jam_selesai:
 *                               type: string
 *                               example: "09:30:00"
 *                       siswa:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 1
 *                             nama_siswa:
 *                               type: string
 *                               example: "Jane Doe"
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan server
 */
router.get("/all", authMiddleware, (req, res) =>
  absensiController.getAllAbsensiWithDetails(req, res)
);

/**
 * @swagger
 * /absensi/jadwal:
 *   get:
 *     summary: Get jadwal and siswa by kelas ID
 *     tags: [Absensi]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: kelas_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID kelas
 *     responses:
 *       200:
 *         description: Data jadwal dan siswa berhasil diambil
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
 *                   example: "Data jadwal dan siswa berhasil diambil"
 *                 data:
 *                   type: object
 *                   properties:
 *                     jadwal:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           mataPelajaran:
 *                             type: string
 *                             example: "Matematika"
 *                           guru:
 *                             type: string
 *                             example: "John Doe"
 *                           hari:
 *                             type: string
 *                             example: "Senin"
 *                           jam_mulai:
 *                             type: string
 *                             example: "08:00:00"
 *                           jam_selesai:
 *                             type: string
 *                             example: "09:30:00"
 *                     siswa:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           nama_siswa:
 *                             type: string
 *                             example: "Jane Doe"
 *       400:
 *         description: Parameter tidak valid
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan server
 */
router.get("/jadwal", authMiddleware, (req, res) =>
  absensiController.getJadwalWithSiswaByKelas(req, res)
);

/**
 * @swagger
 * /absensi/{id}:
 *   get:
 *     summary: Get absensi details by ID
 *     tags: [Absensi]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID absensi
 *     responses:
 *       200:
 *         description: Data absensi berhasil diambil
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
 *                   example: "Data absensi berhasil diambil"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     tanggal_absensi:
 *                       type: string
 *                       format: date
 *                       example: "2023-10-01"
 *                     waktu_masuk:
 *                       type: string
 *                       format: time
 *                       example: "08:00:00"
 *                     waktu_keluar:
 *                       type: string
 *                       format: time
 *                       example: "09:30:00"
 *                     status:
 *                       type: string
 *                       example: "Hadir"
 *                     keterangan:
 *                       type: string
 *                       example: "Tepat Waktu"
 *                     siswa:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 101
 *                         nama_siswa:
 *                           type: string
 *                           example: "Jane Doe"
 *                         nis:
 *                           type: string
 *                           example: "123456"
 *                     jadwal:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 11
 *                         hari:
 *                           type: string
 *                           example: "Senin"
 *                         jam_mulai:
 *                           type: string
 *                           example: "08:00:00"
 *                         jam_selesai:
 *                           type: string
 *                           example: "09:30:00"
 *                         mataPelajaran:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 201
 *                             nama_mapel:
 *                               type: string
 *                               example: "Matematika"
 *                         guru:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 301
 *                             nama_guru:
 *                               type: string
 *                               example: "John Doe"
 *                     kelas:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 5
 *                         nama_kelas:
 *                           type: string
 *                           example: "Kelas A"
 *       404:
 *         description: Absensi tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan server
 */
router.get("/:id", authMiddleware, (req, res) =>
  absensiController.getAbsensi(req, res)
);

/**
 * @swagger
 * /absensi/by-mapel:
 *   get:
 *     summary: Get absensi data grouped by mata pelajaran
 *     tags: [Absensi]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: mapel_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID mata pelajaran
 *     responses:
 *       200:
 *         description: Data absensi berdasarkan mata pelajaran berhasil diambil
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
 *                   example: "Data absensi berdasarkan mata pelajaran berhasil diambil"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       tanggal_absensi:
 *                         type: string
 *                         format: date
 *                         example: "2023-10-01"
 *                       waktu_masuk:
 *                         type: string
 *                         format: time
 *                         example: "08:00:00"
 *                       waktu_keluar:
 *                         type: string
 *                         format: time
 *                         example: "09:30:00"
 *                       status:
 *                         type: string
 *                         example: "Hadir"
 *                       keterangan:
 *                         type: string
 *                         example: "Tepat Waktu"
 *                       siswa:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 101
 *                           nama_siswa:
 *                             type: string
 *                             example: "Jane Doe"
 *                           nis:
 *                             type: string
 *                             example: "123456"
 *                       kelas:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 5
 *                           nama_kelas:
 *                             type: string
 *                             example: "Kelas A"
 *                       jadwal:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 11
 *                           hari:
 *                             type: string
 *                             example: "Senin"
 *                           jam_mulai:
 *                             type: string
 *                             example: "08:00:00"
 *                           jam_selesai:
 *                             type: string
 *                             example: "09:30:00"
 *                           mataPelajaran:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 201
 *                               nama_mapel:
 *                                 type: string
 *                                 example: "Matematika"
 *                           guru:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 301
 *                               nama_guru:
 *                                 type: string
 *                                 example: "John Doe"
 *       400:
 *         description: Parameter tidak valid
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan server
 */
router.get("/by-mapel", authMiddleware, (req, res) =>
  absensiController.getAbsensiByMataPelajaran(req, res)
);

/**
 * @swagger
 * /absensi/auto-process:
 *   post:
 *     summary: Process automatic absensi
 *     tags: [Absensi]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Absensi otomatis berhasil diproses
 *       500:
 *         description: Terjadi kesalahan server
 */
router.post("/auto-process", authMiddleware, async (req, res) => {
  try {
    await AbsensiService.processAutomaticAbsensi();
    res.status(200).json({
      success: true,
      message: "Absensi otomatis berhasil diproses",
    });
  } catch (error) {
    console.error("Error processing automatic absensi:", error.message);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat memproses absensi otomatis",
    });
  }
});

/**
 * @swagger
 * /absensi/by-guru/{guru_id}:
 *   get:
 *     summary: Get all attendance data by guru
 *     tags: [Absensi]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: guru_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID guru
 *     responses:
 *       200:
 *         description: Data absensi berdasarkan guru berhasil diambil
 *       400:
 *         description: Parameter tidak valid
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan server
 */
router.get("/by-guru/:guru_id", authMiddleware, (req, res) =>
  absensiController.getAllAttendanceByGuru(req, res)
);

/**
 * @swagger
 * /absensi/by-jadwal/{jadwal_id}:
 *   get:
 *     summary: Get absensi data by jadwal_id (khusus detail absensi per jadwal)
 *     tags: [Absensi]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jadwal_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID jadwal
 *     responses:
 *       200:
 *         description: Data absensi berhasil diambil
 *       400:
 *         description: Parameter tidak valid
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan server
 */
router.get("/by-jadwal/:jadwal_id", authMiddleware, (req, res) =>
  absensiController.getAbsensiByJadwalId(req, res)
);

export default router;
