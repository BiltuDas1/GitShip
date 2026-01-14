import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export function useLogin() {
  const [IsLoading, setIsLoading] = useState(false);
  const apiUrl: string | null = import.meta.env.VITE_API_URL;

  async function login(email: string, password: string) {
    if (apiUrl === null) {
      throw new Error("VITE_API_URL is not set");
    }

    setIsLoading(true);
    axios
      .post(
        `${apiUrl}/users/login`,
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        },
      )
      .then(() => {
        setIsLoading(false);
        toast.success("Login Successful");
      })
      .catch(() => {
        setIsLoading(false);
        toast.error("Invalid Email or Password");
      });
  }
  return { login, IsLoading };
}
