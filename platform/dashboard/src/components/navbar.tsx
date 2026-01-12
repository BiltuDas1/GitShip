import { useState } from "react";
import { motion } from "framer-motion";
import "../styles/components/navbar.scss";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navItems = ["Home", "FAQ", "Contact"];
  const [selectedItem, setSelectedItem] = useState(navItems[0]);
  const navigate = useNavigate();

  return (
    <nav>
      <div className="logo">
        <img src="/logo.png" />
        <p>GitShip</p>
      </div>
      <ul>
        {navItems.map((item) => (
          <li
            key={item}
            className={selectedItem === item ? "selected" : ""}
            onClick={() => setSelectedItem(item)}
          >
            <span>{item}</span>
            {selectedItem === item && (
              <motion.div className="active" layoutId="active-pill" />
            )}
          </li>
        ))}
      </ul>
      <div className="login-register">
        <button
          className="login"
          onClick={() => {
            navigate("/auth/login");
          }}
        >
          Login
        </button>
        <button
          className="register"
          onClick={() => {
            navigate("/auth/register");
          }}
        >
          Register
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
