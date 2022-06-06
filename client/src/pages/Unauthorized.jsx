import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
	const navigate = useNavigate();
	const goBack = () => navigate(-1);
	return (
		<main className="center-flex">
			<div className="alert">
				<h1>Unauthorized</h1>
				<h2>You do not have access to the requested page.</h2>
				<br />
				<button className="btn" onClick={goBack}>
					Go Back
				</button>
			</div>
		</main>
	);
};

export default Unauthorized;
