import UserLevel from "../models/UserLevel.js";

export const getAllUserLevels = async () => UserLevel.findAll();

export const getUserLevelById = async (id) => UserLevel.findByPk(id);

export const createUserLevel = async (data) => UserLevel.create(data);

export const updateUserLevel = async (id, data) => {
  const userLevel = await UserLevel.findByPk(id);
  if (!userLevel) return null;
  return userLevel.update(data);
};

export const deleteUserLevel = async (id) => {
  const userLevel = await UserLevel.findByPk(id);
  if (!userLevel) return null;
  await userLevel.destroy();
  return true;
};
