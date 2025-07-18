import sequelize from "../config/config.js";

export async function getDashboardStats() {
  try {
    const siswaCount = await sequelize.query(
      "SELECT COUNT(*) as total FROM siswa",
      { type: sequelize.QueryTypes.SELECT }
    );
    const guruCount = await sequelize.query(
      "SELECT COUNT(*) as total FROM guru",
      { type: sequelize.QueryTypes.SELECT }
    );
    const mataPelajaranCount = await sequelize.query(
      "SELECT COUNT(*) as total FROM mata_pelajaran",
      { type: sequelize.QueryTypes.SELECT }
    );
    const absensiStats = await sequelize.query(
      `
        SELECT 
          COUNT(*) as total_absensi,
          SUM(CASE WHEN status = 'Hadir' THEN 1 ELSE 0 END) as total_hadir,
          SUM(CASE WHEN status = 'Izin' THEN 1 ELSE 0 END) as total_izin,
          SUM(CASE WHEN status = 'Sakit' THEN 1 ELSE 0 END) as total_sakit
        FROM absensi
      `,
      { type: sequelize.QueryTypes.SELECT }
    );

    return {
      totalSiswa: siswaCount[0]?.total || 0,
      totalGuru: guruCount[0]?.total || 0,
      totalMataPelajaran: mataPelajaranCount[0]?.total || 0,
      absensiStats: {
        total_absensi: absensiStats[0]?.total_absensi || 0,
        total_hadir: absensiStats[0]?.total_hadir || 0,
        total_izin: absensiStats[0]?.total_izin || 0,
        total_sakit: absensiStats[0]?.total_sakit || 0,
      },
    };
  } catch (error) {
    console.error("Error in getDashboardStats:", error);
    throw error;
  }
}

export async function getMonthlyAttendanceReport(year, month) {
  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate = `${year}-${String(month).padStart(2, "0")}-31`;
  const dailyStats = await sequelize.query(
    `
      SELECT 
        DATE(tanggal_absensi) as date,
        SUM(CASE WHEN status = 'Hadir' THEN 1 ELSE 0 END) as hadir,
        SUM(CASE WHEN status = 'Izin' THEN 1 ELSE 0 END) as izin,
        SUM(CASE WHEN status = 'Sakit' THEN 1 ELSE 0 END) as sakit
      FROM absensi
      WHERE tanggal_absensi BETWEEN :startDate AND :endDate
        AND siswa_id IS NOT NULL
      GROUP BY DATE(tanggal_absensi)
      ORDER BY DATE(tanggal_absensi)
    `,
    {
      replacements: { startDate, endDate },
      type: sequelize.QueryTypes.SELECT,
    }
  );
  return dailyStats;
}

export async function getTeacherDashboardStats(guru_id) {
  const kelasResult = await sequelize.query(
    `SELECT DISTINCT kelas_id FROM jadwal WHERE guru_id = :guru_id`,
    { replacements: { guru_id }, type: sequelize.QueryTypes.SELECT }
  );
  const kelasIds = kelasResult.map((k) => k.kelas_id);
  const totalKelas = kelasIds.length;
  let totalSiswa = 0;
  if (kelasIds.length > 0) {
    const siswaResult = await sequelize.query(
      `SELECT COUNT(DISTINCT siswa_id) as total FROM absensi WHERE kelas_id IN (:kelasIds)`,
      { replacements: { kelasIds }, type: sequelize.QueryTypes.SELECT }
    );
    totalSiswa = siswaResult[0].total;
  }
  const mapelResult = await sequelize.query(
    `SELECT COUNT(DISTINCT mapel_id) as total FROM jadwal WHERE guru_id = :guru_id`,
    { replacements: { guru_id }, type: sequelize.QueryTypes.SELECT }
  );
  const totalMapel = mapelResult[0].total;
  let rata2Kehadiran = 0;
  if (kelasIds.length > 0) {
    const hadirResult = await sequelize.query(
      `SELECT COUNT(*) as total FROM absensi WHERE kelas_id IN (:kelasIds) AND status = 'Hadir'`,
      { replacements: { kelasIds }, type: sequelize.QueryTypes.SELECT }
    );
    const totalAbsensiResult = await sequelize.query(
      `SELECT COUNT(*) as total FROM absensi WHERE kelas_id IN (:kelasIds)`,
      { replacements: { kelasIds }, type: sequelize.QueryTypes.SELECT }
    );
    const totalHadir = hadirResult[0].total;
    const totalAbsensi = totalAbsensiResult[0].total;
    rata2Kehadiran =
      totalAbsensi > 0 ? Math.round((totalHadir / totalAbsensi) * 100) : 0;
  }
  return {
    totalKelas,
    totalSiswa,
    totalMapel,
    rata2Kehadiran,
  };
}

export async function getTeacherMonthlyAttendance(
  guru_id,
  kelas_id,
  year,
  month
) {
  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate = `${year}-${String(month).padStart(2, "0")}-31`;
  const dailyStats = await sequelize.query(
    `
      SELECT 
        DATE(tanggal_absensi) as date,
        SUM(CASE WHEN status = 'Hadir' THEN 1 ELSE 0 END) as hadir,
        SUM(CASE WHEN status = 'Izin' THEN 1 ELSE 0 END) as izin,
        SUM(CASE WHEN status = 'Sakit' THEN 1 ELSE 0 END) as sakit
      FROM absensi
      WHERE tanggal_absensi BETWEEN :startDate AND :endDate
        AND kelas_id = :kelas_id
        AND jadwal_id IN (SELECT id FROM jadwal WHERE guru_id = :guru_id)
      GROUP BY DATE(tanggal_absensi)
      ORDER BY DATE(tanggal_absensi)
    `,
    {
      replacements: { startDate, endDate, kelas_id, guru_id },
      type: sequelize.QueryTypes.SELECT,
    }
  );
  return dailyStats;
}

export async function getLatestAttendance() {
  try {
    const latestAttendance = await sequelize.query(
      `
        SELECT 
          a.id, 
          a.tanggal_absensi, 
          a.waktu_masuk, 
          a.status, 
          s.nama_siswa AS siswa_nama, 
          k.nama_kelas AS kelas_nama,
          m.nama_mapel AS mata_pelajaran
        FROM absensi a
        JOIN siswa s ON a.siswa_id = s.id
        JOIN kelas k ON a.kelas_id = k.id
        JOIN jadwal j ON a.jadwal_id = j.id
        JOIN mata_pelajaran m ON j.mapel_id = m.id
        ORDER BY a.tanggal_absensi DESC
        LIMIT 10
      `,
      { type: sequelize.QueryTypes.SELECT }
    );
    return latestAttendance;
  } catch (error) {
    console.error("Error in getLatestAttendance:", error);
    throw error;
  }
}
