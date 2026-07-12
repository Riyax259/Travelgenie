import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import TripCard from "../components/TripCard.jsx";

function TripsHistoryPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/trips").then((res) => {
      setTrips(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ padding: "2rem" }}>loading...</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1>my trips</h1>
        <Link to="/plan/new" style={{ color: "var(--ember)" }}>+ new trip</Link>
      </div>

      {trips.length === 0 ? (
        <p style={{ color: "var(--mist)" }}>no trips yet — start your first one.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
          {trips.map((trip) => (
            <TripCard key={trip._id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
}

export default TripsHistoryPage;