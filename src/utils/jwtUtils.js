import jwt from "jsonwebtoken";

const jwtUtils = {
  generateToken(user) {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      user_level_id: user.user_level_id,
    };

    const secretKey = process.env.JWT_SECRET || "your_secret_key"; // Use an environment variable for the secret key
    const options = { expiresIn: "1h" }; // Token expiration time

    return jwt.sign(payload, secretKey, options);
  },
};

export default jwtUtils;
