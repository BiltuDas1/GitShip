import { Route, Routes } from "react-router-dom";
import Auth from "./routes/auth";
import ErrorPage from "./pages/404";
import Homepage from "./pages/homepage";
import "./styles/default.scss";
import { Slide, ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Routes>
        <Route path="/auth/*" element={<Auth />} />
        <Route path="/" element={<Homepage />} />

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
