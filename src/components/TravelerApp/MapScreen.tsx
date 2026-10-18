import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Layers,
  Search,
  ShieldCheck,
  ShieldAlert,
  Car,
  Star,
  Navigation,
  Crosshair,
  ExternalLink,
  ChevronRight,
  Info,
  Clock,
  HeartPulse,
  Coffee,
  CheckCircle,
  Building2,
  X,
  Phone,
} from 'lucide-react';
import { MapPOI, SafetyZone, HelaGoDriver } from '../../types';
import { helagoDrivers, mockDynamicPOIs } from '../../data/mockData';
import { apiService } from '../../services/api';

interface MapScreenProps {
  onBookDriver: (driver: HelaGoDriver) => void;
  onOpenAssistantWithLocation: (zoneName: string) => void;
  theme: 'dark' | 'light';
}

export const MapScreen: React.FC<MapScreenProps> = ({
  onBookDriver,
  onOpenAssistantWithLocation,
  theme,
}) => {
  const isDark = theme === 'dark';

  // Search & City state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCity, setActiveCity] = useState<'Colombo' | 'Mirissa' | 'Kandy' | 'Galle' | 'Ella'>('Colombo');

  // Layer filter toggles
  const [showSafetyHeatmap, setShowSafetyHeatmap] = useState(true);
  const [showPOIs, setShowPOIs] = useState(true);
  const [showDrivers, setShowDrivers] = useState(true);
  const [poiCategory, setPoiCategory] = useState<string>('all');

  // Data states
  const [safetyZones, setSafetyZones] = useState<SafetyZone[]>([]);
  const [pois, setPois] = useState<MapPOI[]>([]);
  const [selectedZone, setSelectedZone] = useState<SafetyZone | null>(null);
  const [selectedPOI, setSelectedPOI] = useState<MapPOI | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<HelaGoDriver | null>(null);

  // City coordinates map
  const cityCoordinates: Record<string, { lat: number; lng: number; zoomLabel: string }> = {
    Colombo: { lat: 6.9271, lng: 79.8612, zoomLabel: 'Colombo Metropolitan Area' },
    Mirissa: { lat: 5.9482, lng: 80.4578, zoomLabel: 'Mirissa Coastal Beach Sector' },
    Kandy: { lat: 7.2906, lng: 80.6337, zoomLabel: 'Kandy Cultural Valley' },
    Galle: { lat: 6.0329, lng: 80.2168, zoomLabel: 'Galle Fort Ramparts' },
    Ella: { lat: 6.8667, lng: 81.0466, zoomLabel: 'Ella Mountain Ridge' },
  };

  useEffect(() => {
    loadMapData();
  }, [activeCity, poiCategory]);

  const loadMapData = async () => {
    try {
      const [zonesRes, poisRes] = await Promise.all([
        apiService.getSafetyZones(activeCity),
        apiService.getPOIs(poiCategory),
      ]);
      if (zonesRes.success) setSafetyZones(zonesRes.zones);
      if (poisRes.success) {
        // Filter by active city if present or include regional
        const filtered = poisRes.data.filter(
          (p) => p.city.toLowerCase() === activeCity.toLowerCase() || p.category === 'safe_cafe' || p.category === 'tourist_police'
        );
        setPois(filtered.length > 0 ? filtered : poisRes.data);
      }
    } catch (e) {
      console.warn('Map load fallback:', e);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    if (query.includes('kandy')) setActiveCity('Kandy');
    else if (query.includes('mirissa')) setActiveCity('Mirissa');
    else if (query.includes('galle')) setActiveCity('Galle');
    else if (query.includes('ella')) setActiveCity('Ella');
    else setActiveCity('Colombo');
  };

  const getPoiBadge = (cat: string) => {
    switch (cat) {
      case 'police':
        return { label: 'Police', color: 'bg-blue-600', icon: '🛡️' };
      case 'tourist_police':
        return { label: 'Tourist Police', color: 'bg-purple-600', icon: '👮‍♀️' };
      case 'hospital':
        return { label: '24h Hospital', color: 'bg-rose-600', icon: '🏥' };
      case 'safe_cafe':
        return { label: 'Verified Cafe', color: 'bg-amber-600', icon: '☕' };
      case 'pharmacy':
        return { label: '24h Pharmacy', color: 'bg-emerald-600', icon: '💊' };
      default:
        return { label: 'Safe POI', color: 'bg-purple-600', icon: '📍' };
    }
  };

  return (
    <div className="space-y-4 pb-14 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 1. Functional Dynamic Location Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-purple-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search Colombo, Kandy, Mirissa, or any safety pin...`}
          className={`w-full rounded-2xl pl-10 pr-24 py-2.5 text-xs border focus:outline-none focus:border-purple-600 transition ${
            isDark
              ? 'bg-[#150f24] border-purple-900/40 text-stone-100 placeholder-stone-500'
              : 'bg-white border-purple-100 text-stone-900 placeholder-stone-400 shadow-xs'
          }`}
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-[11px] font-bold shadow-xs transition"
        >
          Explore
        </button>
      </form>

      {/* City Switcher Quick Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-xs">
        <span className="text-[11px] text-stone-500 dark:text-stone-400 shrink-0">City:</span>
        {(['Colombo', 'Mirissa', 'Kandy', 'Galle', 'Ella'] as const).map((city) => (
          <button
            key={city}
            onClick={() => setActiveCity(city)}
            className={`px-3 py-1 rounded-xl shrink-0 font-semibold border transition ${
              activeCity === city
                ? 'bg-purple-700 text-white border-purple-600 shadow-xs'
                : isDark
                ? 'bg-stone-900/80 border-purple-900/30 text-stone-400 hover:text-white'
                : 'bg-purple-50 border-purple-100 text-purple-900 hover:bg-purple-100'
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Layer Toggles & Filters */}
      <div className={`p-3 rounded-2xl border space-y-2 ${
        isDark ? 'bg-[#150f24] border-purple-900/40' : 'bg-white border-purple-100 shadow-xs'
      }`}>
        <div className="grid grid-cols-3 gap-1.5 text-xs">
          <button
            onClick={() => setShowSafetyHeatmap(!showSafetyHeatmap)}
            className={`p-2 rounded-xl flex items-center justify-center gap-1.5 border font-semibold transition ${
              showSafetyHeatmap
                ? 'bg-purple-600 text-white border-purple-500 shadow-xs'
                : isDark
                ? 'bg-stone-950 border-stone-800 text-stone-500'
                : 'bg-stone-100 border-stone-200 text-stone-500'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Safety Heatmap</span>
          </button>

          <button
            onClick={() => setShowPOIs(!showPOIs)}
            className={`p-2 rounded-xl flex items-center justify-center gap-1.5 border font-semibold transition ${
              showPOIs
                ? 'bg-purple-600 text-white border-purple-500 shadow-xs'
                : isDark
                ? 'bg-stone-950 border-stone-800 text-stone-500'
                : 'bg-stone-100 border-stone-200 text-stone-500'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Safe POIs</span>
          </button>

          <button
            onClick={() => setShowDrivers(!showDrivers)}
            className={`p-2 rounded-xl flex items-center justify-center gap-1.5 border font-semibold transition ${
              showDrivers
                ? 'bg-purple-600 text-white border-purple-500 shadow-xs'
                : isDark
                ? 'bg-stone-950 border-stone-800 text-stone-500'
                : 'bg-stone-100 border-stone-200 text-stone-500'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>HelaGo Fleet</span>
          </button>
        </div>

        {/* POI Category Sub-Filters */}
        {showPOIs && (
          <div className="flex items-center gap-1 overflow-x-auto text-[11px] pt-1">
            {[
              { id: 'all', label: 'All POIs' },
              { id: 'safe_cafe', label: '☕ Safe Cafes' },
              { id: 'tourist_police', label: '👮‍♀️ Tourist Police' },
              { id: 'hospital', label: '🏥 24h Medical' },
              { id: 'pharmacy', label: '💊 Hygiene & Pads' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setPoiCategory(cat.id)}
                className={`px-2 py-0.5 rounded-lg shrink-0 font-medium transition ${
                  poiCategory === cat.id
                    ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/40 font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. DYNAMIC REALISTIC MAP CANVAS CONTAINER */}
      <div className={`relative w-full h-[320px] rounded-3xl overflow-hidden border shadow-inner select-none ${
        isDark ? 'bg-[#0d0918] border-purple-900/40' : 'bg-[#f4effc] border-purple-200'
      }`}>
        {/* Dynamic Map Grid Pattern */}
        <div className={`absolute inset-0 opacity-20 pointer-events-none ${
          isDark
            ? 'bg-[radial-gradient(#9333ea_1px,transparent_1px)] [background-size:16px_16px]'
            : 'bg-[radial-gradient(#6b21a8_1px,transparent_1px)] [background-size:16px_16px]'
        }`} />

        {/* Simulated Map Arterials & Topography */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
          <path
            d="M 30,0 Q 60,110 35,210 T 50,320"
            fill="none"
            stroke="#7c3aed"
            strokeWidth="6"
          />
          <path
            d="M 75,0 L 85,130 L 70,240 L 80,320"
            fill="none"
            stroke="#9333ea"
            strokeWidth="3.5"
            strokeDasharray="6,3"
          />
          <path
            d="M 130,0 L 145,150 L 125,270 L 135,320"
            fill="none"
            stroke="#a855f7"
            strokeWidth="2.5"
          />
        </svg>

        {/* Dynamic Center Tag */}
        <div className="absolute top-2.5 left-3 z-10 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-xl border border-purple-900/60 text-[10px] text-purple-200 flex items-center gap-1.5 shadow-md">
          <Navigation className="w-3 h-3 text-purple-400" />
          <span>{cityCoordinates[activeCity]?.zoomLabel || activeCity}</span>
        </div>

        {/* GPS Current User Marker */}
        <div className="absolute top-[50%] left-[45%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
          <div className="relative flex items-center justify-center">
            <span className="w-9 h-9 rounded-full bg-purple-600/30 animate-ping absolute" />
            <span className="w-5 h-5 rounded-full bg-purple-600 border-2 border-white shadow-xl flex items-center justify-center text-white text-[9px] font-bold">
              •
            </span>
          </div>
          <span className="bg-stone-900/95 border border-purple-600 text-purple-200 text-[9px] px-1.5 py-0.2 rounded shadow-md mt-1 whitespace-nowrap font-bold">
            You are here
          </span>
        </div>

        {/* SAFETY HEATMAP ZONES OVERLAYS */}
        {showSafetyHeatmap && (
          <>
            {/* Cinnamon Gardens / Primary Safe Zone */}
            <div
              onClick={() => {
                const z = safetyZones[0] || {
                  zoneId: 'cinnamon',
                  zoneName: `${activeCity} Safe Diplomatic Sector`,
                  safetyScore: 94,
                  level: 'safe',
                  streetLightingIndex: 9.6,
                  crimeRiskIndex: 1.2,
                  activeSoloTravelers: 42,
                  userReportsCount: 168,
                  recommendedCurfew: 'Safe after 23:00 with standard awareness',
                  notes: 'High police presence, well-lit embassies and artisan cafes.',
                };
                setSelectedZone(z as any);
                setSelectedPOI(null);
                setSelectedDriver(null);
              }}
              className="absolute top-[28%] left-[42%] w-36 h-28 rounded-2xl border-2 border-dashed border-emerald-500 bg-emerald-500/15 p-1.5 cursor-pointer hover:scale-105 transition flex flex-col justify-between z-10"
            >
              <div className="flex items-center justify-between text-[10px] font-bold text-emerald-400">
                <span>{activeCity} Core</span>
                <span className="bg-emerald-950/80 px-1 rounded text-[9px] font-mono">94/100</span>
              </div>
              <div className="text-[9px] text-emerald-300 flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Verified Safe Zone</span>
              </div>
            </div>

            {/* Caution Zone (e.g. Railway Terminal / unlit area) */}
            <div
              onClick={() => {
                const z = safetyZones[2] || {
                  zoneId: 'caution-zone',
                  zoneName: `${activeCity} Transit Hub Alleys`,
                  safetyScore: 62,
                  level: 'caution',
                  streetLightingIndex: 6.2,
                  crimeRiskIndex: 5.5,
                  activeSoloTravelers: 8,
                  userReportsCount: 290,
                  recommendedCurfew: 'Avoid unlit cross-streets post 19:30',
                  notes: 'Crowded daytime hub, low evening lighting.',
                };
                setSelectedZone(z as any);
                setSelectedPOI(null);
                setSelectedDriver(null);
              }}
              className="absolute top-[8%] left-[60%] w-32 h-20 rounded-2xl border-2 border-dashed border-amber-500 bg-amber-500/15 p-1.5 cursor-pointer hover:scale-105 transition flex flex-col justify-between z-10"
            >
              <div className="flex items-center justify-between text-[10px] font-bold text-amber-400">
                <span>Transit Terminus</span>
                <span className="bg-amber-950/80 px-1 rounded text-[9px] font-mono">62/100</span>
              </div>
              <div className="text-[9px] text-amber-300 flex items-center gap-1 font-semibold">
                <ShieldAlert className="w-3 h-3 text-amber-400" />
                <span>Caution Area</span>
              </div>
            </div>
          </>
        )}

        {/* POI MAP PINS (Police, Hospitals, Safe Cafes) */}
        {showPOIs &&
          pois.map((poi, idx) => {
            const offsets = [
              { top: '38%', left: '72%' },
              { top: '68%', left: '32%' },
              { top: '24%', left: '26%' },
              { top: '56%', left: '62%' },
              { top: '75%', left: '55%' },
            ];
            const pos = offsets[idx % offsets.length];
            const badge = getPoiBadge(poi.category);

            return (
              <button
                key={poi.poiId}
                onClick={() => {
                  setSelectedPOI(poi);
                  setSelectedZone(null);
                  setSelectedDriver(null);
                }}
                style={{ top: pos.top, left: pos.left }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group hover:scale-125 transition"
                title={poi.name}
              >
                <div className={`p-1.5 rounded-full shadow-lg border-2 border-white text-white flex items-center justify-center ${badge.color}`}>
                  <span className="text-[11px] leading-none">{badge.icon}</span>
                </div>
                <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-stone-900 border border-purple-800 text-stone-200 text-[10px] px-2 py-0.5 rounded-md shadow-xl whitespace-nowrap z-30">
                  {poi.name}
                </div>
              </button>
            );
          })}

        {/* HELAGO FEMALE DRIVER PINS */}
        {showDrivers &&
          helagoDrivers.map((driver, idx) => {
            const driverPositions = [
              { top: '46%', left: '28%' },
              { top: '34%', left: '52%' },
              { top: '65%', left: '76%' },
            ];
            const pos = driverPositions[idx % driverPositions.length];

            return (
              <button
                key={driver.driverId}
                onClick={() => {
                  setSelectedDriver(driver);
                  setSelectedZone(null);
                  setSelectedPOI(null);
                }}
                style={{ top: pos.top, left: pos.left }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group hover:scale-125 transition"
              >
                <div className="p-1.5 rounded-full bg-gradient-to-tr from-purple-700 to-fuchsia-600 border-2 border-white shadow-xl text-white flex items-center justify-center">
                  <Car className="w-3.5 h-3.5" />
                </div>
                <div className="bg-purple-950/90 border border-purple-400 text-purple-200 text-[9px] font-bold px-1.5 py-0.5 rounded shadow mt-0.5 whitespace-nowrap">
                  {driver.name.split(' ')[0]} ({driver.etaMinutes}m)
                </div>
              </button>
            );
          })}

        {/* Recenter Crosshair */}
        <button
          onClick={() => {
            setSelectedZone(null);
            setSelectedPOI(null);
            setSelectedDriver(null);
          }}
          className={`absolute bottom-3 right-3 z-30 p-2 rounded-2xl border shadow-lg active:scale-95 transition ${
            isDark ? 'bg-stone-900/90 border-purple-900 text-purple-300' : 'bg-white border-purple-200 text-purple-700'
          }`}
          title="Recenter Map View"
        >
          <Crosshair className="w-4 h-4" />
        </button>
      </div>

      {/* 3. INTERACTIVE POI / ZONE DETAILS BOTTOM DRAWER */}

      {/* A. Selected Safe Cafe or Place Card */}
      {selectedPOI && (
        <div className={`p-4 rounded-3xl border space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-150 ${
          isDark ? 'bg-[#150f24] border-purple-900/50' : 'bg-white border-purple-100 shadow-lg'
        }`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              {selectedPOI.image && (
                <img
                  src={selectedPOI.image}
                  alt={selectedPOI.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-purple-500/30"
                />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-bold">{selectedPOI.name}</h3>
                  {selectedPOI.isVerifiedLocalBusiness && (
                    <span className="bg-purple-500/20 text-purple-700 dark:text-purple-300 text-[10px] px-1.5 py-0.2 rounded-full font-bold border border-purple-500/30">
                      ✓ Verified Local Business
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">{selectedPOI.address}</p>
                <div className="flex items-center gap-2 mt-1 text-[11px]">
                  <span className="text-amber-500 font-bold flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-500" /> {selectedPOI.rating}
                  </span>
                  <span className="text-stone-400 font-mono">({selectedPOI.reviewsCount} verified reviews)</span>
                  {selectedPOI.open24Hours ? (
                    <span className="text-emerald-500 font-bold">· 24/7 Open</span>
                  ) : (
                    <span className="text-stone-400">· {selectedPOI.operatingHours}</span>
                  )}
                </div>
              </div>
            </div>

            <button onClick={() => setSelectedPOI(null)} className="p-1 text-stone-400 hover:text-stone-200">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Safety Verifications */}
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              Safety Amenities & Audits:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {selectedPOI.safetyFeatures.map((feat, i) => (
                <span
                  key={i}
                  className={`text-[10px] px-2 py-0.5 rounded-lg border font-medium ${
                    isDark ? 'bg-stone-900 border-purple-900/40 text-stone-300' : 'bg-purple-50 border-purple-200 text-purple-900'
                  }`}
                >
                  ✓ {feat}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            {selectedPOI.phone && (
              <a
                href={`tel:${selectedPOI.phone}`}
                className="px-3 py-2 rounded-xl border border-purple-600/40 text-purple-600 dark:text-purple-300 text-xs font-bold flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Venue</span>
              </a>
            )}
            <a
              href={`https://maps.google.com/?q=${selectedPOI.coordinates.lat},${selectedPOI.coordinates.lng}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Get Walking Route</span>
            </a>
          </div>
        </div>
      )}

      {/* B. Selected Safety Zone Card */}
      {selectedZone && (
        <div className={`p-4 rounded-3xl border space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-150 ${
          isDark ? 'bg-[#150f24] border-purple-900/50' : 'bg-white border-purple-100 shadow-lg'
        }`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${selectedZone.level === 'safe' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <h3 className="text-sm font-bold">{selectedZone.zoneName}</h3>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{selectedZone.notes}</p>
            </div>
            <div className="text-right">
              <span className={`text-base font-black font-mono ${selectedZone.level === 'safe' ? 'text-emerald-500' : 'text-amber-500'}`}>
                {selectedZone.safetyScore}/100
              </span>
              <div className="text-[9px] text-stone-400 uppercase font-bold">Safety Index</div>
            </div>
          </div>

          <div className={`grid grid-cols-3 gap-2 p-2.5 rounded-2xl border text-center text-xs ${
            isDark ? 'bg-stone-950/70 border-purple-900/30' : 'bg-purple-50/60 border-purple-100'
          }`}>
            <div>
              <div className="font-bold">{selectedZone.streetLightingIndex}/10</div>
              <div className="text-[10px] text-stone-400">Street Lighting</div>
            </div>
            <div>
              <div className="font-bold">{selectedZone.activeSoloTravelers}</div>
              <div className="text-[10px] text-stone-400">Solo Travelers</div>
            </div>
            <div>
              <div className="font-bold">{selectedZone.userReportsCount}</div>
              <div className="text-[10px] text-stone-400">Verified Reports</div>
            </div>
          </div>

          <button
            onClick={() => onOpenAssistantWithLocation(selectedZone.zoneName)}
            className="w-full py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-700 dark:text-purple-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <span>Ask Serena AI About Night Curfew in this Area →</span>
          </button>
        </div>
      )}

      {/* C. Selected HelaGo Driver Card */}
      {selectedDriver && (
        <div className={`p-4 rounded-3xl border space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-150 ${
          isDark ? 'bg-[#150f24] border-purple-600/50' : 'bg-white border-purple-300 shadow-xl'
        }`}>
          <div className="flex items-center gap-3">
            <img
              src={selectedDriver.driverImage}
              alt={selectedDriver.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-purple-600"
            />
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold">{selectedDriver.name}</h3>
                <span className="bg-purple-500/20 text-purple-700 dark:text-purple-300 text-[10px] px-1.5 py-0.2 rounded font-bold border border-purple-500/30">
                  Pink Shield ★
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {selectedDriver.vehicleModel} · <span className="font-mono">{selectedDriver.licensePlate}</span>
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-purple-600 dark:text-purple-400">{selectedDriver.etaMinutes}m away</div>
              <div className="text-[10px] text-stone-400">{selectedDriver.totalRides} trips</div>
            </div>
          </div>

          <div className={`flex items-center justify-between p-2.5 rounded-2xl border text-xs ${
            isDark ? 'bg-stone-950 border-stone-800' : 'bg-purple-50 border-purple-100'
          }`}>
            <div>
              <div className="text-[10px] text-stone-400">Estimated Metered Fare</div>
              <div className="font-bold font-mono">LKR {selectedDriver.fareEstimate.toLocaleString()}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-stone-400">12% Platform Fee</div>
              <div className="text-purple-600 dark:text-purple-400 font-mono text-[11px] font-bold">
                LKR {Math.round(selectedDriver.fareEstimate * 0.12)}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onBookDriver(selectedDriver)}
              className="flex-1 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5"
            >
              <Car className="w-4 h-4" />
              <span>Confirm HelaGo Driver Booking</span>
            </button>
            <button
              onClick={() => setSelectedDriver(null)}
              className="px-3 py-2 rounded-xl border border-stone-700 text-xs text-stone-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
