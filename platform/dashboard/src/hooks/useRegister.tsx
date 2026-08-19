import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { toSentenceCase } from "../utils/case";

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
        if (res.data?.status) {
          toast.success("Verification email sent. Please check your inbox.");
        } else {
          toast.error(toSentenceCase(res.data?.message))
        }
        return true;
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(
          toSentenceCase(err.response?.data?.message) || "Registration failed. Please try again."
        );
        return false;
      });
  }

  return { register, IsLoading };
}
