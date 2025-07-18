// utils/seedAdmin.js
import md5 from "md5";
import User from "../models/User.js";

export async function createAdminIfNotExists() {
  const existing = await User.findOne({
    where: { username: "admin" },
  });

  if (!existing) {
    await User.create({
      username: "admin",
      password: md5("admin123"), // default password
      nama_lengkap: "Administrator",
      email: "admin@example.com",
      no_telepon: "081234567890",
      user_level_id: 1, // pastikan 1 = admin
    });
    console.log("✅ Admin berhasil dibuat (username: admin)");
  } else {
    console.log("ℹ️ Admin sudah ada, tidak dibuat ulang.");
  }
}
