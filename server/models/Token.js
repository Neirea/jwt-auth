const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema(
	{
		refreshToken: {
			type: String,
			required: true,
		},
		ip: {
			type: String,
			required: true,
		},
		// device used to access
		userAgent: {
			type: String,
			required: true,
		},
		isValid: {
			type: Boolean,
			default: true,
		},
		remember: {
			type: Boolean,
			default: false,
		},
		user: {
			type: mongoose.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Token", TokenSchema);
