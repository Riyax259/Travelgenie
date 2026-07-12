import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function LandingPage() {
  const { user } = useAuth();

  return (
    <div style={styles.hero}>
      <div style={styles.overlay} />
      <div style={styles.content}>
        <p style={styles.eyebrow}>basecamp</p>
        <h1 style={styles.headline}>
          {user ? `welcome back, ${user.name}` : "plan the trail before you take it"}
        </h1>
        <p style={styles.tagline}>talk it through, hear it back, get a route worth printing.</p>
        <div style={styles.actions}>
          <Link to={user ? "/plan/new" : "/signup"} style={styles.primaryBtn}>
            plan a new trip
          </Link>
          <Link to={user ? "/trips" : "/login"} style={styles.secondaryBtn}>
            {user ? "my trips" : "log in"}
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  hero: {
    minHeight: "100vh",
    backgroundImage:
      "linear-gradient(180deg, rgba(11,14,17,0.3) 0%, rgba(11,14,17,0.95) 100%), url('/mountain-hero.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "flex-end",
    position: "relative",
  },
  overlay: {},
  content: { padding: "4rem", maxWidth: "600px" },
  eyebrow: {
    fontFamily: "var(--font-mono)",
    fontSize: "13px",
    color: "var(--mist)",
    letterSpacing: "0.08em",
    marginBottom: "10px",
  },
  headline: { fontSize: "42px", marginBottom: "14px", lineHeight: 1.25 },
  tagline: { color: "var(--mist)", marginBottom: "28px", fontSize: "15px" },
  actions: { display: "flex", gap: "14px" },
  primaryBtn: {
    background: "var(--ember)",
    color: "var(--ember-dark)",
    padding: "12px 22px",
    borderRadius: "var(--radius)",
    fontWeight: 500,
    fontSize: "14px",
  },
  secondaryBtn: {
    background: "transparent",
    color: "var(--snow)",
    border: "0.5px solid var(--dusk-light)",
    padding: "12px 22px",
    borderRadius: "var(--radius)",
    fontWeight: 500,
    fontSize: "14px",
  },
};

export default LandingPage;