import { Route, Routes } from "react-router-dom";
import Login from "../pages/login";
import Register from "../pages/register";
import ForgotPassword from "../pages/forgot-password";
import { Navigate } from "react-router-dom";
import { useSession } from "../hooks/useSession";

function Auth() {
  const { isAuthenticated, isChecking } = useSession();

  if (isChecking) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
}

export default Auth;
