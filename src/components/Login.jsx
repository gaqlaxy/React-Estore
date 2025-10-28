import React, { useEffect } from "react";
import { signInWithPopup, auth, provider } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) navigate("/dashboard");
  }, [user, loading, navigate]);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Something went wrong during login!");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <h2>Login</h2>
      <button
        onClick={handleGoogleLogin}
        style={{
          background: "#4285F4",
          color: "#fff",
          padding: "0.75rem 1.5rem",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Sign in with Google
      </button>
    </div>
  );
}
