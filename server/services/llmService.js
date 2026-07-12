import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const extractFieldFromMessage = async (field, userMessage, conversationContext) => {
  const systemPrompt = `You are a friendly travel planning assistant having a conversation to plan a trip.

Your current job: extract the value for the field "${field}" from the user's latest message, and write a warm, brief conversational reply.

Rules:
- Respond in STRICT JSON only. No markdown, no commentary, no code fences.
- JSON shape: { "extracted": <value or null>, "reply": "<your conversational reply>" }
- If the field is "duration", extracted should be a number (days).
- If the field is "groupType", extracted must be one of: "solo", "couple", "friends", "family"
- If the field is "budget", extracted must be one of: "budget", "moderate", "luxury"
- If the field is "pace", extracted must be one of: "relaxed", "balanced", "packed"
- If the field is "dailyRhythm", extracted must be one of: "early_bird", "night_owl"
- If the field is "interests", extracted must be an array of strings from: ["nature","history_culture","food","nightlife","shopping","adventure_sports","offbeat_hidden_gems","relaxation_wellness","photography"]
- If the field is "destination" or "mustSee", extracted is a string (or array of strings for mustSee)
- If you truly cannot extract a clear value, set extracted to null and gently ask again in your reply
- Keep "reply" short — 1-2 sentences, warm and natural
- Do NOT ask unrelated follow-up questions or introduce new topics — only respond to what's needed for extracting "${field}", nothing else
- If extraction succeeds, your reply should simply acknowledge it warmly, not ask a different question


Conversation so far:
${conversationContext}`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    temperature: 0.4,
  });

  const raw = completion.choices[0].message.content;

  try {
    const cleaned = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    return { extracted: null, reply: "Sorry, could you say that again?" };
  }
};