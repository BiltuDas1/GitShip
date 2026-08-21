import axios from "axios";
import { useState } from "react";

export function useResetPassword() {
  const [IsLoading, setIsLoading] = useState(false);
  const apiUrl: string | null = import.meta.env.VITE_API_URL;

  async function resetPassword(token: string, password: string) {
    if (apiUrl === null) {
      throw new Error("VITE_API_URL is not set");
    }

    setIsLoading(true);
    return axios
      .post(`${apiUrl}/users/password/update`, { token, password })
      .then(() => true)
      .catch(() => false)
      .finally(() => setIsLoading(false));
  }

  async function validateToken(token: string) {
    if (apiUrl === null) {
      return false;
    }

    return axios
      .get(`${apiUrl}/users/password/validate`, { params: { token } })
      .then(() => true)
      .catch(() => false);
  }

  return { resetPassword, validateToken, IsLoading };
}