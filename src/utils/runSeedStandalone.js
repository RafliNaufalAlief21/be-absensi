// utils/runSeedStandalone.js
import { seedUserLevels } from "./seedUserLevels.js";
import sequelize from "../config/config.js";

async function runSeedStandalone() {
  try {
    console.log("🚀 Menjalankan seed secara standalone...");
    await seedUserLevels();
    console.log("✅ Seed selesai!");
  } catch (error) {
    console.error("❌ Seed gagal:", error);
  } finally {
    // Close database connection for standalone execution
    await sequelize.close();
    console.log("🔌 Koneksi database ditutup");
    process.exit(0);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSeedStandalone();
} 