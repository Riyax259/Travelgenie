import Trip from "../models/Trip.js";
import { generateItineraryPDF } from "../services/pdfService.js";

export const downloadTripPDF = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.tripId,
      userId: req.userId,
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.status !== "completed") {
      return res.status(400).json({ message: "Itinerary not ready yet" });
    }

    generateItineraryPDF(trip, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTrip = async (req, res) => {
  try {
    const trip = await Trip.create({
      userId: req.userId,
      status: "in_progress",
      currentStage: 0,
    });
    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.tripId,
      userId: req.userId,
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({
      _id: req.params.tripId,
      userId: req.userId,
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.status(200).json({ message: "Trip deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};