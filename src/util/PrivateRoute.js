// import requred functions
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

/**
 * Pages only accessable to logged in and verified users.
 */
export function AuthOnly({ children }) {
  const { currentUser } = useAuth();
  return currentUser && currentUser.emailVerified ? children : <Navigate to="/login" />;
}

/**
 * Pages only accessable to logged out or unverified users.
 */
export function NoAuthOnly({ children }) {
  const { currentUser } = useAuth();
  return !currentUser || !currentUser.emailVerified ? children : <Navigate to="/" />;
}
