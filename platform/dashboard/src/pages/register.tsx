import { useState } from "react";
import "../styles/login.scss";
import { useRegister } from "../hooks/useRegister";
import validator from "validator";
import {
  CloseButton,
  EmailIcon,
  PasswordIcon,
  UserIcon,
} from "../components/icons/AuthIcons";
import { TooltipInput } from "../components/ui/ToolTipsInput";
import { useNavigate } from "react-router-dom";

function Register() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useRegister();
  const navigate = useNavigate();
  const [error, setErrors] = useState<{
    firstname: null | string;
    lastname: null | string;
    email: null | string;
    password: null | string;
  }>({ firstname: null, lastname: null, email: null, password: null });

  // Validate input
  const validate = () => {
    let isValid = true;
    const newErrors = {
      firstname: null as null | string,
      lastname: null as null | string,
      email: null as null | string,
      password: null as null | string,
    };

    if (!firstname.trim()) {
      newErrors.firstname = "Provide a First Name";
      isValid = false;
    } else if (!validator.isAlpha(firstname.trim())) {
      newErrors.firstname = "Letters only (A-Z)";
      isValid = false;
    }

    if (!lastname.trim()) {
      newErrors.lastname = "Provide a Last Name";
      isValid = false;
    } else if (!validator.isAlpha(lastname.trim())) {
      newErrors.lastname = "Letters only (A-Z)";
      isValid = false;
    }

    if (!email) {
      newErrors.email = "Input an Email Address";
      isValid = false;
    } else if (!validator.isEmail(email)) {
      newErrors.email = "Invalid Email Format";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Provide a Password";
      isValid = false;
    } else if (password.length < 8) {
      newErrors.password = "Must be at least 8 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  return (
    <div className="login-container">
      <div
        className="closebtn"
        onClick={() => {
          navigate("/");
        }}
      >
        <CloseButton />
      </div>
      <form
        className="login-form"
        action="javascript:;"
        onSubmit={(e) => {
          e.preventDefault();
          if (validate()) {
            register(firstname.trim(), lastname.trim(), email, password);
          }
        }}
      >
        <img className="logo" src="/logo.png" alt="GitShip Logo" />
        <div className="meta">
          <h2 className="title">Create an Account</h2>
          <p className="description">
            Already have an account?{" "}
            <a
              onClick={() => {
                navigate("/auth/login");
              }}
            >
              Sign In
            </a>
          </p>
        </div>
        <div className="user-input">
          <div className="text-input">
            <TooltipInput
              icon={<UserIcon />}
              type="text"
              id="user-firstname"
              placeholder="First Name"
              value={firstname}
              error={error.firstname}
              onChange={(e) => {
                setFirstname(e.target.value);
                if (error.firstname != null) validate();
              }}
            />
          </div>
          <div className="text-input">
            <TooltipInput
              icon={<UserIcon />}
              type="text"
              id="user-lastname"
              placeholder="Last Name"
              value={lastname}
              error={error.lastname}
              onChange={(e) => {
                setLastname(e.target.value);
                if (error.lastname != null) validate();
              }}
            />
          </div>
          <div className="email-input">
            <TooltipInput
              icon={<EmailIcon />}
              type="text"
              id="user-email"
              placeholder="Email Address"
              value={email}
              error={error.email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error.email != null) validate();
              }}
            />
          </div>
          <div className="password-input">
            <TooltipInput
              icon={<PasswordIcon />}
              type="password"
              id="user-password"
              placeholder="Password"
              value={password}
              error={error.password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error.password != null) validate();
              }}
            />
          </div>
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
}

export default Register;
