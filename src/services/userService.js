import { Op } from "sequelize";
import sequelize from "../config/config.js";
import Guru from "../models/Guru.js";
import User from "../models/User.js";
import Siswa from "../models/Siswa.js";
import UserLevel from "../models/UserLevel.js";

export async function getAllUsers() {
  return await User.findAll({
    include: ["userLevel"],
    order: [["created_at", "DESC"]],
  });
}

export async function getUserById(id) {
  return await User.findByPk(id, { include: ["userLevel"] });
}

export async function createUser(data) {
  return await User.create(data);
}

export async function updateUser(id, data) {
  const user = await User.findByPk(id);
  if (!user) return null;
  await user.update(data);
  return user;
}

export async function deleteUser(id) {
  const user = await User.findByPk(id);
  if (!user) return null;
  await user.destroy();
  return true;
}

export async function checkUserLevelExists(user_level_id) {
  const userLevel = await UserLevel.findByPk(user_level_id);
  return !!userLevel;
}

export async function createGuru(user_id, guruData) {
  return await Guru.create({ ...guruData, user_id });
}

export async function createSiswa(user_id, siswaData) {
  return await Siswa.create({ ...siswaData, user_id });
}

export async function createUserWithRelations(userData) {
  const {
    nama_lengkap,
    username,
    password,
    email,
    no_telepon,
    user_level_id,
    additionalData,
  } = userData;
  const transaction = await sequelize.transaction();
  try {
    const user = await User.create(
      {
        nama_lengkap,
        username,
        password,
        email,
        no_telepon,
        user_level_id,
      },
      { transaction }
    );
    if (user_level_id === 2) {
      if (!additionalData.nip || !additionalData.nama_guru) {
        throw new Error("NIP dan Nama Guru wajib diisi untuk Guru");
      }
      const relatedData = await Guru.create(
        {
          user_id: user.id,
          ...additionalData,
        },
        { transaction }
      );
      user.guru = relatedData;
    }
    await transaction.commit();
    return user;
  } catch (error) {
    await transaction.rollback();
    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      const messages = error.errors.map((e) => ({
        field: e.path,
        message: e.message,
      }));
      throw new Error(JSON.stringify({ validationErrors: messages }));
    }
    throw new Error(error.message);
  }
}

export async function findUserByIdentifier(identifier) {
  return await User.findOne({
    where: {
      [Op.or]: [
        { email: identifier },
        { username: identifier },
        { "$guru.nip$": identifier },
      ],
    },
    include: [{ model: Guru, as: "guru", attributes: ["nip"] }],
  });
}

export async function getUsersByUserLevel(user_level_id) {
  return await User.findAll({
    where: { user_level_id },
    include: [
      {
        model: UserLevel,
        as: "userLevel",
        attributes: ["id", "nama_level", "deskripsi"],
      },
    ],
    attributes: ["id", "username", "nama_lengkap", "email", "no_telepon"],
    order: [["created_at", "DESC"]],
  });
}
