import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/trips");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={styles.wrapper}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h1 style={styles.heading}>welcome back</h1>
        {error && <p style={styles.error}>{error}</p>}
        <input
          style={styles.input}
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button style={styles.button} type="submit">log in</button>
        <p style={styles.link}>
          no account? <Link to="/signup" style={{ color: "var(--glacier)" }}>sign up</Link>
        </p>
      </form>
    </div>
  );
}

const styles = {
  wrapper: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" },
  form: { width: "320px", display: "flex", flexDirection: "column", gap: "12px" },
  heading: { marginBottom: "8px" },
  input: {
    background: "var(--dusk)",
    border: "0.5px solid var(--dusk-light)",
    borderRadius: "var(--radius)",
    padding: "10px 12px",
    color: "var(--snow)",
    fontSize: "14px",
  },
  button: {
    background: "var(--ember)",
    color: "var(--ember-dark)",
    border: "none",
    borderRadius: "var(--radius)",
    padding: "10px",
    fontWeight: 500,
    marginTop: "8px",
  },
  error: { color: "var(--ember)", fontSize: "13px" },
  link: { fontSize: "13px", color: "var(--mist)", marginTop: "8px" },
};

export default LoginPage;