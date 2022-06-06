import { useState } from "react";
import { Link } from "react-router-dom";
import useLocalState from "../utils/useLocalState";
import axios from "axios";

const Register = () => {
	const {
		alert,
		showAlert,
		loading,
		setLoading,
		hideAlert,
		success,
		setSuccess,
	} = useLocalState();
	const [values, setValues] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const handleChange = (e) => {
		setValues({ ...values, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		hideAlert();
		setLoading(true);

		const { email, name, password, confirmPassword } = values;
		const registerUser = { email, name, password };

		try {
			if (password !== confirmPassword) {
				setValues({
					...values,
					password: "",
					confirmPassword: "",
				});
				showAlert({
					text: "Passwords don't match!",
				});
			} else {
				const { data } = await axios.post(
					`/api/v1/auth/register`,
					registerUser
				);
				setSuccess(true);
				setValues({ name: "", email: "", password: "", confirmPassword: "" });
				showAlert({
					text: data.msg,
					type: "success",
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
					<p>{alert.text}</p>
					<Link to="/">Go back to Home page</Link>
				</div>
			)}
			{!success && (
				<form className="form-class" onSubmit={handleSubmit}>
					<div className="form-input">
						<label htmlFor="name">Your Name:</label>
						<input
							id="name"
							name="name"
							type="name"
							className="input-text"
							autoFocus={true}
							pattern="[a-zA-Z]+([0-9]+)?"
							value={values.email}
							onChange={handleChange}
						/>
					</div>
					<div className="form-input">
						<label htmlFor="email">Your Email:</label>
						<input
							id="email"
							name="email"
							type="email"
							className="input-text"
							value={values.email}
							onChange={handleChange}
						/>
					</div>
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
						<label htmlFor="confirmPassword">Confirm Password:</label>
						<input
							id="confirmPassword"
							name="confirmPassword"
							type="password"
							className="input-text"
							value={values.password}
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

export default Register;
