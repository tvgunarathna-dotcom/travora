import React, { useState, useEffect } from 'react';
import {
  MapPin,
  ShieldAlert,
  Users,
  WifiOff,
  Sparkles,
  ShieldCheck,
  Building2,
  Compass,
  CheckCircle,
  User,
  Clock,
  PhoneCall,
} from 'lucide-react';
import { UserProfile, HelaGoDriver, EmergencyHotlineData, TripTimerState, SafeStay, TravelGuide } from './types';
import { initialCurrentUser, fallbackHotlines } from './data/mockData';
import { Header } from './components/Header';
import { MapScreen } from './components/TravelerApp/MapScreen';
import { SafetyDashboard } from './components/TravelerApp/SafetyDashboard';
import { StaysScreen } from './components/TravelerApp/StaysScreen';
import { GuidesScreen } from './components/TravelerApp/GuidesScreen';
import { VerificationScreen } from './components/TravelerApp/VerificationScreen';
import { BuddyFeedScreen } from './components/TravelerApp/BuddyFeedScreen';
import { OfflineEmergencyScreen } from './components/TravelerApp/OfflineEmergencyScreen';
import { AiSafetyAssistant } from './components/TravelerApp/AiSafetyAssistant';
import { FakeCallOverlay } from './components/TravelerApp/FakeCallOverlay';
import { SubscriptionModal } from './components/TravelerApp/SubscriptionModal';
import { ProfileModal } from './components/TravelerApp/ProfileModal';
import { PartnerDashboard } from './components/PartnerPortal/PartnerDashboard';
import { ArchitectureModal } from './components/ArchitectureView/ArchitectureModal';
import { apiService } from './services/api';
import { soundEffects } from './services/soundEffects';

export default function App() {
  // Top-level View State
  const [activeView, setActiveView] = useState<'traveler' | 'partner' | 'architecture'>('traveler');

  // Traveler App Tabs
  const [travelerTab, setTravelerTab] = useState<'safety' | 'map' | 'stays' | 'guides' | 'buddies' | 'offline' | 'ai' | 'verify'>('safety');

  // Theme State: 'dark' | 'light'
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('travora_theme');
    return (saved as 'dark' | 'light') || 'dark';
  });

  // User Profile
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('travora_user_profile');
    return saved ? JSON.parse(saved) : initialCurrentUser;
  });

  // Persistent Global Trip Timer State
  const [tripTimer, setTripTimer] = useState<TripTimerState>({
    isActive: false,
    destinationName: 'Rosmead Place, Cinnamon Gardens',
    transportMode: 'tuk_tuk',
    totalSeconds: 25 * 60,
    remainingSeconds: 25 * 60,
    startTime: '',
    status: 'idle',
  });

  // Destination & Hotline Data
  const [currentCountry, setCurrentCountry] = useState<string>('LK');
  const hotlineData: EmergencyHotlineData = fallbackHotlines[currentCountry] || fallbackHotlines['LK'];

  // Modals & Overlays
  const [showFakeCall, setShowFakeCall] = useState(false);
  const [fakeCallPersonaId, setFakeCallPersonaId] = useState('mom');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [isFreemiumPrompt, setIsFreemiumPrompt] = useState(false);
  const [checkoutBookingItem, setCheckoutBookingItem] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Layout Viewport Control
  const [isMobileFrame, setIsMobileFrame] = useState(true);
  const [isOfflineSimulated, setIsOfflineSimulated] = useState(() => apiService.isOfflineMode());

  // Save theme & profile
  useEffect(() => {
    localStorage.setItem('travora_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('travora_user_profile', JSON.stringify(user));
  }, [user]);

  // Global Trip Timer Countdown Interval
  useEffect(() => {
    let interval: any;
    if (tripTimer.isActive && tripTimer.remainingSeconds > 0) {
      interval = setInterval(() => {
        setTripTimer((prev) => {
          if (prev.remainingSeconds === 120) {
            soundEffects.playWarningChime();
          }
          if (prev.remainingSeconds <= 1) {
            clearInterval(interval);
            soundEffects.playWarningChime();
            triggerToast('🚨 Trip timer expired! Auto-dispatching emergency GPS alert to contacts.');
            return {
              ...prev,
              remainingSeconds: 0,
              isActive: false,
              status: 'sos_dispatched',
            };
          }
          return {
            ...prev,
            remainingSeconds: prev.remainingSeconds - 1,
          };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [tripTimer.isActive, tripTimer.remainingSeconds]);

  const handleStartTripTimer = (destination: string, mode: 'tuk_tuk' | 'taxi' | 'walk' | 'train', durationMins: number) => {
    const sec = durationMins * 60;
    setTripTimer({
      isActive: true,
      destinationName: destination,
      transportMode: mode,
      totalSeconds: sec,
      remainingSeconds: sec,
      startTime: new Date().toLocaleTimeString(),
      status: 'running',
    });
    triggerToast(`Trip Timer armed: ${durationMins} minutes to ${destination}`);
  };

  const handleCancelTripTimer = () => {
    setTripTimer((prev) => ({
      ...prev,
      isActive: false,
      status: 'completed',
    }));
    triggerToast('Safe arrival confirmed with PIN. Trip timer completed.');
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  const handleToggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleToggleOffline = () => {
    const next = !isOfflineSimulated;
    setIsOfflineSimulated(next);
    apiService.setOfflineSimulation(next);
    triggerToast(next ? 'Simulated Offline Zero-Data Mode Active' : 'Connected to Cloud Online Network');
  };

  const handleUpdateVerification = (verified: boolean, badgeHash?: string) => {
    setUser((prev) => ({
      ...prev,
      isVerified: verified,
      pinkShieldBadgeHash: badgeHash || prev.pinkShieldBadgeHash,
    }));
    triggerToast(
      verified
        ? '✓ AU10TIX Identity Verification passed! ID Verified badge issued.'
        : 'Identity verification reset to unverified for testing.'
    );
  };

  // Booking handlers with 12% TRAVORA commission split
  const handleBookDriver = (driver: HelaGoDriver) => {
    setCheckoutBookingItem({
      title: `HelaGo Electric Ride · ${driver.vehicleModel}`,
      partnerName: `Driver: ${driver.name} (${driver.licensePlate})`,
      amountLKR: driver.fareEstimate,
      amountUSD: Math.round(driver.fareEstimate / 300),
      serviceType: 'transport',
    });
    setIsFreemiumPrompt(false);
    setShowSubscriptionModal(true);
  };

  const handleBookStay = (stay: SafeStay) => {
    setCheckoutBookingItem({
      title: `${stay.name} (${stay.type})`,
      partnerName: `${stay.city} · 24/7 Desk · Pink Shield Certified`,
      amountLKR: stay.pricePerNightLKR,
      amountUSD: stay.priceUSD,
      serviceType: 'hostel',
    });
    setIsFreemiumPrompt(false);
    setShowSubscriptionModal(true);
  };

  const handleBookGuide = (guide: TravelGuide) => {
    setCheckoutBookingItem({
      title: `Guided Escort Tour · ${guide.name}`,
      partnerName: `Licensed Guide (${guide.licenseNumber}) · ${guide.city}`,
      amountLKR: guide.dailyRateLKR,
      amountUSD: guide.dailyRateUSD,
      serviceType: 'guide',
    });
    setIsFreemiumPrompt(false);
    setShowSubscriptionModal(true);
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 font-['Plus_Jakarta_Sans',sans-serif] ${
      isDark ? 'bg-[#0d0817] text-stone-100' : 'bg-[#FAF5FF] text-stone-900'
    }`}>
      {/* Universal Top Header */}
      <Header
        activeView={activeView}
        onSelectView={setActiveView}
        isMobileFrame={isMobileFrame}
        onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
        isOfflineSimulated={isOfflineSimulated}
        onToggleOffline={handleToggleOffline}
        user={user}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenProfile={() => setShowProfileModal(true)}
        onOpenVerification={() => {
          setActiveView('traveler');
          setTravelerTab('verify');
        }}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#160c28] border border-purple-500/70 text-purple-200 text-xs font-bold px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <CheckCircle className="w-4 h-4 text-purple-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container - Constrained Mobile Viewport to prevent screen overflow */}
      <main className="flex-1 flex flex-col items-center justify-start p-2 sm:p-4 w-full max-w-7xl mx-auto overflow-hidden">
        {/* VIEW 1: REGULAR TRAVELER APP */}
        {activeView === 'traveler' && (
          <div
            className={`w-full transition-all duration-300 ${
              isMobileFrame
                ? 'max-w-[430px] w-full h-[880px] max-h-[92vh] flex flex-col shadow-2xl rounded-[40px] border-[7px] border-stone-800/90 overflow-hidden relative'
                : 'max-w-4xl'
            } ${isDark ? 'bg-[#0f0a1c]' : 'bg-white'}`}
          >
            {/* Top Phone Bezel / Dynamic Island (Only in mobile frame view) */}
            {isMobileFrame && (
              <div className={`px-5 pt-3 pb-2 flex items-center justify-between text-[11px] font-bold select-none border-b shrink-0 ${
                isDark ? 'bg-[#0f0a1c] border-purple-900/30 text-stone-400' : 'bg-white border-purple-100 text-stone-700'
              }`}>
                <span>09:41</span>
                {/* Dynamic island pill with active trip timer indicator */}
                <div className="h-4 px-3 bg-black rounded-full border border-stone-800 flex items-center gap-1.5 shadow-xs">
                  <div className={`w-2 h-2 rounded-full ${tripTimer.isActive ? 'bg-amber-400 animate-ping' : 'bg-purple-600'}`} />
                  {tripTimer.isActive && (
                    <span className="text-[9px] font-mono text-amber-300 font-bold">
                      {Math.floor(tripTimer.remainingSeconds / 60)}m
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  {isOfflineSimulated ? (
                    <span className="text-amber-500 font-bold text-[10px]">OFFLINE</span>
                  ) : (
                    <span className="text-emerald-500 font-bold text-[10px]">5G</span>
                  )}
                  <span>100%</span>
                </div>
              </div>
            )}

            {/* Scrollable Interior Container (Prevents whole-page overflow!) */}
            <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-4">
              {travelerTab === 'safety' && (
                <SafetyDashboard
                  user={user}
                  hotlineData={hotlineData}
                  tripTimer={tripTimer}
                  onStartTripTimer={handleStartTripTimer}
                  onCancelTripTimer={handleCancelTripTimer}
                  onLaunchFakeCall={(pId) => {
                    setFakeCallPersonaId(pId);
                    setShowFakeCall(true);
                  }}
                  onOpenOfflineHotlines={() => setTravelerTab('offline')}
                  theme={theme}
                />
              )}

              {travelerTab === 'map' && (
                <MapScreen
                  onBookDriver={handleBookDriver}
                  onOpenAssistantWithLocation={(loc) => {
                    setTravelerTab('ai');
                  }}
                  theme={theme}
                />
              )}

              {travelerTab === 'stays' && (
                <StaysScreen
                  onBookStay={handleBookStay}
                  theme={theme}
                />
              )}

              {travelerTab === 'guides' && (
                <GuidesScreen
                  onBookGuide={handleBookGuide}
                  onChatWithGuide={(g) => {
                    setTravelerTab('buddies');
                  }}
                  theme={theme}
                />
              )}

              {travelerTab === 'buddies' && (
                <BuddyFeedScreen
                  user={user}
                  onOpenVerification={() => setTravelerTab('verify')}
                  theme={theme}
                />
              )}

              {travelerTab === 'offline' && (
                <OfflineEmergencyScreen
                  currentCountry={currentCountry}
                  onSelectCountry={setCurrentCountry}
                  onTriggerUpgradePrompt={() => {
                    setIsFreemiumPrompt(true);
                    setCheckoutBookingItem(null);
                    setShowSubscriptionModal(true);
                  }}
                  theme={theme}
                />
              )}

              {travelerTab === 'ai' && (
                <AiSafetyAssistant
                  currentCity="Colombo, Sri Lanka"
                  theme={theme}
                />
              )}

              {travelerTab === 'verify' && (
                <VerificationScreen
                  user={user}
                  onUpdateUserVerification={handleUpdateVerification}
                  theme={theme}
                />
              )}
            </div>

            {/* Fixed Bottom Tab Bar (Never scrolls out of screen!) */}
            <nav className={`shrink-0 border-t px-1 py-1.5 flex items-center justify-around z-30 transition-colors ${
              isDark
                ? 'bg-[#0f0a1c]/95 border-purple-900/40 backdrop-blur-md'
                : 'bg-white/95 border-purple-100 shadow-md backdrop-blur-md'
            }`}>
              {[
                { id: 'safety', label: 'Safety', icon: ShieldAlert },
                { id: 'map', label: 'Map', icon: MapPin },
                { id: 'stays', label: 'Stays', icon: Building2 },
                { id: 'guides', label: 'Guides', icon: Compass },
                { id: 'buddies', label: 'Buddies', icon: Users, badge: !user.isVerified ? '🔒' : undefined },
                { id: 'offline', label: 'Offline', icon: WifiOff },
                { id: 'ai', label: 'Serena', icon: Sparkles },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = travelerTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setTravelerTab(tab.id as any)}
                    className={`flex flex-col items-center gap-0.5 py-1 px-1 rounded-xl transition ${
                      isActive
                        ? 'text-purple-600 dark:text-purple-300 font-extrabold'
                        : 'text-stone-400 hover:text-purple-600 font-medium'
                    }`}
                  >
                    <div className="relative">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-stone-400'}`} />
                      {tab.badge && (
                        <span className="absolute -top-1 -right-1 text-[8px]">{tab.badge}</span>
                      )}
                    </div>
                    <span className="text-[9px] tracking-tight">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* VIEW 2: B2B PARTNER PORTAL */}
        {activeView === 'partner' && (
          <div className="w-full max-w-5xl overflow-y-auto">
            <PartnerDashboard theme={theme} />
          </div>
        )}

        {/* VIEW 3: TECHNICAL ARCHITECTURE & SCHEMAS */}
        {activeView === 'architecture' && (
          <div className="w-full max-w-5xl overflow-y-auto">
            <ArchitectureModal />
          </div>
        )}
      </main>

      {/* FAKE CALL DISRUPTION FULLSCREEN OVERLAY */}
      {showFakeCall && (
        <FakeCallOverlay
          initialPersonaId={fakeCallPersonaId}
          onDismiss={() => setShowFakeCall(false)}
          onTriggerSos={() => {
            setShowFakeCall(false);
            setTravelerTab('safety');
          }}
        />
      )}

      {/* EDITABLE USER PROFILE MODAL */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user}
        onSaveUser={(updated) => {
          setUser(updated);
          triggerToast('Profile and emergency contacts updated successfully.');
        }}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onUpgradePrompt={() => {
          setShowProfileModal(false);
          setIsFreemiumPrompt(true);
          setCheckoutBookingItem(null);
          setShowSubscriptionModal(true);
        }}
      />

      {/* SUBSCRIPTION & 12% COMMISSION BNPL CHECKOUT MODAL */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => {
          setShowSubscriptionModal(false);
          setCheckoutBookingItem(null);
        }}
        bookingItem={checkoutBookingItem}
        isFreemiumPrompt={isFreemiumPrompt}
        theme={theme}
        onSuccess={(bookingId) => {
          setShowSubscriptionModal(false);
          setCheckoutBookingItem(null);
          triggerToast(
            bookingId
              ? `Booking ${bookingId} confirmed! Check partner receipts with 12% fee calculated.`
              : 'TRAVORA Premium unlocked! Offline vector maps & unlimited contacts active.'
          );
        }}
      />
    </div>
  );
}
