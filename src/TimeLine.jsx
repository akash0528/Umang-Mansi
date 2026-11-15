import React, { useState, useEffect, useRef, useMemo } from "react";
import Image1 from "./assets/HaldiImage.jpg";
import Image2 from "./assets/MehndiImage.jpg";
import Image3 from "./assets/WeddingImage.jpg";
import WeddingSong from "./assets/Audio.mp4";

/*
  Fonts: index.html ke <head> me ye add kar lo (agar pehle se nahi hai):
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Great+Vibes&display=swap" rel="stylesheet">
*/

const timelineEvents = [
  {
    id: 1,
    title: "Mehndi",
    tagline:
      "Sufi Night — an evening filled with mehndi, music, laughter and beautiful memories with family.",
    date: "Tue · Dec 01, 2026",
    time: "1:00 PM onwards",

    image: Image2,
  },
  {
    id: 2,
    title: "Haldi",
    tagline:
      "A joyful turmeric ceremony to bless the couple, surrounded by family, love and happiness.",
    date: "Tue · Dec 01, 2026",
    time: "6:00 PM onwards",

    image: Image1,
  },
  {
    id: 3,
    title: "Wedding",
    tagline:
      "The most beautiful chapter begins as we celebrate love and togetherness.",
    date: "Wed · Dec 02, 2026",
    time: "05:00 PM onwards",

    image: Image3,
  },
];

const PETAL_COLORS = ["#e91e8c", "#f06292", "#ff4fa3"];
const FLOWERS = ["🌼", "🌸", "🏵️", "🍃"];

export default function Timeline() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [visibleItems, setVisibleItems] = useState({});
  const itemRefs = useRef([]);
  const audioRef = useRef(null);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Play failed:", err));
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const events = ["pointerup", "touchend", "click", "keydown"];

    const removeListeners = () =>
      events.forEach((ev) =>
        window.removeEventListener(ev, startOnInteraction),
      );

    const startOnInteraction = () => {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          removeListeners();
        })
        .catch(() => {});
    };

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        events.forEach((ev) =>
          window.addEventListener(ev, startOnInteraction, { passive: true }),
        );
      });

    return removeListeners;
  }, []);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = entry.target.getAttribute("data-index");
            setVisibleItems((prev) => ({ ...prev, [index]: true }));
          }
        });
      },
      { threshold: 0.15 },
    );
    itemRefs.current.forEach((ref) => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, []);

  const petals = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 14 + Math.random() * 14,
        duration: 9 + Math.random() * 9,
        delay: -Math.random() * 15,
        sway: 30 + Math.random() * 60,
        color: PETAL_COLORS[i % PETAL_COLORS.length],
      })),
    [],
  );

  const flowers = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        id: i,
        left: Math.random() * 96,
        top: Math.random() * 96,
        size: 14 + Math.random() * 12,
        duration: 6 + Math.random() * 6,
        delay: -Math.random() * 6,
        icon: FLOWERS[i % FLOWERS.length],
      })),
    [],
  );

  return (
    <div style={styles.container}>
      <audio ref={audioRef} src={WeddingSong} loop />

      <style>{`
        @keyframes petalFall {
          0%   { transform: translate3d(0, -10vh, 0) rotate(0deg); opacity: 0; }
          10%  { opacity: 0.9; }
          90%  { opacity: 0.9; }
          100% { transform: translate3d(var(--sway), 110vh, 0) rotate(360deg); opacity: 0; }
        }
        @keyframes floatFlower {
          0%, 100% { transform: translateY(0) rotate(-6deg); }
          50%      { transform: translateY(-14px) rotate(6deg); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseBar {
          0%, 100% { height: 4px; }
          50% { height: 14px; }
        }
        @keyframes ring {
          0%   { box-shadow: 0 0 0 0 rgba(224,184,120,0.55); }
          100% { box-shadow: 0 0 0 14px rgba(224,184,120,0); }
        }

        .ev-card { transition: transform .5s cubic-bezier(.165,.84,.44,1), box-shadow .5s ease; }
        .ev-card:hover { transform: translateY(-6px); box-shadow: 0 24px 50px rgba(0,0,0,.45); }
        .ev-card:hover .ev-bg { transform: scale(1.05); }
        .ev-bg { transition: transform .8s cubic-bezier(.165,.84,.44,1); }

        @media (max-width: 768px) {
          .ev-title-main { font-size: 42px !important; }
          .ev-card-content { padding-top: 40px !important; }
          .ev-card-title { font-size: 40px !important; }
          .ev-value { font-size: 17px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .petal, .flower { animation: none !important; }
        }
      `}</style>

      {/* Decorative layer: petals + flowers */}
      <div style={styles.fxLayer} aria-hidden="true">
        {flowers.map((f) => (
          <span
            key={f.id}
            className="flower"
            style={{
              position: "absolute",
              left: `${f.left}%`,
              top: `${f.top}%`,
              fontSize: f.size,
              opacity: 0.35,
              animation: `floatFlower ${f.duration}s ease-in-out ${f.delay}s infinite`,
            }}
          >
            {f.icon}
          </span>
        ))}
        {petals.map((p) => (
          <span
            key={p.id}
            className="petal"
            style={{
              position: "absolute",
              top: 0,
              left: `${p.left}%`,
              width: p.size,
              height: p.size * 1.25,
              background: p.color,
              borderRadius: "80% 0 80% 0",
              "--sway": `${p.sway}px`,
              animation: `petalFall ${p.duration}s linear ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div style={styles.header}>
        <h1 className="ev-title-main" style={styles.mainTitle}>
          Events Schedule
        </h1>
        <div style={styles.ornament}>❀</div>
      </div>

      {/* Event cards */}
      <div style={styles.list}>
        {timelineEvents.map((item, index) => {
          const isVisible = visibleItems[index];
          return (
            <div
              key={item.id}
              ref={(el) => (itemRefs.current[index] = el)}
              data-index={index}
              className="ev-card"
              style={{
                ...styles.card,
                opacity: isVisible ? 1 : 0,
                animation: isVisible
                  ? "fadeSlideUp 0.9s cubic-bezier(0.16,1,0.3,1) forwards"
                  : "none",
              }}
            >
              {/* Background image */}
              <img
                className="ev-bg"
                src={item.image}
                alt={item.title}
                style={styles.cardBg}
              />
              {/* Dark maroon gradient: upar gehra, neeche halka */}
              <div style={styles.cardOverlay} />

              <div className="ev-card-content" style={styles.cardContent}>
                <h2 className="ev-card-title" style={styles.cardTitle}>
                  {item.title}
                </h2>
                <p style={styles.tagline}>{item.tagline}</p>
                <div style={styles.ornamentSmall}>❀</div>

                <div style={styles.label}>Date</div>
                <div className="ev-value" style={styles.value}>
                  {item.date}
                </div>

                <div style={styles.label}>Time</div>
                <div className="ev-value" style={styles.value}>
                  {item.time}
                </div>

                <div style={styles.address}>{item.address}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Round floating music button */}
      <button
        onClick={toggleMusic}
        title={isPlaying ? "Pause Music" : "Play Music"}
        aria-label={isPlaying ? "Pause music" : "Play music"}
        style={{
          ...styles.musicButton,
          animation: isPlaying ? "ring 1.6s ease-out infinite" : "none",
        }}
      >
        {isPlaying ? (
          <div style={styles.waveContainer}>
            {[0.1, 0.3, 0.2, 0.4].map((d, i) => (
              <span
                key={i}
                style={{
                  ...styles.waveBar,
                  animation: `pulseBar 0.8s infinite ${d}s`,
                }}
              />
            ))}
          </div>
        ) : (
          <span style={{ fontSize: 22 }}>🎵</span>
        )}
      </button>
    </div>
  );
}

const SERIF = "'Cormorant Garamond', 'Georgia', serif";
const SCRIPT = "'Great Vibes', 'Dancing Script', cursive";

const styles = {
  container: {
    backgroundColor: "#4a0519", // deep maroon (image 1)
    minHeight: "100vh",
    width: "100%",
    padding: "40px 20px 100px",
    boxSizing: "border-box",
    fontFamily: SERIF,
    position: "relative",
    overflowX: "hidden",
  },
  fxLayer: {
    position: "fixed",
    inset: 0,
    pointerEvents: "none",
    overflow: "hidden",
    zIndex: 5,
  },
  header: {
    textAlign: "center",
    marginBottom: "36px",
    position: "relative",
    zIndex: 2,
  },
  mainTitle: {
    fontFamily: SCRIPT,
    fontSize: "64px",
    fontWeight: 400,
    color: "#ffffff",
    margin: "0 0 10px 0",
    textShadow: "0 2px 12px rgba(0,0,0,0.35)",
  },
  ornament: {
    color: "#e0903a",
    fontSize: "20px",
  },
  list: {
    maxWidth: "1440px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "36px",
    position: "relative",
    zIndex: 2,
  },
  card: {
    position: "relative",
    width: "100%",
    borderRadius: "28px",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.55)",
    boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
    boxSizing: "border-box",
  },
  cardBg: {
    display: "block",
    width: "100%",
    height: "auto",
  },
  cardOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to bottom, rgba(58,3,20,1) 0%, rgba(58,3,20,0.92) 12%, rgba(58,3,20,0.45) 30%, rgba(58,3,20,0.15) 55%, rgba(58,3,20,0.1) 100%)",
  },
  cardContent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    padding: "70px 24px 24px",
    textAlign: "center",
    color: "#fff",
    boxSizing: "border-box",
    textShadow: "0 2px 8px rgba(0,0,0,0.7)",
  },
  cardTitle: {
    fontFamily: SCRIPT,
    fontSize: "50px",
    fontWeight: 400,
    margin: "0 0 6px 0",
    color: "#fff",
  },
  tagline: {
    fontFamily: SERIF,
    fontStyle: "italic",
    fontSize: "16px",
    lineHeight: 1.4,
    maxWidth: "560px",
    margin: "0 auto 10px",
    color: "#fff",
  },
  ornamentSmall: {
    color: "#e0903a",
    fontSize: "14px",
    marginBottom: "12px",
  },
  label: {
    fontFamily: SERIF,
    fontVariant: "small-caps",
    letterSpacing: "3px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#fff",
    marginBottom: "2px",
  },
  value: {
    fontFamily: SERIF,
    fontSize: "19px",
    fontWeight: 500,
    color: "#fff",
    marginBottom: "12px",
  },
  address: {
    fontFamily: SERIF,
    fontSize: "15px",
    marginTop: "-8px",
    color: "rgba(255,255,255,0.9)",
  },
  musicButton: {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    width: "62px",
    height: "62px",
    borderRadius: "50%",
    border: "2px solid #e0b878",
    background: "linear-gradient(135deg, #7a1a3a, #4a0519)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: 100,
    boxShadow: "0 6px 18px rgba(0,0,0,0.45)",
  },
  waveContainer: {
    display: "flex",
    alignItems: "flex-end",
    gap: "3px",
    height: "16px",
  },
  waveBar: {
    width: "3px",
    backgroundColor: "#f5c98b",
    borderRadius: "2px",
  },
};
