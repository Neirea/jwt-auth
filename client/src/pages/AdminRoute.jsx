import React from "react";
import { useNavigate } from "react-router-dom";

const AdminRoute = () => {
	const navigate = useNavigate();
	const goBack = () => navigate(-1);
	return (
		<main className="center-flex">
			<p>AdminRoute</p>
			<button className="btn" onClick={goBack}>
				Go Back
			</button>
		</main>
	);
};

export default AdminRoute;
