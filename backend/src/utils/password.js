const bcrypt = require("bcryptjs");
const env = require("../config/env");

const hash = (plain) => bcrypt.hash(plain, env.BCRYPT_ROUNDS);
const compare = (plain, hashed) => bcrypt.compare(plain, hashed);

module.exports = { hash, compare };
