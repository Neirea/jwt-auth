import { useContext, useState, useEffect, createContext } from "react";
import axios from "axios";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [user, setUser] = useState(null);

	const fetchUser = async () => {
		try {
			const { data } = await axios.get("/api/v1/user/showMe");
			if (data) setUser(data.user);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchUser();
	}, []);

	const logoutUser = async () => {
		try {
			await axios.delete("/api/v1/auth/logout");
			setUser(null);
		} catch (error) {}
	};

	return (
		<AppContext.Provider
			value={{
				isLoading,
				setUser,
				user,
				logoutUser,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

export const useGlobalContext = () => {
	return useContext(AppContext);
};

export { AppProvider };
