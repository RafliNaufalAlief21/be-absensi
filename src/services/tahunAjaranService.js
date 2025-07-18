export async function createTahunAjaran(tahunAjaranModel, tahunAjaranData) {
  try {
    return await tahunAjaranModel.create(tahunAjaranData);
  } catch (error) {
    throw new Error("Failed to create Tahun Ajaran: " + error.message);
  }
}

export async function getAllTahunAjaran(tahunAjaranModel) {
  try {
    return await tahunAjaranModel.findAll({
      order: [["created_at", "DESC"]],
    });
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
