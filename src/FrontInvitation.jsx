import React, { useState, useEffect, useRef } from "react";

import "./FrontInvitation.css";

// Flap ka shape (band flap aur khula flap dono ke liye)
const FLAP_PATH = "M 4,4 L 396,4 L 208,138 Q 200,144 192,138 Z";

// Wax seal ka lehrata hua (wavy) kinara - asli mom ki muhar jaisa
const buildSealPath = () => {
  const pts = [];
  const N = 120;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const r =
      49 +
      2.0 * Math.sin(9 * a + 0.4) +
      1.4 * Math.sin(5 * a + 1.1) +
      0.8 * Math.sin(14 * a + 2.0);
    pts.push(`${(r * Math.cos(a)).toFixed(2)},${(r * Math.sin(a)).toFixed(2)}`);
  }
  return `M${pts.join(" L")} Z`;
};
const SEAL_PATH = buildSealPath();

const FrontInvitation = ({ onOpen }) => {
  // idle -> opening (lift + flap khulta hai + letter nikalta hai) -> zooming (agle page pe)
  const [stage, setStage] = useState("idle");
  const timers = useRef([]);

  useEffect(() => {
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, []);

  const handleTapEnvelope = () => {
    if (stage !== "idle") return;
    setStage("opening");

    timers.current.push(setTimeout(() => setStage("zooming"), 1400));
    timers.current.push(
      setTimeout(() => {
        if (onOpen) onOpen();
      }, 2200),
    );
  };

  const isOpening = stage !== "idle";
  const isZooming = stage === "zooming";

  return (
    <div
      className={`framika-screen ${isOpening ? "is-opening" : ""} ${
        isZooming ? "zoom-transition" : ""
      }`}
    >
      {/* गिरती हुई गुलाबी पंखुड़ियां, पीले फूल और पत्तियां */}
      <div className="falling-layer">
        <span className="petal petal-pink p1" />
        <span className="petal petal-pink p2" />
        <span className="petal p3">🌼</span>
        <span className="petal p4">🍃</span>
        <span className="petal p5">🌿</span>
        <span className="petal petal-pink p6" />
        <span className="petal p7">🌼</span>
      </div>

      {/* 1. कपल कैलीग्राफी लोगो (public/couple-logo.png) */}
      <div className="couple-logo-box">
        <img
          src="/couple-logo.png"
          alt="Couple Logo"
          className="couple-logo-img"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      </div>

      {/* 2. मरून लिफाफा */}
      <div
        className={`envelope-card ${isOpening ? "opening" : ""}`}
        onClick={handleTapEnvelope}
        role="button"
        tabIndex={0}
        aria-label="Open invitation"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleTapEnvelope();
        }}
      >
        <svg viewBox="0 0 400 284" className="envelope-svg">
          <defs>
            <linearGradient id="maroonBase" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#780f20" />
              <stop offset="100%" stopColor="#5d0914" />
            </linearGradient>
            <linearGradient id="flapGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8b1428" />
              <stop offset="100%" stopColor="#6f0f1f" />
            </linearGradient>
            <linearGradient id="flapInner" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3f040a" />
              <stop offset="100%" stopColor="#5a0812" />
            </linearGradient>
            {/* side folds: bahar se halka gehra, andar ki taraf halka */}
            <linearGradient id="foldLeft" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2a0006" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#2a0006" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="foldRight" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#2a0006" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#2a0006" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="foldBottom" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2a0006" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#ff8a8a" stopOpacity="0.05" />
            </linearGradient>
            {/* pocket ka opaque rang (letter band envelope mein andar se na dikhe) */}
            <linearGradient
              id="pocketGrad"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="4"
              x2="0"
              y2="280"
            >
              <stop offset="0%" stopColor="#780f20" />
              <stop offset="100%" stopColor="#5d0914" />
            </linearGradient>
            <filter
              id="flapShadow"
              x="-10%"
              y="-10%"
              width="120%"
              height="140%"
            >
              <feDropShadow
                dx="0"
                dy="5"
                stdDeviation="5"
                floodColor="#240105"
                floodOpacity="0.5"
              />
            </filter>
          </defs>

          {/* लिफाफे का मुख्य हिस्सा */}
          <rect
            x="4"
            y="4"
            width="392"
            height="276"
            rx="3"
            fill="url(#maroonBase)"
          />

          {/* khula hua flap (letter ke peeche) - shuru mein chhupa hota hai */}
          <path className="flap-back" d={FLAP_PATH} fill="url(#flapInner)" />

          {/* andar ka letter - click par upar nikalta hai */}
          <g className="letter">
            <rect
              x="28"
              y="16"
              width="344"
              height="235"
              rx="6"
              fill="#fff9f0"
              stroke="#e6cfa8"
              strokeWidth="1.5"
            />
            <rect
              x="40"
              y="28"
              width="320"
              height="211"
              rx="3"
              fill="none"
              stroke="#d9b36b"
              strokeWidth="1"
            />
            <line
              x1="130"
              y1="62"
              x2="270"
              y2="62"
              stroke="#d9b36b"
              strokeWidth="1"
            />
            <text
              x="200"
              y="112"
              textAnchor="middle"
              fontSize="46"
              fill="#c78624"
            >
              ♥
            </text>
            <line
              x1="130"
              y1="132"
              x2="270"
              y2="132"
              stroke="#d9b36b"
              strokeWidth="1"
            />
          </g>

          {/* pocket ka aage wala hissa: bilkul opaque, letter ko neeche se dhakta hai */}
          <polygon
            points="4,4 200,140 396,4 396,280 4,280"
            fill="url(#pocketGrad)"
          />

          {/* बायाँ, दायाँ और नीचे का फोल्ड (हल्के shading + पतली लाइनें) */}
          <polygon
            points="4,4 196,142 4,280"
            fill="url(#foldLeft)"
            stroke="rgba(30,0,6,0.35)"
            strokeWidth="0.8"
          />
          <polygon
            points="396,4 204,142 396,280"
            fill="url(#foldRight)"
            stroke="rgba(30,0,6,0.35)"
            strokeWidth="0.8"
          />
          <polygon
            points="4,280 200,136 396,280"
            fill="url(#foldBottom)"
            stroke="rgba(30,0,6,0.3)"
            strokeWidth="0.8"
          />

          {/* upar ke kinare ki halki chamak */}
          <line
            x1="8"
            y1="5.5"
            x2="392"
            y2="5.5"
            stroke="rgba(255,170,170,0.16)"
            strokeWidth="1.2"
          />

          {/* ऊपरी तिकोना फ्लैप (band) */}
          <path
            className="flap-front"
            d={FLAP_PATH}
            fill="url(#flapGrad)"
            stroke="rgba(35,0,8,0.45)"
            strokeWidth="0.8"
            filter="url(#flapShadow)"
          />
        </svg>

        {/* बीच में गोल्डन वैक्स सील */}
        <div className="wax-seal-center">
          <div className="pulse-ring"></div>
          <div className="static-ring"></div>

          <svg viewBox="-58 -58 116 116" className="seal-svg">
            <defs>
              <radialGradient id="goldRim" cx="32%" cy="28%" r="85%">
                <stop offset="0%" stopColor="#ffeab0" />
                <stop offset="42%" stopColor="#e5ab40" />
                <stop offset="85%" stopColor="#a8681a" />
                <stop offset="100%" stopColor="#7d4a0a" />
              </radialGradient>
              <radialGradient id="goldDent" cx="62%" cy="66%" r="75%">
                <stop offset="0%" stopColor="#fadc90" />
                <stop offset="60%" stopColor="#dc9d33" />
                <stop offset="100%" stopColor="#b97a18" />
              </radialGradient>
              <filter
                id="sealShadow"
                x="-30%"
                y="-30%"
                width="160%"
                height="170%"
              >
                <feDropShadow
                  dx="0"
                  dy="5"
                  stdDeviation="4"
                  floodColor="#000000"
                  floodOpacity="0.5"
                />
              </filter>
            </defs>

            <path
              d={SEAL_PATH}
              fill="url(#goldRim)"
              filter="url(#sealShadow)"
            />
            {/* kinare ki chamak */}
            <path
              d={SEAL_PATH}
              fill="none"
              stroke="rgba(255,244,200,0.65)"
              strokeWidth="1.2"
              transform="scale(0.96)"
            />
            {/* andar ka dabaa hua gola */}
            <circle
              r="31"
              fill="url(#goldDent)"
              stroke="#b27419"
              strokeWidth="1.6"
            />
            <circle
              r="31"
              fill="none"
              stroke="rgba(255,248,215,0.8)"
              strokeWidth="1"
              transform="translate(0.8 1.2)"
              opacity="0.7"
            />
            {/* dil */}
            <path
              transform="translate(0,3)"
              d="M0,10 C-15,-1 -15,-16 -6.5,-16 C-2.5,-16 0,-12.5 0,-10.5 C0,-12.5 2.5,-16 6.5,-16 C15,-16 15,-1 0,10 Z"
              fill="rgba(178,112,28,0.78)"
              stroke="rgba(255,235,170,0.55)"
              strokeWidth="0.8"
            />
          </svg>
        </div>
      </div>

      {/* 3. नीचे का टेक्स्ट */}
      <div className="bottom-caption">
        <h2 className="youre-invited">You're Invited</h2>
        <p className="tap-instruction">
          Tap the envelope to open your invitation
        </p>
      </div>
    </div>
  );
};

export default FrontInvitation;
