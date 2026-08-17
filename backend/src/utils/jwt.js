const jwt = require("jsonwebtoken");
const env = require("../config/env");

const signAccess = (payload) =>
  jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRES });

const signRefresh = (payload) =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES });

const verifyAccess = (token) => jwt.verify(token, env.JWT_ACCESS_SECRET);

const verifyRefresh = (token) => jwt.verify(token, env.JWT_REFRESH_SECRET);

module.exports = { signAccess, signRefresh, verifyAccess, verifyRefresh };
