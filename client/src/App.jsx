import { Routes, Route } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import "./styles/index.css";

import {
	Home,
	Login,
	Register,
	Verify,
	ForgotPassword,
	ResetPassword,
	UserSettings,
	AdminRoute,
	Unauthorized,
	Error,
} from "./pages";

import { useGlobalContext } from "./store/AppContext";

// what accesses each role has
const ROLES = {
	user: ["user", "admin"],
	admin: ["admin"],
};

function App() {
	const { isLoading } = useGlobalContext();

	if (isLoading) {
		return (
			<main className="center-flex">
				<h1>Loading...</h1>
			</main>
		);
	}

	return (
		<>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/unauthorized" element={<Unauthorized />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/verify-email" element={<Verify />} />
				<Route path="/forgot-password" element={<ForgotPassword />} />
				<Route path="/reset-password" element={<ResetPassword />} />
				{/* user routes */}
				<Route element={<RequireAuth key={"user"} allowedRoles={ROLES.user} />}>
					<Route path="/user-settings" element={<UserSettings />} />
				</Route>
				{/* admin routes */}
				<Route
					element={<RequireAuth key={"admin"} allowedRoles={ROLES.admin} />}
				>
					<Route path="/admin-route" element={<AdminRoute />} />
				</Route>
				{/* Any other routes */}
				<Route path="*" element={<Error />} />
			</Routes>
		</>
	);
}

export default App;
