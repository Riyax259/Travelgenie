import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signup(name, email, password);
      navigate("/trips");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <form onSubmit={handleSubmit} style={{ width: "320px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <h1>let's get you set up</h1>
        {error && <p style={{ color: "var(--ember)", fontSize: "13px" }}>{error}</p>}
        <input
          style={inputStyle}
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          style={inputStyle}
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={inputStyle}
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button style={buttonStyle} type="submit">sign up</button>
        <p style={{ fontSize: "13px", color: "var(--mist)" }}>
          already have an account? <Link to="/login" style={{ color: "var(--glacier)" }}>log in</Link>
        </p>
      </form>
    </div>
  );
}

const inputStyle = {
  background: "var(--dusk)",
  border: "0.5px solid var(--dusk-light)",
  borderRadius: "var(--radius)",
  padding: "10px 12px",
  color: "var(--snow)",
  fontSize: "14px",
};

const buttonStyle = {
  background: "var(--ember)",
  color: "var(--ember-dark)",
  border: "none",
  borderRadius: "var(--radius)",
  padding: "10px",
  fontWeight: 500,
  marginTop: "8px",
};

export default SignupPage;