const User = require("../models/User");
const Token = require("../models/Token");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
	attachCookiesToResponse,
	createTokenUser,
	sendVerificationEmail,
	sendResetPasswordEmail,
	createHash,
} = require("../utils");
const crypto = require("crypto");

// register
const register = async (req, res) => {
	const { email, name, password } = req.body;

	const nameValidation = /[a-zA-Z]+([0-9]+)?/g;
	const checkedName = name.match(nameValidation).join();

	if (checkedName !== name) {
		throw new CustomError.BadRequestError("Validation Error: Bad Name");
	}

	// first registered user is an admin
	const isFirstAccount = (await User.countDocuments({})) === 0;
	const role = isFirstAccount ? "admin" : "user";

	const verificationToken = crypto.randomBytes(40).toString("hex");

	const user = await User.create({
		name,
		email,
		password,
		role,
		verificationToken,
	});
	//url of website
	const origin = process.env.ORIGIN_URL || "http://localhost:3000";

	await sendVerificationEmail({
		name: user.name,
		email: user.email,
		verificationToken: user.verificationToken,
		origin,
	});
	res.status(StatusCodes.CREATED).json({
		msg: "Success! Please check your email to verify account",
	});
};

//verify email
const verifyEmail = async (req, res) => {
	const { verificationToken, email } = req.body;
	const user = await User.findOne({ email });

	if (user.isVerified) {
		res.status(StatusCodes.OK).json({ msg: "Account is already verified" });
		return;
	}
	if (!user || user.verificationToken != verificationToken) {
		throw new CustomError.UnauthenticatedError("Verification Failed");
	}

	user.isVerified = true;
	user.verified = Date.now();
	user.verificationToken = "";

	await user.save();
	res.status(StatusCodes.OK).json({ msg: "Account verified" });
};

//login
const login = async (req, res) => {
	const { email, password, remember } = req.body;

	if (!email || !password) {
		throw new CustomError.BadRequestError("Please provide email and password");
	}

	const user = await User.findOne({ email });
	if (!user) {
		throw new CustomError.UnauthenticatedError("Invalid credentials");
	}

	const isPasswordCorrect = await user.comparePassword(password);
	if (!isPasswordCorrect) {
		throw new CustomError.UnauthenticatedError("Invalid credentials");
	}

	if (!user.isVerified) {
		throw new CustomError.UnauthenticatedError("Please verify your account");
	}

	const tokenUser = createTokenUser(user); // {name, userId, role}

	//create new refresh token
	const refreshToken = "";
	//check for existing token in DB to update
	const existingToken = await Token.findOne({ user: user._id });
	if (existingToken) {
		const { isValid } = existingToken;
		if (!isValid) {
			throw new CustomError.UnauthenticatedError("Invalid Credentials");
		}
		//update rememember me field in DB
		if (existingToken.remember != remember) {
			existingToken.remember = remember;
		}
		refreshToken = existingToken.refreshToken;
		//update new refreshToken
		attachCookiesToResponse({
			res,
			user: tokenUser,
			refreshToken,
			remember: remember,
		});
		res.status(StatusCodes.OK).json({ user: tokenUser });
		return;
	}
	//else create new token in DB
	const userAgent = req.headers["user-agent"];
	const ip = req.ip;
	const userToken = { refreshToken, ip, userAgent, remember, user: user._id };

	await Token.create(userToken);
	attachCookiesToResponse({ res, user: tokenUser, refreshToken, remember });

	res.status(StatusCodes.OK).json({ user: tokenUser });
};

//logout
const logout = async (req, res) => {
	await Token.findOneAndDelete({ user: req.user.userId });

	res.cookie("accessToken", "logout", {
		httpOnly: true,
		expires: new Date(Date.now()),
	});
	res.cookie("refreshToken", "logout", {
		httpOnly: true,
		expires: new Date(Date.now()),
	});
	res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};

//forgot password
const forgotPassword = async (req, res) => {
	const { email } = req.body;
	if (!email) {
		throw new CustomError.BadRequestError("Please provide valid email");
	}

	const user = await User.findOne({ email });
	if (user) {
		const passwordToken = crypto.randomBytes(70).toString("hex");
		// send email
		const origin = process.env.ORIGIN_URL || "http://localhost:3000";
		await sendResetPasswordEmail({
			name: user.name,
			email: user.email,
			token: passwordToken,
			origin,
		});
		// no error if user doesn't exist to hide user database from potential attacks

		const tenMinutes = 1000 * 60 * 10;
		const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

		user.passwordToken = createHash(passwordToken);
		user.passwordTokenExpirationDate = passwordTokenExpirationDate;
		await user.save();
	}

	res
		.status(StatusCodes.OK)
		.json({ msg: "Please check your email for reset password link" });
};

const resetPassword = async (req, res) => {
	const { token, email, password } = req.body;
	if (!token || !email || !password) {
		throw new CustomError.BadRequestError("Please provide all values");
	}
	const user = await User.findOne({ email });

	if (user) {
		const currentDate = new Date();
		if (
			user.passwordToken === createHash(token) &&
			user.passwordTokenExpirationDate > currentDate
		) {
			user.password = password;
			user.passwordToken = null;
			user.passwordTokenExpirationDate = null;
			await user.save();
		}
	}

	res.status(StatusCodes.OK).json({ msg: "reset password" });
};

module.exports = {
	register,
	login,
	logout,
	verifyEmail,
	forgotPassword,
	resetPassword,
};
