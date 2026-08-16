import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export function useRegister() {
  const [IsLoading, setIsLoading] = useState(false);
  const apiUrl: string | null = import.meta.env.VITE_API_URL;

  async function register(
    firstname: string,
    lastname: string,
    email: string,
    password: string
  ) {
    if (apiUrl === null) {
      throw new Error("VITE_API_URL is not set");
    }

    setIsLoading(true);
    return axios
      .post(
        `${apiUrl}/users/register`,
        {
          firstname,
          lastname,
          email,
          password,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setIsLoading(false);
        toast.success(
          res.data?.message || "Verification email sent. Please check your inbox."
        );
        return true;
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(
          err.response?.data?.message || "Registration failed. Please try again."
        );
        return false;
      });
  }

  return { register, IsLoading };
}
