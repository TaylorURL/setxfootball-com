/**
 * Waits for the auth session to resolve before deciding. Without that, a
 * signed-in user refreshing the page gets bounced to /auth mid-load.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - The protected page.
 * @param {boolean} [props.requireStaff=false] - Require staff/admin role.
 */
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Skeleton, { LoadingRegion } from "../ui/Skeleton";

const ProtectedRoute = ({ children, requireStaff = false }) => {
  const { user, loading, isStaff } = useAuth();

  // A blank page for the length of a session round trip reads as a broken one.
  if (loading) {
    return (
      <LoadingRegion
        label="Checking your sign-in"
        className="mx-auto w-full max-w-[1440px] px-5 py-10 sm:px-8 sm:py-14 lg:px-10"
      >
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-5 h-12 w-64 sm:h-14 lg:h-16" />
        <Skeleton className="mt-4 h-6 w-72" />
      </LoadingRegion>
    );
  }
  if (!user) return <Navigate to="/auth" />;
  if (requireStaff && !isStaff()) return <Navigate to="/dashboard" />;

  return children;
};

export default ProtectedRoute;
