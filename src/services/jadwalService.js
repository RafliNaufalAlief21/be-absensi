export async function createJadwal(jadwalModel, jadwalData) {
  return await jadwalModel.create(jadwalData);
}

export async function getAllJadwal(jadwalModel) {
  return await jadwalModel.findAll({
    include: [{ association: "mataPelajaran" }, "guru", "kelas", "tahunAjaran"],
    order: [["created_at", "DESC"]],
  });
}

export async function getJadwalById(jadwalModel, id) {
  return await jadwalModel.findByPk(id, {
    include: [{ association: "mataPelajaran" }, "guru", "kelas", "tahunAjaran"],
  });
}

export async function getJadwalByKelasId(jadwalModel, kelas_id) {
  return await jadwalModel.findAll({
    where: { kelas_id },
    include: [{ association: "mataPelajaran" }, "guru", "kelas", "tahunAjaran"],
    order: [["created_at", "DESC"]],
  });
}

export async function updateJadwal(jadwalModel, id, jadwalData) {
  const jadwal = await jadwalModel.findByPk(id);
  if (!jadwal) {
    throw new Error("Jadwal not found");
  }
  await jadwal.update(jadwalData);
  return jadwal;
}

export async function deleteJadwal(jadwalModel, id) {
  const jadwal = await jadwalModel.findByPk(id);
  if (!jadwal) throw new Error("Jadwal not found");
  await jadwal.destroy();
  return true;
}
