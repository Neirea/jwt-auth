const CustomError = require("../errors");
const { isTokenValid, attachCookiesToResponse } = require("../utils");

//checks for access token and for refresh token to get new access one if missing
const authenticateUser = async (req, res, next) => {
	const { refreshToken, accessToken } = req.signedCookies;

	try {
		if (accessToken) {
			const payload = isTokenValid(accessToken);
			req.user = payload.user;
			return next();
		}

		//intercept show me request without cookies
		if (!refreshToken && req.originalUrl == "/api/v1/user/showMe") {
			res.status(200).json(false);
			return;
		}
		const payload = isTokenValid(refreshToken);

		const existingToken = await Token.findOne({
			user: payload.user.userId,
			refreshToken: payload.refreshToken,
		});

		if (!existingToken || !existingToken?.isValid) {
			throw new CustomError.UnauthenticatedError("Authentication Invalid");
		}
		attachCookiesToResponse({
			res,
			user: payload.user,
			refreshToken: existingToken.refreshToken,
			remember: existingToken.remember,
		});
		req.user = payload.user;

		next();
	} catch (error) {
		throw new CustomError.UnauthenticatedError("Authentication Invalid");
	}
};

//checks for correct role (function gets invoked right away and returns callback function as middleware)
const authorizePermissions = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			throw new CustomError.UnauthorizedError(
				"Unauthorized to access this route"
			);
		}
		next();
	};
};

module.exports = { authenticateUser, authorizePermissions };
