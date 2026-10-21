import React, { useState } from 'react';
import {
  Sparkles,
  Download,
  CheckCircle,
  Phone,
  Share2,
  Percent,
  MapPin,
  ShieldCheck,
  Radio,
  Copy,
  Check,
  Car,
  Clock,
  Compass,
  ArrowRight,
  Plus,
  Trash2,
  ExternalLink,
  WifiOff,
  Navigation,
  Lock,
  Building2,
  Users,
} from 'lucide-react';
import { UserProfile, EmergencyContact } from '../../types';

interface PremiumSuiteScreenProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onOpenMap: () => void;
  theme: 'dark' | 'light';
  onBackToStandard?: () => void;
}

export const PremiumSuiteScreen: React.FC<PremiumSuiteScreenProps> = ({
  user,
  onUpdateUser,
  onOpenMap,
  theme,
  onBackToStandard,
}) => {
  const isDark = theme === 'dark';

  // Live Location Share state
  const [copiedLink, setCopiedLink] = useState(false);
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [liveBeaconActive, setLiveBeaconActive] = useState(true);

  // Offline maps pack state
  const [downloadedPacks, setDownloadedPacks] = useState<Record<string, boolean>>({
    kandy: true,
    ella: true,
    galle: false,
    colombo: true,
    nuwara_eliya: false,
  });
  const [downloadingCity, setDownloadingCity] = useState<string | null>(null);

  // Add more emergency contacts (Premium feature: Unlimited)
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('Guardian');

  // Coupon claimed toast
  const [claimedCoupon, setClaimedCoupon] = useState<string | null>(null);

  const liveTrackingUrl = `https://travora.lk/live/${user.name.toLowerCase().replace(/\s+/g, '-') || 'traveler'}?beacon=au10tix_live_891`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(liveTrackingUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleBroadcastBeacon = () => {
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 3500);
  };

  const handleDownloadPack = (key: string) => {
    setDownloadingCity(key);
    setTimeout(() => {
      setDownloadedPacks((prev) => ({ ...prev, [key]: true }));
      setDownloadingCity(null);
    }, 1200);
  };

  const handleAddEmergencyContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) return;

    const newContact: EmergencyContact = {
      id: `c_${Date.now()}`,
      name: newContactName.trim(),
      phone: newContactPhone.trim(),
      relationship: newContactRelation,
      notifySms: true,
      notifyPush: true,
    };

    onUpdateUser({
      ...user,
      emergencyContacts: [...user.emergencyContacts, newContact],
    });

    setNewContactName('');
    setNewContactPhone('');
    setShowAddContact(false);
  };

  const handleDeleteContact = (id: string) => {
    onUpdateUser({
      ...user,
      emergencyContacts: user.emergencyContacts.filter((c) => c.id !== id),
    });
  };

  const handleClaimCoupon = (code: string) => {
    navigator.clipboard?.writeText(code);
    setClaimedCoupon(code);
    setTimeout(() => setClaimedCoupon(null), 3000);
  };

  return (
    <div className="flex flex-col gap-5 pb-12">
      {/* ========================================================
          PREMIUM VIP HERO HEADER
         ======================================================== */}
      <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-amber-500/20 via-purple-950 to-[#0e071e] border-2 border-amber-400/50 shadow-xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs bg-gradient-to-r from-amber-400 to-amber-200 text-stone-950 font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 fill-stone-950" />
                <span>TRAVORA PREMIUM EDITION</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                ACTIVE SUITE ✓
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              VIP Solo Travel Safety Suite
            </h1>
            <p className="text-xs text-stone-300 mt-1 max-w-xl">
              Dedicated edition with full offline maps resilience, continuous encrypted live location beacon,
              unlimited emergency contacts, and priority 24/7 SLTDA police dispatch.
            </p>
          </div>

          {onBackToStandard && (
            <button
              onClick={onBackToStandard}
              className="text-xs font-bold text-amber-300 hover:text-white bg-black/40 hover:bg-black/60 border border-amber-400/40 px-3 py-1.5 rounded-xl transition self-start sm:self-auto"
            >
              Switch to Standard View
            </button>
          )}
        </div>

        {/* Quick Summary Pill Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4 pt-4 border-t border-amber-400/20 text-xs text-white">
          <div className="p-2 rounded-xl bg-black/30 border border-purple-800/40">
            <span className="text-[10px] text-amber-300 font-bold block">1. Offline Maps</span>
            <span className="font-extrabold text-xs">3 Packs Ready</span>
          </div>
          <div className="p-2 rounded-xl bg-black/30 border border-purple-800/40">
            <span className="text-[10px] text-amber-300 font-bold block">2. Live Beacon</span>
            <span className="font-extrabold text-xs text-emerald-400 flex items-center gap-1">
              <Radio className="w-3 h-3 animate-ping" /> Streaming
            </span>
          </div>
          <div className="p-2 rounded-xl bg-black/30 border border-purple-800/40">
            <span className="text-[10px] text-amber-300 font-bold block">3. Priority Booking</span>
            <span className="font-extrabold text-xs text-amber-300">Instant Holds ✓</span>
          </div>
          <div className="p-2 rounded-xl bg-black/30 border border-purple-800/40">
            <span className="text-[10px] text-amber-300 font-bold block">4. VIP Contacts</span>
            <span className="font-extrabold text-xs">Unlimited ({user.emergencyContacts.length})</span>
          </div>
          <div className="p-2 rounded-xl bg-black/30 border border-purple-800/40 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-amber-300 font-bold block">5. VIP Discounts</span>
            <span className="font-extrabold text-xs text-amber-300">Up to 25% Off</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          FEATURE 1: OFFLINE MAPS
         ======================================================== */}
      <div
        className={`rounded-3xl p-5 border transition-all ${
          isDark ? 'bg-[#150a28] border-purple-800/50 text-white' : 'bg-white border-purple-200 text-stone-900 shadow-sm'
        }`}
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base text-stone-900 dark:text-white">
                  1. Offline Maps & Zero-Data Emergency Routes
                </h3>
                <span className="text-[9px] bg-amber-400/20 text-amber-700 dark:text-amber-300 font-extrabold px-1.5 py-0.2 rounded border border-amber-400/40">
                  PREMIUM
                </span>
              </div>
              <p className="text-xs text-stone-600 dark:text-purple-200">
                Full vector street maps, lighted corridors, safe shelters & police stations stored on-device.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenMap}
            className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition shrink-0"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Open Map</span>
          </button>
        </div>

        {/* Offline district packs list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 mt-2">
          {[
            { key: 'kandy', name: 'Kandy & Hanthana Valley', size: '28 MB', status: 'Cached & Armed', area: 'Central Province' },
            { key: 'ella', name: 'Ella, Bandarawela & Horton Plains', size: '19 MB', status: 'Cached & Armed', area: 'Uva Highlands' },
            { key: 'colombo', name: 'Colombo Metro & Airport Corridor', size: '42 MB', status: 'Cached & Armed', area: 'Western Province' },
            { key: 'galle', name: 'Galle Fort, Unawatuna & Mirissa', size: '34 MB', status: 'Available', area: 'Southern Coast' },
            { key: 'nuwara_eliya', name: 'Nuwara Eliya & Tea Country', size: '22 MB', status: 'Available', area: 'Central Highlands' },
          ].map((pack) => {
            const isDownloaded = downloadedPacks[pack.key];
            const isDownloading = downloadingCity === pack.key;

            return (
              <div
                key={pack.key}
                className={`p-3 rounded-2xl border flex items-center justify-between gap-2 transition ${
                  isDownloaded
                    ? isDark
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-white'
                      : 'bg-emerald-50/70 border-emerald-300 text-stone-900'
                    : isDark
                    ? 'bg-black/30 border-purple-900/40'
                    : 'bg-purple-50/40 border-purple-200'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xs text-stone-900 dark:text-white">{pack.name}</span>
                    {isDownloaded && <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                  </div>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400">
                    {pack.area} • {pack.size}
                  </p>
                </div>

                {isDownloaded ? (
                  <span className="text-[10px] bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-1 rounded-lg border border-emerald-500/30 shrink-0">
                    Downloaded ✓
                  </span>
                ) : (
                  <button
                    onClick={() => handleDownloadPack(pack.key)}
                    disabled={isDownloading}
                    className="text-[10px] bg-purple-700 hover:bg-purple-800 text-white font-bold px-2.5 py-1 rounded-lg transition shrink-0 flex items-center gap-1 active:scale-95"
                  >
                    <Download className="w-3 h-3" />
                    <span>{isDownloading ? 'Downloading...' : 'Download'}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          FEATURE 2: SHARE LIVE LOCATION WITH LOVED ONES ON THE GO
         ======================================================== */}
      <div
        className={`rounded-3xl p-5 border transition-all ${
          isDark ? 'bg-[#150a28] border-purple-800/50 text-white' : 'bg-white border-purple-200 text-stone-900 shadow-sm'
        }`}
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-fuchsia-500/20 border border-fuchsia-400 flex items-center justify-center text-fuchsia-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base text-stone-900 dark:text-white">
                  2. Share Live Location with Loved Ones On The Go
                </h3>
                <span className="text-[9px] bg-emerald-500 text-stone-950 font-black px-1.5 py-0.2 rounded">
                  LIVE BEACON
                </span>
              </div>
              <p className="text-xs text-stone-600 dark:text-purple-200">
                End-to-end encrypted telemetry stream with battery percentage, speed, and real-time route breadcrumbs.
              </p>
            </div>
          </div>

          <button
            onClick={() => setLiveBeaconActive(!liveBeaconActive)}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
              liveBeaconActive
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${liveBeaconActive ? 'animate-ping' : ''}`} />
            <span>{liveBeaconActive ? 'Streaming Live' : 'Paused'}</span>
          </button>
        </div>

        {/* Live Telemetry Card */}
        <div
          className={`p-4 rounded-2xl border ${
            isDark ? 'bg-black/40 border-purple-800/50' : 'bg-purple-50/70 border-purple-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-extrabold text-xs text-stone-900 dark:text-white">
                  Kandy Lake Perimeter Corridor • William Gopallawa Mw
                </span>
              </div>
              <p className="text-[11px] text-stone-600 dark:text-purple-200 mt-0.5 font-mono">
                Lat: 7.2906° N • Lng: 80.6337° E • Heading North • ±2m Accuracy
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-bold text-stone-700 dark:text-purple-200">
              <span className="flex items-center gap-1 bg-black/10 dark:bg-black/30 px-2 py-1 rounded-lg">
                🔋 88% Battery
              </span>
              <span className="flex items-center gap-1 bg-black/10 dark:bg-black/30 px-2 py-1 rounded-lg">
                🚗 16 km/h (Moving)
              </span>
            </div>
          </div>

          {/* Shareable URL Bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 p-2 rounded-xl bg-white dark:bg-stone-900 border border-purple-300 dark:border-purple-800 text-xs font-mono text-purple-700 dark:text-purple-300 truncate">
              {liveTrackingUrl}
            </div>
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1 transition shrink-0 active:scale-95"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
            </button>
            <button
              onClick={handleBroadcastBeacon}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs flex items-center gap-1 transition shrink-0 active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{broadcastSent ? 'Broadcast Sent! ✓' : 'Broadcast to Contacts'}</span>
            </button>
          </div>

          {broadcastSent && (
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-2 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Live GPS link sent via SMS & WhatsApp to your emergency contacts.</span>
            </p>
          )}
        </div>
      </div>

      {/* ========================================================
          FEATURE 3: PRIORITY BOOKING & 24/7 RAPID SOS DISPATCH
         ======================================================== */}
      <div
        className={`rounded-3xl p-5 border transition-all ${
          isDark ? 'bg-[#150a28] border-purple-800/50 text-white' : 'bg-white border-purple-200 text-stone-900 shadow-sm'
        }`}
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-purple-500/20 border border-purple-400 flex items-center justify-center text-purple-400">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base text-stone-900 dark:text-white">
                  3. Priority Booking Privileges
                </h3>
                <span className="text-[9px] bg-amber-400/20 text-amber-700 dark:text-amber-300 font-extrabold px-1.5 py-0.2 rounded border border-amber-400/40">
                  PREMIUM
                </span>
              </div>
              <p className="text-xs text-stone-600 dark:text-purple-200">
                Guaranteed priority room holds, zero-deposit boutique stays, and dedicated guide allocations.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* Item A */}
          <div
            className={`p-3.5 rounded-2xl border ${
              isDark ? 'bg-black/30 border-purple-900/40' : 'bg-purple-50/50 border-purple-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Building2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="font-black text-stone-900 dark:text-white">Guaranteed Room Holds</span>
            </div>
            <p className="text-[11px] text-stone-600 dark:text-purple-200 leading-relaxed">
              Hold rooms for up to 24 hours without immediate deposit at high-demand Pink Shield verified stays in Kandy, Ella, and Galle.
            </p>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold block mt-2">
              Status: Priority Hold Armed ✓
            </span>
          </div>

          {/* Item B */}
          <div
            className={`p-3.5 rounded-2xl border ${
              isDark ? 'bg-black/30 border-purple-900/40' : 'bg-purple-50/50 border-purple-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="font-black text-stone-900 dark:text-white">VIP Female Guide Match</span>
            </div>
            <p className="text-[11px] text-stone-600 dark:text-purple-200 leading-relaxed">
              Front-of-the-line matching with top-rated licensed SLTDA female cultural and trekking guides across Sri Lanka.
            </p>
            <span className="text-[10px] text-purple-600 dark:text-purple-300 font-extrabold block mt-2">
              Priority Queue: Instant Match
            </span>
          </div>

          {/* Item C */}
          <div
            className={`p-3.5 rounded-2xl border ${
              isDark ? 'bg-black/30 border-purple-900/40' : 'bg-purple-50/50 border-purple-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span className="font-black text-stone-900 dark:text-white">Zero-Deposit & Late Checkout</span>
            </div>
            <p className="text-[11px] text-stone-600 dark:text-purple-200 leading-relaxed">
              Priority room allocations and free late checkouts up to 2:00 PM at all certified women-friendly boutique hotels.
            </p>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-extrabold block mt-2">
              Privilege: Active
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================
          FEATURE 4: MORE EMERGENCY CONTACTS (UNLIMITED)
         ======================================================== */}
      <div
        className={`rounded-3xl p-5 border transition-all ${
          isDark ? 'bg-[#150a28] border-purple-800/50 text-white' : 'bg-white border-purple-200 text-stone-900 shadow-sm'
        }`}
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-rose-500/20 border border-rose-400 flex items-center justify-center text-rose-400">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base text-stone-900 dark:text-white">
                  4. More Emergency Contacts (Unlimited VIP Roster)
                </h3>
                <span className="text-[9px] bg-rose-500 text-white font-extrabold px-1.5 py-0.2 rounded">
                  UNLIMITED
                </span>
              </div>
              <p className="text-xs text-stone-600 dark:text-purple-200">
                Free tier is limited to 2 contacts. Premium unlocks unlimited trusted circle guardians with simultaneous alerts.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddContact(true)}
            className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Contact</span>
          </button>
        </div>

        {/* Contacts list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {user.emergencyContacts.map((c) => (
            <div
              key={c.id}
              className={`p-3 rounded-2xl border flex items-center justify-between gap-2 ${
                isDark ? 'bg-black/30 border-purple-900/40' : 'bg-purple-50/50 border-purple-200'
              }`}
            >
              <div>
                <span className="font-extrabold text-xs text-stone-900 dark:text-white block">{c.name}</span>
                <span className="text-[11px] text-purple-700 dark:text-purple-300 font-medium block">{c.phone}</span>
                <span className="text-[10px] text-stone-500 dark:text-stone-400 font-mono block">
                  {c.relationship} • SMS & Push
                </span>
              </div>
              {user.emergencyContacts.length > 1 && (
                <button
                  onClick={() => handleDeleteContact(c.id)}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/20 transition"
                  title="Remove Contact"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add Contact Form Inline Modal */}
        {showAddContact && (
          <form
            onSubmit={handleAddEmergencyContact}
            className={`mt-4 p-4 rounded-2xl border flex flex-col gap-3 ${
              isDark ? 'bg-black/50 border-purple-700' : 'bg-purple-100/50 border-purple-300'
            }`}
          >
            <span className="font-extrabold text-xs text-stone-900 dark:text-white">
              Add New Emergency Contact (Premium Slot #{user.emergencyContacts.length + 1})
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <input
                type="text"
                required
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                placeholder="Full Name (e.g. Kasun Fernando)"
                className="p-2 rounded-xl border border-purple-300 dark:border-purple-800 bg-white dark:bg-stone-900 outline-none"
              />
              <input
                type="tel"
                required
                value={newContactPhone}
                onChange={(e) => setNewContactPhone(e.target.value)}
                placeholder="Phone (+94 77 123 4567)"
                className="p-2 rounded-xl border border-purple-300 dark:border-purple-800 bg-white dark:bg-stone-900 outline-none"
              />
              <select
                value={newContactRelation}
                onChange={(e) => setNewContactRelation(e.target.value)}
                className="p-2 rounded-xl border border-purple-300 dark:border-purple-800 bg-white dark:bg-stone-900 outline-none font-bold"
              >
                <option value="Family">Family / Parent</option>
                <option value="Sister">Sister</option>
                <option value="Spouse/Partner">Spouse / Partner</option>
                <option value="Doctor">Doctor / Medical</option>
                <option value="Solo Buddy">Solo Buddy</option>
                <option value="Host">Trusted Homestay Host</option>
              </select>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowAddContact(false)}
                className="px-3 py-1.5 text-xs text-stone-500 hover:text-stone-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs"
              >
                Save VIP Contact
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ========================================================
          FEATURE 5: EXCLUSIVE DISCOUNTS
         ======================================================== */}
      <div
        className={`rounded-3xl p-5 border transition-all ${
          isDark ? 'bg-[#150a28] border-purple-800/50 text-white' : 'bg-white border-purple-200 text-stone-900 shadow-sm'
        }`}
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base text-stone-900 dark:text-white">
                  5. Exclusive Solo Traveler Discounts
                </h3>
                <span className="text-[9px] bg-amber-400/20 text-amber-700 dark:text-amber-300 font-extrabold px-1.5 py-0.2 rounded border border-amber-400/40">
                  SAVE UP TO $120/MO
                </span>
              </div>
              <p className="text-xs text-stone-600 dark:text-purple-200">
                Partnered discounts with verified women-owned boutique hotels, wellness spas, and heritage tea estates.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {[
            {
              title: '20% OFF Boutique Stays',
              partner: 'Queens Hotel & Ella Surf Homestays',
              code: 'KANDY_VIP20',
              badge: 'Hotels',
            },
            {
              title: '15% OFF Ayurvedic Wellness Spas',
              partner: 'Partner Wellness Retreats Kandy & Galle',
              code: 'AYUR_VIP15',
              badge: 'Wellness',
            },
            {
              title: '100% Free VIP Tea Tasting',
              partner: 'Ceylon Tea Museum Hanthana',
              code: 'CEYLON_VIP_PASS',
              badge: 'Attraction',
            },
            {
              title: '25% OFF Mountain Guides',
              partner: 'SLTDA Certified Female Guides',
              code: 'ELLA_TREK25',
              badge: 'Tours',
            },
          ].map((item) => (
            <div
              key={item.code}
              className={`p-3.5 rounded-2xl border flex flex-col justify-between gap-2 ${
                isDark ? 'bg-black/30 border-purple-900/40' : 'bg-purple-50/50 border-purple-200'
              }`}
            >
              <div>
                <span className="text-[9px] bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 font-extrabold px-1.5 py-0.5 rounded border border-purple-300 dark:border-purple-800/60 inline-block mb-1">
                  {item.badge}
                </span>
                <h4 className="font-black text-stone-900 dark:text-white text-xs">{item.title}</h4>
                <p className="text-[10px] text-stone-600 dark:text-stone-300 mt-0.5">{item.partner}</p>
              </div>

              <div className="pt-2 border-t border-purple-900/30 flex items-center justify-between gap-1">
                <span className="font-mono font-bold text-[10px] text-purple-700 dark:text-purple-300">{item.code}</span>
                <button
                  onClick={() => handleClaimCoupon(item.code)}
                  className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-500 text-stone-950 font-black text-[10px] transition active:scale-95"
                >
                  {claimedCoupon === item.code ? 'Copied! ✓' : 'Claim'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
