/**
 * Waits for the auth session to resolve before deciding — without that, a
 * signed-in user refreshing the page gets bounced to /auth mid-load.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - The protected page.
 * @param {boolean} [props.requireStaff=false] - Require staff/admin role.
 */
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, requireStaff = false }) => {
  const { user, loading, isStaff } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/auth" />;
  if (requireStaff && !isStaff()) return <Navigate to="/dashboard" />;

  return children;
};

export default ProtectedRoute;
