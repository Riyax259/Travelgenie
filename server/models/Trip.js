import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    time: String,
    name: String,
    description: String,
    category: String,
    durationEstimate: String,
    lat: Number,
    long: Number,
    image: String,
  },
  { _id: false }
);

const daySchema = new mongoose.Schema(
  {
    day: Number,
    theme: String,
    activities: [activitySchema],
  },
  { _id: false }
);

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["in_progress", "completed"],
      default: "in_progress",
    },
    currentStage: {
      type: Number,
      default: 0,
    },
    tripProfile: {
      destination: String,
      duration: {
        days: Number,
        startDate: Date,
        endDate: Date,
      },
      groupType: String,
      budget: String,
      pace: String,
      dailyRhythm: String,
      interests: [String],
      dietaryNeeds: String,
      mustSee: [String],
      avoid: [String],
    },
    itinerary: {
      tripSummary: {
        destination: String,
        totalDays: Number,
        vibe: String,
      },
      days: [daySchema],
    },
  },
  { timestamps: true }
);

const Trip = mongoose.model("Trip", tripSchema);

export default Trip;