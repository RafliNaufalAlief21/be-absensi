import express from "express";
import cors from "cors";
import dotenv from "dotenv"; 

import authRoutes from "./routes/authRoutes.js";
import absensiRoutes from "./routes/absensiRoutes.js"; // Import absensi routes
import kelasRoutes from "./routes/kelasRoutes.js";
import jadwalRoutes from "./routes/jadwalRoutes.js"; // Import jadwal routes
import siswaRoutes from "./routes/siswaRoutes.js"; // Import siswa routes
import guruRoutes from "./routes/guruRoutes.js"; // Import guru routes
import mataPelajaranRoutes from "./routes/mataPelajaranRoutes.js"; // Import mata pelajaran routes
import userRoutes from "./routes/userRoutes.js"; // Import user routes
import tahunAjaranRoutes from "./routes/tahunAjaranRoutes.js"; // Import tahun ajaran routes
import jadwalMataPelajaranRoutes from "./routes/jadwalMataPelajaranRoutes.js"; // Import new routes
import walikelasRoutes from "./routes/waliKelasRoutes.js"; // Import walikelas routes
import path from "path";
import { fileURLToPath } from "url";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./config/swaggerConfig.js"; // Ensure this file exists and is correctly configured
import dashboardRoutes from "./routes/dashboardRoutes.js"; // Import dashboard routes

dotenv.config(); // Load environment variables

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://fe-anasiriin.vercel.app",
    "https://0240-180-244-90-22.ngrok-free.app",
    "https://be-anasiriin.matrakosala.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true, // jika kamu menggunakan cookie
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

// Additional CORS headers for preflight requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://fe-anasiriin.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Middleware untuk parsing JSON
app.use(express.json()); // Pastikan middleware ini ada

app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs)); // Ensure this path is correct

// Register routes
app.use("/api/auth", authRoutes); // Ensure this line is present
app.use("/api/absensi", absensiRoutes); // Use absensi routes
app.use("/api/kelas", kelasRoutes);
app.use("/api/jadwal", jadwalRoutes); // Use jadwal routes
app.use("/api/siswa", siswaRoutes); // Use siswa routes
app.use("/api/guru", guruRoutes); // Use guru routes
app.use("/api/mata-pelajaran", mataPelajaranRoutes); // Use mata pelajaran routes
app.use("/api/users", userRoutes); // Ensure this line is present
app.use("/api/tahun-ajaran", tahunAjaranRoutes); // Use tahun ajaran routes
app.use("/api/jadwal-mata-pelajaran", jadwalMataPelajaranRoutes); // Use new routes
app.use("/api/walikelas", walikelasRoutes); // Ensure the walikelas routes are registered
app.use("/api/dashboard", dashboardRoutes); // Use dashboard routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "404 not found",
  });
});

export default app;
