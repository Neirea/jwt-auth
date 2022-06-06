import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useLocalState from "../utils/useLocalState";
import { useGlobalContext } from "../store/AppContext";

const Login = () => {
	const navigate = useNavigate();
	const { setUser } = useGlobalContext();
	const { alert, showAlert, loading, setLoading, hideAlert } = useLocalState();
	const [values, setValues] = useState({
		email: "",
		password: "",
		remember: false,
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		hideAlert();
		try {
			const { data } = await axios.post("/api/v1/auth/login", values);
			setUser(data.user);
			setLoading(false);
			navigate("/");
		} catch (error) {
			setLoading(false);
			showAlert({ text: error?.response?.data?.msg || "there was an error" });
		}
	};

	const handleChange = (e) => {
		const inputValue =
			e.target.type === "checkbox" ? e.target.checked : e.target.value;
		setValues({ ...values, [e.target.name]: inputValue });
	};

	return (
		<main className="center-flex">
			<form className="form-class" onSubmit={handleSubmit}>
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
				<div className="form-checkbox">
					<input
						id="cb"
						name="remember"
						type="checkbox"
						className="input-checkbox"
						checked={values.remember}
						onChange={handleChange}
					/>
					<label htmlFor="cb">Remember me?</label>
				</div>
				{alert.show && <p className="alert">{alert.text}</p>}
				<button type="submit" className="btn submit" disabled={loading}>
					Submit
				</button>
			</form>
		</main>
	);
};

export default Login;
