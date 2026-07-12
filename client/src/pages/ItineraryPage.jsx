import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import api from "../services/api.js";
import { API_BASE } from "../config.js";
import "leaflet/dist/leaflet.css";

function ItineraryPage() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    api.get(`/trips/${tripId}`).then((res) => setTrip(res.data));
  }, [tripId]);

  if (!trip) return <div style={{ padding: "2rem" }}>Loading...</div>;

  const allActivities = trip.itinerary.days
    .flatMap((d) => d.activities)
    .filter((a) => a.lat && a.long);

  const center = allActivities.length
    ? [allActivities[0].lat, allActivities[0].long]
    : [20, 78];

  const dayColors = ["#E8834E", "#5FA8C7", "#97C459", "#D4537E", "#EF9F27"];

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1>{trip.itinerary.tripSummary.destination}</h1>

      <p style={{ color: "var(--mist)", marginBottom: "1.5rem" }}>
        {trip.itinerary.tripSummary.vibe}
      </p>

      <div
        style={{
          height: "350px",
          borderRadius: "12px",
          overflow: "hidden",
          marginBottom: "2rem",
        }}
      >
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

          {trip.itinerary.days.map((day, dIdx) =>
            day.activities
              .filter((a) => a.lat && a.long)
              .map((a, aIdx) => (
                <Marker
                  key={`${dIdx}-${aIdx}`}
                  position={[a.lat, a.long]}
                >
                  <Popup>
                    <strong>{a.name}</strong>
                    <br />
                    Day {day.day}
                  </Popup>
                </Marker>
              ))
          )}
        </MapContainer>
      </div>

      {/* Download PDF */}
      <a
        href={`${API_BASE}/api/trips/${tripId}/pdf?token=${localStorage.getItem("token")}`}
       
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: "var(--ember)",
          display: "inline-block",
          marginBottom: "2rem",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        Download PDF
      </a>

      {trip.itinerary.days.map((day, i) => (
        <div key={i} style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              color: dayColors[i % dayColors.length],
              marginBottom: "10px",
            }}
          >
            Day {day.day}: {day.theme}
          </h2>

          {day.activities.map((a, j) => (
            <div
              key={j}
              style={{
                background: "var(--dusk)",
                borderRadius: "12px",
                padding: "1rem",
                marginBottom: "10px",
              }}
            >
              <p style={{ fontSize: "13px", color: "var(--mist)" }}>
                {a.time} · {a.category}
              </p>

              <h3 style={{ margin: "6px 0" }}>{a.name}</h3>

              <p style={{ fontSize: "13px", color: "var(--mist)" }}>
                {a.description}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default ItineraryPage;