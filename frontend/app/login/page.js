"use client";

import { useAuthStore } from "../../store/authStore";
import { useState } from "react";

export default function Login() {
  const login = useAuthStore((state) => state.login);

  const [name, setName] = useState("");
  
  const handleLogin = () => {
    login({ name });
  };

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}