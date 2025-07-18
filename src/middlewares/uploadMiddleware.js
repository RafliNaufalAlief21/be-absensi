import multer from "multer";
import sharp from "sharp";
import fs from "fs";
import multerConfig from "../config/multerConfig.js";

const upload = multerConfig;

// Middleware untuk mengompres file gambar
const compressFiles = async (req, res, next) => {
  if (!req.file) return next();

  console.log("=== File Compression ===");
  console.log("File to compress:", req.file);

  try {
    const file = req.file;
    const outputPath = file.path;

    if (file.mimetype.startsWith("image/")) {
      // Compress image
      await sharp(file.path)
        .resize(800, 800, { fit: "inside" })
        .toFormat("jpeg")
        .jpeg({ quality: 80 })
        .toFile(outputPath + ".compressed");

      // Ganti file asli dengan versi terkompresi
      fs.renameSync(outputPath + ".compressed", outputPath);
      console.log("File compressed successfully");
    }

    next();
  } catch (error) {
    console.error("=== Error compressing file ===");
    console.error("Error:", error.message);
    console.error("File:", req.file);
    
    // Don't fail the request if compression fails
    console.warn("Compression failed, continuing with original file");
    next();
  }
};

// Middleware untuk menangani error upload
const handleUploadErrors = (err, req, res, next) => {
  console.error("=== Upload Error ===");
  console.error("Error:", err);
  console.error("Request headers:", req.headers);
  console.error("Request method:", req.method);
  console.error("Request URL:", req.url);
  
  if (err instanceof multer.MulterError) {
    console.error("Multer error code:", err.code);
    
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Ukuran file terlalu besar. Maksimum 5MB.",
      });
    }
    
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Terlalu banyak file yang diupload.",
      });
    }
    
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        message: "Field file tidak sesuai.",
      });
    }
    
    return res.status(400).json({ 
      success: false, 
      message: `Upload error: ${err.message}` 
    });
  } else if (err) {
    // Handle permission errors
    if (err.message.includes('EACCES') || err.message.includes('permission')) {
      return res.status(500).json({
        success: false,
        message: "Server error: Permission denied for file upload. Please contact administrator.",
      });
    }
    
    return res.status(400).json({ 
      success: false, 
      message: `Upload error: ${err.message}` 
    });
  }
  next();
};

export { upload, compressFiles, handleUploadErrors };
