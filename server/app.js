require("dotenv").config(); // .env support
require("express-async-errors"); // async await error handling

// express server
const express = require("express");
const app = express();

const helmet = require("helmet"); // Helps you secure your Express apps by setting various HTTP headers.
const cors = require("cors"); // Enable Cross-origin resource sharing
const xss = require("xss-clean"); // Middleware to sanitize user input coming from POST body, GET queries, and url params.
const mongoSanitize = require("express-mongo-sanitize"); // searches for any keys in objects that begin with a $ sign or contain a ., from req.body, req.query or req.params
const cookieParser = require("cookie-parser"); // Parse Cookie header and populate req.cookies with an object keyed by the cookie names.

if (process.env.NODE_ENV !== "production") {
	const morgan = require("morgan"); // middleware to log HTTP requests and errors, and simplifies the process.
	app.use(morgan("tiny"));
}

//auth router
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");

app.set("trust proxy", 1); // Indicates the app is behind a front-facing proxy, and to use the X-Forwarded-* headers to determine the connection and the IP address of the client.
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(express.json());
app.use(mongoSanitize());
app.use(cookieParser(process.env.JWT_SECRET));

// Using routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);

// middleware
const notFoundMiddleware = require("./middleware/not-found"); // Page not found
const errorHandlerMiddleware = require("./middleware/error-handler");

// Error handling middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;
