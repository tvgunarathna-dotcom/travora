import React, { useState } from 'react';
import {
  X,
  Navigation,
  Footprints,
  Car,
  MapPin,
  ShieldCheck,
  Compass,
  Lightbulb,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { SafeStay } from '../../types';
import { getRouteForStay } from '../../data/hotelRoutesData';

interface HotelRouteMapModalProps {
  stay: SafeStay;
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
}

export const HotelRouteMapModal: React.FC<HotelRouteMapModalProps> = ({
  stay,
  isOpen,
  onClose,
  theme,
}) => {
  if (!isOpen) return null;

  const isDark = theme === 'dark';
  const routeData = getRouteForStay(stay.stayId);

  const [travelMode, setTravelMode] = useState<'walking' | 'drive'>('walking');
  const [showDirections, setShowDirections] = useState(true);
  const [showLightingOverlay, setShowLightingOverlay] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedLandmark, setSelectedLandmark] = useState<string | null>(null);

  const activeSteps = travelMode === 'walking' ? routeData.walkingSteps : routeData.drivingSteps;
  const activePathD = travelMode === 'walking' ? routeData.svgMap.walkingPathD : routeData.svgMap.drivingPathD;

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 1.75));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.85));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto">
      <div
        className={`w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border transition-all my-auto flex flex-col max-h-[92vh] ${
          isDark
            ? 'bg-[#140a28] border-purple-700/60 text-white'
            : 'bg-white border-purple-200 text-stone-900 shadow-2xl'
        }`}
      >
        {/* ========================================================
            MODAL HEADER: Hotel Branding & Close
           ======================================================== */}
        <div className="p-3.5 sm:p-4 border-b border-purple-900/30 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-400 shrink-0">
              <Compass className="w-5 h-5 text-purple-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-black text-sm sm:text-base text-stone-900 dark:text-white truncate">
                  {stay.name}
                </h3>
                <span className="text-[10px] bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-600/50 px-2 py-0.2 rounded-md font-bold shrink-0">
                  {stay.city}
                </span>
                <span className="text-[10px] bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded-md font-bold flex items-center gap-1 shrink-0">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> Pink Shield
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-purple-200 truncate mt-0.5">
                {stay.location}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-purple-900/60 text-stone-500 dark:text-stone-300 hover:text-white transition shrink-0"
            title="Close Map"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ========================================================
            LIVE GPS STATUS & DISTANCE STRIP
           ======================================================== */}
        <div className="p-2.5 sm:p-3 bg-gradient-to-r from-purple-950/70 via-indigo-950/60 to-purple-950/70 border-b border-purple-900/40 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative flex items-center justify-center shrink-0">
              <div className="w-3 h-3 rounded-full bg-blue-400 animate-ping absolute" />
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 border border-white z-10" />
            </div>
            <div className="truncate">
              <span className="font-extrabold text-blue-300 text-[11px] block sm:inline">
                Live GPS Active:{' '}
              </span>
              <span className="text-purple-100 text-[11px]">
                {routeData.userLiveLocation.label} ({routeData.userLiveLocation.neighborhood})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 text-[11px]">
            <span className="px-2 py-0.5 rounded-lg bg-emerald-600/30 border border-emerald-400/40 text-emerald-300 font-extrabold flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{routeData.distanceKm} km away</span>
            </span>
            <span className="text-purple-300/80">•</span>
            <span className="text-purple-200">
              {travelMode === 'walking' ? `~${routeData.walkingMinutes} min walk` : `~${routeData.drivingMinutes} min drive`}
            </span>
            <span className="text-purple-300/80">•</span>
            <span className="text-amber-300 font-bold flex items-center gap-0.5" title="Lighting Safety Score">
              <Lightbulb className="w-3 h-3" />
              <span>{routeData.lightingSafetyIndex}/10</span>
            </span>
          </div>
        </div>

        {/* ========================================================
            MAP CONTROLS TOOLBAR
           ======================================================== */}
        <div className="px-3 py-2 bg-[#0e071c] border-b border-purple-900/40 flex items-center justify-between gap-2 shrink-0 flex-wrap text-xs">
          {/* Mode switch: Walk vs Drive */}
          <div className="flex items-center gap-1 p-0.5 rounded-xl bg-purple-950/90 border border-purple-800/60">
            <button
              onClick={() => setTravelMode('walking')}
              className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition ${
                travelMode === 'walking'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <Footprints className="w-3.5 h-3.5" />
              <span>Walk (~{routeData.walkingMinutes}m)</span>
            </button>
            <button
              onClick={() => setTravelMode('drive')}
              className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition ${
                travelMode === 'drive'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Drive / Cab (~{routeData.drivingMinutes}m)</span>
            </button>
          </div>

          {/* Interactive Layer Toggles */}
          <div className="flex items-center gap-1.5 ml-auto">
            {/* Safe Street Lighting Toggle */}
            <button
              onClick={() => setShowLightingOverlay(!showLightingOverlay)}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 transition ${
                showLightingOverlay
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-stone-900 text-stone-400 border-stone-800'
              }`}
              title="Toggle Safe Street Lighting Corridors"
            >
              <Lightbulb className="w-3 h-3" />
              <span className="hidden sm:inline">Lighting Corridor</span>
            </button>

            {/* Directions Toggle */}
            <button
              onClick={() => setShowDirections(!showDirections)}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-extrabold flex items-center gap-1 transition ${
                showDirections
                  ? 'bg-emerald-600 text-white border-emerald-400'
                  : 'bg-purple-900/60 text-purple-300 border-purple-700/60 hover:text-white'
              }`}
            >
              <Navigation className="w-3 h-3" />
              <span>{showDirections ? 'Hide Steps' : 'Show Directions'}</span>
            </button>

            {/* Zoom Controls */}
            <div className="flex items-center rounded-lg bg-stone-900 border border-purple-900/40 text-stone-300">
              <button
                onClick={handleZoomIn}
                className="p-1 hover:text-white transition"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleResetZoom}
                className="px-1 text-[10px] font-mono hover:text-white transition"
                title="Reset Zoom"
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
                onClick={handleZoomOut}
                className="p-1 hover:text-white transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================
            DYNAMIC VECTOR SVG MAP (Distinct for each stay)
           ======================================================== */}
        <div className="relative w-full h-64 sm:h-72 bg-[#0c101d] overflow-hidden border-b border-purple-900/40 select-none">
          <div
            className="w-full h-full transition-transform duration-300 origin-center"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <svg
              viewBox={routeData.svgMap.viewBox}
              className="w-full h-full object-cover"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                {/* Gradients */}
                <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0c101d" />
                  <stop offset="100%" stopColor="#151b2e" />
                </linearGradient>

                <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.75" />
                </linearGradient>

                <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#0369a1" stopOpacity="0.9" />
                </linearGradient>

                <linearGradient id="routeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>

                {/* Filter for glowing paths */}
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Map Background */}
              <rect width="520" height="360" fill="url(#bgGrad)" />

              {/* Grid / Mesh Texture */}
              <g stroke="#334155" strokeWidth="0.5" opacity="0.15">
                {[...Array(14)].map((_, i) => (
                  <line key={`v-${i}`} x1={i * 40} y1="0" x2={i * 40} y2="360" />
                ))}
                {[...Array(10)].map((_, i) => (
                  <line key={`h-${i}`} x1="0" y1={i * 40} x2="520" y2={i * 40} />
                ))}
              </g>

              {/* Elevation Contours / Mountain ridges (Specific to terrain) */}
              {routeData.svgMap.contours?.map((cnt, i) => (
                <path
                  key={`cnt-${i}`}
                  d={cnt.d}
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                  fill="none"
                  opacity={cnt.opacity || 0.2}
                />
              ))}

              {/* Water Feature (Kandy Lake, Mirissa Ocean, Hanthana Stream, Galle coast) */}
              {routeData.svgMap.waterFeature && (
                <g>
                  <path
                    d={routeData.svgMap.waterFeature.d}
                    fill={routeData.svgMap.waterFeature.type === 'ocean' ? 'url(#oceanGrad)' : 'url(#waterGrad)'}
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    opacity="0.85"
                  />
                  {/* Subtle water ripple lines */}
                  {routeData.svgMap.waterFeature.type === 'ocean' && (
                    <>
                      <path
                        d="M 50 290 Q 150 280 250 290 Q 350 300 450 280"
                        stroke="#ffffff"
                        strokeWidth="1"
                        fill="none"
                        opacity="0.35"
                      />
                      <path
                        d="M 80 320 Q 200 310 320 320 Q 420 330 500 310"
                        stroke="#ffffff"
                        strokeWidth="1"
                        fill="none"
                        opacity="0.25"
                      />
                    </>
                  )}
                  <text
                    x={routeData.svgMap.waterFeature.labelX}
                    y={routeData.svgMap.waterFeature.labelY}
                    fill="#93c5fd"
                    fontSize="9.5"
                    fontWeight="bold"
                    letterSpacing="0.5"
                  >
                    {routeData.svgMap.waterFeature.name}
                  </text>
                </g>
              )}

              {/* Road Network & Safe Corridors (Distinct street layout) */}
              {routeData.svgMap.safeCorridors.map((corridor, i) => (
                <g key={`corridor-${i}`}>
                  {/* Base Road Bed */}
                  <path
                    d={corridor.d}
                    stroke="#1e293b"
                    strokeWidth="18"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.9"
                  />
                  <path
                    d={corridor.d}
                    stroke="#334155"
                    strokeWidth="12"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.9"
                  />

                  {/* Safe Street Lighting Glow (when enabled) */}
                  {showLightingOverlay && (
                    <path
                      d={corridor.d}
                      stroke="#f59e0b"
                      strokeWidth="6"
                      strokeLinecap="round"
                      fill="none"
                      opacity="0.4"
                      strokeDasharray="8,6"
                    />
                  )}

                  {/* Road Center Stripe */}
                  <path
                    d={corridor.d}
                    stroke="#475569"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                    fill="none"
                    opacity="0.7"
                  />

                  {/* Road Name Label */}
                  {corridor.label && (
                    <text
                      fontSize="7.5"
                      fill="#94a3b8"
                      fontWeight="600"
                      opacity="0.8"
                    >
                      <textPath href={`#corridor-path-${i}`} startOffset="40%">
                        {corridor.label}
                      </textPath>
                    </text>
                  )}
                </g>
              ))}

              {/* ACTIVE ROUTE PATH (Turn-by-turn guidance vector) */}
              {showDirections && (
                <g>
                  {/* Route Outer Aura Glow */}
                  <path
                    d={activePathD}
                    stroke={travelMode === 'walking' ? '#10b981' : '#8b5cf6'}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    opacity="0.3"
                    filter="url(#glow)"
                  />

                  {/* Animated Dotted Main Route Line */}
                  <path
                    d={activePathD}
                    stroke={travelMode === 'walking' ? '#34d399' : '#a78bfa'}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="8,6"
                    fill="none"
                    className="animate-pulse"
                  />

                  {/* Crisp Center Guide Core */}
                  <path
                    d={activePathD}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    opacity="0.9"
                  />
                </g>
              )}

              {/* Geographic Landmarks for this specific location */}
              {routeData.svgMap.landmarks.map((lm, i) => (
                <g
                  key={`lm-${i}`}
                  transform={`translate(${lm.x}, ${lm.y})`}
                  className="cursor-pointer transition-transform hover:scale-110"
                  onClick={() => setSelectedLandmark(lm.name)}
                >
                  {/* Landmark Halo */}
                  <circle
                    r="10"
                    fill={lm.isSafetyPost ? '#10b981' : '#3b82f6'}
                    opacity={lm.isSafetyPost ? '0.25' : '0.15'}
                  />
                  <circle
                    r="7"
                    fill="#0f172a"
                    stroke={lm.isSafetyPost ? '#10b981' : '#60a5fa'}
                    strokeWidth="1.5"
                  />
                  <text
                    x="0"
                    y="3"
                    fontSize="7"
                    textAnchor="middle"
                    fill="#ffffff"
                  >
                    {lm.icon}
                  </text>

                  {/* Landmark Label Banner */}
                  <rect
                    x="-45"
                    y="-23"
                    width="90"
                    height="14"
                    rx="4"
                    fill="#090d16"
                    stroke={lm.isSafetyPost ? '#10b981' : '#475569'}
                    strokeWidth="1"
                    opacity="0.92"
                  />
                  <text
                    x="0"
                    y="-13"
                    fontSize="6.5"
                    fontWeight="bold"
                    fill={lm.isSafetyPost ? '#6ee7b7' : '#e2e8f0'}
                    textAnchor="middle"
                  >
                    {lm.name.length > 20 ? lm.name.slice(0, 19) + '…' : lm.name}
                  </text>
                </g>
              ))}

              {/* USER LIVE LOCATION PIN (Blue Pulsing Marker) */}
              <g transform={`translate(${routeData.svgMap.userPoint.x}, ${routeData.svgMap.userPoint.y})`}>
                <circle r="22" fill="#3b82f6" opacity="0.2" className="animate-ping" />
                <circle r="12" fill="#2563eb" opacity="0.4" />
                <circle r="7" fill="#1d4ed8" stroke="#ffffff" strokeWidth="2" />
                <circle r="2.5" fill="#ffffff" />

                {/* Live Location Tag Box */}
                <rect
                  x="-55"
                  y="-38"
                  width="110"
                  height="18"
                  rx="6"
                  fill="#1e40af"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                <text
                  x="0"
                  y="-26"
                  fill="#ffffff"
                  fontSize="7.5"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {routeData.svgMap.userPoint.label}
                </text>
              </g>

              {/* DESTINATION HOTEL PIN (Purple Shield & Gold Star) */}
              <g transform={`translate(${routeData.svgMap.hotelPoint.x}, ${routeData.svgMap.hotelPoint.y})`}>
                <circle r="24" fill="#a855f7" opacity="0.25" className="animate-pulse" />
                <circle r="15" fill="#7e22ce" opacity="0.4" />

                {/* Hotel Pin Box */}
                <rect
                  x="-12"
                  y="-24"
                  width="24"
                  height="24"
                  rx="7"
                  fill="#6b21a8"
                  stroke="#fde047"
                  strokeWidth="2"
                />
                <text x="0" y="-8" fill="#ffffff" fontSize="11" textAnchor="middle">
                  🏨
                </text>

                {/* Hotel Name Tag */}
                <rect
                  x="-65"
                  y="-46"
                  width="130"
                  height="20"
                  rx="6"
                  fill="#0b0717"
                  stroke="#c084fc"
                  strokeWidth="1.5"
                />
                <text
                  x="0"
                  y="-32"
                  fill="#f3e8ff"
                  fontSize="8"
                  fontWeight="900"
                  textAnchor="middle"
                >
                  {stay.name.length > 22 ? stay.name.slice(0, 20) + '…' : stay.name}
                </text>
              </g>
            </svg>
          </div>

          {/* Floating Map Legend Strip */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2 pointer-events-none">
            <div className="bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-purple-800/40 text-[10px] text-white flex items-center gap-2 pointer-events-auto shadow-lg">
              <span className="flex items-center gap-1 font-bold text-blue-400">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> You
              </span>
              <span className="text-purple-400">•</span>
              <span className="flex items-center gap-1 font-bold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Safe Route
              </span>
              <span className="text-purple-400">•</span>
              <span className="flex items-center gap-1 font-bold text-amber-300">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Lit Corridor
              </span>
              <span className="text-purple-400">•</span>
              <span className="flex items-center gap-1 font-bold text-purple-300">
                <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" /> Hotel
              </span>
            </div>

            <div className="bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-purple-800/40 text-[10px] text-purple-200 pointer-events-auto hidden sm:block">
              {routeData.elevationNote || 'Pink Shield Verified Street Corridor'}
            </div>
          </div>
        </div>

        {/* ========================================================
            SAFE CORRIDOR & ENVIRONMENT BRIEF
           ======================================================== */}
        <div className="p-3 bg-purple-50/60 dark:bg-purple-950/40 border-b border-purple-900/30 flex items-start gap-2.5 text-xs shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <span className="font-extrabold text-stone-900 dark:text-purple-200 block">
              Safe Corridor: {routeData.safeCorridorName}
            </span>
            <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-0.5 leading-relaxed">
              {routeData.environmentDescription}
            </p>
          </div>
        </div>

        {/* ========================================================
            TURN-BY-TURN DIRECTIONS LIST (Customized for this hotel)
           ======================================================== */}
        {showDirections && (
          <div className="p-3 sm:p-4 flex flex-col gap-2.5 overflow-y-auto max-h-56">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-xs sm:text-sm text-stone-900 dark:text-white flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-emerald-500" />
                <span>
                  {travelMode === 'walking' ? 'Walking Directions' : 'Cab / Driving Route'} · {routeData.distanceKm} km
                </span>
              </h4>
              <span className="text-[10px] text-stone-500 dark:text-purple-300 font-semibold">
                {activeSteps.length} Step Guidance
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {activeSteps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="p-2.5 rounded-2xl bg-white dark:bg-[#1b1033] border border-purple-200/80 dark:border-purple-800/40 flex items-start gap-2.5 text-xs shadow-xs"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    {step.stepNumber}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-extrabold text-stone-900 dark:text-white block text-xs">
                        {step.title}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/50 px-1.5 py-0.2 rounded shrink-0">
                        {step.distance}
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                      {step.instruction}
                    </p>

                    <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800/30 w-fit">
                      <Sparkles className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span>{step.safeHighlight}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            MODAL FOOTER ACTIONS
           ======================================================== */}
        <div className="p-3 border-t border-purple-900/30 flex items-center justify-between gap-2 shrink-0 bg-[#0e071c]">
          <div className="text-[11px] text-stone-400">
            Destination: <span className="text-white font-bold">{stay.name}</span> · {stay.city}
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition active:scale-95"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
