import Trip from "../models/Trip.js";
import { getPlacesForDestination } from "../services/placesService.js";
import { generateItinerary } from "../services/itineraryService.js";
import { enrichItinerary } from "../services/enrichmentService.js";
import { attachImages } from "../services/imageService.js";
import { REQUIRED_FIELDS } from "../config/stages.js";

export const generateTripItinerary = async (req, res) => {
  try {
    const { tripId } = req.params;

    const trip = await Trip.findOne({ _id: tripId, userId: req.userId });
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const missing = REQUIRED_FIELDS.filter((field) => {
      const value = trip.tripProfile[field];
      return !value || (Array.isArray(value) && value.length === 0);
    });

    if (missing.length > 0) {
      return res.status(400).json({
        message: "Trip profile incomplete",
        missingFields: missing,
      });
    }

    // 1. RETRIEVAL
    const places = await getPlacesForDestination(trip.tripProfile.destination);

    if (places.length === 0) {
      return res.status(400).json({
        message: "Couldn't find enough places for this destination",
      });
    }

    // 2. GENERATION (grounded in retrieved places)
    const rawItinerary = await generateItinerary(trip.tripProfile, places);

    // 3. ENRICHMENT — attach coordinates via fuzzy matching
    const withCoords = enrichItinerary(rawItinerary, places);

    // 4. ENRICHMENT — attach images
    const finalItinerary = await attachImages(withCoords);

    // 5. Save
    trip.itinerary = finalItinerary;
    trip.status = "completed";
    await trip.save();

    res.status(200).json(trip);
  } catch (error) {
    console.error("Generation error:", error);
    res.status(500).json({ message: "Failed to generate itinerary", error: error.message });
  }
};