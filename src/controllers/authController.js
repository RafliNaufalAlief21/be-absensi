let authServiceInstance = null;
export function setAuthService(service) {
  authServiceInstance = service;
}

export const login = async (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({
      success: false,
      message:
        "Identifier (email, username, nip, atau nis) dan password harus diisi",
    });
  }
  try {
    const { user, token } = await authServiceInstance.login(
      identifier,
      password
    );
    return res.status(200).json({
      success: true,
      message: "Login berhasil",
      data: {
        user: {
          ...user,
          guru: user.guru
            ? {
                id: user.guru.id,
                nip: user.guru.nip,
                jadwal_id: user.guru.jadwal_id,
                kelas_id: user.guru.kelas_id,
                mapel_id: user.guru.mapel_id,
                siswa_id: user.guru.siswa_id,
              }
            : null,
          siswa: user.siswa
            ? {
                ...user.siswa,
                mapel_id: user.siswa.mapel_id,
              }
            : null,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(400).json({
      success: false,
      message: error.message || "Identifier atau password salah",
    });
  }
};
