import ChatMessage from "../models/ChatMessage.js";
import Trip from "../models/Trip.js";
import { STAGES, REQUIRED_FIELDS } from "../config/stages.js";
import { extractFieldFromMessage } from "../services/llmService.js";

export const getChatHistory = async (req, res) => {
  try {
    const messages = await ChatMessage.find({ tripId: req.params.tripId }).sort({
      createdAt: 1,
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { message } = req.body;

    const trip = await Trip.findOne({ _id: tripId, userId: req.userId });
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Save the user's message
    await ChatMessage.create({
      tripId,
      role: "user",
      content: message,
      stage: trip.currentStage,
    });

    const currentStage = STAGES[trip.currentStage];

    if (!currentStage) {
      return res.status(200).json({
        reply: "We've got everything we need! Ready to generate your itinerary?",
        stageComplete: true,
        trip,
      });
    }

    // Build simple conversation context (last few messages) for the LLM
    const recentMessages = await ChatMessage.find({ tripId }).sort({ createdAt: -1 }).limit(6);
    const context = recentMessages
      .reverse()
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n");

    const { extracted, reply } = await extractFieldFromMessage(
      currentStage.field,
      message,
      context
    );

    if (extracted !== null) {
      // Update the trip profile with the extracted field
      if (currentStage.field === "duration") {
        trip.tripProfile.duration = { days: extracted };
      } else {
        trip.tripProfile[currentStage.field] = extracted;
      }

      trip.currentStage += 1;
      await trip.save();

      const nextStage = STAGES[trip.currentStage];
      const finalReply = nextStage ? `${reply} ${nextStage.question}` : reply;

      await ChatMessage.create({
        tripId,
        role: "assistant",
        content: finalReply,
        stage: trip.currentStage,
      });

      return res.status(200).json({
        reply: finalReply,
        nextStage: nextStage?.question || null,
        stageComplete: trip.currentStage >= STAGES.length,
        trip,
      });
    }

    // Extraction failed — save the re-ask reply, stay on the same stage
    await ChatMessage.create({
      tripId,
      role: "assistant",
      content: reply,
      stage: trip.currentStage,
    });

    return res.status(200).json({
      reply,
      stageComplete: false,
      trip,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};