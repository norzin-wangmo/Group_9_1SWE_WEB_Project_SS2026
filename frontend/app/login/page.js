"use client";

import { useState } from "react";   
import { useAuthStore } from "../../store/authStore";

export default function Login() {
  const login = useAuthStore((state) => state.login);
  const [name, setName] = useState("");

  const handleLogin = () => {
    if (!name) {
      alert("Please enter your name");
      return;
    }

    login({ name });
  };

  return (
    <div>
      <h1>Login Page</h1>

      <input
        placeholder="Enter your name"
        onChange={(e) => setName(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}