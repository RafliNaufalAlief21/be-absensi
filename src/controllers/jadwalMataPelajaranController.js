export function createJadwalWithMataPelajaran(
  jadwalService,
  mataPelajaranService
) {
  return async (req, res) => {
    try {
      const { jadwalData, mataPelajaranData, guru_id } = req.body;

      if (!guru_id) {
        return res.status(400).json({
          success: false,
          message: "guru_id is required",
        });
      }

      // Create Mata Pelajaran with guru_id
      const mataPelajaran = await mataPelajaranService.createMataPelajaran({
        ...mataPelajaranData,
        guru_id,
      });

      // Create Jadwal with guru_id and Mata Pelajaran ID
      const jadwal = await jadwalService.createJadwal({
        ...jadwalData,
        guru_id,
        mapel_id: mataPelajaran.id,
      });

      return res.status(201).json({
        success: true,
        message: "Jadwal with Mata Pelajaran created successfully",
        data: { jadwal, mataPelajaran },
      });
    } catch (error) {
      console.error("Create Jadwal with Mata Pelajaran error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to create Jadwal with Mata Pelajaran",
        error: error.message,
      });
    }
  };
}

export function getJadwalWithMataPelajaran(jadwalService) {
  return async (req, res) => {
    try {
      const jadwalList = await jadwalService.getAllJadwal();
      return res.status(200).json({
        success: true,
        data: jadwalList,
      });
    } catch (error) {
      console.error("Get Jadwal with Mata Pelajaran error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve Jadwal with Mata Pelajaran",
        error: error.message,
      });
    }
  };
}

export function getJadwalWithMataPelajaranById(jadwalService) {
  return async (req, res) => {
    try {
      const { id } = req.params;

      const jadwal = await jadwalService.getJadwalById(id);

      if (!jadwal) {
        return res.status(404).json({
          success: false,
          message: "Jadwal not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: jadwal,
      });
    } catch (error) {
      console.error(
        "Get Jadwal with Mata Pelajaran by ID error:",
        error.message
      );
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve Jadwal with Mata Pelajaran",
        error: error.message,
      });
    }
  };
}

export function getJadwalWithMataPelajaranByKelasId(jadwalService) {
  return async (req, res) => {
    try {
      const { kelas_id } = req.params;

      if (!kelas_id) {
        return res.status(400).json({
          success: false,
          message: "kelas_id is required",
        });
      }

      const jadwalList = await jadwalService.getJadwalByKelasId(kelas_id);

      return res.status(200).json({
        success: true,
        data: jadwalList,
      });
    } catch (error) {
      console.error(
        "Get Jadwal with Mata Pelajaran by kelas_id error:",
        error.message
      );
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve Jadwal with Mata Pelajaran by kelas_id",
        error: error.message,
      });
    }
  };
}

export function updateJadwalWithMataPelajaran(
  jadwalService,
  mataPelajaranService
) {
  return async (req, res) => {
    try {
      const { jadwalData, mataPelajaranData, guru_id } = req.body;

      if (!guru_id) {
        return res.status(400).json({
          success: false,
          message: "guru_id is required",
        });
      }

      // Retrieve existing Jadwal by ID
      const jadwal = await jadwalService.getJadwalById(req.params.id);
      if (!jadwal) {
        return res.status(404).json({
          success: false,
          message: "Jadwal not found",
        });
      }

      // Retrieve Mata Pelajaran by mapel_id from Jadwal
      const mataPelajaran = await mataPelajaranService.getMataPelajaranById(
        jadwal.mapel_id
      );
      if (!mataPelajaran) {
        return res.status(404).json({
          success: false,
          message: "Mata Pelajaran not found",
        });
      }

      // Update Mata Pelajaran with guru_id if mataPelajaranData is provided
      if (mataPelajaranData && Object.keys(mataPelajaranData).length > 0) {
        await mataPelajaranService.updateMataPelajaran(mataPelajaran.id, {
          ...mataPelajaranData,
          guru_id,
        });
      }

      // Update Jadwal with guru_id if jadwalData is provided
      if (jadwalData && Object.keys(jadwalData).length > 0) {
        await jadwalService.updateJadwal(req.params.id, {
          ...jadwalData,
          guru_id,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Jadwal with Mata Pelajaran updated successfully",
      });
    } catch (error) {
      console.error("Update Jadwal with Mata Pelajaran error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to update Jadwal with Mata Pelajaran",
        error: error.message,
      });
    }
  };
}

export function deleteJadwalWithMataPelajaran(
  jadwalService,
  mataPelajaranService
) {
  return async (req, res) => {
    try {
      // Retrieve the Jadwal by ID
      const jadwal = await jadwalService.getJadwalById(req.params.id);
      if (!jadwal) {
        return res.status(404).json({
          success: false,
          message: "Jadwal not found",
        });
      }

      // Retrieve the associated Mata Pelajaran by mapel_id
      const mataPelajaran = await mataPelajaranService.getMataPelajaranById(
        jadwal.mapel_id
      );
      if (!mataPelajaran) {
        return res.status(404).json({
          success: false,
          message: "Mata Pelajaran not found",
        });
      }

      // Delete the Jadwal
      await jadwalService.deleteJadwal(req.params.id);

      // Delete the Mata Pelajaran
      await mataPelajaranService.deleteMataPelajaran(jadwal.mapel_id);

      return res.status(200).json({
        success: true,
        message: "Jadwal and Mata Pelajaran deleted successfully",
      });
    } catch (error) {
      console.error("Delete Jadwal with Mata Pelajaran error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to delete Jadwal with Mata Pelajaran",
        error: error.message,
      });
    }
  };
}
