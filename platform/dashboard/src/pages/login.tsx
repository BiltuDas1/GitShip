import { useState } from "react";
import "../styles/login.scss";
import { useLogin } from "../hooks/useLogin";
import validator from "validator";
import { EmailIcon, PasswordIcon } from "../components/icons/AuthIcons";
import { TooltipInput } from "../components/ui/ToolTipsInput";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useLogin();
  const [error, setErrors] = useState<{
    email: null | string;
    password: null | string;
  }>({ email: null, password: null });

  // Validate input
  const validate = () => {
    let isValid = true;
    let newErrors: { email: null | string; password: null | string } = {
      email: null,
      password: null,
    };

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
    }

    setErrors(newErrors);
    return isValid;
  };

  return (
    <div className="login-container">
      <form
        className="login-form"
        action="javascript:;"
        onSubmit={(e) => {
          e.preventDefault();
          validate() && login(email, password);
        }}
      >
        <img className="logo" src="/logo.png" />
        <div className="meta">
          <h2 className="title">Welcome Back</h2>
          <p className="description">
            Don't have an account yet? <a href="/auth/register">Register Now</a>
          </p>
        </div>
        <div className="user-input">
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
                error.email != null && validate();
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
                error.password != null && validate();
              }}
            />
          </div>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}

export default Login;
