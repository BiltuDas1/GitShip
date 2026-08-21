import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export function useForgotPassword() {
  const [IsLoading, setIsLoading] = useState(false);
  const apiUrl: string | null = import.meta.env.VITE_API_URL;

  async function requestReset(email: string) {
    if (apiUrl === null) {
      throw new Error("VITE_API_URL is not set");
    }

    setIsLoading(true);
    return axios
      .post(`${apiUrl}/users/password/reset`, { email })
      .then(() => {
        toast.success("If an account exists, a reset email is on its way.");
        return true;
      })
      .catch(() => {
        toast.error("Unable to send the reset email. Please try again.");
        return false;
      })
      .finally(() => setIsLoading(false));
  }

  return { requestReset, IsLoading };
}