const crypto = require("crypto");

const hashString = (token) =>
	crypto.createHash("md5").update(token).digest("hex");

module.exports = hashString;
