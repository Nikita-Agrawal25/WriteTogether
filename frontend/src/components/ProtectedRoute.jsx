import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user-info"));
  return user ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;