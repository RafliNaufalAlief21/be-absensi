// utils/seedUserLevels.js
import UserLevel from "../models/UserLevel.js";
import sequelize from "../config/config.js";

export async function seedUserLevels() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log("✅ Koneksi database berhasil");
    
    console.log("🌱 Memulai seeding user levels...");

    // Create user levels
    const userLevels = [
      {
        id: 1,
        nama_level: "Admin",
        level_akses: 1,
      },
      {
        id: 2,
        nama_level: "Guru",
        level_akses: 2,
      },
    ];

    // Insert user levels
    for (const level of userLevels) {
      const existingLevel = await UserLevel.findByPk(level.id);
      if (!existingLevel) {
        await UserLevel.create(level);
        console.log(`✅ User level "${level.nama_level}" berhasil dibuat`);
      } else {
        console.log(`ℹ️ User level "${level.nama_level}" sudah ada`);
      }
    }

    console.log("🎉 Seeding user levels selesai!");
    
    // Display summary
    const totalLevels = await UserLevel.count();
    console.log(`📊 Summary:`);
    console.log(`   - Total user levels: ${totalLevels}`);
    console.log(`   - Admin level (ID: 1): Admin`);
    console.log(`   - Guru level (ID: 2): Guru`);

  } catch (error) {
    console.error("❌ Error saat seeding:", error);
    throw error;
  }
}

// Function to run seeding
export async function runSeed() {
  try {
    await seedUserLevels();
  } catch (error) {
    console.error("❌ Seeding gagal:", error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSeed();
} 