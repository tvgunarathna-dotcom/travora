import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  Star,
  MapPin,
  CheckCircle,
  Search,
  ArrowLeft,
  ChevronRight,
  Wifi,
  Wind,
  Waves,
  CreditCard,
  Phone,
  Lock,
  Compass,
  Navigation,
  Footprints,
  Car,
  X,
  Radio,
} from 'lucide-react';
import { SafeStay } from '../../types';
import { mockSafeStays } from '../../data/mockData';
import { HotelRouteMapModal } from './HotelRouteMapModal';

interface StaysScreenProps {
  onBookStay: (stay: SafeStay) => void;
  theme: 'dark' | 'light';
}

export const StaysScreen: React.FC<StaysScreenProps> = ({
  onBookStay,
  theme,
}) => {
  const isDark = theme === 'dark';

  // Navigation within Stays:
  // 'list' -> Hotel directory
  // 'details' -> Full Hotel Details Page
  const [subView, setSubView] = useState<'list' | 'details'>('list');
  const [selectedStay, setSelectedStay] = useState<SafeStay | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCityTab, setSelectedCityTab] = useState<'all' | 'kandy' | 'ella' | 'seaside'>('all');

  // Interactive Live Map & Directions Modal State
  const [showMapModal, setShowMapModal] = useState(false);
  const [showDirections, setShowDirections] = useState(false);
  const [travelMode, setTravelMode] = useState<'walking' | 'drive'>('walking');

  const filteredStays = mockSafeStays.filter((stay) => {
    if (selectedCityTab === 'kandy' && stay.city.toLowerCase() !== 'kandy') return false;
    if (selectedCityTab === 'ella' && stay.city.toLowerCase() !== 'ella') return false;
    if (selectedCityTab === 'seaside' && stay.city.toLowerCase() !== 'mirissa' && stay.city.toLowerCase() !== 'galle') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        stay.name.toLowerCase().includes(q) ||
        stay.city.toLowerCase().includes(q) ||
        stay.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-4 p-3 sm:p-4 pb-20 select-none">
      {/* ========================================================
          SUB-VIEW 1: STAYS DIRECTORY LIST
         ======================================================== */}
      {subView === 'list' && (
        <div className="flex flex-col gap-3.5">
          {/* Page Title */}
          <div className="flex items-center justify-between py-1">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-700/60 border border-purple-500/40 flex items-center justify-center text-purple-200">
                  <Building2 className="w-4 h-4" />
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-purple-700 dark:text-purple-300">
                  Stays
                </h1>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
                Pink Shield audited accommodation, boutique villas & female co-living
              </p>
            </div>
            <span className="text-[10px] bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-600/50 px-2.5 py-1 rounded-lg font-extrabold uppercase tracking-wider shrink-0 shadow-xs">
              PINK SHIELD AUDITED
            </span>
          </div>

          {/* Search Bar */}
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-2xl border transition-all ${
              isDark
                ? 'bg-[#150a28] border-purple-800/50 text-white'
                : 'bg-white border-purple-200 text-stone-900 shadow-xs'
            }`}
          >
            <Search className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stays (hotel name, city, location)..."
              className="bg-transparent text-xs sm:text-sm outline-none w-full font-medium placeholder-stone-400 dark:placeholder-stone-500"
            />
            <button className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-xs transition">
              Explore
            </button>
          </div>

          {/* Destination Filter Tabs (All, Kandy, Ella, Seaside) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-semibold">
            {[
              { id: 'all', label: 'All Stays' },
              { id: 'kandy', label: 'Kandy (4)' },
              { id: 'ella', label: 'Ella' },
              { id: 'seaside', label: 'Seaside (Mirissa / Galle)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCityTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl border shrink-0 transition font-bold ${
                  selectedCityTab === tab.id
                    ? 'bg-purple-700 text-white border-purple-500 shadow-xs'
                    : isDark
                    ? 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800'
                    : 'bg-white border-purple-200 text-stone-700 hover:bg-purple-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Hotel Cards List */}
          <div className="flex flex-col gap-3">
            {filteredStays.map((stay) => (
              <div
                key={stay.stayId}
                onClick={() => {
                  setSelectedStay(stay);
                  setShowMapModal(false);
                  setShowDirections(false);
                  setSubView('details');
                }}
                className={`rounded-2xl border p-3 flex gap-3 cursor-pointer shadow-sm transition transform active:scale-98 group ${
                  isDark
                    ? 'bg-[#150a28] border-purple-800/40 hover:border-purple-600 text-white'
                    : 'bg-white border-purple-200 hover:border-purple-300 text-stone-900 shadow-xs'
                }`}
              >
                {/* Hotel Thumbnail */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-stone-900 border border-purple-900/30">
                  <img
                    src={stay.images[0]}
                    alt={stay.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Hotel Information */}
                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="font-extrabold text-xs sm:text-sm text-stone-900 dark:text-white truncate">
                        {stay.name}
                      </h3>
                      {stay.isPinkShieldVerified && (
                        <div className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold shrink-0">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>PinkShield</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="flex items-center text-amber-500 text-xs font-bold">
                        <Star className="w-3 h-3 fill-amber-500" />
                        <span className="ml-0.5">{stay.rating}</span>
                      </div>
                      <span className="text-[10px] text-stone-500 dark:text-stone-400">
                        ({stay.reviewsCount} reviews)
                      </span>
                      <span className="text-[10px] text-stone-400 dark:text-stone-500">•</span>
                      <span className="text-[10px] text-purple-700 dark:text-purple-300 font-semibold truncate">
                        {stay.city}
                      </span>
                    </div>

                    <p className="text-[10px] text-stone-600 dark:text-stone-400 truncate mt-0.5 flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5 text-stone-400 shrink-0" />
                      <span>{stay.location}</span>
                    </p>
                  </div>

                  {/* Pricing Breakdown with Koko/Mintpay installment & Quick Map Button */}
                  <div className="flex items-end justify-between border-t border-purple-900/20 pt-1.5 mt-1.5 gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800/60 px-1.5 py-0.5 rounded font-bold block w-fit">
                        Koko/Mintpay: 3x LKR {stay.kokoMonthlyLKR.toLocaleString()}/mo
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStay(stay);
                          setShowMapModal(true);
                        }}
                        className="text-[10px] text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-white font-extrabold flex items-center gap-1 w-fit transition"
                      >
                        <Navigation className="w-3 h-3 text-emerald-500" />
                        <span>View Route Map</span>
                      </button>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs sm:text-sm font-black text-purple-800 dark:text-purple-300">
                        LKR {stay.pricePerNightLKR.toLocaleString()}
                      </span>
                      <span className="text-[9px] text-stone-500 dark:text-stone-400 block">
                        /night (~${stay.priceUSD})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-VIEW 2: FULL HOTEL DETAILS PAGE
         ======================================================== */}
      {subView === 'details' && selectedStay && (
        <div className="flex flex-col gap-4 animate-fadeIn">
          {/* Details Header Bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setShowMapModal(false);
                setSubView('list');
              }}
              className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-200 transition flex items-center gap-1 font-bold text-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Stays</span>
            </button>

            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-stone-500 dark:text-purple-300">
                {selectedStay.type}
              </span>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="rounded-3xl overflow-hidden border border-purple-800/40 shadow-xl bg-stone-900">
            <div className="h-56 sm:h-72 w-full overflow-hidden relative">
              <img
                src={selectedStay.images[0]}
                alt={selectedStay.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

              <div className="absolute bottom-3 left-3 right-3 text-white flex items-end justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Pink Shield Verified</span>
                    </span>
                    <span className="text-[10px] bg-purple-700 text-white font-bold px-2 py-0.5 rounded shadow-xs">
                      {selectedStay.city}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-2xl font-black drop-shadow-md">
                    {selectedStay.name}
                  </h2>
                  <p className="text-xs text-purple-200 drop-shadow-sm flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    <span>{selectedStay.location}</span>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-lg sm:text-xl font-black text-amber-300 drop-shadow-md">
                    LKR {selectedStay.pricePerNightLKR.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-purple-200 block drop-shadow-sm">
                    /night (~${selectedStay.priceUSD})
                  </span>
                </div>
              </div>
            </div>

            {/* Thumbnail Gallery Strip */}
            <div className="flex gap-2 p-2 bg-[#120824] border-t border-purple-900/40 overflow-x-auto">
              {selectedStay.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt=""
                  className="w-16 h-12 rounded-lg object-cover border border-purple-700/50 hover:opacity-100 opacity-80 cursor-pointer transition shrink-0"
                />
              ))}
            </div>
          </div>

          {/* ========================================================
              HOTEL ADDRESS & VIEW ON MAP ACTION CARD (User Request)
             ======================================================== */}
          <div
            className={`p-4 rounded-2xl border shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all ${
              isDark
                ? 'bg-gradient-to-r from-[#180d33] to-[#140828] border-purple-700/50 text-white'
                : 'bg-gradient-to-r from-purple-50 via-white to-purple-50 border-purple-200 text-stone-900'
            }`}
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-300" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-extrabold text-purple-700 dark:text-purple-300 tracking-wider block">
                  Official Hotel Address
                </span>
                <p className="text-xs sm:text-sm font-extrabold text-stone-900 dark:text-white mt-0.5 leading-snug">
                  {selectedStay.location}
                </p>
                <p className="text-[11px] text-stone-600 dark:text-purple-200/80 mt-0.5 flex items-center gap-1.5 flex-wrap">
                  <span>{selectedStay.city}, Sri Lanka</span>
                  <span>•</span>
                  <span className="font-mono text-[10px] bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 px-1.5 py-0.2 rounded font-bold">
                    GPS: {selectedStay.coordinates.lat.toFixed(4)}° N, {selectedStay.coordinates.lng.toFixed(4)}° E
                  </span>
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setShowMapModal(true);
                setShowDirections(false);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-purple-900/30 active:scale-95 transition shrink-0"
            >
              <Compass className="w-4 h-4 text-purple-200" />
              <span>View on Map</span>
            </button>
          </div>

          {/* Safety Indexes Breakdown Card */}
          <div
            className={`p-4 rounded-2xl border shadow-sm ${
              isDark
                ? 'bg-[#150a28] border-purple-800/40 text-white'
                : 'bg-white border-purple-200 text-stone-900'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <h3 className="font-extrabold text-sm sm:text-base text-stone-900 dark:text-white">
                Pink Shield Safety Indexes
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40">
                <span className="text-[10px] text-stone-600 dark:text-purple-300 block">
                  Security Staff
                </span>
                <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                  {selectedStay.safetyIndexes.securityStaff}/10
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40">
                <span className="text-[10px] text-stone-600 dark:text-purple-300 block">
                  Street Lighting
                </span>
                <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                  {selectedStay.safetyIndexes.streetLighting}/10
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40">
                <span className="text-[10px] text-stone-600 dark:text-purple-300 block">
                  Smart Keycards
                </span>
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Equipped
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40">
                <span className="text-[10px] text-stone-600 dark:text-purple-300 block">
                  CCTV Monitoring
                </span>
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
                  <CheckCircle className="w-3.5 h-3.5" /> 24/7 Monitored
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40">
                <span className="text-[10px] text-stone-600 dark:text-purple-300 block">
                  Female-Only Floor
                </span>
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Available
                </span>
              </div>
            </div>
          </div>

          {/* Safety Features List */}
          <div
            className={`p-4 rounded-2xl border shadow-sm ${
              isDark
                ? 'bg-[#150a28] border-purple-800/40 text-white'
                : 'bg-white border-purple-200 text-stone-900'
            }`}
          >
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-purple-700 dark:text-purple-400 mb-2">
              Verified Safety Standards
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {selectedStay.safetyAmenities.map((amenity, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="text-stone-700 dark:text-stone-300">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* General Amenities */}
          <div
            className={`p-4 rounded-2xl border shadow-sm ${
              isDark
                ? 'bg-[#150a28] border-purple-800/40 text-white'
                : 'bg-white border-purple-200 text-stone-900'
            }`}
          >
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-purple-700 dark:text-purple-400 mb-2">
              Hotel Amenities
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedStay.generalAmenities.map((am, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 text-xs font-medium"
                >
                  {am}
                </span>
              ))}
            </div>
          </div>

          {/* Traveler Reviews */}
          <div
            className={`p-4 rounded-2xl border shadow-sm ${
              isDark
                ? 'bg-[#150a28] border-purple-800/40 text-white'
                : 'bg-white border-purple-200 text-stone-900'
            }`}
          >
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-purple-700 dark:text-purple-400 mb-3">
              Solo Female Traveler Reviews
            </h4>
            <div className="flex flex-col gap-3">
              {selectedStay.reviews.map((rev, i) => (
                <div key={i} className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200/50 dark:border-purple-800/30">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <img
                        src={rev.avatar}
                        alt={rev.author}
                        className="w-7 h-7 rounded-full object-cover border border-purple-400"
                      />
                      <span className="text-xs font-bold text-stone-900 dark:text-white">
                        {rev.author}
                      </span>
                    </div>
                    <div className="flex items-center text-amber-500 text-xs font-bold">
                      <Star className="w-3 h-3 fill-amber-500" />
                      <span className="ml-1">{rev.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 italic">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* BNPL Installment Banner */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-900/80 to-indigo-950 border border-purple-700/50 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-purple-300" />
              <span className="text-xs">
                Pay in 3 installments of <strong>LKR {selectedStay.kokoMonthlyLKR.toLocaleString()}</strong> with Koko or Mintpay
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded bg-purple-800 text-[10px] font-bold text-purple-200">
                Koko
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-900 text-[10px] font-bold text-emerald-300">
                Mintpay
              </span>
            </div>
          </div>

          {/* Book Now Button */}
          <button
            onClick={() => onBookStay(selectedStay)}
            className="w-full bg-gradient-to-r from-purple-700 to-fuchsia-600 hover:from-purple-800 hover:to-fuchsia-700 text-white font-black py-3 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 active:scale-98 transition"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Book Stay (12% Platform Fee Included)</span>
          </button>
        </div>
      )}

      {/* ========================================================
          HOTEL MAP & LIVE DIRECTIONS MODAL (Different for each hotel)
         ======================================================== */}
      {selectedStay && (
        <HotelRouteMapModal
          stay={selectedStay}
          isOpen={showMapModal}
          onClose={() => setShowMapModal(false)}
          theme={theme}
        />
      )}
    </div>
  );
};
