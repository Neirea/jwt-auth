const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./custom-api");

class ServiceUnavailableError extends CustomAPIError {
	constructor(message) {
		super(message);
		this.statusCode = StatusCodes.SERVICE_UNAVAILABLE;
	}
}

module.exports = ServiceUnavailableError;
