import React from 'react';

interface MarketmeCharacter3DProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showBackdrop?: boolean;
}

export const MarketmeCharacter3D: React.FC<MarketmeCharacter3DProps> = ({
  className = '',
  size = 'lg',
  showBackdrop = true,
}) => {
  const sizeClasses = {
    sm: 'w-48 h-48',
    md: 'w-72 h-72',
    lg: 'w-96 h-96 sm:w-[440px] sm:h-[440px]',
  }[size];

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Ambient warm radial glow backdrop matching image */}
      {showBackdrop && (
        <div className="absolute inset-0 -m-10 flex items-center justify-center pointer-events-none">
          {/* Outer dark vignette circle */}
          <div className="w-[120%] h-[120%] rounded-full bg-radial from-orange-500/25 via-orange-950/15 to-transparent blur-3xl opacity-80" />
          {/* Inner warm orange core */}
          <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-radial from-orange-500/35 via-amber-600/10 to-transparent blur-2xl" />
        </div>
      )}

      {/* 3D Animated Jumping Boy with Backpack Illustration */}
      <div className={`relative z-10 ${sizeClasses} transition-transform duration-500 hover:scale-105`}>
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full drop-shadow-[0_20px_40px_rgba(255,107,0,0.25)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients for 3D Shading */}
            <radialGradient id="faceGrad" cx="45%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#FFE0BD" />
              <stop offset="70%" stopColor="#F8C798" />
              <stop offset="100%" stopColor="#E5A66E" />
            </radialGradient>

            <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5D3A1A" />
              <stop offset="45%" stopColor="#3E240D" />
              <stop offset="100%" stopColor="#251305" />
            </linearGradient>

            <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>

            <linearGradient id="backpackBlue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#0369A1" />
            </linearGradient>

            <linearGradient id="backpackOrange" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FB923C" />
              <stop offset="60%" stopColor="#EA580C" />
              <stop offset="100%" stopColor="#9A3412" />
            </linearGradient>

            <linearGradient id="denimShorts" x1="0%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#64748B" />
              <stop offset="60%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>

            <linearGradient id="sneakerOrange" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFA45B" />
              <stop offset="60%" stopColor="#FF6B00" />
              <stop offset="100%" stopColor="#C44800" />
            </linearGradient>

            <filter id="shadowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* BACKPACK (Behind torso) */}
          <g filter="url(#shadowFilter)">
            <rect x="180" y="160" width="140" height="150" rx="35" fill="url(#backpackBlue)" />
            <rect x="195" y="180" width="110" height="90" rx="20" fill="url(#backpackOrange)" />
            {/* Backpack handle */}
            <path
              d="M225 160 C225 140 275 140 275 160"
              stroke="#0369A1"
              strokeWidth="10"
              strokeLinecap="round"
            />
          </g>

          {/* LEFT LEG (Kicked back in jump) */}
          <g>
            <path
              d="M210 320 Q190 370 205 400"
              stroke="#F8C798"
              strokeWidth="28"
              strokeLinecap="round"
            />
            {/* Left Sneaker */}
            <g transform="translate(180, 395) rotate(-15)">
              <ellipse cx="25" cy="18" rx="28" ry="16" fill="url(#sneakerOrange)" />
              <path d="M5 28 L48 28 L45 35 L8 35 Z" fill="#FFFFFF" />
              <rect x="10" y="14" width="22" height="6" rx="3" fill="#FFFFFF" opacity="0.9" />
            </g>
          </g>

          {/* RIGHT LEG (Kicked forward/bent in jump) */}
          <g>
            <path
              d="M280 320 Q315 365 310 405"
              stroke="#F8C798"
              strokeWidth="28"
              strokeLinecap="round"
            />
            {/* Right Sneaker */}
            <g transform="translate(290, 400) rotate(15)">
              <ellipse cx="25" cy="18" rx="30" ry="17" fill="url(#sneakerOrange)" />
              <path d="M3 28 L52 28 L48 36 L6 36 Z" fill="#FFFFFF" />
              <rect x="12" y="14" width="24" height="6" rx="3" fill="#FFFFFF" opacity="0.9" />
            </g>
          </g>

          {/* SHORTS */}
          <path
            d="M190 300 Q250 310 310 300 L325 345 Q290 355 260 345 L250 330 L240 345 Q210 355 175 345 Z"
            fill="url(#denimShorts)"
            filter="url(#shadowFilter)"
          />

          {/* TORSO / WHITE T-SHIRT */}
          <path
            d="M195 200 Q250 195 305 200 L315 310 Q250 318 185 310 Z"
            fill="url(#shirtGrad)"
            filter="url(#shadowFilter)"
          />

          {/* Backpack Straps on Chest */}
          <path
            d="M205 195 Q215 250 220 295"
            stroke="url(#backpackOrange)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M295 195 Q285 250 280 295"
            stroke="url(#backpackOrange)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Chest buckle */}
          <rect x="235" y="245" width="30" height="10" rx="4" fill="#0369A1" />

          {/* LEFT ARM (Outstretched joyfully) */}
          <g>
            <path
              d="M195 210 Q140 190 105 180"
              stroke="#F8C798"
              strokeWidth="24"
              strokeLinecap="round"
            />
            {/* Left Hand (Thumb up / open palm) */}
            <circle cx="95" cy="175" r="16" fill="url(#faceGrad)" />
            <ellipse cx="85" cy="165" rx="7" ry="10" fill="url(#faceGrad)" transform="rotate(-30 85 165)" />
            <circle cx="90" cy="180" r="5" fill="#E5A66E" opacity="0.4" />
          </g>

          {/* RIGHT ARM (Up in victory) */}
          <g>
            <path
              d="M305 210 Q370 175 405 150"
              stroke="#F8C798"
              strokeWidth="24"
              strokeLinecap="round"
            />
            {/* Right Hand (Peace / joy wave) */}
            <circle cx="415" cy="142" r="16" fill="url(#faceGrad)" />
            <ellipse cx="425" cy="132" rx="7" ry="10" fill="url(#faceGrad)" transform="rotate(25 425 132)" />
            <circle cx="415" cy="142" r="5" fill="#E5A66E" opacity="0.4" />
          </g>

          {/* NECK */}
          <rect x="232" y="170" width="36" height="35" rx="10" fill="#E5A66E" />

          {/* HEAD */}
          <ellipse cx="250" cy="130" rx="68" ry="72" fill="url(#faceGrad)" filter="url(#shadowFilter)" />

          {/* EARS */}
          <ellipse cx="182" cy="135" rx="12" ry="16" fill="url(#faceGrad)" />
          <ellipse cx="184" cy="135" rx="6" ry="9" fill="#E5A66E" opacity="0.6" />
          <ellipse cx="318" cy="135" rx="12" ry="16" fill="url(#faceGrad)" />
          <ellipse cx="316" cy="135" rx="6" ry="9" fill="#E5A66E" opacity="0.6" />

          {/* BIG 3D CARTOON EYES */}
          {/* Eye Whites */}
          <ellipse cx="225" cy="120" rx="17" ry="21" fill="#FFFFFF" />
          <ellipse cx="275" cy="120" rx="17" ry="21" fill="#FFFFFF" />

          {/* Big Brown Irises */}
          <ellipse cx="228" cy="120" rx="12" ry="14" fill="#451A03" />
          <ellipse cx="272" cy="120" rx="12" ry="14" fill="#451A03" />

          {/* Pupils */}
          <circle cx="229" cy="120" r="8" fill="#000000" />
          <circle cx="271" cy="120" r="8" fill="#000000" />

          {/* Big Cute Light Reflections (catchlights) */}
          <circle cx="233" cy="114" r="5" fill="#FFFFFF" />
          <circle cx="224" cy="125" r="2.5" fill="#FFFFFF" />
          <circle cx="275" cy="114" r="5" fill="#FFFFFF" />
          <circle cx="266" cy="125" r="2.5" fill="#FFFFFF" />

          {/* EYEBROWS (Raised, happy) */}
          <path
            d="M210 92 Q225 82 242 92"
            stroke="#3E240D"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M258 92 Q275 82 290 92"
            stroke="#3E240D"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* CUTE NOSE */}
          <ellipse cx="250" cy="132" rx="7" ry="5" fill="#D97706" opacity="0.5" />

          {/* BIG HAPPY SMILE (Open mouth showing teeth and tongue) */}
          <path
            d="M222 144 Q250 184 278 144 Z"
            fill="#7F1D1D"
          />
          {/* Teeth */}
          <path
            d="M228 145 Q250 152 272 145 L270 150 Q250 156 230 150 Z"
            fill="#FFFFFF"
          />
          {/* Tongue */}
          <path
            d="M236 166 Q250 158 264 166 Q250 180 236 166 Z"
            fill="#F43F5E"
          />
          {/* Rosy cheeks */}
          <ellipse cx="205" cy="142" rx="14" ry="8" fill="#FB7185" opacity="0.35" />
          <ellipse cx="295" cy="142" rx="14" ry="8" fill="#FB7185" opacity="0.35" />

          {/* 3D BROWN HAIR (Stylized tufts & volume) */}
          <path
            d="M182 110 Q175 60 220 50 Q250 40 280 48 Q325 55 320 105 Q305 75 270 70 Q240 68 215 78 Q195 85 182 110 Z"
            fill="url(#hairGrad)"
            filter="url(#shadowFilter)"
          />
          {/* Front hair fringe tufts */}
          <path
            d="M205 78 Q225 65 245 85 Q255 60 275 80 Q290 70 305 95 Q285 85 260 86 Q235 84 205 78 Z"
            fill="#5D3A1A"
          />
          {/* Hair shine highlight */}
          <path
            d="M230 54 Q255 48 275 52"
            stroke="#A16207"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>
      </div>
    </div>
  );
};
