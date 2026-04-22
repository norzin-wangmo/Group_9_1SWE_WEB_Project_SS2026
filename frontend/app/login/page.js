"use client";

import { useAuthStore } from "../../store/authStore";

export default function Login() {
  const login = useAuthStore((state) => state.login);

  const handleLogin = () => {
    login({ name: "Kinley", role: "user" });
  };

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}