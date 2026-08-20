import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/verify-email.scss";

type VerificationState = "loading" | "success" | "error";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const apiUrl = import.meta.env.VITE_API_URL;
  const [state, setState] = useState<VerificationState>(
    token && apiUrl ? "loading" : "error",
  );
  const requestStarted = useRef(false);

  useEffect(() => {
    if (!token || !apiUrl || requestStarted.current) {
      return;
    }
    requestStarted.current = true;

    axios
      .get(`${apiUrl}/users/verify`, { params: { token } })
      .then(() => setState("success"))
      .catch(() => setState("error"));
  }, [apiUrl, token]);

  if (state === "loading") {
    return (
      <main className="verification-container" aria-live="polite">
        <div className="verification-status loading-status">
          <span className="loading-spinner" aria-hidden="true" />
          <p>Verifying your email</p>
        </div>
      </main>
    );
  }

  const isSuccess = state === "success";

  return (
    <main className="verification-container" aria-live="polite">
      <div className={`verification-status ${isSuccess ? "success" : "error"}`}>
        <div className="status-icon" aria-hidden="true">
          {isSuccess ? "✓" : "!"}
        </div>
        <h1>{isSuccess ? "Email verified" : "Verification failed"}</h1>
        <p>
          {isSuccess
            ? "Your account is ready to use."
            : "This verification link is invalid or has expired."}
        </p>
        {isSuccess && (
          <button type="button" onClick={() => navigate("/auth/login")}>
            Go to login
          </button>
        )}
      </div>
    </main>
  );
}

export default VerifyEmail;