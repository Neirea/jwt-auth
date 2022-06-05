import { Link } from "react-router-dom";

const Error = () => {
	return (
		<main className="center-flex">
			<b style={{ fontSize: "9rem" }}>404</b>
			<h3>Page not found</h3>
			<Link to="/" className="btn">
				Back Home
			</Link>
		</main>
	);
};

export default Error;
