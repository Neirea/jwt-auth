import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useGlobalContext } from "../store/AppContext";

const RequireAuth = ({ allowedRoles }) => {
	const { user } = useGlobalContext();
	const location = useLocation();

	return allowedRoles?.includes(user?.role) ? (
		<Outlet />
	) : user ? (
		<Navigate to="/unauthorized" state={{ from: location }} replace />
	) : (
		<Navigate to="/login" state={{ from: location }} replace />
	);
};

export default RequireAuth;
