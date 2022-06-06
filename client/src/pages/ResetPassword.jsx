import { useState } from "react";
import useLocalState from "../utils/useLocalState";
import axios from "axios";
import { Link } from "react-router-dom";
import { useQuery } from "../utils/useQuery";

const ResetPassword = () => {
	const query = useQuery();
	const {
		alert,
		showAlert,
		hideAlert,
		loading,
		setLoading,
		success,
		setSuccess,
	} = useLocalState();
	const [values, setValues] = useState({
		password: "",
		confirmPassword: "",
	});

	const handleChange = async (e) => {
		setValues({ ...values, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		hideAlert();

		const { password, confirmPassword } = values;
		try {
			if (password !== confirmPassword) {
				setValues({
					password: "",
					confirmPassword: "",
				});
				showAlert({
					text: "Passwords don't match!",
				});
			} else {
				await axios.post("/api/v1/auth/reset-password", {
					password,
					token: query.get("token"),
					email: query.get("email"),
				});
				setSuccess(true);
				showAlert({
					text: `Password was successfuly reset!`,
					type: "success",
				});
			}
		} catch (error) {
			showAlert({ text: error?.response?.data?.msg || "There was an error" });
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="center-flex">
			{success && alert.show && (
				<div className="alert">
					<p>{alert.text}</p>
					<Link to="/">Go back to Home page</Link>
				</div>
			)}
			{!success && (
				<form className="form-class" onSubmit={handleSubmit}>
					<div className="form-input">
						<label htmlFor="pass">Your Password:</label>
						<input
							id="pass"
							name="password"
							type="password"
							className="input-text"
							value={values.password}
							onChange={handleChange}
						/>
					</div>
					<div className="form-input">
						<label htmlFor="confirmPass">Confirm Password:</label>
						<input
							id="confirmPass"
							name="confirmPassword"
							type="confirmPassord"
							className="input-text"
							value={values.confirmPassword}
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

export default ResetPassword;
