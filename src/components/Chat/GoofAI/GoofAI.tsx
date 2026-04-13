import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Props = {
  theme: string | null;
  onClose: () => void;
};

export function GoofAI({ theme, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hey! I'm Goof-AI 🤖✨ I'm your silly but smart chat buddy inside Goofie. Ask me anything — jokes, help, or just vibes!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const isDark = theme === "dark";
  const bg = isDark ? "#231840" : "#ffffff";
  const border = isDark ? "#3d2c6e" : "#e8e0ff";
  const text = isDark ? "#f0e8ff" : "#2d1b6e";
  const inputBg = isDark ? "#1a1228" : "#f8f5ff";
  const msgBg = isDark ? "#1a1228" : "#f3f0ff";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are Goof-AI, the fun, witty, and friendly AI assistant built into Goofie — a colorful chat app. You're helpful but also playful. Keep responses concise and conversational. Use occasional emojis to match Goofie's vibe. Don't be overly formal.",
          messages: newMessages,
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Hmm, I got confused 😅 Try again?";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Oops! Something went wrong on my end 🙈 Try again?" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      bottom: "80px",
      right: "20px",
      width: "340px",
      height: "500px",
      background: bg,
      border: `1px solid ${border}`,
      borderRadius: "20px",
      boxShadow: "0 12px 40px rgba(155,89,245,0.35)",
      display: "flex",
      flexDirection: "column",
      zIndex: 100,
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "14px 16px",
        background: "linear-gradient(135deg, #9b59f5, #e91e8c)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "1.5rem" }}>🤖</span>
          <div>
            <div style={{ color: "white", fontWeight: 700, fontSize: "0.95rem" }}>Goof-AI</div>
            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.75rem" }}>Always here to vibe ✨</div>
          </div>
        </div>
        <button onClick={onClose} style={{ border: "none", background: "rgba(255,255,255,0.2)", color: "white", borderRadius: "8px", width: "28px", height: "28px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem" }}>✕</button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            {msg.role === "assistant" && (
              <span style={{ fontSize: "1.2rem", marginRight: "6px", alignSelf: "flex-end" }}>🤖</span>
            )}
            <div style={{
              maxWidth: "78%",
              padding: "10px 14px",
              borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              background: msg.role === "user"
                ? "linear-gradient(135deg, #9b59f5, #e91e8c)"
                : msgBg,
              color: msg.role === "user" ? "white" : text,
              fontSize: "0.88rem",
              lineHeight: 1.5,
              boxShadow: msg.role === "user" ? "0 2px 10px rgba(155,89,245,0.3)" : "none",
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "1.2rem" }}>🤖</span>
            <div style={{ background: msgBg, padding: "10px 14px", borderRadius: "18px 18px 18px 4px", color: "#9b59f5", fontSize: "0.88rem" }}>
              Thinking... 🤔
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "10px", borderTop: `1px solid ${border}`, display: "flex", gap: "8px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Ask Goof-AI anything..."
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: "12px",
            border: `1px solid ${border}`,
            background: inputBg,
            color: text,
            fontSize: "0.88rem",
            outline: "none",
          }}
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          style={{
            border: "none",
            width: "38px",
            height: "38px",
            borderRadius: "12px",
            background: loading || !input.trim() ? "#ccc" : "linear-gradient(135deg, #9b59f5, #e91e8c)",
            color: "white",
            fontSize: "1rem",
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
          }}
        >
          🚀
        </button>
      </div>
    </div>
  );
}
