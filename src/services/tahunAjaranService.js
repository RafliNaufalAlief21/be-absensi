export async function createTahunAjaran(tahunAjaranModel, tahunAjaranData) {
  try {
    return await tahunAjaranModel.create(tahunAjaranData);
  } catch (error) {
    throw new Error("Failed to create Tahun Ajaran: " + error.message);
  }
}

export async function getAllTahunAjaran(tahunAjaranModel) {
  try {
    // Use raw query to get distinct values
    const { Sequelize } = await import('sequelize');
    const result = await tahunAjaranModel.findAll({
      attributes: [
        'id',
        'nama_tahun_ajaran',
        'tanggal_mulai',
        'tanggal_selesai',
        'is_active',
        'created_at',
        'updated_at'
      ],
      order: [["created_at", "DESC"]],
      // Use distinct to avoid duplicates
      distinct: true,
    });
    console.log("TahunAjaran Service Result (Raw):", result); // Debug logging
    
    // Log each item to see if there are duplicates
    result.forEach((item, index) => {
      console.log(`Item ${index}:`, {
        id: item.id,
        nama_tahun_ajaran: item.nama_tahun_ajaran,
        created_at: item.created_at
      });
    });
    
    // Deduplicate in JavaScript based on nama_tahun_ajaran as fallback
    const uniqueResult = result.filter((item, index, self) => 
      index === self.findIndex(t => t.nama_tahun_ajaran === item.nama_tahun_ajaran)
    );
    
    console.log("TahunAjaran Unique Result:", uniqueResult); // Debug logging
    return uniqueResult;
  } catch (error) {
    throw new Error("Failed to retrieve Tahun Ajaran: " + error.message);
  }
}

export async function getTahunAjaranById(tahunAjaranModel, id) {
  try {
    const tahunAjaran = await tahunAjaranModel.findByPk(id);
    if (!tahunAjaran) {
      throw new Error("Tahun Ajaran not found");
    }
    return tahunAjaran;
  } catch (error) {
    throw new Error("Failed to retrieve Tahun Ajaran: " + error.message);
  }
}

export async function updateTahunAjaran(tahunAjaranModel, id, tahunAjaranData) {
  try {
    const tahunAjaran = await tahunAjaranModel.findByPk(id);
    if (!tahunAjaran) {
      throw new Error("Tahun Ajaran not found");
    }
    await tahunAjaran.update(tahunAjaranData);
    return true;
  } catch (error) {
    throw new Error("Failed to update Tahun Ajaran: " + error.message);
  }
}

export async function deleteTahunAjaran(tahunAjaranModel, id) {
  try {
    const tahunAjaran = await tahunAjaranModel.findByPk(id);
    if (!tahunAjaran) {
      throw new Error("Tahun Ajaran not found");
    }
    await tahunAjaran.destroy();
    return true;
  } catch (error) {
    throw new Error("Failed to delete Tahun Ajaran: " + error.message);
  }
}
