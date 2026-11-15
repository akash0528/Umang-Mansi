import React, { useState, useEffect, useRef } from "react";
import Image1 from "./assets/image1.jpeg";
import Image2 from "./assets/image7.jpeg";
import Image3 from "./assets/image14.jpeg";
import Image4 from "./assets/image12.jpeg";
import Image5 from "./assets/image6.jpeg";
import Image6 from "./assets/image3.jpeg";
import Image7 from "./assets/image13.jpeg";
import Image8 from "./assets/image17.jpeg";
import Image9 from "./assets/image5.jpeg";
import Image10 from "./assets/image4.jpeg";
import Image11 from "./assets/image15.jpeg";
import Image12 from "./assets/image9.jpeg";
import Image13 from "./assets/image16.jpeg";
import Image14 from "./assets/image8.jpeg";
import Image15 from "./assets/image2.jpeg";

const galleryData = [
  { id: 1, image: Image1 },
  { id: 2, image: Image2 },
  { id: 3, image: Image3 },
  { id: 4, image: Image4 },
  { id: 5, image: Image5 },
  { id: 6, image: Image6 },
  { id: 7, image: Image7 },
  { id: 8, image: Image8 },
  { id: 9, image: Image9 },
  { id: 10, image: Image10 },
  { id: 11, image: Image11 },
  { id: 12, image: Image12 },
  { id: 13, image: Image13 },
  { id: 14, image: Image14 },
  { id: 15, image: Image15 },
];

// ---- Mobile / responsive slider (image 2 wala, pehle jaisa) ----
const OFFSET = 35; // card ke left mein khali jagah
const GAP = 22; // cards ke beech gap
const PEEK = 37; // agle card ka kitna hissa dikhe

// ---- Desktop slider (image 1 wala: 3 cards ek saath) ----
const DESKTOP_BREAKPOINT = 900; // isse bada screen = desktop layout
const D_GAP = 28; // desktop me cards ke beech gap
const D_VISIBLE = 3; // desktop me kitne cards dikhein
const D_MAX_CARD_W = 440; // desktop card ki max width
const D_RATIO = 1.35; // desktop card height = width * ye

const Chevron = ({ dir }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "block" }}
  >
    <polyline
      points={dir === "left" ? "15.5 5 8.5 12 15.5 19" : "8.5 5 15.5 12 8.5 19"}
    />
  </svg>
);

const EXTRA_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;1,400;1,500&family=Great+Vibes&display=swap');
@keyframes wgFall {
  0% { transform: translateY(-10vh); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(110vh); opacity: 0; }
}
@keyframes wgSway {
  0% { transform: translateX(-16px) rotate(-30deg); }
  100% { transform: translateX(16px) rotate(200deg); }
}
`;

const petals = Array.from({ length: 16 }).map((_, i) => ({
  id: i,
  left: Math.random() * 100,
  size: 14 + Math.random() * 12,
  fall: 9 + Math.random() * 8,
  sway: 3 + Math.random() * 3,
  delay: -Math.random() * 16,
  flower: i % 4 === 0,
}));

export default function Collection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [vw, setVw] = useState(window.innerWidth);
  const [activeBtn, setActiveBtn] = useState(null); // "prev" | "next" | null
  const touchX = useRef(null);
  const prevIndex = useRef(0);

  const total = galleryData.length;
  const isDesktop = vw >= DESKTOP_BREAKPOINT;

  // ---------- Measurements ----------
  let sliderW, cardW, cardH, gap, offset;

  if (isDesktop) {
    gap = D_GAP;
    offset = 0;
    cardW = Math.min(
      (Math.min(vw - 160, 1340) - gap * (D_VISIBLE - 1)) / D_VISIBLE,
      D_MAX_CARD_W,
    );
    cardH = Math.round(cardW * D_RATIO);
    sliderW = cardW * D_VISIBLE + gap * (D_VISIBLE - 1);
  } else {
    gap = GAP;
    offset = OFFSET;
    sliderW = Math.min(vw - 24, 406);
    cardW = sliderW - OFFSET - GAP - PEEK;
    cardH = Math.round((cardW - 6) * 1.12);
  }
  const arrowTop = 4 + cardH / 2; // card ka vertical center

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    prevIndex.current = activeIndex;
  }, [activeIndex]);

  const handlePrev = () =>
    setActiveIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  const handleNext = () =>
    setActiveIndex((prev) => (prev === total - 1 ? 0 : prev + 1));

  const onTouchStart = (e) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) dx < 0 ? handleNext() : handlePrev();
    touchX.current = null;
  };

  const wrapDiff = (index, active) => {
    let diff = index - active;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  // Mobile: flat slider, 1 card + agle card ki jhalak
  const getMobileCardStyle = (index) => {
    const diff = wrapDiff(index, activeIndex);
    const oldDiff = wrapDiff(index, prevIndex.current);
    const isWrapJump = Math.abs(diff - oldDiff) > total / 2;
    const visible = diff === 0 || diff === 1;

    return {
      transform: `translateX(${diff * (cardW + gap)}px)`,
      opacity: visible ? 1 : 0,
      zIndex: diff === 0 ? 2 : 1,
      pointerEvents: visible ? "auto" : "none",
      transition: isWrapJump
        ? "none"
        : "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease",
    };
  };

  // Desktop: 3 cards ek saath, activeIndex = sabse left wala card
  const getDesktopCardStyle = (index) => {
    const mod = (n) => ((n % total) + total) % total;
    const pos = mod(index - activeIndex);
    const oldPos = mod(index - prevIndex.current);
    const isWrapJump = Math.abs(pos - oldPos) > total / 2;
    const visible = pos < D_VISIBLE;

    return {
      transform: `translateX(${pos * (cardW + gap)}px)`,
      opacity: visible ? 1 : 0,
      zIndex: 1,
      pointerEvents: visible ? "auto" : "none",
      transition: isWrapJump
        ? "none"
        : "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease",
    };
  };

  const arrowSize = isDesktop ? 58 : 46;

  return (
    <div style={styles.container}>
      <style>{EXTRA_CSS}</style>

      {/* Falling petals + flowers */}
      <div style={styles.petalLayer}>
        {petals.map((p) => (
          <div
            key={p.id}
            style={{
              position: "absolute",
              top: 0,
              left: `${p.left}%`,
              animation: `wgFall ${p.fall}s linear ${p.delay}s infinite`,
            }}
          >
            <div
              style={{
                width: p.size,
                height: p.size,
                animation: `wgSway ${p.sway}s ease-in-out ${p.delay}s infinite alternate`,
                ...(p.flower ? styles.flower : styles.petal),
              }}
            />
          </div>
        ))}
      </div>

      {/* Header Section */}
      <div style={styles.headerContainer}>
        <span style={styles.subHeading}>MOMENTS</span>
        <h1 style={styles.mainTitle}>Our Gallery</h1>
        <div style={styles.dividerLine}>
          <span style={styles.diamond}>◇</span>
          <span style={styles.diamond}>◇</span>
          <span style={styles.diamondActive}>◆</span>
          <span style={styles.diamond}>◇</span>
          <span style={styles.diamond}>◇</span>
        </div>
        <p style={styles.description}>
          A glimpse into our journey of love and togetherness
        </p>
      </div>

      {/* Slider */}
      <div style={{ ...styles.sliderWrap, width: sliderW }}>
        <div
          style={{ ...styles.sliderViewport, height: cardH + 40 }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {galleryData.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={item.id}
                onClick={() => setActiveIndex(index)}
                style={{
                  ...styles.card,
                  left: offset,
                  width: cardW,
                  height: cardH,
                  ...(isDesktop
                    ? getDesktopCardStyle(index)
                    : getMobileCardStyle(index)),
                }}
              >
                <img
                  src={item.image}
                  alt={item.caption}
                  draggable={false}
                  style={styles.cardImage}
                />
                <div style={styles.cardOverlay}>
                  <p
                    style={{
                      ...styles.cardCaption,
                      opacity: isDesktop || isActive ? 1 : 0.8,
                    }}
                  >
                    {item.caption}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Arrows */}
        <button
          onClick={() => {
            setActiveBtn("prev");
            handlePrev();
          }}
          style={{
            ...styles.controlBtn,
            ...(activeBtn === "prev" ? styles.controlBtnActive : {}),
            width: arrowSize,
            height: arrowSize,
            top: arrowTop,
            // desktop: card ke left edge par center; mobile: pehle jaisa
            left: isDesktop ? -arrowSize / 2 : OFFSET - 6,
          }}
          aria-label="Previous"
        >
          <Chevron dir="left" />
        </button>
        <button
          onClick={() => {
            setActiveBtn("next");
            handleNext();
          }}
          style={{
            ...styles.controlBtn,
            ...(activeBtn === "next" ? styles.controlBtnActive : {}),
            width: arrowSize,
            height: arrowSize,
            top: arrowTop,
            right: isDesktop ? -arrowSize / 2 : 8,
          }}
          aria-label="Next"
        >
          <Chevron dir="right" />
        </button>
      </div>

      {/* Pagination Indicators */}
      <div style={styles.dotsContainer}>
        {galleryData.map((_, i) => (
          <span
            key={i}
            onClick={() => setActiveIndex(i)}
            style={{
              ...styles.dot,
              width: i === activeIndex ? "26px" : "10px",
              backgroundColor: i === activeIndex ? "#7a2a35" : "#e6cfb8",
              borderRadius: "5px",
            }}
          />
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#fdf4ec",
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 0",
    boxSizing: "border-box",
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    position: "relative",
    overflow: "hidden",
    WebkitTapHighlightColor: "transparent",
    userSelect: "none",
    WebkitUserSelect: "none",
  },
  headerContainer: {
    textAlign: "center",
    marginBottom: "24px",
    zIndex: 2,
    padding: "0 20px",
  },
  subHeading: {
    fontSize: "13px",
    letterSpacing: "6px",
    color: "#8b6b61",
    textTransform: "uppercase",
    display: "block",
    marginBottom: "4px",
  },
  mainTitle: {
    fontFamily: "'Great Vibes', cursive",
    fontSize: "clamp(48px, 12vw, 72px)",
    color: "#6b1d2f",
    margin: "0 0 8px 0",
    fontWeight: "normal",
    lineHeight: 1.1,
  },
  dividerLine: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    margin: "10px 0 18px",
  },
  diamond: { fontSize: "11px", color: "#c9953a" },
  diamondActive: { fontSize: "13px", color: "#5a1525" },
  description: {
    fontSize: "18px",
    fontStyle: "italic",
    color: "#7a5a60",
    margin: 0,
  },
  // Arrows isi wrapper ke andar hain (overflow hidden nahi, taaki bahar tak aa sakein)
  sliderWrap: {
    position: "relative",
    margin: "10px 0",
  },
  // Sirf cards ko clip karta hai
  sliderViewport: {
    position: "relative",
    width: "100%",
    overflow: "hidden",
    touchAction: "pan-y",
  },
  card: {
    position: "absolute",
    top: "4px",
    borderRadius: "22px",
    overflow: "hidden",
    boxShadow: "0 14px 28px rgba(120,60,50,0.2)",
    cursor: "pointer",
    backgroundColor: "#fff",
    WebkitTapHighlightColor: "transparent",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    pointerEvents: "none",
  },
  cardOverlay: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: "18px 20px",
    boxSizing: "border-box",
    background:
      "linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.12) 25%, transparent 45%)",
  },
  cardCaption: {
    color: "#fff",
    fontStyle: "italic",
    fontSize: "18px",
    margin: 0,
    textShadow: "0 2px 6px rgba(0,0,0,0.5)",
  },
  controlBtn: {
    position: "absolute",
    transform: "translateY(-50%)",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.93)",
    border: "none",
    color: "#7a2a35",
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
    zIndex: 40,
    WebkitTapHighlightColor: "transparent",
    outline: "none",
    transition: "background 0.3s ease, color 0.3s ease",
  },
  controlBtnActive: {
    background: "#7a2a35",
    color: "#ffffff",
  },
  dotsContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "14px",
    zIndex: 2,
  },
  dot: {
    height: "10px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    WebkitTapHighlightColor: "transparent",
  },
  petalLayer: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    zIndex: 30,
    overflow: "hidden",
  },
  petal: {
    background: "radial-gradient(circle at 30% 30%, #ff7ab8, #e0307f)",
    borderRadius: "70% 0 70% 70%",
  },
  flower: {
    borderRadius: "50%",
    background:
      "radial-gradient(circle, #8a5a00 0 18%, #ffd93b 20% 55%, #f5b800 58% 100%)",
  },
};
