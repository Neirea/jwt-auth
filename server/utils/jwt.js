const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
	const token = jwt.sign(payload, process.env.JWT_SECRET);
	return token;
};

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET);

//-------------------------------------------------
const attachCookiesToResponse = ({ res, user, refreshToken, remember }) => {
	const accessTokenJWT = createJWT({ payload: { user } });
	const refreshTokenJWT = createJWT({ payload: { user, refreshToken } });

	const accessTokenDuration = 1000 * 60 * 30; // 30minutes
	const refreshTokenDuration = remember
		? 1000 * 60 * 60 * 24 * 7
		: accessTokenDuration; // 7 days or access token duration

	res.cookie("accessToken", accessTokenJWT, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		signed: true,
		expires: new Date(Date.now() + accessTokenDuration),
	});
	res.cookie("refreshToken", refreshTokenJWT, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		signed: true,
		expires: new Date(Date.now() + refreshTokenDuration),
	});
};

module.exports = {
	createJWT,
	isTokenValid,
	attachCookiesToResponse,
};
