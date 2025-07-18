// Fungsi untuk mendapatkan tanggal dan waktu dalam format Jakarta/WIB
const getJakartaTime = () => {
  // Buat object Date baru
  const now = new Date();

  // Gunakan toLocaleString dengan opsi zona waktu Jakarta
  const jakartaTime = now.toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return jakartaTime;
};

// Fungsi untuk mendapatkan object Date dengan waktu Jakarta
const getJakartaDate = () => {
  const now = new Date();

  // Offset untuk waktu Jakarta (UTC+7)
  // Perhatikan: pendekatan ini memiliki keterbatasan terkait waktu DST
  const jakartaOffset = 7 * 60 * 60 * 1000;
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const jakartaTime = new Date(utcTime + jakartaOffset);

  return jakartaTime;
};

// Fungsi untuk mendapatkan waktu saat ini dalam format string SQL
const getJakartaTimeString = () => {
  const date = getJakartaDate();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // Format 'YYYY-MM-DD HH:MM:SS'
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// Fungsi untuk mendapatkan tanggal hari ini dalam format string SQL
const getJakartaDateString = () => {
  const date = getJakartaDate();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  // Format 'YYYY-MM-DD'
  return `${year}-${month}-${day}`;
};

export {
  getJakartaTime,
  getJakartaDate,
  getJakartaTimeString,
  getJakartaDateString,
};
