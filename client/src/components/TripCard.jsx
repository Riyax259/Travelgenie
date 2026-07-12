import { Link } from "react-router-dom";
import { API_BASE } from "../config.js";

function TripCard({ trip }) {
  const isComplete = trip.status === "completed";
  const dest = trip.tripProfile?.destination || "untitled trip";

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>{dest}</h3>
      <p style={styles.meta}>
        {isComplete
          ? `${trip.itinerary?.tripSummary?.totalDays || "?"} days`
          : "in progress"}
      </p>
      <div style={styles.actions}>
        <Link
          to={isComplete ? `/trips/${trip._id}` : `/plan/${trip._id}`}
          style={styles.link}
        >
          {isComplete ? "view itinerary" : "continue planning"}
        </Link>
        {isComplete && (
          <a
            href={`${API_BASE}/api/trips/${trip._id}/pdf?token=${localStorage.getItem("token")}`}
            style={styles.link}
          >
            download pdf
          </a>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "var(--dusk)",
    borderRadius: "12px",
    padding: "1.25rem",
  },
  title: { fontSize: "18px", marginBottom: "6px" },
  meta: { color: "var(--mist)", fontSize: "13px", marginBottom: "14px" },
  actions: { display: "flex", gap: "12px" },
  link: { color: "var(--glacier)", fontSize: "13px" },
};

export default TripCard;