import React, { useState } from 'react';
import {
  Building2,
  Car,
  ShieldCheck,
  Star,
  MapPin,
  CheckCircle,
  Search,
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  Lock,
  Sparkles,
  Wifi,
  Wind,
  Waves,
  CreditCard,
  Phone,
} from 'lucide-react';
import { SafeStay, HelaGoDriver } from '../../types';
import { mockSafeStays, helagoDrivers } from '../../data/mockData';

interface StaysScreenProps {
  onBookStay: (stay: SafeStay) => void;
  theme: 'dark' | 'light';
}

export const StaysScreen: React.FC<StaysScreenProps> = ({
  onBookStay,
  theme,
}) => {
  const isDark = theme === 'dark';

  // Navigation within Rides & Stays:
  // 'menu' -> Screenshot 3 (Verified Stays vs Find a Ride)
  // 'stays_list' -> Screenshot 4 (Hotel directory)
  // 'hotel_details' -> Full Hotel Details Page
  const [subView, setSubView] = useState<'menu' | 'stays_list' | 'hotel_details'>('menu');
  const [selectedStay, setSelectedStay] = useState<SafeStay | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCityTab, setSelectedCityTab] = useState<'all' | 'kandy' | 'ella' | 'seaside'>('all');

  // HelaGo prompt modal state
  const [showHelagoPrompt, setShowHelagoPrompt] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<HelaGoDriver>(helagoDrivers[0]);
  const [helagoLaunched, setHelagoLaunched] = useState(false);

  const filteredStays = mockSafeStays.filter((stay) => {
    if (selectedCityTab === 'kandy' && stay.city.toLowerCase() !== 'kandy') return false;
    if (selectedCityTab === 'ella' && stay.city.toLowerCase() !== 'ella') return false;
    if (selectedCityTab === 'seaside' && stay.city.toLowerCase() !== 'mirissa' && stay.city.toLowerCase() !== 'galle') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return stay.name.toLowerCase().includes(q) || stay.city.toLowerCase().includes(q) || stay.location.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-4 p-3 sm:p-4 pb-20 select-none">
      {/* ========================================================
          SUB-VIEW 1: MENU SELECTION (MATCHING SCREENSHOT 3)
         ======================================================== */}
      {subView === 'menu' && (
        <div className="flex flex-col gap-4">
          <div className="py-1">
            <h1 className="text-xl sm:text-2xl font-black text-purple-700 dark:text-purple-300">
              Rides & Stays
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Verified safe accommodation and female-driven transport integrations
            </p>
          </div>

          {/* CARD 1: Verified Stays & Female Co-Living (Screenshot 3) */}
          <div
            onClick={() => setSubView('stays_list')}
            className={`rounded-2xl border p-4 shadow-md cursor-pointer transition transform active:scale-98 group ${
              isDark
                ? 'bg-[#150a28] border-purple-800/40 hover:border-purple-600 text-white'
                : 'bg-[#180d33] border-purple-900 text-white shadow-purple-950/20'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-700/60 border border-purple-500/40 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-purple-200" />
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  Verified Stays & Female Co-Living
                </h3>
              </div>
              <span className="text-[9px] bg-purple-800/60 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                PINK SHIELD AUDITED
              </span>
            </div>
            <p className="text-xs text-purple-200/80 pl-10">
              safety-audited hostels, boutique villas & dorms
            </p>
          </div>

          {/* CARD 2: Find a ride (HelaGo App Integration) (Screenshot 3) */}
          <div
            onClick={() => setShowHelagoPrompt(true)}
            className={`rounded-2xl border p-4 shadow-md cursor-pointer transition transform active:scale-98 group ${
              isDark
                ? 'bg-[#150a28] border-purple-800/40 hover:border-purple-600 text-white'
                : 'bg-[#180d33] border-purple-900 text-white shadow-purple-950/20'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-700/60 border border-purple-500/40 flex items-center justify-center">
                  <Car className="w-4 h-4 text-purple-200" />
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  Find a ride
                </h3>
              </div>
              {/* Green HelaGo 'go' Logo */}
              <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center font-black text-white text-xs shadow-sm">
                go
              </div>
            </div>
            <p className="text-xs text-purple-200/80 pl-10">
              Book a ride through the HelaGo app
            </p>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-VIEW 2: STAYS LIST (MATCHING SCREENSHOT 4)
         ======================================================== */}
      {subView === 'stays_list' && (
        <div className="flex flex-col gap-3">
          {/* Header with Back Button */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setSubView('menu')}
              className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-200 transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <div>
                <h2 className="text-sm sm:text-base font-black text-purple-700 dark:text-purple-300">
                  Verified Stays & Female Co-Living
                </h2>
              </div>
            </div>
          </div>

          {/* Search bar matching Screenshot 4 */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-2xl border transition-all ${
            isDark ? 'bg-[#150a28] border-purple-800/50 text-white' : 'bg-white border-purple-200 text-stone-900 shadow-xs'
          }`}>
            <Search className="w-4 h-4 text-purple-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search here (hotel name, city)..."
              className="bg-transparent text-xs sm:text-sm outline-none w-full"
            />
            <button className="bg-purple-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl">
              Explore
            </button>
          </div>

          {/* Destination Tabs (Kandy, Ella, Seaside) */}
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
                className={`px-3 py-1.5 rounded-xl border shrink-0 transition ${
                  selectedCityTab === tab.id
                    ? 'bg-purple-700 text-white border-purple-500 font-bold'
                    : isDark
                    ? 'bg-stone-900 border-stone-800 text-stone-300'
                    : 'bg-white border-stone-200 text-stone-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Hotels List matching Screenshot 4 */}
          <div className="flex flex-col gap-3">
            {filteredStays.map((stay) => (
              <div
                key={stay.stayId}
                onClick={() => {
                  setSelectedStay(stay);
                  setSubView('hotel_details');
                }}
                className={`rounded-2xl border p-3 flex gap-3 cursor-pointer shadow-sm transition transform active:scale-98 group ${
                  isDark
                    ? 'bg-[#150a28] border-purple-800/40 hover:border-purple-600 text-white'
                    : 'bg-white border-purple-100 hover:border-purple-300 text-stone-900 shadow-xs'
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

                {/* Hotel Meta */}
                <div className="flex flex-col justify-between flex-1">
                  <div>
                    {/* Title & Price */}
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-extrabold text-xs sm:text-sm text-stone-900 dark:text-white leading-tight">
                        {stay.name}
                      </h4>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-purple-700 dark:text-purple-300">
                          LKR {stay.pricePerNightLKR.toLocaleString()}
                        </span>
                        <span className="text-[9px] text-stone-400 block -mt-0.5">/ night</span>
                      </div>
                    </div>

                    {/* Stars and Rating */}
                    <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-stone-500 dark:text-stone-400">
                      <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                        <span>{stay.rating}</span>
                        {[...Array(stay.stars || 3)].map((_, i) => (
                          <Star key={i} className="w-2.5 h-2.5 fill-amber-500" />
                        ))}
                      </div>
                      <span>({stay.reviewsCount})</span>
                      <span>· {stay.stars}-star hotel</span>
                    </div>

                    <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-1 line-clamp-1">
                      {stay.location}
                    </p>
                  </div>

                  {/* Amenities / Badges */}
                  <div className="mt-2">
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-stone-600 dark:text-stone-300">
                      {stay.generalAmenities?.slice(0, 3).map((am, i) => (
                        <span key={i} className="flex items-center gap-0.5">
                          • {am}
                        </span>
                      ))}
                    </div>

                    {stay.dealTag && (
                      <div className="mt-1.5">
                        <span className="bg-emerald-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider mr-1.5">
                          GREAT DEAL
                        </span>
                        <span className="text-[10px] text-emerald-500 font-semibold">
                          27% less than usual
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-VIEW 3: FULL HOTEL DETAILS & SAFETY INDEXES
         ======================================================== */}
      {subView === 'hotel_details' && selectedStay && (
        <div className="flex flex-col gap-4">
          {/* Back button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSubView('stays_list')}
              className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-200 transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-stone-500">Back to Stays Directory</span>
          </div>

          {/* Photo Gallery */}
          <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden border border-purple-900/30">
            <img
              src={selectedStay.images[0]}
              alt={selectedStay.name}
              className="w-full h-44 object-cover"
            />
            <div className="grid grid-rows-2 gap-2 h-44">
              <img
                src={selectedStay.images[1] || selectedStay.images[0]}
                alt="Room Preview"
                className="w-full h-full object-cover"
              />
              <div className="relative w-full h-full bg-stone-900 overflow-hidden">
                <img
                  src={selectedStay.images[2] || selectedStay.images[0]}
                  alt="Lounge"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold">
                  View All Photos
                </div>
              </div>
            </div>
          </div>

          {/* Hotel Title & Price */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-purple-600 tracking-wider">
                {selectedStay.type} · {selectedStay.city}
              </span>
              <h2 className="text-lg sm:text-xl font-black text-stone-900 dark:text-white">
                {selectedStay.name}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-purple-500" /> {selectedStay.location}
              </p>
            </div>

            <div className="text-right">
              <span className="text-base font-black text-purple-700 dark:text-purple-300">
                LKR {selectedStay.pricePerNightLKR.toLocaleString()}
              </span>
              <span className="text-[10px] text-stone-400 block">/ night (~${selectedStay.priceUSD})</span>
            </div>
          </div>

          {/* PINK SHIELD SAFETY INDEXES BREAKDOWN */}
          <div className={`p-4 rounded-2xl border space-y-3 ${
            isDark ? 'bg-purple-950/40 border-purple-800/50' : 'bg-purple-50/80 border-purple-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h4 className="font-extrabold text-xs sm:text-sm text-stone-900 dark:text-white">
                  Pink Shield Safety Index Audit
                </h4>
              </div>
              <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                100% PASSED
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-black/20 flex items-center justify-between">
                <span className="text-stone-600 dark:text-stone-300">24/7 Security Staff</span>
                <span className="font-bold text-purple-600 dark:text-purple-300">
                  {selectedStay.safetyIndexes?.securityStaff || '9.4'}/10
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/20 flex items-center justify-between">
                <span className="text-stone-600 dark:text-stone-300">Female Only Floors</span>
                <span className="font-bold text-emerald-500">Available ✓</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/20 flex items-center justify-between">
                <span className="text-stone-600 dark:text-stone-300">Smart RFID Keycards</span>
                <span className="font-bold text-emerald-500">Active ✓</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/20 flex items-center justify-between">
                <span className="text-stone-600 dark:text-stone-300">CCTV Coverage</span>
                <span className="font-bold text-emerald-500">24/7 Monitored</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {selectedStay.safetyAmenities.map((am, i) => (
                <span
                  key={i}
                  className="text-[10px] bg-purple-900/30 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-md font-medium"
                >
                  ✓ {am}
                </span>
              ))}
            </div>
          </div>

          {/* BNPL Local Payment Installment Calculator */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-purple-800/40 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-white block">Local BNPL Available</span>
              <span className="text-[10px] text-purple-300">
                Pay in 3 installments of <strong>LKR {selectedStay.kokoMonthlyLKR.toLocaleString()}</strong> with Koko or Mintpay
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded bg-purple-900 text-[10px] font-bold text-purple-200">
                Koko
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-[10px] font-bold text-emerald-300">
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
          HELAGO APPLICATION PROMPT MODAL (User Request)
         ======================================================== */}
      {showHelagoPrompt && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#150a28] border border-purple-500/50 rounded-3xl p-5 max-w-sm w-full text-white shadow-2xl animate-fadeIn">
            {/* Modal Header with HelaGo branding */}
            <div className="flex items-center justify-between border-b border-purple-900/40 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center font-black text-white text-xs shadow-md">
                  go
                </div>
                <div>
                  <h3 className="font-black text-sm text-white">
                    HelaGo Ride Network
                  </h3>
                  <p className="text-[10px] text-purple-300">
                    Sri Lanka’s 100% Female-Driven Cab App
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowHelagoPrompt(false);
                  setHelagoLaunched(false);
                }}
                className="text-stone-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {helagoLaunched ? (
              <div className="py-6 flex flex-col items-center text-center gap-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-emerald-400 animate-pulse" />
                </div>
                <h4 className="text-base font-bold text-white">
                  Launching HelaGo Application...
                </h4>
                <p className="text-xs text-purple-200">
                  Your current GPS pickup location has been handed off to driver <strong>{selectedDriver.name}</strong>.
                </p>
                <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-800/50 text-[11px] text-left w-full mt-2">
                  <p className="text-purple-300">Vehicle: <strong>{selectedDriver.vehicleModel}</strong> ({selectedDriver.licensePlate})</p>
                  <p className="text-purple-300">ETA: <strong>{selectedDriver.etaMinutes} mins</strong> | Estimated Fare: <strong>LKR {selectedDriver.fareEstimate}</strong></p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-purple-200 leading-relaxed">
                  You are being prompted to book a safe ride through the <strong>HelaGo</strong> app. Female drivers are pre-vetted with background checks and GPS shielded telematics.
                </p>

                {/* Driver Selector */}
                <div className="flex flex-col gap-2 my-1">
                  {helagoDrivers.map((driver) => (
                    <div
                      key={driver.driverId}
                      onClick={() => setSelectedDriver(driver)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                        selectedDriver.driverId === driver.driverId
                          ? 'bg-purple-900/60 border-purple-400'
                          : 'bg-black/30 border-purple-900/40 hover:bg-purple-950/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={driver.driverImage}
                          alt={driver.name}
                          className="w-9 h-9 rounded-full object-cover border border-purple-400"
                        />
                        <div>
                          <span className="font-bold text-xs text-white block">
                            {driver.name}
                          </span>
                          <span className="text-[10px] text-purple-300">
                            {driver.vehicleModel} · {driver.etaMinutes}m away
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-emerald-400">
                          LKR {driver.fareEstimate}
                        </span>
                        <div className="flex items-center gap-0.5 text-amber-400 text-[10px] justify-end">
                          <Star className="w-2.5 h-2.5 fill-amber-400" />
                          <span>{driver.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Prompt Button */}
                <button
                  onClick={() => setHelagoLaunched(true)}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition active:scale-98 mt-2"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Launch HelaGo App</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
