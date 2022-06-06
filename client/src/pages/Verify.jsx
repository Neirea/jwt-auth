import { useState, useEffect } from "react";
import useLocalState from "../utils/useLocalState";
import { useQuery } from "../utils/useQuery";
import axios from "axios";
import { Link } from "react-router-dom";

const Verify = () => {
	const query = useQuery();
	const { loading, setLoading } = useLocalState();
	const [error, setError] = useState(false);
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		const verifyToken = async () => {
			setLoading(true);
			try {
				await axios.post(`/api/v1/auth/verify-email`, {
					verificationToken: query.get("token"),
					email: query.get("email"),
				});
				setSuccess(true);
			} catch (err) {
				setError(true);
			} finally {
				setLoading(false);
			}
		};
		verifyToken();
	}, [query, setLoading]);

	if (loading) {
		return (
			<main className="center-flex">
				<h2>Loading...</h2>
			</main>
		);
	}
	if (success) {
		return (
			<main className="center-flex">
				<h2>Account Confirmed</h2>
				<Link className="btn" to="/login"></Link>
			</main>
		);
	}

	if (error) {
		return (
			<main className="center-flex">
				<h2>There was an error, please double check your verification link</h2>
			</main>
		);
	}
	return <></>;
};

export default Verify;
