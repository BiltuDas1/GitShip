import axios from "axios";
import { useEffect, useState } from "react";

let sessionRequest: Promise<boolean> | null = null;

function checkSession(apiUrl: string): Promise<boolean> {
  if (!sessionRequest) {
    sessionRequest = axios
      .post(`${apiUrl}/auth/refresh`, undefined, { withCredentials: true })
      .then(() => true)
      .catch(() => false)
      .finally(() => {
        sessionRequest = null;
      });
  }

  return sessionRequest;
}

export function useSession() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const apiUrl: string | null = import.meta.env.VITE_API_URL;
  const [isChecking, setIsChecking] = useState(() => Boolean(apiUrl));

  useEffect(() => {
    if (!apiUrl) {
      return;
    }

    checkSession(apiUrl)
      .then((isValid) => setIsAuthenticated(isValid))
      .finally(() => setIsChecking(false));
  }, [apiUrl]);

  return { isAuthenticated, isChecking };
}