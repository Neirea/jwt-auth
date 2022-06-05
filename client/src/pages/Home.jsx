import React from "react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../store/AppContext";

const Home = () => {
	const { user, logoutUser } = useGlobalContext();

	const logout = () => {
		logoutUser();
	};
	return (
		<main className="center-flex">
			{!user ? (
				<>
					<Link className="btn" to="/login">
						Login
					</Link>
					<Link className="btn" to="/register">
						Register
					</Link>
				</>
			) : (
				<>
					<h2>Welcome, User Name</h2>
					<Link className="btn" to="/user-settings">
						Change Password
					</Link>
					<button className="btn" onClick={logout}>
						Log Out
					</button>
					<Link className="btn" to="/admin-route">
						Admin Test
					</Link>
				</>
			)}
		</main>
	);
};

export default Home;
