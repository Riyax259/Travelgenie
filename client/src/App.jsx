import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import TripsHistoryPage from "./pages/TripsHistoryPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import ItineraryPage from "./pages/ItineraryPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/trips" element={<ProtectedRoute><TripsHistoryPage /></ProtectedRoute>} />
      <Route path="/trips/:tripId" element={<ProtectedRoute><ItineraryPage /></ProtectedRoute>} />
      <Route path="/plan/:tripId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;