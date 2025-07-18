import express from "express";
import AttendanceController from "../controllers/attendanceController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();
const attendanceController = new AttendanceController();

router.post("/mark", authMiddleware, (req, res) =>
  attendanceController.markAttendance(req, res)
);

router.post("/scan", authMiddleware, (req, res) =>
  attendanceController.scanBarcode(req, res)
);

export default router;
