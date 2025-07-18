import app from "./app.js";
import { connectDB } from "./config/dbConnection.js";
import { createAdminIfNotExists } from "./utils/seedAdmin.js";
import { seedUserLevels } from "./utils/seedUserLevels.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;

// Pastikan folder uploads tersedia
const ensureUploadsDirectory = () => {
  const uploadsDir = path.join(__dirname, "../uploads");

  try {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true, mode: 0o755 });
      console.log(`📁 Created uploads directory: ${uploadsDir}`);
    }

    try {
      fs.accessSync(uploadsDir, fs.constants.W_OK);
      console.log(`✅ Uploads directory is writable: ${uploadsDir}`);
    } catch (err) {
      console.warn(`⚠️ Uploads directory not writable: ${uploadsDir}`);
      try {
        fs.chmodSync(uploadsDir, 0o755);
        console.log(`🔧 Fixed permissions for uploads directory`);
      } catch (chmodErr) {
        console.warn(`❌ Failed to fix permissions: ${chmodErr.message}`);
      }
    }
  } catch (err) {
    console.warn(`⚠️ Failed to prepare uploads directory: ${err.message}`);
  }
};

// Jalankan server
const startServer = async () => {
  try {
    ensureUploadsDirectory();

    console.log("🔌 Connecting to the database...");
    await connectDB();
    console.log("✅ Database connected successfully.");

    console.log("🌱 Seeding user levels...");
    await seedUserLevels();

    console.log("🌱 Creating default admin if not exists...");
    await createAdminIfNotExists();

    const models = (await import("./models/index.js")).default;
    console.log("📦 Loaded Models:", Object.keys(models));

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📁 Upload path: ${path.join(__dirname, "../uploads")}`);
    });

  } catch (error) {
    console.error("❌ Server startup error:", error);
    process.exit(1); // Wajib untuk Railway agar tahu proses gagal
  }
};

startServer();
