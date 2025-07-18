import * as dashboardService from "../services/dashboardService.js";

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
export const getDashboardStats = async (req, res) => {
  try {
    const stats = await dashboardService.getDashboardStats();
    return res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error("Error getting dashboard stats:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMonthlyAttendanceReport = async (req, res) => {
  try {
    const { year, month } = req.query;
    const report = await dashboardService.getMonthlyAttendanceReport(
      year,
      month
    );
    return res.status(200).json({ success: true, data: report });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getTeacherDashboardStats = async (req, res) => {
  try {
    const { guru_id } = req.query;
    if (!guru_id)
      return res
        .status(400)
        .json({ success: false, message: "guru_id is required" });
    const stats = await dashboardService.getTeacherDashboardStats(guru_id);
    return res.status(200).json({ success: true, data: stats });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getTeacherMonthlyAttendance = async (req, res) => {
  try {
    const { guru_id, kelas_id, year, month } = req.query;
    if (!guru_id || !kelas_id || !year || !month) {
      return res.status(400).json({
        success: false,
        message: "guru_id, kelas_id, year, and month are required",
      });
    }
    const report = await dashboardService.getTeacherMonthlyAttendance(
      guru_id,
      kelas_id,
      year,
      month
    );
    return res.status(200).json({ success: true, data: report });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getLatestAttendance = async (req, res) => {
  try {
    const latestAttendance = await dashboardService.getLatestAttendance();
    return res.status(200).json({ success: true, data: latestAttendance });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
