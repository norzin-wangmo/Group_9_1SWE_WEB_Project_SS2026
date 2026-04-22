"use client";

import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useRouter } from "next/navigation";

export default function Register() {
  const [name, setName] = useState("");
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleRegister = (e) => {
    e.preventDefault();

    // For now: simulate register → login
    login({ name, role: "user" });

    router.push("/");
  };

  return (
    <form onSubmit={handleRegister}>
      <h1>Register</h1>

      <input
        placeholder="Enter Name"
        onChange={(e) => setName(e.target.value)}
      />

      <button type="submit">Register</button>
    </form>
  );
}