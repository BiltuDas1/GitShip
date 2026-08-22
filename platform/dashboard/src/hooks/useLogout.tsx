import axios from "axios";

export function useLogout() {
  const apiUrl: string | null = import.meta.env.VITE_API_URL;

  async function logout() {
    if (!apiUrl) {
      return;
    }

    await axios.delete(`${apiUrl}/users/session`, { withCredentials: true });
  }

  return { logout };
}