import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid"; // Import UUID untuk nama file unik

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pastikan direktori upload tersedia dengan permission yang benar
const uploadDir = path.join(__dirname, "../../uploads");

const ensureUploadDir = () => {
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true, mode: 0o755 });
      console.log(`Created uploads directory: ${uploadDir}`);
    }
    
    // Check if directory is writable
    try {
      fs.accessSync(uploadDir, fs.constants.W_OK);
      console.log(`Uploads directory is writable: ${uploadDir}`);
    } catch (error) {
      console.warn(`Warning: Uploads directory is not writable: ${uploadDir}`);
      // Don't throw error, will be handled at runtime
    }
  } catch (error) {
    console.warn(`Warning: Error creating uploads directory: ${error.message}`);
    // Don't throw error during startup, will be handled at runtime
  }
};

// Ensure upload directory exists (but don't fail startup)
ensureUploadDir();

// Konfigurasi penyimpanan multer - semua file langsung di uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      // Double-check directory exists before saving
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true, mode: 0o755 });
      }
      
      // Semua file disimpan langsung di folder uploads
      cb(null, uploadDir);
    } catch (error) {
      console.error("Error in destination:", error);
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    try {
      const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    } catch (error) {
      console.error("Error generating filename:", error);
      cb(error);
    }
  },
});

// Filter file untuk hanya menerima gambar DAN excel
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.mimetype === "application/vnd.ms-excel"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file gambar dan Excel yang diperbolehkan!"), false);
  }
};

// Konfigurasi multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // Batas ukuran file 5MB
});

export default upload;
