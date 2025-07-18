import express from "express";
import * as authController from "../controllers/authController.js";
import * as authService from "../services/authService.js";
import User from "../models/User.js";
import jwtUtils from "../utils/jwtUtils.js";

const router = express.Router();

authController.setAuthService({
  login: (identifier, password) =>
    authService.login(User, jwtUtils, identifier, password),
  registerUser: (userData) =>
    authService.registerUser(User, jwtUtils, userData),
  findUserByEmail: (email) => authService.findUserByEmail(User, email),
  findUserById: (userId) => authService.findUserById(User, userId),
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login using email, username, nip (Guru), or nis (Siswa)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: Email, username, nip (for Guru), or nis (for Siswa)
 *                 example: admin1@example.com
 *               password:
 *                 type: string
 *                 description: The password of the user
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login successful
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
 *                   example: Login berhasil
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *                       description: JWT token
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Invalid identifier or password
 */
router.post("/login", authController.login);
// Jika ingin menambah register:
// router.post("/register", authController.register);

export default router;
