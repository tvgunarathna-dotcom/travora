import React, { useState, useEffect, useMemo } from 'react';
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
  Minimize2,
  Crosshair,
  Plus,
  Compass,
  ZoomIn,
  ZoomOut,
  X,
  Filter,
} from 'lucide-react';
import { MapPOI, SafetyZone, AreaArticle } from '../../types';
import { mockAreaArticles } from '../../data/mockData';
import { sriLankaDistricts, DistrictMapData } from '../../data/districtMapsData';
import { ArticleDetailModal } from './ArticleDetailModal';
import { AddArticleModal } from './AddArticleModal';

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

  // District Search & State (default Kandy, any Sri Lankan district searchable)
  const [searchQuery, setSearchQuery] = useState('Kandy');
  const [activeDistrictKey, setActiveDistrictKey] = useState<string>('kandy');
  const activeDistrict: DistrictMapData = sriLankaDistricts[activeDistrictKey] || sriLankaDistricts['kandy'];

  // Map Interactive Controls
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Selected Zone or POI for details card
  const [selectedZone, setSelectedZone] = useState<SafetyZone>(activeDistrict.zones[0]);
  const [selectedPOI, setSelectedPOI] = useState<MapPOI | null>(null);

  // Articles & User Stories
  const [articlesList, setArticlesList] = useState<AreaArticle[]>(() => {
    const saved = localStorage.getItem('travora_user_articles');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return [...parsed, ...mockAreaArticles];
      } catch (e) {
        return mockAreaArticles;
      }
    }
    return mockAreaArticles;
  });

  const [selectedArticle, setSelectedArticle] = useState<AreaArticle | null>(null);
  const [showAddArticleModal, setShowAddArticleModal] = useState(false);

  // Filter articles specifically by current district / city
  // Hanthana mountain hike is strictly for Kandy; Colombo shows Lotus Tower, Independence Square, Gangaramaya; Galle shows Galle Fort, Rumassala, Martin Wickramasinghe Museum
  const currentCityName = useMemo(() => {
    return activeDistrict.name.replace(' District', '').trim().toLowerCase();
  }, [activeDistrict.name]);

  const displayedArticles = useMemo(() => {
    const matched = articlesList.filter((art) => {
      const artCity = (art.destinationCity || '').toLowerCase();
      return artCity.includes(currentCityName) || currentCityName.includes(artCity);
    });
    return matched.length > 0 ? matched : articlesList;
  }, [articlesList, currentCityName]);

  // Update selected zone when district changes
  useEffect(() => {
    if (activeDistrict.zones.length > 0) {
      setSelectedZone(activeDistrict.zones[0]);
      setSelectedPOI(null);
    }
  }, [activeDistrictKey]);

  // Handle Search Input (matches any Sri Lankan district or landmark)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    // Direct match against district keys or names
    const matchedKey = Object.keys(sriLankaDistricts).find((key) => {
      const d = sriLankaDistricts[key];
      return (
        key.includes(query) ||
        d.name.toLowerCase().includes(query) ||
        d.province.toLowerCase().includes(query) ||
        d.landmarks.some((l) => l.name.toLowerCase().includes(query)) ||
        d.zones.some((z) => z.zoneName.toLowerCase().includes(query))
      );
    });

    if (matchedKey) {
      setActiveDistrictKey(matchedKey);
    } else {
      // If no exact match, fallback to Kandy or Colombo and set zone name
      setActiveDistrictKey('kandy');
    }
  };

  const handleSelectDistrict = (key: string) => {
    setActiveDistrictKey(key);
    setSearchQuery(sriLankaDistricts[key]?.name || key);
  };

  // Filter POIs according to activeCategory
  const filteredPOIs = activeDistrict.pois.filter((poi) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'safe_cafes' && poi.category === 'safe_cafe') return true;
    if (activeCategory === 'hospitals' && poi.category === 'hospital') return true;
    if (activeCategory === 'police' && (poi.category === 'police' || poi.category === 'tourist_police')) return true;
    if (activeCategory === 'restrooms' && poi.category === 'restroom') return true;
    if (activeCategory === 'pharmacies' && poi.category === 'pharmacy') return true;
    return false;
  });

  const handleAddUserArticle = (newArticle: AreaArticle) => {
    const updated = [newArticle, ...articlesList];
    setArticlesList(updated);
    try {
      const userArticlesOnly = updated.filter((a) => a.id.startsWith('art_user_'));
      localStorage.setItem('travora_user_articles', JSON.stringify(userArticlesOnly));
    } catch (e) {
      // storage quota safe
    }
    setSelectedArticle(newArticle);
  };

  /* ========================================================
     MAP SVG RENDERER: DYNAMIC GEOGRAPHY FOR EACH DISTRICT
     ======================================================== */
  const renderDistrictSvg = () => {
    const terrain = activeDistrict.terrainType;

    return (
      <svg
        className="w-full h-full transition-transform duration-300"
        style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
        viewBox="0 0 400 300"
        preserveAspectRatio="none"
      >
        {/* Dynamic Water Bodies / Mountains based on terrain */}
        {terrain === 'mountain_lake' && (
          <>
            {/* Mahaweli River Curve */}
            <path
              d="M 0 140 Q 150 170 230 130 T 400 110"
              fill="none"
              stroke="#93c5fd"
              strokeWidth="20"
              className="opacity-75 dark:opacity-40"
            />
            {/* Kandy Lake */}
            <path
              d="M 170 190 Q 230 175 270 210 Q 240 240 180 220 Z"
              fill="#60a5fa"
              className="opacity-80 dark:opacity-45"
            />
            <text x="195" y="210" fill="#1e3a8a" fontSize="8" fontWeight="bold" className="dark:fill-blue-200">
              Kandy Lake
            </text>
          </>
        )}

        {terrain === 'coastal_harbor' && (
          <>
            {/* Indian Ocean on West Coast (Left) */}
            <path
              d="M 0 0 L 80 0 L 60 120 L 75 180 L 50 300 L 0 300 Z"
              fill="#93c5fd"
              className="opacity-75 dark:opacity-40"
            />
            {/* Beira Lake */}
            <ellipse cx="210" cy="120" rx="35" ry="18" fill="#60a5fa" className="opacity-80 dark:opacity-45" />
            <text x="185" y="122" fill="#1e3a8a" fontSize="8" fontWeight="bold" className="dark:fill-blue-200">
              Beira Lake
            </text>
            <text x="15" y="80" fill="#1e40af" fontSize="9" fontWeight="extrabold" transform="rotate(-90 15 80)" className="dark:fill-blue-200">
              INDIAN OCEAN
            </text>
          </>
        )}

        {terrain === 'fort_ocean' && (
          <>
            {/* Ocean surrounding Fort Peninsula (South & West) */}
            <path
              d="M 0 180 Q 90 200 120 180 Q 260 280 400 240 L 400 300 L 0 300 Z"
              fill="#93c5fd"
              className="opacity-75 dark:opacity-40"
            />
            {/* Fort Ramparts Outline */}
            <path
              d="M 130 90 L 260 85 L 280 180 L 140 185 Z"
              fill="none"
              stroke="#d97706"
              strokeWidth="4"
              strokeDasharray="4,2"
              className="opacity-60"
            />
            <text x="155" y="140" fill="#b45309" fontSize="10" fontWeight="extrabold" className="dark:fill-amber-300">
              GALLE FORT
            </text>
          </>
        )}

        {terrain === 'mountain_ridge' && (
          <>
            {/* Ella Gap Mountain Contours */}
            <path d="M 0 60 Q 120 20 200 80 T 400 50" fill="none" stroke="#86efac" strokeWidth="14" className="opacity-40" />
            <path d="M 0 240 Q 180 200 280 260 T 400 220" fill="none" stroke="#86efac" strokeWidth="18" className="opacity-40" />
            {/* Railway Track Curve (Nine Arches) */}
            <path d="M 50 160 Q 200 120 350 200" fill="none" stroke="#94a3b8" strokeWidth="4" strokeDasharray="3,3" />
            <text x="210" y="180" fill="#475569" fontSize="8" fontWeight="bold" className="dark:fill-stone-300">
              Nine Arches Viaduct
            </text>
          </>
        )}

        {terrain === 'highland_tea' && (
          <>
            {/* Lake Gregory */}
            <ellipse cx="210" cy="210" rx="60" ry="25" fill="#60a5fa" className="opacity-80 dark:opacity-45" />
            {/* Tea Hills Contours */}
            <path d="M 20 80 Q 150 40 380 90" fill="none" stroke="#4ade80" strokeWidth="16" className="opacity-35" />
            <text x="175" y="213" fill="#1e3a8a" fontSize="9" fontWeight="bold" className="dark:fill-blue-200">
              Lake Gregory
            </text>
          </>
        )}

        {terrain === 'northern_peninsula' && (
          <>
            {/* Jaffna Lagoon on South/West */}
            <path d="M 0 160 Q 140 180 200 230 L 0 300 Z" fill="#93c5fd" className="opacity-75 dark:opacity-40" />
            <text x="20" y="240" fill="#1e40af" fontSize="9" fontWeight="bold" className="dark:fill-blue-200">
              Jaffna Lagoon
            </text>
          </>
        )}

        {terrain === 'deep_bay' && (
          <>
            {/* Trincomalee Deep Harbor & Swami Rock */}
            <path d="M 180 0 Q 220 140 320 180 Q 220 260 160 300 L 400 300 L 400 0 Z" fill="#93c5fd" className="opacity-75 dark:opacity-40" />
            <text x="250" y="100" fill="#1e40af" fontSize="9" fontWeight="extrabold" className="dark:fill-blue-200">
              KODDIYAR BAY
            </text>
          </>
        )}

        {terrain === 'southern_surf' && (
          <>
            {/* Southern Ocean shoreline */}
            <path d="M 0 200 Q 180 180 400 230 L 400 300 L 0 300 Z" fill="#93c5fd" className="opacity-75 dark:opacity-40" />
            <text x="160" y="270" fill="#1e40af" fontSize="9" fontWeight="extrabold" className="dark:fill-blue-200">
              MIRISSA BAY (SURF)
            </text>
          </>
        )}

        {/* Road Grid Network */}
        <path d="M 30 30 L 130 130 L 270 170 L 380 230" fill="none" stroke="#ffffff" strokeWidth="7" className="dark:stroke-stone-700" />
        <path d="M 30 30 L 130 130 L 270 170 L 380 230" fill="none" stroke="#f6d365" strokeWidth="3.5" />

        <path d="M 130 40 L 120 250" fill="none" stroke="#ffffff" strokeWidth="5.5" className="dark:stroke-stone-700" />
        <path d="M 130 40 L 120 250" fill="none" stroke="#ffd166" strokeWidth="2.5" />

        <path d="M 40 90 Q 200 95 380 80" fill="none" stroke="#ffffff" strokeWidth="4" className="dark:stroke-stone-800" />
        <path d="M 90 190 Q 240 200 390 170" fill="none" stroke="#ffffff" strokeWidth="4" className="dark:stroke-stone-800" />

        {/* Road Labels for District */}
        {activeDistrict.mainStreets.map((street, idx) => (
          <text
            key={idx}
            x={street.x}
            y={street.y}
            fill="#475569"
            fontSize="8"
            fontWeight="bold"
            transform={street.rotate ? `rotate(${street.rotate} ${street.x} ${street.y})` : undefined}
            className="dark:fill-stone-300"
          >
            {street.name}
          </text>
        ))}

        {/* Landmark Text Labels */}
        {activeDistrict.landmarks.map((l, idx) => (
          <text
            key={idx}
            x={l.x}
            y={l.y}
            fill="#1e293b"
            fontSize="11"
            fontWeight="extrabold"
            className="dark:fill-stone-100"
          >
            {l.name}
          </text>
        ))}

        {/* SAFETY HEATMAP POLYGONS (Toggleable ON / OFF) */}
        {showHeatmap && (
          <>
            {/* Zone 1: Caution Area (Orange/Amber Dashed Polygon) */}
            {activeDistrict.zones[0] && (
              <g
                onClick={() => {
                  setSelectedZone(activeDistrict.zones[0]);
                  setSelectedPOI(null);
                }}
                className="cursor-pointer"
              >
                <polygon
                  points="180,55 275,55 270,115 185,110"
                  fill="#f59e0b"
                  fillOpacity="0.25"
                  stroke="#ea580c"
                  strokeWidth="2.5"
                  strokeDasharray="5,4"
                />
              </g>
            )}

            {/* Zone 2: Verified Safe Zone (Emerald Dashed Polygon) */}
            {activeDistrict.zones[1] && (
              <g
                onClick={() => {
                  setSelectedZone(activeDistrict.zones[1]);
                  setSelectedPOI(null);
                }}
                className="cursor-pointer"
              >
                <polygon
                  points="85,135 220,135 215,205 90,200"
                  fill="#10b981"
                  fillOpacity="0.2"
                  stroke="#059669"
                  strokeWidth="2.5"
                  strokeDasharray="5,4"
                />
              </g>
            )}
          </>
        )}
      </svg>
    );
  };

  return (
    <div className="flex flex-col gap-3.5 p-3 sm:p-4 pb-20 select-none">
      {/* 1. TOP DISTRICT SEARCH & EXPLORE BAR */}
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <div className={`flex items-center gap-2 flex-1 px-3.5 py-2.5 rounded-2xl border transition-all ${
          isDark
            ? 'bg-[#150a28] border-purple-800/50 text-white'
            : 'bg-white border-purple-200 text-stone-900 shadow-xs'
        }`}>
          <Search className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search district (e.g. Kandy, Colombo, Galle, Ella, Nuwara Eliya, Jaffna)..."
            className="bg-transparent text-xs sm:text-sm text-stone-900 dark:text-white placeholder-stone-500 dark:placeholder-purple-300/50 outline-none w-full font-medium"
          />
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-extrabold text-xs px-5 py-2.5 rounded-2xl shadow-md transition active:scale-95"
        >
          Explore
        </button>
      </form>

      {/* 2. POPULAR SRI LANKAN DISTRICT QUICK CHIPS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {[
          { key: 'kandy', label: 'Kandy' },
          { key: 'colombo', label: 'Colombo' },
          { key: 'galle', label: 'Galle' },
          { key: 'ella', label: 'Ella' },
          { key: 'nuwara_eliya', label: 'Nuwara Eliya' },
          { key: 'jaffna', label: 'Jaffna' },
          { key: 'trincomalee', label: 'Trincomalee' },
          { key: 'matara', label: 'Mirissa / Matara' },
        ].map((dist) => (
          <button
            key={dist.key}
            onClick={() => handleSelectDistrict(dist.key)}
            className={`px-3 py-1.5 rounded-xl border font-bold shrink-0 transition ${
              activeDistrictKey === dist.key
                ? 'bg-purple-700 text-white border-purple-500 shadow-xs'
                : isDark
                ? 'bg-stone-900/90 border-purple-900/40 text-purple-300 hover:bg-stone-800'
                : 'bg-white border-purple-200 text-stone-700 hover:bg-purple-50'
            }`}
          >
            {dist.label}
          </button>
        ))}
      </div>

      {/* 3. SAFETY HEATMAP & CATEGORY FILTER CHIPS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {/* Safety Heatmap Toggle: ON / OFF */}
        <button
          onClick={() => setShowHeatmap(!showHeatmap)}
          className={`px-3.5 py-1.5 rounded-xl border text-xs font-black shrink-0 transition flex items-center gap-1.5 ${
            showHeatmap
              ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white border-purple-400 shadow-xs'
              : isDark
              ? 'bg-stone-900 border-purple-900/40 text-stone-400'
              : 'bg-white border-stone-300 text-stone-600'
          }`}
          title="Turn on/off safety heatmap polygon overlays"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Safety Heatmap: {showHeatmap ? 'ON' : 'OFF'}</span>
        </button>

        {/* All Filters / Reset */}
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-xl border text-xs font-bold shrink-0 transition ${
            activeCategory === 'all'
              ? 'bg-purple-600 text-white border-purple-400 shadow-xs'
              : isDark
              ? 'bg-stone-900 border-purple-900/40 text-stone-300'
              : 'bg-white border-purple-200 text-stone-700'
          }`}
        >
          All POIs ({activeDistrict.pois.length})
        </button>

        {/* Safe Cafes Filter */}
        <button
          onClick={() => setActiveCategory(activeCategory === 'safe_cafes' ? 'all' : 'safe_cafes')}
          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold shrink-0 transition flex items-center gap-1.5 ${
            activeCategory === 'safe_cafes'
              ? 'bg-amber-600 text-white border-amber-400'
              : isDark
              ? 'bg-stone-900/80 border-stone-800 text-amber-300'
              : 'bg-white border-stone-300 text-stone-800'
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span>Safe Cafes</span>
        </button>

        {/* Hospitals Filter */}
        <button
          onClick={() => setActiveCategory(activeCategory === 'hospitals' ? 'all' : 'hospitals')}
          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold shrink-0 transition flex items-center gap-1.5 ${
            activeCategory === 'hospitals'
              ? 'bg-rose-600 text-white border-rose-400'
              : isDark
              ? 'bg-stone-900/80 border-stone-800 text-rose-300'
              : 'bg-white border-stone-300 text-stone-800'
          }`}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 flex items-center justify-center text-[7px] text-white font-black">
            +
          </div>
          <span>Hospitals / 24hr</span>
        </button>

        {/* Police Filter */}
        <button
          onClick={() => setActiveCategory(activeCategory === 'police' ? 'all' : 'police')}
          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold shrink-0 transition flex items-center gap-1.5 ${
            activeCategory === 'police'
              ? 'bg-blue-600 text-white border-blue-400'
              : isDark
              ? 'bg-stone-900/80 border-stone-800 text-blue-300'
              : 'bg-white border-stone-300 text-stone-800'
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span>Tourist Police</span>
        </button>

        {/* Pharmacies */}
        <button
          onClick={() => setActiveCategory(activeCategory === 'pharmacies' ? 'all' : 'pharmacies')}
          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold shrink-0 transition flex items-center gap-1.5 ${
            activeCategory === 'pharmacies'
              ? 'bg-emerald-600 text-white border-emerald-400'
              : isDark
              ? 'bg-stone-900/80 border-stone-800 text-emerald-300'
              : 'bg-white border-stone-300 text-stone-800'
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Pharmacies</span>
        </button>
      </div>

      {/* 4. DYNAMIC INTERACTIVE MAP VIEW WITH FULLSCREEN TOGGLE */}
      <div className={`relative w-full rounded-3xl overflow-hidden border shadow-lg transition-all ${
        isDark ? 'border-purple-800/40 bg-[#121622]' : 'border-purple-200 bg-[#e5e9f0]'
      } h-72 sm:h-80`}>
        {/* Render District Vector Map */}
        {renderDistrictSvg()}

        {/* Interactive Floating Caution Area Badge */}
        {showHeatmap && activeDistrict.zones[0] && (
          <div
            onClick={() => {
              setSelectedZone(activeDistrict.zones[0]);
              setSelectedPOI(null);
            }}
            className="absolute top-12 left-[50%] -translate-x-1/2 bg-amber-500/90 hover:bg-amber-600 text-white text-[9px] font-black px-2.5 py-1 rounded-full shadow-md cursor-pointer border border-white/50 flex items-center gap-1 active:scale-95 transition z-10"
          >
            <AlertTriangle className="w-2.5 h-2.5" />
            <span>Caution: {activeDistrict.zones[0].safetyScore}/100</span>
          </div>
        )}

        {/* Interactive Floating Verified Safe Zone Badge */}
        {showHeatmap && activeDistrict.zones[1] && (
          <div
            onClick={() => {
              setSelectedZone(activeDistrict.zones[1]);
              setSelectedPOI(null);
            }}
            className="absolute bottom-20 left-20 bg-emerald-600/90 hover:bg-emerald-700 text-white text-[9px] font-black px-2.5 py-1 rounded-full shadow-md cursor-pointer border border-white/50 flex items-center gap-1 active:scale-95 transition z-10"
          >
            <ShieldCheck className="w-2.5 h-2.5" />
            <span>Verified Safe ({activeDistrict.zones[1].safetyScore}/100)</span>
          </div>
        )}

        {/* Filtered Dynamic POI Markers */}
        {filteredPOIs.map((poi, idx) => {
          const isHospital = poi.category === 'hospital';
          const isPolice = poi.category === 'tourist_police' || poi.category === 'police';
          const isCafe = poi.category === 'safe_cafe';
          const isPharmacy = poi.category === 'pharmacy';

          // Coordinates map to visual placement
          const leftPositions = [20, 36, 68, 78, 86];
          const topPositions = [12, 22, 16, 26, 20];
          const left = leftPositions[idx % leftPositions.length];
          const top = topPositions[idx % topPositions.length];

          return (
            <button
              key={poi.poiId}
              onClick={() => setSelectedPOI(poi)}
              style={{ left: `${left}%`, top: `${top}%` }}
              className={`absolute w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-md border-2 border-white hover:scale-125 transition-transform cursor-pointer z-10 ${
                isHospital
                  ? 'bg-rose-500 text-white'
                  : isPolice
                  ? 'bg-blue-600 text-white'
                  : isCafe
                  ? 'bg-amber-500 text-white'
                  : isPharmacy
                  ? 'bg-emerald-500 text-white'
                  : 'bg-purple-600 text-white'
              }`}
              title={poi.name}
            >
              {isHospital ? '+' : isPolice ? '🛡️' : isCafe ? '☕' : isPharmacy ? '💊' : '📍'}
            </button>
          );
        })}

        {/* User Current Location Radar Pulse */}
        <div className="absolute top-24 left-32 w-8 h-8 rounded-full bg-purple-600/30 border-2 border-purple-500 flex items-center justify-center animate-pulse z-10 pointer-events-none">
          <div className="w-3.5 h-3.5 rounded-full bg-purple-600 border border-white" />
        </div>

        {/* Bottom Right Map Action Controls (Zoom, Center, Fullscreen) */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-1.5 z-20">
          <button
            onClick={() => setIsFullscreen(true)}
            className="w-8 h-8 rounded-xl bg-black/80 hover:bg-black text-white flex items-center justify-center shadow-md backdrop-blur-xs transition"
            title="Expand to Fullscreen Map"
          >
            <Maximize2 className="w-4 h-4 text-purple-300" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.5))}
            className="w-8 h-8 rounded-xl bg-black/80 hover:bg-black text-white flex items-center justify-center shadow-md backdrop-blur-xs transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 1))}
            className="w-8 h-8 rounded-xl bg-black/80 hover:bg-black text-white flex items-center justify-center shadow-md backdrop-blur-xs transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="w-8 h-8 rounded-xl bg-black/80 hover:bg-black text-white flex items-center justify-center shadow-md backdrop-blur-xs transition"
            title="Recenter Map"
          >
            <Crosshair className="w-4 h-4 text-purple-400" />
          </button>
        </div>

        {/* Top Left District Indicator Pill */}
        <div className="absolute top-3 left-3 bg-black/80 text-white text-[10px] font-black px-3 py-1.5 rounded-xl backdrop-blur-xs border border-white/20 flex items-center gap-1.5 z-10">
          <MapPin className="w-3 h-3 text-purple-400" />
          <span>{activeDistrict.name}</span>
          <span className="text-purple-300 text-[9px] font-normal">({activeDistrict.province})</span>
        </div>
      </div>

      {/* 5. DOWNLOAD OFFLINE VECTOR MAP BANNER */}
      <div className="rounded-2xl bg-[#130722] border border-purple-800/40 p-3.5 text-white flex items-center justify-between gap-3 shadow-md">
        <div>
          <h4 className="font-extrabold text-xs text-white">
            Download Offline Vector Map ({activeDistrict.name})
          </h4>
          <p className="text-[10px] text-purple-200/80 mt-0.5">
            Offline GPS navigation & safe zone overlays without cellular data (140 MB)
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

      {/* 6. SELECTED AREA OR POI DETAILS CARD (Gonawala, Kandy Lake, etc.) */}
      {selectedPOI ? (
        /* Selected POI Details Card */
        <div className={`rounded-2xl border p-4 shadow-md transition-all ${
          isDark ? 'bg-[#150a28] border-purple-800/50 text-white' : 'bg-white border-purple-200 text-stone-900'
        }`}>
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Verified Map Landmark · {activeDistrict.name}
              </span>
              <h3 className="font-extrabold text-sm sm:text-base text-stone-900 dark:text-white">
                {selectedPOI.name}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-purple-500" /> {selectedPOI.address}
              </p>
            </div>
            <div className="flex items-center gap-1 bg-amber-500/20 text-amber-500 px-2.5 py-1 rounded-xl text-xs font-black shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-500" />
              <span>{selectedPOI.rating}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 my-2.5">
            {selectedPOI.safetyFeatures.map((f, i) => (
              <span
                key={i}
                className="text-[10px] bg-purple-950/40 border border-purple-700/40 text-purple-300 px-2 py-0.5 rounded-md font-semibold"
              >
                ✓ {f}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-purple-900/30 pt-2.5 mt-2">
            <span className="text-[11px] text-stone-700 dark:text-stone-300 font-medium">
              {selectedPOI.open24Hours ? 'Open 24 Hours' : selectedPOI.operatingHours}
            </span>
            <button
              onClick={() => onAskSerenaAI(`Tell me about the safety precautions and verified reviews for ${selectedPOI.name} in ${activeDistrict.name}.`)}
              className="text-xs text-purple-600 dark:text-purple-300 font-extrabold hover:underline flex items-center gap-1"
            >
              Ask Serena AI →
            </button>
          </div>
        </div>
      ) : (
        /* Selected Zone Card (e.g. Gonawala Town Area, Nattarampota, etc.) */
        <div className={`rounded-2xl border p-4 shadow-md transition-all ${
          isDark ? 'bg-[#150a28] border-purple-800/50 text-white' : 'bg-white border-purple-200 text-stone-900'
        }`}>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              <div className={`w-3.5 h-3.5 rounded-full ${
                selectedZone.level === 'safe' ? 'bg-emerald-500' : 'bg-amber-500'
              }`} />
              <h3 className="font-extrabold text-sm sm:text-base text-stone-900 dark:text-white">
                {selectedZone.zoneName}
              </h3>
            </div>

            <div className="text-right">
              <span className={`text-base font-black ${
                selectedZone.safetyScore >= 80 ? 'text-emerald-500' : 'text-amber-500'
              }`}>
                {selectedZone.safetyScore}/100
              </span>
              <span className="text-[9px] uppercase tracking-wider text-purple-500 font-bold block">
                SAFETY INDEX
              </span>
            </div>
          </div>

          <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed mb-3">
            {selectedZone.recommendedCurfew}
          </p>

          {/* 3 Metric Pills */}
          <div className="grid grid-cols-3 gap-2 text-center py-2.5 border-y border-purple-900/30 mb-3">
            <div>
              <span className="text-xs font-black text-stone-900 dark:text-white block">
                {selectedZone.streetLightingIndex}/10
              </span>
              <span className="text-[10px] text-stone-600 dark:text-purple-300 font-medium">
                Street Lighting
              </span>
            </div>
            <div>
              <span className="text-xs font-black text-stone-900 dark:text-white block">
                {selectedZone.activeSoloTravelers}
              </span>
              <span className="text-[10px] text-stone-600 dark:text-purple-300 font-medium">
                Solo Travelers
              </span>
            </div>
            <div>
              <span className="text-xs font-black text-stone-900 dark:text-white block">
                {selectedZone.userReportsCount}
              </span>
              <span className="text-[10px] text-stone-600 dark:text-purple-300 font-medium">
                Verified Reports
              </span>
            </div>
          </div>

          <button
            onClick={() => onAskSerenaAI(`What is the recommended night curfew, transport, and safe cafes in ${selectedZone.zoneName}, ${activeDistrict.name}?`)}
            className="w-full text-center text-xs font-bold text-purple-700 dark:text-purple-300 hover:text-purple-500 py-2 rounded-xl border border-purple-500/30 bg-purple-100/50 dark:bg-purple-950/40 hover:bg-purple-200/60 dark:hover:bg-purple-900/60 transition"
          >
            Ask Serena AI About Night Curfew & Safety in this Area →
          </button>
        </div>
      )}

      {/* 7. "THINGS TO DO..." ARTICLES SECTION (TripAdvisor Layout) */}
      <div className="mt-2">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <div>
            <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-white">
              Things To Do in {activeDistrict.name.replace(' District', '')}
            </h3>
            <p className="text-[11px] text-stone-600 dark:text-purple-300">
              TripAdvisor style guides with safety ratings, duration, & verified reviews
            </p>
          </div>
          <span className="text-xs text-purple-700 dark:text-purple-400 font-bold shrink-0">
            {displayedArticles.length} Articles
          </span>
        </div>

        {/* Featured Top Article */}
        {displayedArticles[0] && (
          <div
            onClick={() => setSelectedArticle(displayedArticles[0])}
            className="relative rounded-3xl overflow-hidden border border-purple-800/40 shadow-xl cursor-pointer group mb-3 transform active:scale-98 transition"
          >
            <div className="h-52 sm:h-60 w-full overflow-hidden bg-stone-900">
              <img
                src={displayedArticles[0].heroImage}
                alt={displayedArticles[0].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-[10px] bg-purple-600 text-white font-bold px-2.5 py-0.5 rounded-md inline-block mb-1 shadow-sm">
                Top Rated · {displayedArticles[0].destinationCity}
              </span>
              <h4 className="text-lg sm:text-xl font-black leading-tight drop-shadow-md">
                {displayedArticles[0].title}
              </h4>
              <p className="text-xs text-purple-200 mt-0.5 drop-shadow-sm line-clamp-1">
                {displayedArticles[0].subtitle}
              </p>
              <div className="flex items-center gap-3 mt-2 text-[11px] text-purple-200 font-medium">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {displayedArticles[0].rating} ({displayedArticles[0].reviewsCount})
                </span>
                <span>• {displayedArticles[0].duration}</span>
                <span>• {displayedArticles[0].difficulty}</span>
              </div>
            </div>
          </div>
        )}

        {/* Other Article Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {displayedArticles.slice(1).map((art) => (
            <div
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className={`rounded-2xl border p-3 flex gap-3 cursor-pointer shadow-md transition transform active:scale-98 group ${
                isDark
                  ? 'bg-[#150a28] border-purple-800/40 hover:border-purple-600 text-white'
                  : 'bg-white border-purple-200 hover:border-purple-300 text-stone-900'
              }`}
            >
              <img
                src={art.heroImage}
                alt={art.title}
                className="w-20 h-20 rounded-xl object-cover shrink-0 border border-purple-900/30 group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase font-bold text-purple-600 dark:text-purple-400 tracking-wider">
                      {art.category}
                    </span>
                    {art.id.startsWith('art_user_') && (
                      <span className="text-[8px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-bold">
                        USER REVIEW
                      </span>
                    )}
                  </div>
                  <h5 className="font-extrabold text-xs leading-snug line-clamp-2 text-stone-900 dark:text-white mt-0.5">
                    {art.title}
                  </h5>
                </div>
                <div className="flex items-center justify-between text-[10px] text-stone-600 dark:text-stone-300 mt-1">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3 h-3 fill-amber-500" />
                    <span>{art.rating}</span>
                  </div>
                  <span>{art.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 8. OPTION FOR USERS TO ADD ARTICLES AT EXPLORE PAGE BOTTOM */}
        <div className={`rounded-3xl border p-4.5 text-center shadow-lg transition-all ${
          isDark
            ? 'bg-gradient-to-br from-[#180d33] to-[#120824] border-purple-800/50 text-white'
            : 'bg-gradient-to-br from-purple-50 via-white to-purple-50 border-purple-200 text-stone-900'
        }`}>
          <div className="w-10 h-10 rounded-2xl bg-purple-700/60 border border-purple-500/40 mx-auto flex items-center justify-center mb-2 shadow-sm">
            <Compass className="w-5 h-5 text-purple-200" />
          </div>
          <h4 className="font-black text-sm sm:text-base text-stone-900 dark:text-white">
            Visited a Destination in Sri Lanka?
          </h4>
          <p className="text-xs text-stone-600 dark:text-purple-200 max-w-md mx-auto mt-1 mb-3.5 leading-relaxed">
            Directly add your own destination article, review, descriptions, photos, and 1–5 star ratings to help solo female travelers explore with confidence.
          </p>

          <button
            onClick={() => setShowAddArticleModal(true)}
            className="bg-gradient-to-r from-purple-700 via-fuchsia-600 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-black text-xs px-6 py-3 rounded-2xl shadow-lg shadow-purple-900/30 flex items-center gap-2 mx-auto active:scale-95 transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Write Destination Article & Review</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          FULLSCREEN EXPANDED MAP VIEW OVERLAY
         ======================================================== */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-[#0b0518] flex flex-col text-white">
          {/* Fullscreen Header Bar */}
          <div className="p-3 bg-black/80 backdrop-blur-md border-b border-purple-800/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-400" />
              <div>
                <h3 className="font-black text-sm text-white">
                  {activeDistrict.name} · Fullscreen Interactive Map
                </h3>
                <span className="text-[10px] text-purple-300">
                  Safety Score: {activeDistrict.safetyScore}/100 · {activeDistrict.province}
                </span>
              </div>
            </div>

            {/* Quick Controls inside Fullscreen */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                  showHeatmap ? 'bg-purple-700 text-white border-purple-400' : 'bg-stone-900 text-stone-400 border-stone-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Heatmap: {showHeatmap ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={() => setIsFullscreen(false)}
                className="p-2 rounded-xl bg-purple-900/40 hover:bg-purple-800 text-white border border-purple-500/40 transition"
                title="Exit Fullscreen"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Fullscreen Map Body */}
          <div className="flex-1 relative overflow-hidden bg-[#121622]">
            {renderDistrictSvg()}

            {/* Floating Filter Bar at Top */}
            <div className="absolute top-3 left-3 right-3 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar z-20">
              {['all', 'safe_cafes', 'hospitals', 'police', 'pharmacies'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-xl border text-xs font-bold shrink-0 transition ${
                    activeCategory === cat
                      ? 'bg-purple-600 text-white border-purple-300 shadow-md'
                      : 'bg-black/70 text-purple-200 border-purple-800/60 backdrop-blur-xs'
                  }`}
                >
                  {cat === 'all'
                    ? 'All Pins'
                    : cat === 'safe_cafes'
                    ? '☕ Safe Cafes'
                    : cat === 'hospitals'
                    ? '+ Hospitals'
                    : cat === 'police'
                    ? '🛡️ Police'
                    : '💊 Pharmacies'}
                </button>
              ))}
            </div>

            {/* Filtered POI pins on fullscreen map */}
            {filteredPOIs.map((poi, idx) => {
              const isHospital = poi.category === 'hospital';
              const isPolice = poi.category === 'tourist_police' || poi.category === 'police';
              const isCafe = poi.category === 'safe_cafe';
              const isPharmacy = poi.category === 'pharmacy';

              const leftPositions = [22, 38, 64, 76, 84];
              const topPositions = [14, 24, 18, 28, 22];
              const left = leftPositions[idx % leftPositions.length];
              const top = topPositions[idx % topPositions.length];

              return (
                <button
                  key={poi.poiId}
                  onClick={() => setSelectedPOI(poi)}
                  style={{ left: `${left}%`, top: `${top}%` }}
                  className={`absolute w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-xl border-2 border-white hover:scale-125 transition-transform cursor-pointer z-20 ${
                    isHospital
                      ? 'bg-rose-500 text-white'
                      : isPolice
                      ? 'bg-blue-600 text-white'
                      : isCafe
                      ? 'bg-amber-500 text-white'
                      : isPharmacy
                      ? 'bg-emerald-500 text-white'
                      : 'bg-purple-600 text-white'
                  }`}
                >
                  {isHospital ? '+' : isPolice ? '🛡️' : isCafe ? '☕' : isPharmacy ? '💊' : '📍'}
                </button>
              );
            })}

            {/* Bottom Right Floating Zoom & Recenter controls */}
            <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-30">
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 0.3, 3))}
                className="w-10 h-10 rounded-2xl bg-black/80 hover:bg-black text-white flex items-center justify-center shadow-lg border border-purple-500/40"
              >
                <ZoomIn className="w-5 h-5 text-purple-300" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 0.3, 1))}
                className="w-10 h-10 rounded-2xl bg-black/80 hover:bg-black text-white flex items-center justify-center shadow-lg border border-purple-500/40"
              >
                <ZoomOut className="w-5 h-5 text-purple-300" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="w-10 h-10 rounded-2xl bg-black/80 hover:bg-black text-white flex items-center justify-center shadow-lg border border-purple-500/40"
              >
                <Crosshair className="w-5 h-5 text-purple-400" />
              </button>
            </div>

            {/* Selected Item Drawer at Bottom */}
            <div className="absolute bottom-4 left-4 right-20 bg-black/90 backdrop-blur-md border border-purple-600/50 rounded-2xl p-3.5 z-30 text-white shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold text-purple-400 tracking-wider">
                    {selectedPOI ? selectedPOI.category.replace('_', ' ') : 'Safety Zone Information'}
                  </span>
                  <h4 className="font-black text-sm text-white">
                    {selectedPOI ? selectedPOI.name : selectedZone.zoneName}
                  </h4>
                  <p className="text-xs text-stone-300 mt-0.5">
                    {selectedPOI ? selectedPOI.address : selectedZone.recommendedCurfew}
                  </p>
                </div>
                <button
                  onClick={() => onAskSerenaAI(`Provide complete solo travel safety advice for ${selectedPOI ? selectedPOI.name : selectedZone.zoneName} in ${activeDistrict.name}.`)}
                  className="bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl shrink-0"
                >
                  Serena Advice →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TripAdvisor Article Detail Modal */}
      <ArticleDetailModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
        onAskSerena={onAskSerenaAI}
        theme={theme}
      />

      {/* User Add Destination Article & Review Modal */}
      <AddArticleModal
        isOpen={showAddArticleModal}
        onClose={() => setShowAddArticleModal(false)}
        onAddArticle={handleAddUserArticle}
        currentDistrict={activeDistrict.name.replace(' District', '')}
        theme={theme}
      />
    </div>
  );
};
