import { Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import authService from "../services/authService";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    console.log("ProtectedRoute mounted, checking auth status");
    const isAuth = authService.isAuthenticated();
    console.log("Is authenticated:", isAuth);
  }, [location]);

  if (!authService.isAuthenticated()) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has access to the current path
  if (!authService.hasAccess(location.pathname)) {
    console.log("User does not have access to this route");
    return <Navigate to="/" replace />;
  }

  console.log("Authenticated and authorized, rendering protected content");
  return children;
};

export default ProtectedRoute;
