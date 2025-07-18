import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  getUsersByUserLevel,
} from "../controllers/userController.js"; // Gunakan named imports
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for managing users
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/", authMiddleware, getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retrieve a single user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       200:
 *         description: A single user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found.
 */
router.get("/:id", authMiddleware, getUserById);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new administrator
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the administrator
 *                 example: admin1
 *               password:
 *                 type: string
 *                 description: The password of the administrator
 *                 example: admin123
 *               nama_lengkap:
 *                 type: string
 *                 description: The full name of the administrator
 *                 example: Admin One
 *               email:
 *                 type: string
 *                 description: The email of the administrator
 *                 example: admin1@example.com
 *               no_telepon:
 *                 type: string
 *                 description: The phone number of the administrator
 *                 example: 08123456789
 *     responses:
 *       201:
 *         description: Administrator created successfully.
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
 *                   example: Administrator created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: admin1
 *                     nama_lengkap:
 *                       type: string
 *                       example: Admin One
 *                     email:
 *                       type: string
 *                       example: admin1@example.com
 *                     no_telepon:
 *                       type: string
 *                       example: 08123456789
 *       400:
 *         description: Validation error.
 *       500:
 *         description: Failed to create administrator.
 */
router.post("/", authMiddleware, createUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update an existing user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user
 *               password:
 *                 type: string
 *                 description: The password of the user (will be hashed using MD5)
 *               nama_lengkap:
 *                 type: string
 *                 description: The full name of the user
 *               email:
 *                 type: string
 *                 description: The email of the user
 *               no_telepon:
 *                 type: string
 *                 description: The phone number of the user
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       404:
 *         description: User not found.
 *       400:
 *         description: Failed to update user.
 */
router.put("/:id", authMiddleware, updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       404:
 *         description: User not found.
 */
router.delete("/:id", authMiddleware, deleteUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
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
 *         description: Login successful.
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
 *                   example: Login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     identifier:
 *                       type: string
 *                       example: admin1@example.com
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Invalid identifier or password.
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /users/level/{user_level_id}:
 *   get:
 *     summary: Retrieve users by user level
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_level_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user level ID
 *     responses:
 *       200:
 *         description: A list of users for the specified user level.
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
 *                   username:
 *                     type: string
 *                     example: admin1
 *                   nama_lengkap:
 *                     type: string
 *                     example: Admin One
 *                   email:
 *                     type: string
 *                     example: admin1@example.com
 *                   no_telepon:
 *                     type: string
 *                     example: 08123456789
 *                   userLevel:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       nama_level:
 *                         type: string
 *                         example: Administrator
 *                       deskripsi:
 *                         type: string
 *                         example: User with full access
 *       404:
 *         description: No users found for the specified user level.
 *       400:
 *         description: Invalid user_level_id.
 *       500:
 *         description: Internal server error.
 */
router.get("/level/:user_level_id", authMiddleware, getUsersByUserLevel);

/**
 * @swagger
 * /users/level/1:
 *   get:
 *     summary: Retrieve users with user_level_id 1 (Administrator)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users with user_level_id 1.
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
 *                   username:
 *                     type: string
 *                     example: admin1
 *                   nama_lengkap:
 *                     type: string
 *                     example: Admin One
 *                   email:
 *                     type: string
 *                     example: admin1@example.com
 *                   no_telepon:
 *                     type: string
 *                     example: 08123456789
 *                   userLevel:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       nama_level:
 *                         type: string
 *                         example: Administrator
 *                       deskripsi:
 *                         type: string
 *                         example: User with full access
 *       404:
 *         description: No users found for user_level_id 1.
 *       500:
 *         description: Internal server error.
 */
router.get("/level/1", authMiddleware, getUsersByUserLevel);

export default router;
