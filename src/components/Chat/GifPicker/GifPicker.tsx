import { useState, useEffect, useCallback } from "react";
import { TENOR_API, TENOR_API_KEY } from "../../../library/constant";

type GifResult = {
  id: string;
  media_formats: {
    tinygif: { url: string };
    gif: { url: string };
  };
  title: string;
};

type Props = {
  theme: string | null;
  onSelect: (gifUrl: string) => void;
  onClose: () => void;
};

export function GifPicker({ theme, onSelect, onClose }: Props) {
  const [search, setSearch] = useState("");
  const [gifs, setGifs] = useState<GifResult[]>([]);
  const [loading, setLoading] = useState(false);

  const isDark = theme === "dark";
  const bg = isDark ? "#231840" : "#fff";
  const border = isDark ? "#3d2c6e" : "#e8e0ff";
  const text = isDark ? "#f0e8ff" : "#2d1b6e";
  const inputBg = isDark ? "#1a1228" : "#f8f5ff";

  const fetchGifs = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const endpoint = q
        ? `${TENOR_API}/search?q=${encodeURIComponent(q)}&key=${TENOR_API_KEY}&limit=20&media_filter=tinygif,gif`
        : `${TENOR_API}/featured?key=${TENOR_API_KEY}&limit=20&media_filter=tinygif,gif`;
      const res = await fetch(endpoint);
      const data = await res.json();
      setGifs(data.results || []);
    } catch {
      setGifs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGifs("");
  }, [fetchGifs]);

  useEffect(() => {
    const t = setTimeout(() => fetchGifs(search), 400);
    return () => clearTimeout(t);
  }, [search, fetchGifs]);

  return (
    <div style={{
      position: "absolute",
      bottom: "80px",
      left: "10px",
      width: "320px",
      height: "380px",
      background: bg,
      border: `1px solid ${border}`,
      borderRadius: "16px",
      boxShadow: "0 8px 30px rgba(155,89,245,0.25)",
      display: "flex",
      flexDirection: "column",
      zIndex: 50,
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{ padding: "12px 12px 8px", borderBottom: `1px solid ${border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontWeight: 700, color: text, fontSize: "0.95rem" }}>🎞️ GIFs</span>
          <button onClick={onClose} style={{ border: "none", background: "transparent", color: text, fontSize: "1.1rem", cursor: "pointer" }}>✕</button>
        </div>
        <input
          autoFocus
          placeholder="Search GIFs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 12px",
            borderRadius: "10px",
            border: `1px solid ${border}`,
            background: inputBg,
            color: text,
            fontSize: "0.9rem",
            outline: "none",
          }}
        />
      </div>

      {/* Grid */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#9b59f5" }}>
            Loading...
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
            {gifs.map((gif) => (
              <img
                key={gif.id}
                src={gif.media_formats.tinygif.url}
                alt={gif.title}
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "transform 0.15s ease",
                  aspectRatio: "1",
                  objectFit: "cover",
                }}
                onClick={() => {
                  onSelect(gif.media_formats.gif.url);
                  onClose();
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
            ))}
            {gifs.length === 0 && !loading && (
              <div style={{ gridColumn: "span 2", textAlign: "center", color: "#9b59f5", paddingTop: "30px" }}>
                No GIFs found 😅
              </div>
            )}
          </div>
        )}
      </div>
      <div style={{ padding: "6px 8px", textAlign: "right", borderTop: `1px solid ${border}` }}>
        <span style={{ fontSize: "0.7rem", color: "#9b59f5", opacity: 0.7 }}>Powered by Tenor</span>
      </div>
    </div>
  );
}
