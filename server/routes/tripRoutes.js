import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createTrip,
  getTrips,
  getTripById,
  deleteTrip,
  downloadTripPDF,
} from "../controllers/tripController.js";
import { generateTripItinerary } from "../controllers/generationController.js";

const router = express.Router();

router.use(protect);

router.post("/", createTrip);
router.get("/", getTrips);
router.get("/:tripId", getTripById);
router.delete("/:tripId", deleteTrip);
router.post("/:tripId/generate", generateTripItinerary);
router.get("/:tripId/pdf", downloadTripPDF);

export default router;