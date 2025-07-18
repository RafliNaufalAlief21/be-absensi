import app from "./app.js"; // Import app with routes
import { connectDB } from "./config/dbConnection.js";
import { createAdminIfNotExists } from "./utils/seedAdmin.js"; // ⬅️ Tambah ini
import { seedUserLevels } from "./utils/seedUserLevels.js"; // ⬅️ Tambah ini
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5400;

// Function to ensure uploads directory exists with proper permissions
const ensureUploadsDirectory = () => {
  const uploadsDir = path.join(__dirname, "../uploads");
  
  try {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true, mode: 0o755 });
      console.log(`Created uploads directory: ${uploadsDir}`);
    }
    
    // Check and fix permissions (but don't fail if can't)
    try {
      fs.accessSync(uploadsDir, fs.constants.W_OK);
      console.log(`Uploads directory is writable: ${uploadsDir}`);
    } catch (error) {
      console.warn(`Warning: Uploads directory is not writable: ${uploadsDir}`);
      try {
        fs.chmodSync(uploadsDir, 0o755);
        console.log(`Fixed permissions for uploads directory: ${uploadsDir}`);
      } catch (chmodError) {
        console.warn(`Could not fix permissions: ${chmodError.message}`);
      }
    }
  } catch (error) {
    console.warn(`Warning: Error setting up uploads directory: ${error.message}`);
    // Don't fail startup, will be handled at runtime
  }
};

const startServer = async () => {
  try {
    // Ensure uploads directory exists with proper permissions (but don't fail if can't)
    ensureUploadsDirectory();
    
    await connectDB(); // Connect to the database
    console.log("Database connected and models synchronized successfully.");
    
    // Seed user levels first (because admin needs user_level_id)
    await seedUserLevels();
    
    // Then create admin user
    await createAdminIfNotExists();
    
    console.log(
      "Models:",
      Object.keys((await import("./models/index.js")).default)
    ); // Log the loaded models

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Uploads directory: ${path.join(__dirname, "../uploads")}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();
