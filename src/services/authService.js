import md5 from "md5";
import { Op } from "sequelize";

export async function login(userModel, jwtUtils, identifier, password) {
  console.log("Logging in user with identifier:", identifier);

  const user = await userModel.findOne({
    where: {
      [Op.or]: [
        { email: identifier },
        { username: identifier },
        { "$guru.nip$": identifier },
      ],
    },
    include: [
      {
        model: userModel.sequelize.models.Guru,
        as: "guru",
        attributes: ["id", "nip", "kelas_id"],
        include: [
          {
            model: userModel.sequelize.models.Jadwal,
            as: "jadwal", // Use the correct alias "jadwal"
            attributes: ["id", "kelas_id", "mapel_id"],
            include: [
              {
                model: userModel.sequelize.models.Kelas,
                as: "kelas", // Ensure alias matches "kelasDetails"
                attributes: ["id"],
              },
            ],
            limit: 1,
          },
        ],
      },
    ],
  });

  if (!user) {
    console.error("User not found for identifier:", identifier);
    throw new Error("Invalid identifier or password");
  }

  const isValidPassword = validatePassword(password, user.password);
  if (!isValidPassword) {
    console.error("Password mismatch for user:", user.username);
    throw new Error("Invalid identifier or password");
  }

  const token = jwtUtils.generateToken(user);

  let siswaIdForGuru = null;
  let kelasIdForGuru = user.guru?.kelas_id || null;

  if (!kelasIdForGuru && user.guru?.jadwal?.[0]?.kelasDetails?.id) {
    console.log("Fetching kelas_id from jadwal for guru:", user.guru.id);
    kelasIdForGuru = user.guru.jadwal[0].kelasDetails.id;
  }

  if (kelasIdForGuru) {
    console.log("Fetching siswa_id for kelas_id:", kelasIdForGuru);
    const siswa = await userModel.sequelize.models.Siswa.findOne({
      where: { kelas_id: kelasIdForGuru },
      attributes: ["id"],
    });

    if (siswa) {
      siswaIdForGuru = siswa.id;
      console.log(
        "Siswa found for kelas_id:",
        kelasIdForGuru,
        "siswa_id:",
        siswaIdForGuru
      );
    } else {
      console.warn(
        `No Siswa found for kelas_id: ${kelasIdForGuru}. siswa_id remains null.`
      );
    }
  }

  const { password: _, ...userWithoutPassword } = user.dataValues;

  console.log("Returning user data with token.");
  return {
    user: {
      ...userWithoutPassword,
      guru: user.guru
        ? {
            id: user.guru.id,
            nip: user.guru.nip,
            jadwal_id: user.guru.jadwal?.[0]?.id || null,
            kelas_id: kelasIdForGuru,
            mapel_id: user.guru.jadwal?.[0]?.mapel_id || null,
            siswa_id: siswaIdForGuru,
          }
        : null,
    },
    token,
  };
}

export async function findUserByEmail(userModel, email) {
  return await userModel.findOne({ where: { email } });
}

export async function findUserById(userModel, userId) {
  const user = await userModel.findOne({
    where: { id: userId },
    include: [
      {
        model: userModel.sequelize.models.Guru,
        as: "guru",
        include: [
          { model: userModel.sequelize.models.Kelas, as: "kelas" },
          { model: userModel.sequelize.models.Jadwal, as: "jadwal" },
        ],
      },
    ],
  });
  console.log("User with relations:", user);
  return user;
}

export function md5Password(password) {
  return md5(password);
}

export function validatePassword(password, md5PasswordValue) {
  return md5Password(password) === md5PasswordValue;
}
