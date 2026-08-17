require("dotenv").config();

const env = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES || "15m",
  JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES || "7d",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  NODE_ENV: process.env.NODE_ENV || "development",
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS) || 12,
};

const required = ["MONGO_URI", "JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"];
required.forEach((key) => {
  if (!env[key]) throw new Error(`Missing required env variable: ${key}`);
});

// Block placeholder/weak secrets in production
if (env.NODE_ENV === "production") {
  ["JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"].forEach((key) => {
    if (env[key].startsWith("CHANGE_ME") || env[key].length < 32) {
      throw new Error(`${key} is insecure for production. Use a random 64-byte hex string.`);
    }
  });
}

module.exports = env;
