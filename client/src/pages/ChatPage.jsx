import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api.js";

function ChatPage() {
  const { tripId: paramTripId } = useParams();
  const navigate = useNavigate();
  const [tripId, setTripId] = useState(paramTripId === "new" ? null : paramTripId);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [stageComplete, setStageComplete] = useState(false);
  const [muted, setMuted] = useState(false);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const mutedRef = useRef(false); // mirrors `muted` so speak() always reads the latest value

  useEffect(() => {
    mutedRef.current = muted;
    if (muted) {
      window.speechSynthesis.cancel(); // stop mid-sentence immediately when muted
    }
  }, [muted]);

  useEffect(() => {
    const init = async () => {
      let id = tripId;
      if (!id) {
        const res = await api.post("/trips");
        id = res.data._id;
        setTripId(id);
        navigate(`/plan/${id}`, { replace: true });
      }
      const history = await api.get(`/chat/${id}`);
      if (history.data.length === 0) {
        setMessages([{ role: "assistant", content: "Hey! Where are you dreaming of going?" }]);
      } else {
        setMessages(history.data);
      }
    };
    init();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speak = (text) => {
    if (mutedRef.current) return; // respect mute state
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1.05;
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = async (text) => {
    if (!text.trim() || !tripId) return;
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post(`/chat/${tripId}`, { message: text });
      setMessages((prev) => [...prev, { role: "assistant", content: res.data.reply }]);
      speak(res.data.reply);
      if (res.data.stageComplete) setStageComplete(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleMic = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input isn't supported in this browser — try Chrome.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      sendMessage(transcript);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      await api.post(`/trips/${tripId}/generate`);
      navigate(`/trips/${tripId}`);
    } catch (err) {
      alert(err.response?.data?.message || "Generation failed");
      setLoading(false);
    }
  };

  return (
    <div style={styles.outer}>
      <div style={styles.scrollContainer}>
        <div style={styles.inner}>
          <div style={styles.topBar}>
            <button style={styles.muteBtn(muted)} onClick={() => setMuted((m) => !m)}>
              {muted ? "voice off" : "voice on"}
            </button>
          </div>

          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                ...styles.bubble,
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                background: m.role === "user" ? "var(--ember)" : "var(--dusk)",
                color: m.role === "user" ? "var(--ember-dark)" : "var(--snow)",
              }}
            >
              {m.content}
            </div>
          ))}
          {loading && <div style={{ ...styles.bubble, background: "var(--dusk)" }}>...</div>}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div style={styles.bottomBarWrap}>
        <div style={styles.inner}>
          {stageComplete ? (
            <button style={styles.generateBtn} onClick={handleGenerate}>
              generate my itinerary
            </button>
          ) : (
            <div style={styles.inputBar}>
              <button style={styles.micBtn(isListening)} onClick={toggleMic}>
                {isListening ? "listening..." : "mic"}
              </button>
              <input
                style={styles.textInput}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder="type or tap the mic..."
              />
              <button style={styles.sendBtn} onClick={() => sendMessage(input)}>
                send
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  outer: { display: "flex", flexDirection: "column", height: "100vh" },
  scrollContainer: { flex: 1, overflowY: "auto", width: "100%" },
  inner: { maxWidth: "700px", margin: "0 auto", padding: "0 2rem" },
  topBar: { display: "flex", justifyContent: "flex-end", padding: "1.5rem 0 0.5rem" },
  muteBtn: (isMuted) => ({
    background: isMuted ? "var(--dusk)" : "transparent",
    color: isMuted ? "var(--mist)" : "var(--glacier)",
    border: "0.5px solid var(--dusk-light)",
    borderRadius: "var(--radius)",
    padding: "6px 12px",
    fontSize: "12px",
  }),
  bubble: {
    padding: "10px 16px",
    borderRadius: "14px",
    maxWidth: "75%",
    fontSize: "14px",
    marginBottom: "10px",
    display: "block",
  },
  bottomBarWrap: {
    borderTop: "0.5px solid var(--dusk-light)",
    background: "var(--void)",
    padding: "1rem 0",
  },
  inputBar: { display: "flex", gap: "10px" },
  textInput: {
    flex: 1,
    background: "var(--dusk)",
    border: "0.5px solid var(--dusk-light)",
    borderRadius: "var(--radius)",
    padding: "10px 14px",
    color: "var(--snow)",
  },
  sendBtn: {
    background: "var(--ember)",
    color: "var(--ember-dark)",
    border: "none",
    borderRadius: "var(--radius)",
    padding: "10px 18px",
    fontWeight: 500,
  },
  micBtn: (active) => ({
    background: active ? "var(--ember)" : "var(--dusk)",
    color: active ? "var(--ember-dark)" : "var(--snow)",
    border: "0.5px solid var(--dusk-light)",
    borderRadius: "var(--radius)",
    padding: "10px 14px",
  }),
  generateBtn: {
    background: "var(--ember)",
    color: "var(--ember-dark)",
    border: "none",
    borderRadius: "var(--radius)",
    padding: "14px",
    fontWeight: 500,
    width: "100%",
  },
};

export default ChatPage;