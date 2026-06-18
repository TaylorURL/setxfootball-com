/**
 * ProtectedRoute — gates a route on authentication, and optionally on staff
 * role. AuthProvider blocks the tree with a loading state until auth resolves,
 * so the guards here always see settled user/profile state.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - The protected page.
 * @param {boolean} [props.requireStaff=false] - Require staff/admin role.
 */
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, requireStaff = false }) => {
  const { user, isStaff } = useAuth();

  if (!user) return <Navigate to="/auth" />;
  if (requireStaff && !isStaff()) return <Navigate to="/dashboard" />;

  return children;
};

export default ProtectedRoute;
