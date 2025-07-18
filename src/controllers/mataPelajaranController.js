export function createMataPelajaran(mataPelajaranService) {
  return async (req, res) => {
    try {
      const { kode_mapel, ...mataPelajaranData } = req.body; // Exclude kode_mapel from request body
      const mataPelajaran = await mataPelajaranService.createMataPelajaran(
        mataPelajaranData
      );
      return res.status(201).json({
        success: true,
        message: "Mata Pelajaran berhasil dibuat",
        data: mataPelajaran,
      });
    } catch (error) {
      console.error("Create Mata Pelajaran error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat membuat mata pelajaran",
        error: error.message,
      });
    }
  };
}

export function getAllMataPelajaran(mataPelajaranService) {
  return async (req, res) => {
    try {
      const mataPelajaranList =
        await mataPelajaranService.getAllMataPelajaran();
      return res.status(200).json({
        success: true,
        data: mataPelajaranList,
      });
    } catch (error) {
      console.error("Get All Mata Pelajaran error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve Mata Pelajaran",
        error: error.message,
      });
    }
  };
}

export function getMataPelajaranById(mataPelajaranService) {
  return async (req, res) => {
    try {
      const mataPelajaran = await mataPelajaranService.getMataPelajaranById(
        req.params.id
      );
      if (!mataPelajaran) {
        return res.status(404).json({
          success: false,
          message: "Mata Pelajaran tidak ditemukan",
        });
      }
      return res.status(200).json({
        success: true,
        data: mataPelajaran,
      });
    } catch (error) {
      console.error("Get Mata Pelajaran By ID error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat mengambil data mata pelajaran",
        error: error.message,
      });
    }
  };
}

export function updateMataPelajaran(mataPelajaranService) {
  return async (req, res) => {
    try {
      const updated = await mataPelajaranService.updateMataPelajaran(
        req.params.id,
        req.body
      );
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Mata Pelajaran tidak ditemukan",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Mata Pelajaran berhasil diperbarui",
      });
    } catch (error) {
      console.error("Update Mata Pelajaran error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat memperbarui mata pelajaran",
        error: error.message,
      });
    }
  };
}

export function deleteMataPelajaran(mataPelajaranService) {
  return async (req, res) => {
    try {
      const deleted = await mataPelajaranService.deleteMataPelajaran(
        req.params.id
      );
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Mata Pelajaran tidak ditemukan",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Mata Pelajaran berhasil dihapus",
      });
    } catch (error) {
      console.error("Delete Mata Pelajaran error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat menghapus mata pelajaran",
        error: error.message,
      });
    }
  };
}
