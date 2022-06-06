const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");

const getAllUsers = async (req, res) => {
	const users = await User.find({ role: "user" }).select({
		password: 0,
		passwordToken: 0,
		passwordTokenExpirationDate: 0,
		verificationToken: 0,
	});
	res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
	const user = await User.findOne({ _id: req.params.id }).select({
		password: 0,
		passwordToken: 0,
		passwordTokenExpirationDate: 0,
		verificationToken: 0,
	});
	if (!user) {
		throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`);
	}
	//checks if admin or request user = user's id
	checkPermissions(req.user, user._id);
	res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
	res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUserPassword = async (req, res) => {
	const { oldPassword, newPassword } = req.body;
	if (!oldPassword || !newPassword) {
		throw new CustomError.BadRequestError("Please provide both values");
	}
	const user = await User.findOne({ _id: req.user.userId });

	const isPasswordCorrect = await user.comparePassword(oldPassword);
	if (!isPasswordCorrect) {
		throw new CustomError.UnauthenticatedError("Invalid Credentials");
	}
	user.password = newPassword;

	await user.save();
	res.status(StatusCodes.OK).json({ msg: "Success! Password Updated." });
};

module.exports = {
	getAllUsers,
	getSingleUser,
	showCurrentUser,
	updateUserPassword,
};
