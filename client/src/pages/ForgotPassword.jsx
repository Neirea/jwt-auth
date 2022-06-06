import { useState } from "react";
import useLocalState from "../utils/useLocalState";
import axios from "axios";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
	const {
		alert,
		showAlert,
		loading,
		setLoading,
		success,
		setSuccess,
		hideAlert,
	} = useLocalState();
	const [email, setEmail] = useState("");

	const handleChange = (e) => {
		setEmail(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		hideAlert();
		try {
			const { data } = await axios.post("/api/v1/auth/forgot-password", {
				email,
			});
			setSuccess(true);
			showAlert({ text: data.msg });
		} catch (error) {
			showAlert({ text: error?.response?.data?.msg || "there was an error" });
		} finally {
			setLoading(false);
		}
	};
	return (
		<main className="center-flex">
			{success && alert.show && (
				<div className="alert">
					<h2>{alert.text}</h2>
					<Link className="alert-link" to="/">
						Go back to Home page
					</Link>
				</div>
			)}
			{!success && (
				<form className="form-class" onSubmit={handleSubmit}>
					<div className="form-input">
						<label htmlFor="email">Your Email:</label>
						<input
							id="email"
							name="email"
							type="email"
							className="input-text"
							value={email}
							onChange={handleChange}
						/>
					</div>
					{alert.show && <p className="alert">{alert.text}</p>}
					<button type="submit" className="btn submit" disabled={loading}>
						Submit
					</button>
				</form>
			)}
		</main>
	);
};

export default ForgotPassword;
