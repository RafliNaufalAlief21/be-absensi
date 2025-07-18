import sequelize from "./config.js"; // Mengimpor sequelize dari config.js

// Fungsi untuk menghubungkan ke database dan menyinkronkan model
const connectDB = async () => {
  const maxRetries = 5;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      // Mencoba autentikasi koneksi
      await sequelize.authenticate();
      console.log("Connection has been established successfully.");

      // Sinkronisasi model dengan database
      await sequelize.sync({
        alter: false, // Jangan ubah tabel yang sudah ada
        logging: (sql) => {
          // Log aksi SQL jika CREATE TABLE atau ALTER TABLE dilakukan
          if (sql.includes("CREATE TABLE") || sql.includes("ALTER TABLE")) {
            console.log("Sync Action:", sql);
          }
        },
      });

      console.log("All models were synchronized successfully.");

      // Mendapatkan semua tabel di database
      const [tables] = await sequelize.query("SHOW TABLES");

      // Menampilkan tabel dan kolom-kolomnya
      console.log("Tables and their columns:");
      for (const table of tables) {
        const tableName = table[`Tables_in_${process.env.DB_NAME}`];

        // Mengambil deskripsi kolom dari setiap tabel
        const [columns] = await sequelize.query(`DESCRIBE ${tableName}`);

        console.log(`\nTable: ${tableName}`);
        console.log("Columns:");
        columns.forEach((column) => {
          console.log(
            `- ${column.Field}: ${column.Type} ${
              column.Null === "NO" ? "NOT NULL" : "NULL"
            } ${column.Key ? `(${column.Key})` : ""}`
          );
        });
      }

      return;
    } catch (error) {
      attempt++;
      console.error(`Attempt ${attempt} failed:`, error.message);

      if (attempt < maxRetries) {
        console.log(
          `Retrying to connect in 5 seconds... (${attempt}/${maxRetries})`
        );
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } else {
        console.error(
          "All retry attempts failed. Unable to connect to the database."
        );
        throw error;
      }
    }
  }
};

export { connectDB };
