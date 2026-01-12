import { Route, Routes } from "react-router-dom";
import Login from "../pages/login";
import Register from "../pages/register";

function Auth() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/login" element={<Register />} />
    </Routes>
  );
}

export default Auth;
