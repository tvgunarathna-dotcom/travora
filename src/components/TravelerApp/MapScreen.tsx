import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Layers,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Star,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Download,
  AlertTriangle,
  Maximize2,
  Crosshair,
} from 'lucide-react';
import { MapPOI, SafetyZone, AreaArticle } from '../../types';
import { mockSafetyZones, mockDynamicPOIs, mockAreaArticles } from '../../data/mockData';
import { ArticleDetailModal } from './ArticleDetailModal';

interface MapScreenProps {
  onAskSerenaAI: (query: string) => void;
  onTriggerUpgradePrompt: () => void;
  theme: 'dark' | 'light';
}

export const MapScreen: React.FC<MapScreenProps> = ({
  onAskSerenaAI,
  onTriggerUpgradePrompt,
  theme,
}) => {
  const isDark = theme === 'dark';

  // District Search (Default Kandy as shown in PDF, but any Sri Lankan district searchable)
  const [searchQuery, setSearchQuery] = useState('Kandy');
  const [activeDistrict, setActiveDistrict] = useState('Kandy');

  // Filter Categories
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Selected Zone or POI for details card (Default to Gonawala Town Area matching Screenshot 2)
  const [selectedZone, setSelectedZone] = useState<SafetyZone>(mockSafetyZones[0]);
  const [selectedPOI, setSelectedPOI] = useState<MapPOI | null>(null);

  // Article Modal
  const [selectedArticle, setSelectedArticle] = useState<AreaArticle | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveDistrict(searchQuery.trim());
      // Find matching zone if available
      const match = mockSafetyZones.find((z) =>
        z.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        z.zoneName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (match) setSelectedZone(match);
    }
  };

  // Filter POIs
  const filteredPOIs = mockDynamicPOIs.filter((poi) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'safe_cafes' && poi.category === 'safe_cafe') return true;
    if (activeCategory === 'hospitals' && poi.category === 'hospital') return true;
    if (activeCategory === 'police' && (poi.category === 'police' || poi.category === 'tourist_police')) return true;
    if (activeCategory === 'restrooms' && poi.category === 'restroom') return true;
    if (activeCategory === 'pharmacies' && poi.category === 'pharmacy') return true;
    return false;
  });

  return (
    <div className="flex flex-col gap-3 p-3 sm:p-4 pb-20 select-none">
      {/* 1. TOP SEARCH BAR (Matching Screenshot 2) */}
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <div className={`flex items-center gap-2 flex-1 px-3.5 py-2.5 rounded-2xl border transition-all ${
          isDark
            ? 'bg-[#150a28] border-purple-800/50 text-white'
            : 'bg-white border-purple-200 text-stone-900 shadow-xs'
        }`}>
          <Search className="w-4 h-4 text-purple-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search here (e.g. Kandy, Colombo, Galle, Ella)..."
            className="bg-transparent text-xs sm:text-sm text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-purple-300/40 outline-none w-full font-medium"
          />
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-bold text-xs px-5 py-2.5 rounded-2xl shadow-md transition active:scale-95"
        >
          Explore
        </button>
      </form>

      {/* 2. FILTER CHIPS HORIZONTAL ROW (Matching Screenshot 2) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {/* Safety Heatmap Toggle */}
        <button
          onClick={() => setShowHeatmap(!showHeatmap)}
          className={`px-3 py-1.5 rounded-xl border text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${
            showHeatmap
              ? 'bg-purple-700 text-white border-purple-500 shadow-xs'
              : isDark
              ? 'bg-stone-900 border-purple-900/40 text-purple-300'
              : 'bg-white border-purple-200 text-purple-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Safety Heatmap</span>
        </button>

        {/* Filters Button */}
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-xl border text-xs font-bold shrink-0 transition ${
            activeCategory === 'all'
              ? 'bg-purple-600 text-white border-purple-400'
              : isDark
              ? 'bg-stone-900 border-purple-900/40 text-stone-300'
              : 'bg-white border-purple-200 text-stone-700'
          }`}
        >
          Filters
        </button>

        {/* Safe Cafes */}
        <button
          onClick={() => setActiveCategory(activeCategory === 'safe_cafes' ? 'all' : 'safe_cafes')}
          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold shrink-0 transition flex items-center gap-1.5 ${
            activeCategory === 'safe_cafes'
              ? 'bg-amber-600 text-white border-amber-400'
              : isDark
              ? 'bg-stone-900/80 border-stone-800 text-amber-300'
              : 'bg-white border-stone-200 text-stone-800'
          }`}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>Safe cafes</span>
        </button>

        {/* Hospitals / 24 Hour Medical */}
        <button
          onClick={() => setActiveCategory(activeCategory === 'hospitals' ? 'all' : 'hospitals')}
          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold shrink-0 transition flex items-center gap-1.5 ${
            activeCategory === 'hospitals'
              ? 'bg-rose-600 text-white border-rose-400'
              : isDark
              ? 'bg-stone-900/80 border-stone-800 text-rose-300'
              : 'bg-white border-stone-200 text-stone-800'
          }`}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 flex items-center justify-center text-[8px] text-white font-black">
            +
          </div>
          <span>Hospitals / 24hr</span>
        </button>

        {/* Police / Tourist Police */}
        <button
          onClick={() => setActiveCategory(activeCategory === 'police' ? 'all' : 'police')}
          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold shrink-0 transition flex items-center gap-1.5 ${
            activeCategory === 'police'
              ? 'bg-blue-600 text-white border-blue-400'
              : isDark
              ? 'bg-stone-900/80 border-stone-800 text-blue-300'
              : 'bg-white border-stone-200 text-stone-800'
          }`}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span>Police / Tourist Police</span>
        </button>

        {/* Clean Restrooms */}
        <button
          onClick={() => setActiveCategory(activeCategory === 'restrooms' ? 'all' : 'restrooms')}
          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold shrink-0 transition flex items-center gap-1.5 ${
            activeCategory === 'restrooms'
              ? 'bg-teal-600 text-white border-teal-400'
              : isDark
              ? 'bg-stone-900/80 border-stone-800 text-teal-300'
              : 'bg-white border-stone-200 text-stone-800'
          }`}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />
          <span>Clean Restrooms</span>
        </button>

        {/* Pharmacies / Period Hygiene */}
        <button
          onClick={() => setActiveCategory(activeCategory === 'pharmacies' ? 'all' : 'pharmacies')}
          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold shrink-0 transition flex items-center gap-1.5 ${
            activeCategory === 'pharmacies'
              ? 'bg-emerald-600 text-white border-emerald-400'
              : isDark
              ? 'bg-stone-900/80 border-stone-800 text-emerald-300'
              : 'bg-white border-stone-200 text-stone-800'
          }`}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Pharmacies / Period Hygiene</span>
        </button>
      </div>

      {/* 3. DYNAMIC GOOGLE MAPS STYLE VIEW (Matching Screenshot 2) */}
      <div className={`relative h-72 sm:h-80 w-full rounded-3xl overflow-hidden border shadow-lg ${
        isDark ? 'border-purple-800/40 bg-[#121622]' : 'border-purple-100 bg-[#e5e9f0]'
      }`}>
        {/* Realistic SVG Vector Map with Kandy road names: Kalapura Rd, Nattarampota, Kundasale, Gonawala */}
        <svg className="w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="none">
          {/* River / Waterbody (Mahaweli River curve) */}
          <path
            d="M 0 140 Q 150 170 230 130 T 400 110"
            fill="none"
            stroke="#a5c9eb"
            strokeWidth="18"
            className="opacity-70 dark:opacity-40"
          />

          {/* Road Network */}
          {/* Main Highway */}
          <path d="M 30 20 L 120 120 L 260 170 L 380 220" fill="none" stroke="#ffffff" strokeWidth="6" className="dark:stroke-stone-700" />
          <path d="M 30 20 L 120 120 L 260 170 L 380 220" fill="none" stroke="#f6d365" strokeWidth="3" />

          {/* Kalapura Road */}
          <path d="M 120 40 L 110 240" fill="none" stroke="#ffffff" strokeWidth="5" className="dark:stroke-stone-700" />
          <path d="M 120 40 L 110 240" fill="none" stroke="#ffd166" strokeWidth="2.5" />

          {/* Secondary Crossroads */}
          <path d="M 20 80 Q 180 90 380 70" fill="none" stroke="#ffffff" strokeWidth="4" className="dark:stroke-stone-800" />
          <path d="M 80 180 Q 240 190 390 160" fill="none" stroke="#ffffff" strokeWidth="4" className="dark:stroke-stone-800" />

          {/* Street Labels */}
          <text x="75" y="110" fill="#64748b" fontSize="8" fontWeight="bold" transform="rotate(-75 75 110)">
            Kalapura Rd
          </text>
          <text x="65" y="155" fill="#334155" fontSize="13" fontWeight="bold" className="dark:fill-stone-300">
            Nattarampota
          </text>
          <text x="270" y="155" fill="#334155" fontSize="13" fontWeight="bold" className="dark:fill-stone-300">
            Kundasale
          </text>

          {/* POLYGON 1: Verified Safe Zone (Green Dashed Outline) */}
          <g
            onClick={() => {
              const zone = mockSafetyZones.find((z) => z.zoneId === 'zn-kandy-nattarampota') || mockSafetyZones[1];
              setSelectedZone(zone);
              setSelectedPOI(null);
            }}
            className="cursor-pointer"
          >
            <polygon
              points="90,140 215,140 210,205 95,200"
              fill="#10b981"
              fillOpacity="0.15"
              stroke="#059669"
              strokeWidth="2.5"
              strokeDasharray="5,4"
            />
          </g>

          {/* POLYGON 2: Caution Area 62/100 (Orange/Red Dashed Outline around Gonawala) */}
          <g
            onClick={() => {
              setSelectedZone(mockSafetyZones[0]);
              setSelectedPOI(null);
            }}
            className="cursor-pointer"
          >
            <polygon
              points="180,50 265,50 260,110 185,105"
              fill="#f59e0b"
              fillOpacity="0.2"
              stroke="#ea580c"
              strokeWidth="2.5"
              strokeDasharray="5,4"
            />
          </g>
        </svg>

        {/* Overlay Interactive Badges on Map */}
        {/* Caution Area 62/100 badge */}
        <div
          onClick={() => {
            setSelectedZone(mockSafetyZones[0]);
            setSelectedPOI(null);
          }}
          className="absolute top-14 left-[50%] -translate-x-1/2 bg-amber-500/90 hover:bg-amber-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-md cursor-pointer border border-white/40 flex items-center gap-1 active:scale-95 transition"
        >
          <AlertTriangle className="w-2.5 h-2.5" />
          <span>Caution Area 62/100</span>
        </div>

        {/* Verified Safe Zone badge */}
        <div
          onClick={() => {
            const zone = mockSafetyZones.find((z) => z.zoneId === 'zn-kandy-nattarampota') || mockSafetyZones[1];
            setSelectedZone(zone);
            setSelectedPOI(null);
          }}
          className="absolute bottom-28 left-28 bg-emerald-600/90 hover:bg-emerald-700 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-md cursor-pointer border border-white/40 flex items-center gap-1 active:scale-95 transition"
        >
          <ShieldCheck className="w-2.5 h-2.5" />
          <span>Verified Safe Zone</span>
        </div>

        {/* Custom POI Pin Markers matching Screenshot 2 */}
        {/* Red Cross Hospital Pin 1 */}
        <button
          onClick={() => {
            const poi = mockDynamicPOIs.find((p) => p.poiId === 'poi-med-kandy-01') || mockDynamicPOIs[2];
            setSelectedPOI(poi);
          }}
          className="absolute top-10 left-20 w-6 h-6 rounded-full bg-white border-2 border-rose-500 text-rose-600 font-bold text-xs flex items-center justify-center shadow-md hover:scale-110 transition cursor-pointer"
          title="Hospital / 24hr Clinic"
        >
          +
        </button>

        {/* Orange Safe Cafe Pin */}
        <button
          onClick={() => {
            const poi = mockDynamicPOIs.find((p) => p.category === 'safe_cafe') || mockDynamicPOIs[4];
            setSelectedPOI(poi);
          }}
          className="absolute top-14 left-36 w-6 h-6 rounded-full bg-amber-500 border-2 border-white text-white flex items-center justify-center shadow-md hover:scale-110 transition cursor-pointer"
          title="Safe Cafe"
        >
          ☕
        </button>

        {/* Red Cross Hospital Pin 2 */}
        <button
          onClick={() => {
            const poi = mockDynamicPOIs.find((p) => p.poiId === 'poi-med-kundasale') || mockDynamicPOIs[3];
            setSelectedPOI(poi);
          }}
          className="absolute top-20 right-12 w-6 h-6 rounded-full bg-white border-2 border-rose-500 text-rose-600 font-bold text-xs flex items-center justify-center shadow-md hover:scale-110 transition cursor-pointer"
        >
          +
        </button>

        {/* Blue Police Pin */}
        <button
          onClick={() => {
            const poi = mockDynamicPOIs.find((p) => p.category === 'tourist_police') || mockDynamicPOIs[0];
            setSelectedPOI(poi);
          }}
          className="absolute top-16 right-24 w-6 h-6 rounded-full bg-blue-600 border-2 border-white text-white flex items-center justify-center shadow-md hover:scale-110 transition cursor-pointer"
          title="Police / Tourist Police"
        >
          🛡️
        </button>

        {/* Green Pharmacy Pin */}
        <button
          onClick={() => {
            const poi = mockDynamicPOIs.find((p) => p.category === 'pharmacy') || mockDynamicPOIs[3];
            setSelectedPOI(poi);
          }}
          className="absolute top-24 right-36 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white text-white flex items-center justify-center shadow-md hover:scale-110 transition cursor-pointer"
          title="Pharmacy / Period Hygiene"
        >
          💊
        </button>

        {/* Teal Restroom Pin */}
        <button
          onClick={() => {
            const poi = mockDynamicPOIs.find((p) => p.category === 'restroom') || mockDynamicPOIs[5];
            setSelectedPOI(poi);
          }}
          className="absolute top-24 right-4 w-6 h-6 rounded-full bg-teal-500 border-2 border-white text-white flex items-center justify-center shadow-md hover:scale-110 transition cursor-pointer"
          title="Clean Restroom"
        >
          🚻
        </button>

        {/* User Current Location Indicator (Purple avatar dot) */}
        <div className="absolute top-20 left-32 w-8 h-8 rounded-full bg-purple-600/30 border-2 border-purple-500 flex items-center justify-center animate-pulse">
          <div className="w-4 h-4 rounded-full bg-purple-600 border border-white" />
        </div>

        {/* Bottom Right Map Controls */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-1.5">
          <button className="w-7 h-7 rounded-lg bg-black/70 hover:bg-black text-white flex items-center justify-center shadow-md backdrop-blur-xs">
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button className="w-7 h-7 rounded-lg bg-black/70 hover:bg-black text-white flex items-center justify-center shadow-md backdrop-blur-xs">
            <Crosshair className="w-3.5 h-3.5 text-purple-400" />
          </button>
        </div>
      </div>

      {/* 4. DOWNLOAD OFFLINE VECTOR MAP BANNER (Matching Screenshot 2) */}
      <div className="rounded-2xl bg-black/90 border border-purple-800/40 p-3.5 text-white flex items-center justify-between gap-3 shadow-md">
        <div>
          <h4 className="font-extrabold text-xs text-white">
            Download Offline Vector Map (Sri Lanka)
          </h4>
          <p className="text-[10px] text-purple-200/70 mt-0.5">
            High-res offline GPS navigation & safe zone overlays (140 MB)
          </p>
        </div>

        <button
          onClick={onTriggerUpgradePrompt}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-[11px] px-3.5 py-2 rounded-xl flex items-center gap-1.5 shrink-0 shadow-sm active:scale-95 transition"
        >
          <Download className="w-3 h-3" />
          <span>Download (Premium)</span>
        </button>
      </div>

      {/* 5. SELECTED AREA / POI DETAILS CARD (Matching Screenshot 2: Gonawala Town Area) */}
      {selectedPOI ? (
        /* Selected POI Details Card */
        <div className={`rounded-2xl border p-4 shadow-md transition-all ${
          isDark ? 'bg-[#150a28] border-purple-800/50 text-white' : 'bg-white border-purple-100 text-stone-900'
        }`}>
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-purple-500">
                Verified Map Landmark
              </span>
              <h3 className="font-extrabold text-sm sm:text-base text-stone-900 dark:text-white">
                {selectedPOI.name}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-purple-400" /> {selectedPOI.address}
              </p>
            </div>
            <div className="flex items-center gap-1 bg-amber-500/20 text-amber-500 px-2 py-1 rounded-lg text-xs font-bold shrink-0">
              <Star className="w-3 h-3 fill-amber-500" />
              <span>{selectedPOI.rating}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 my-2.5">
            {selectedPOI.safetyFeatures.map((f, i) => (
              <span
                key={i}
                className="text-[10px] bg-purple-950/40 border border-purple-800/40 text-purple-300 px-2 py-0.5 rounded-md font-medium"
              >
                ✓ {f}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-purple-900/30 pt-2 mt-2">
            <span className="text-[11px] text-stone-600 dark:text-stone-300">
              {selectedPOI.open24Hours ? 'Open 24 Hours' : selectedPOI.operatingHours}
            </span>
            <button
              onClick={() => onAskSerenaAI(`Tell me about the safety and reviews for ${selectedPOI.name} in Kandy.`)}
              className="text-xs text-purple-600 dark:text-purple-300 font-bold hover:underline flex items-center gap-1"
            >
              Ask Serena AI →
            </button>
          </div>
        </div>
      ) : (
        /* Selected Zone Card (Screenshot 2: Gonawala Town Area 62/100) */
        <div className={`rounded-2xl border p-4 shadow-md transition-all ${
          isDark ? 'bg-[#150a28] border-purple-800/50 text-white' : 'bg-white border-purple-100 text-stone-900'
        }`}>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                selectedZone.level === 'safe' ? 'bg-emerald-500' : 'bg-amber-500'
              }`} />
              <h3 className="font-extrabold text-sm sm:text-base text-stone-900 dark:text-white">
                {selectedZone.zoneName}
              </h3>
            </div>

            <div className="text-right">
              <div className="flex items-baseline justify-end gap-1">
                <span className={`text-base font-black ${
                  selectedZone.safetyScore >= 80 ? 'text-emerald-500' : 'text-amber-500'
                }`}>
                  {selectedZone.safetyScore}/100
                </span>
              </div>
              <span className="text-[9px] uppercase tracking-wider text-purple-400 font-bold block">
                SAFETY INDEX
              </span>
            </div>
          </div>

          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mb-3">
            {selectedZone.recommendedCurfew}
          </p>

          {/* 3 Metric Pills matching Screenshot 2 */}
          <div className="grid grid-cols-3 gap-2 text-center py-2 border-y border-purple-900/30 mb-3">
            <div>
              <span className="text-xs font-black text-stone-900 dark:text-white block">
                {selectedZone.streetLightingIndex}/10
              </span>
              <span className="text-[9px] text-purple-300/80 font-medium">
                Street Lighting
              </span>
            </div>
            <div>
              <span className="text-xs font-black text-stone-900 dark:text-white block">
                {selectedZone.activeSoloTravelers}
              </span>
              <span className="text-[9px] text-purple-300/80 font-medium">
                Solo Travelers
              </span>
            </div>
            <div>
              <span className="text-xs font-black text-stone-900 dark:text-white block">
                {selectedZone.userReportsCount}
              </span>
              <span className="text-[9px] text-purple-300/80 font-medium">
                Verified Reports
              </span>
            </div>
          </div>

          <button
            onClick={() => onAskSerenaAI(`What is the recommended night curfew and safe transport advice in ${selectedZone.zoneName}?`)}
            className="w-full text-center text-xs font-bold text-purple-600 dark:text-purple-300 hover:text-purple-400 py-1.5 rounded-xl border border-purple-500/30 bg-purple-950/30 hover:bg-purple-950/60 transition"
          >
            Ask Serena AI About Night Curfew in this Area →
          </button>
        </div>
      )}

      {/* 6. "THINGS TO DO..." SECTION (Matching Screenshot 2 & TripAdvisor Layout) */}
      <div className="mt-2">
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-white">
            Things To Do...
          </h3>
          <span className="text-xs text-purple-600 dark:text-purple-400 font-bold">
            TripAdvisor Guides (5)
          </span>
        </div>

        {/* Featured Article 1 (Matches Screenshot 2: Hiking the Hanthana Mountain Range) */}
        {mockAreaArticles[0] && (
          <div
            onClick={() => setSelectedArticle(mockAreaArticles[0])}
            className="relative rounded-3xl overflow-hidden border border-purple-800/40 shadow-xl cursor-pointer group mb-3 transform active:scale-98 transition"
          >
            <div className="h-52 sm:h-60 w-full overflow-hidden bg-stone-900">
              <img
                src={mockAreaArticles[0].heroImage}
                alt={mockAreaArticles[0].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-[10px] bg-purple-600 text-white font-bold px-2.5 py-0.5 rounded-md inline-block mb-1 shadow-sm">
                Top Rated Hike · Kandy
              </span>
              <h4 className="text-lg sm:text-xl font-black leading-tight drop-shadow-md">
                {mockAreaArticles[0].title}
              </h4>
              <p className="text-xs text-purple-200 mt-0.5 drop-shadow-sm">
                All You Should Know
              </p>
              <div className="flex items-center gap-3 mt-2 text-[11px] text-purple-200/90 font-medium">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {mockAreaArticles[0].rating} ({mockAreaArticles[0].reviewsCount})
                </span>
                <span>• {mockAreaArticles[0].duration}</span>
                <span>• {mockAreaArticles[0].difficulty}</span>
              </div>
            </div>
          </div>
        )}

        {/* 4 Other TripAdvisor Style Article Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {mockAreaArticles.slice(1).map((art) => (
            <div
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className={`rounded-2xl border p-3 flex gap-3 cursor-pointer shadow-md transition transform active:scale-98 group ${
                isDark
                  ? 'bg-[#150a28] border-purple-800/40 hover:border-purple-600 text-white'
                  : 'bg-white border-purple-100 hover:border-purple-300 text-stone-900'
              }`}
            >
              <img
                src={art.heroImage}
                alt={art.title}
                className="w-20 h-20 rounded-xl object-cover shrink-0 border border-purple-900/30 group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <span className="text-[9px] uppercase font-bold text-purple-500 tracking-wider">
                    {art.category}
                  </span>
                  <h5 className="font-extrabold text-xs leading-snug line-clamp-2 text-stone-900 dark:text-white">
                    {art.title}
                  </h5>
                </div>
                <div className="flex items-center justify-between text-[10px] text-stone-500 dark:text-stone-400 mt-1">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-2.5 h-2.5 fill-amber-500" />
                    <span>{art.rating}</span>
                  </div>
                  <span>{art.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TripAdvisor Article Detail Modal */}
      <ArticleDetailModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
        onAskSerena={onAskSerenaAI}
        theme={theme}
      />
    </div>
  );
};
