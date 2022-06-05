import { useState, useCallback } from "react";

const useLocalState = () => {
	const [alert, setAlert] = useState({
		show: false,
		text: "",
	});
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const showAlert = useCallback(
		({ text }) => {
			setAlert({ show: true, text });
		},
		[setAlert]
	);
	const hideAlert = useCallback(() => {
		setAlert({ show: false, text: "", type: "danger" });
	}, [setAlert]);
	return {
		alert,
		showAlert,
		loading,
		setLoading,
		success,
		setSuccess,
		hideAlert,
	};
};

export default useLocalState;
