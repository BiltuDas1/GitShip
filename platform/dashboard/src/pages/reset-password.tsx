import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PasswordIcon, CloseButton } from "../components/icons/AuthIcons";
import { TooltipInput } from "../components/ui/ToolTipsInput";
import { useResetPassword } from "../hooks/useResetPassword";
import "../styles/login.scss";
import "../styles/verify-email.scss";

type ResetState = "loading" | "form" | "success" | "error";

function isStrongPassword(password: string): boolean {
  return (
    password.length >= 8 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const { resetPassword, validateToken, IsLoading } = useResetPassword();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    password: string | null;
    confirmPassword: string | null;
  }>({ password: null, confirmPassword: null });
  const [state, setState] = useState<ResetState>(token ? "loading" : "error");
  const validationStarted = useRef(false);

  useEffect(() => {
    if (!token || validationStarted.current) {
      return;
    }

    validationStarted.current = true;
    validateToken(token).then((isValid) => {
      setState(isValid ? "form" : "error");
    });
  }, [token, validateToken]);

  const validate = () => {
    const nextErrors = { password: null as string | null, confirmPassword: null as string | null };

    if (!isStrongPassword(password)) {
      nextErrors.password =
        "Use at least 8 characters with uppercase, lowercase, number and special character";
    }

    if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(nextErrors);
    return !nextErrors.password && !nextErrors.confirmPassword;
  };

  async function submit() {
    if (!token || !validate()) {
      return;
    }

    const succeeded = await resetPassword(token, password);
    setState(succeeded ? "success" : "error");
  }

  if (state === "loading") {
    return (
      <main className="verification-container" aria-live="polite">
        <div className="verification-status loading-status">
          <span className="loading-spinner" aria-hidden="true" />
          <p>Checking your reset link</p>
        </div>
      </main>
    );
  }

  if (state !== "form") {
    const isSuccess = state === "success";

    return (
      <main className="verification-container" aria-live="polite">
        <div className={`verification-status ${isSuccess ? "success" : "error"}`}>
          <div className="status-icon" aria-hidden="true">
            {isSuccess ? "✓" : "!"}
          </div>
          <h1>{isSuccess ? "Password reset" : "Reset link invalid"}</h1>
          <p>
            {isSuccess
              ? "Your password has been updated successfully."
              : "This reset link is invalid or has expired."}
          </p>
          <button type="button" onClick={() => navigate("/auth/login")}>
            Go to login
          </button>
        </div>
      </main>
    );
  }

  return (
    <div className="login-container">
      <div className="closebtn" onClick={() => navigate("/")}>
        <CloseButton />
      </div>
      <form
        className="login-form"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <img className="logo" src="/logo.png" alt="GitShip Logo" />
        <div className="meta">
          <h2 className="title">Choose a new password</h2>
          <p className="description">Enter your new password below.</p>
        </div>
        <div className="user-input">
          <div className="password-input">
            <TooltipInput
              icon={<PasswordIcon />}
              type="password"
              id="reset-password"
              placeholder="New Password"
              value={password}
              error={errors.password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (errors.password) {
                  setErrors({ ...errors, password: null });
                }
              }}
            />
          </div>
          <div className="password-input">
            <TooltipInput
              icon={<PasswordIcon />}
              type="password"
              id="confirm-password"
              placeholder="Confirm Password"
              value={confirmPassword}
              error={errors.confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                if (errors.confirmPassword) {
                  setErrors({ ...errors, confirmPassword: null });
                }
              }}
            />
          </div>
          <button type="submit" disabled={IsLoading}>
            {IsLoading ? (
              <span className="auth-spinner" aria-label="Resetting password" />
            ) : (
              "Reset password"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ResetPassword;