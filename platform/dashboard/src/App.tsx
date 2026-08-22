import { Route, Routes } from "react-router-dom";
import Auth from "./routes/auth";
import ErrorPage from "./pages/404";
import Homepage from "./pages/homepage";
import VerifyEmail from "./pages/verify-email";
import ResetPassword from "./pages/reset-password";
import Dashboard from "./pages/dashboard";
import "./styles/default.scss";
import { Slide, ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Routes>
        <Route path="/auth/*" element={<Auth />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* 404 Error */}
        <Route path="/*" element={<ErrorPage />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Slide}
      />
    </>
  );
}

export default App;
