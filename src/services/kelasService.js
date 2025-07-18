import Guru from "../models/Guru.js"; // Add this import

class KelasService {
  constructor(kelasModel) {
    this.kelasModel = kelasModel;
  }

  async createKelas(kelasData) {
    return await this.kelasModel.create(kelasData);
  }

  async getAllKelas() {
    return await this.kelasModel.findAll({
      attributes: [
        "id",
        "nama_kelas",
        "tingkat",
        "jurusan",
        "guru_id", // Include this field
        "tahun_ajaran",
        "created_at",
      ],
      include: [{ model: Guru, as: "guru" }], // Include Guru association
      order: [["created_at", "DESC"]],
    });
  }

  async getKelasById(id) {
    return await this.kelasModel.findByPk(id, {
      include: [{ model: Guru, as: "guru" }], // Include Guru association
    });
  }

  async updateKelas(id, kelasData) {
    return await this.kelasModel.update(kelasData, { where: { id } });
  }

  async deleteKelas(id) {
    return await this.kelasModel.destroy({ where: { id } });
  }
}

export default KelasService;
