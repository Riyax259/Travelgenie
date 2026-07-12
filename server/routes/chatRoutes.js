import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getChatHistory, sendMessage } from "../controllers/chatController.js";

const router = express.Router();

router.use(protect);

router.get("/:tripId", getChatHistory);
router.post("/:tripId", sendMessage);

export default router;