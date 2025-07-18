async function createMataPelajaran(MataPelajaran, mataPelajaranData) {
  return await MataPelajaran.create(mataPelajaranData);
}

async function getAllMataPelajaran(MataPelajaran) {
  return await MataPelajaran.findAll({
    include: ["guru"],
    order: [["created_at", "DESC"]],
  });
}

async function getMataPelajaranById(MataPelajaran, id) {
  const mataPelajaran = await MataPelajaran.findByPk(id);
  if (!mataPelajaran) {
    throw new Error("Mata Pelajaran not found");
  }
  return mataPelajaran;
}

async function updateMataPelajaran(MataPelajaran, id, mataPelajaranData) {
  const mataPelajaran = await MataPelajaran.findByPk(id);
  if (!mataPelajaran) {
    throw new Error("Mata Pelajaran not found");
  }
  await mataPelajaran.update(mataPelajaranData);
  return mataPelajaran;
}

async function deleteMataPelajaran(MataPelajaran, id) {
  const mataPelajaran = await MataPelajaran.findByPk(id);
  if (!mataPelajaran) throw new Error("Mata Pelajaran not found");
  await mataPelajaran.destroy();
  return true;
}

export {
  createMataPelajaran,
  getAllMataPelajaran,
  getMataPelajaranById,
  updateMataPelajaran,
  deleteMataPelajaran,
};
