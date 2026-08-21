import { useState } from "react";
import validator from "validator";
import { useNavigate } from "react-router-dom";
import { CloseButton, EmailIcon } from "../components/icons/AuthIcons";
import { TooltipInput } from "../components/ui/ToolTipsInput";
import { useForgotPassword } from "../hooks/useForgotPassword";
import "../styles/login.scss";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { requestReset, IsLoading } = useForgotPassword();
  const navigate = useNavigate();

  const validate = () => {
    if (!email) {
      setError("Input an Email Address");
      return false;
    }

    if (!validator.isEmail(email)) {
      setError("Invalid Email Format");
      return false;
    }

    setError(null);
    return true;
  };

  return (
    <div className="login-container">
      <div className="closebtn" onClick={() => navigate("/")}>
        <CloseButton />
      </div>
      <form
        className="login-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (validate()) {
            requestReset(email.trim());
          }
        }}
      >
        <img className="logo" src="/logo.png" alt="GitShip Logo" />
        <div className="meta">
          <h2 className="title">Forgot Password?</h2>
          <p className="description">
            Enter your email and we'll send you a reset link.
          </p>
        </div>
        <div className="user-input">
          <div className="email-input">
            <TooltipInput
              icon={<EmailIcon />}
              type="email"
              id="reset-email"
              placeholder="Email Address"
              value={email}
              error={error}
              onChange={(event) => {
                setEmail(event.target.value);
                if (error) {
                  validate();
                }
              }}
            />
          </div>
          <button type="submit" disabled={IsLoading}>
            {IsLoading ? (
              <span className="auth-spinner" aria-label="Sending reset email" />
            ) : (
              "Send reset link"
            )}
          </button>
          <button
            className="auth-secondary-button"
            type="button"
            onClick={() => navigate("/auth/login")}
          >
            Back to login
          </button>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;