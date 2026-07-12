import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const formatPlacesList = (places) => {
  return places
    .map((p, i) => `${i + 1}. ${p.name} | category: ${p.category}`)
    .join("\n");
};

export const generateItinerary = async (tripProfile, places) => {
  const placesList = formatPlacesList(places);

  const systemPrompt = `You are an expert travel itinerary planner.

GROUNDING RULE (most important): You must ONLY use places from the RETRIEVED PLACES list below. Do not invent, assume, or add any place not in this list.

RETRIEVED PLACES:
${placesList}

USER TRIP PROFILE:
- Destination: ${tripProfile.destination}
- Days: ${tripProfile.duration.days}
- Group: ${tripProfile.groupType}
- Budget: ${tripProfile.budget}
- Pace: ${tripProfile.pace}
- Daily rhythm: ${tripProfile.dailyRhythm}
- Interests: ${tripProfile.interests.join(", ")}
- Must include: ${(tripProfile.mustSee || []).join(", ") || "none specified"}
- Avoid: ${(tripProfile.avoid || []).join(", ") || "none specified"}

TASK:
- Build a ${tripProfile.duration.days}-day itinerary using ONLY the retrieved places above
- Pace guide: relaxed = 2-3 activities/day, balanced = 3-4, packed = 5-6
- If dailyRhythm is "early_bird", start around 7-8am. If "night_owl", start around 10-11am and include evening activities
- Prioritize places matching the user's interests, but keep the schedule realistic and geographically sensible
- Include must-see places if they appear in the retrieved list
- Never include anything in the avoid list

OUTPUT FORMAT — respond in STRICT JSON only, no markdown, no commentary:
{
  "tripSummary": { "destination": "...", "totalDays": ..., "vibe": "..." },
  "days": [
    {
      "day": 1,
      "theme": "...",
      "activities": [
        { "time": "8:00 AM", "name": "EXACT name from retrieved list", "description": "...", "category": "...", "durationEstimate": "2 hours" }
      ]
    }
  ]
}`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "system", content: systemPrompt }],
    temperature: 0.6,
  });

  const raw = completion.choices[0].message.content;
  const cleaned = raw.replace(/```json|```/g, "").trim();

  return JSON.parse(cleaned);
};