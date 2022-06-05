require("dotenv").config();
const app = require("./app.js");
// database
const connectDB = require("./db/connect");

// launching server with connecting to DB
const port = process.env.PORT || 5000;
const start = async () => {
	try {
		await connectDB(process.env.MONGO_URL);
		app.listen(port, console.log(`Server is listening on port ${port}...`));
	} catch (error) {
		console.log(error);
	}
};

start();
