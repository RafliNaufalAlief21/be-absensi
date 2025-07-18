import express from "express";
import {
  getDashboardStats,
  getMonthlyAttendanceReport,
  getTeacherDashboardStats,
  getTeacherMonthlyAttendance,
  getLatestAttendance,
} from "../controllers/dashboardController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     description: Retrieve total students, teachers, subjects, and attendance statistics
 *     responses:
 *       200:
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalSiswa:
 *                       type: number
 *                     totalGuru:
 *                       type: number
 *                     totalMataPelajaran:
 *                       type: number
 *                     absensiStats:
 *                       type: object
 *                       properties:
 *                         total_absensi:
 *                           type: number
 *                         total_hadir:
 *                           type: number
 *                         total_izin:
 *                           type: number
 *                         total_sakit:
 *                           type: number
 *       500:
 *         description: Server error
 */
router.get("/stats", authMiddleware, getDashboardStats);

router.get("/monthly-attendance", authMiddleware, getMonthlyAttendanceReport);

router.get("/teacher-stats", authMiddleware, getTeacherDashboardStats);
router.get(
  "/teacher-monthly-attendance",
  authMiddleware,
  getTeacherMonthlyAttendance
);
router.get("/latest-attendance", authMiddleware, getLatestAttendance);

export default router;
