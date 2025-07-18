import * as userService from "../services/userService.js";
import jwt from "jsonwebtoken";
import md5 from "md5";

export const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve users",
      data: null,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve user",
      data: null,
    });
  }
};

export const createUser = async (req, res) => {
  const { username, password, nama_lengkap, email, no_telepon } = req.body;
  try {
    const hashedPassword = md5(password);
    const user = await userService.createUser({
      username,
      password: hashedPassword,
      nama_lengkap,
      email,
      no_telepon,
      user_level_id: 1,
    });
    res.status(201).json({
      success: true,
      message: "Administrator created successfully",
      data: user,
    });
  } catch (error) {
    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      const messages = error.errors.map((e) => ({
        field: e.path,
        message: e.message,
      }));
      return res.status(400).json({
        success: false,
        message: "Validation error",
        data: messages,
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to create administrator",
      data: null,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.status(401).json({
        success: false,
        message: "Token required",
        data: null,
      });
    jwt.verify(token, process.env.JWT_SECRET);
    const { password, ...otherData } = req.body;
    const updatedData = password
      ? { ...otherData, password: md5(password) }
      : otherData;
    const user = await userService.updateUser(req.params.id, updatedData);
    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update user",
      data: null,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.status(401).json({
        success: false,
        message: "Token required",
        data: null,
      });
    jwt.verify(token, process.env.JWT_SECRET);
    const result = await userService.deleteUser(req.params.id);
    if (!result)
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      data: null,
    });
  }
};

export const loginUser = async (req, res) => {
  const { identifier, password } = req.body;
  try {
    const hashedPassword = md5(password);
    const user = await userService.findUserByIdentifier(identifier);
    if (!user || user.password !== hashedPassword) {
      console.error("Login failed: Invalid identifier or password");
      return res.status(401).json({
        success: false,
        message: "Invalid identifier or password",
        data: null,
      });
    }
    const token = jwt.sign(
      { id: user.id, user_level_id: user.user_level_id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        identifier,
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({
      success: false,
      message: "An error occurred during login",
      data: null,
    });
  }
};

export const getUsersByUserLevel = async (req, res) => {
  try {
    const user_level_id = 1;
    const users = await userService.getUsersByUserLevel(user_level_id);
    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found for user_level_id 1",
      });
    }
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve users by user_level",
      error: error.message,
    });
  }
};
