"use client";

import {  useState } from "react";
import { useAuth } from "@/hooks";

const UsernameForm = () => {
  const { needsUserName, updateUserName } = useAuth();
  const [userName, setUserName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      try {
        await updateUserName(userName);
        setError(null); // Clear any previous errors
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : 'An  error occurred updating the user');
      }
    }
  };

  if (!needsUserName) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <h2>Please provide a username</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your username"
            required
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default UsernameForm;