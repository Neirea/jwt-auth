import { useState } from "react";
import useLocalState from "../utils/useLocalState";
import axios from "axios";
import { Link } from "react-router-dom";

const ChangePassword = () => {
	const [values, setValues] = useState({
		oldPassword: "",
		newPassword: "",
		newPasswordConfirm: "",
	});
	const {
		alert,
		showAlert,
		hideAlert,
		loading,
		setLoading,
		success,
		setSuccess,
	} = useLocalState();
	const handleChange = (e) => {
		setValues({ ...values, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		hideAlert();

		const { oldPassword, newPassword, newPasswordConfirm } = values;

		try {
			//check if passwords match and if new pass is different from old one
			if (newPassword !== newPasswordConfirm || oldPassword === newPassword) {
				setValues({
					...values,
					newPassword: "",
					newPasswordConfirm: "",
				});
				const alertText =
					oldPassword === newPassword
						? "You've entered same password"
						: "Passwords don't match!";
				showAlert({
					text: alertText,
				});
			} else {
				await axios.patch("/api/v1/user/updateUserPassword", {
					oldPassword: oldPassword,
					newPassword: newPassword,
				});
				setSuccess(true);
				showAlert({
					text: "Password was successfuly changed!",
				});
			}
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
						<label htmlFor="oldPass">Old Password:</label>
						<input
							id="oldPass"
							name="oldPassword"
							type="password"
							className="input-text"
							value={values.oldPassword}
							onChange={handleChange}
						/>
					</div>
					<div className="form-input">
						<label htmlFor="newPass">New Password:</label>
						<input
							id="newPass"
							name="newPassword"
							type="password"
							className="input-text"
							value={values.newPassword}
							onChange={handleChange}
						/>
					</div>
					<div className="form-input">
						<label htmlFor="newPassConfirm">Confirm password:</label>
						<input
							id="newPassConfirm"
							name="newPasswordConfirm"
							type="password"
							className="input-text"
							value={values.newPasswordConfirm}
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

export default ChangePassword;
