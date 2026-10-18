import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Shield,
  Users,
  Building2,
  Sparkles,
} from 'lucide-react';
import { UserProfile, EmergencyHotlineData, TripTimerState, SafeStay, TravelGuide } from './types';
import { initialCurrentUser, fallbackHotlines } from './data/mockData';
import { Header } from './components/Header';
import { MapScreen } from './components/TravelerApp/MapScreen';
import { SafetyDashboard } from './components/TravelerApp/SafetyDashboard';
import { StaysScreen } from './components/TravelerApp/StaysScreen';
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

  // Traveler App Tabs: Matches exactly the 5 PDF prototype tabs + sub-screens
  const [travelerTab, setTravelerTab] = useState<'safety' | 'map' | 'stays' | 'buddies' | 'ai' | 'offline' | 'verify'>('safety');

  // Theme State: 'dark' | 'light'
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('travora_theme');
    return (saved as 'dark' | 'light') || 'light';
  });

  // User Profile: Default Piyumi Anuradha
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('travora_user_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure name is Piyumi Anuradha
        if (parsed.name !== 'Piyumi Anuradha') {
          return { ...parsed, name: 'Piyumi Anuradha' };
        }
        return parsed;
      } catch (e) {
        return initialCurrentUser;
      }
    }
    return initialCurrentUser;
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

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleStartTripTimer = (destination: string, mode: 'tuk_tuk' | 'taxi' | 'walk' | 'train', durationMins: number) => {
    const totalSecs = durationMins * 60;
    setTripTimer({
      isActive: true,
      destinationName: destination,
      transportMode: mode,
      totalSeconds: totalSecs,
      remainingSeconds: totalSecs,
      startTime: new Date().toLocaleTimeString(),
      status: 'running',
    });
    triggerToast(`Trip Timer active: ${durationMins} minutes to ${destination}`);
  };

  const handleCancelTripTimer = () => {
    setTripTimer((prev) => ({
      ...prev,
      isActive: false,
      status: 'completed',
    }));
    triggerToast('Arrived safely! Live GPS broadcast concluded.');
  };

  const handleToggleOffline = () => {
    const nextState = !isOfflineSimulated;
    setIsOfflineSimulated(nextState);
    apiService.setOfflineSimulation(nextState);
    triggerToast(
      nextState
        ? 'Offline Mode Active (Zero-Data SQLite cached phrases and hotlines enabled)'
        : 'Cloud Online Mode re-established'
    );
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleBookStay = (stay: SafeStay) => {
    setCheckoutBookingItem({
      title: `${stay.name} (${stay.type})`,
      partnerName: stay.name,
      amountLKR: stay.pricePerNightLKR,
      amountUSD: stay.priceUSD,
      serviceType: 'hostel',
    });
    setIsFreemiumPrompt(false);
    setShowSubscriptionModal(true);
  };

  const handleBookGuide = (guide: TravelGuide) => {
    setCheckoutBookingItem({
      title: `${guide.name} - Full Day Cultural Tour`,
      partnerName: guide.name,
      amountLKR: guide.dailyRateLKR,
      amountUSD: guide.dailyRateUSD,
      serviceType: 'guide',
    });
    setIsFreemiumPrompt(false);
    setShowSubscriptionModal(true);
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-200 ${
      isDark ? 'bg-[#0b0518] text-stone-100' : 'bg-[#FAF5FF] text-stone-900'
    }`}>
      {/* Top Application Header Bar */}
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
        onOpenVerification={() => setTravelerTab('verify')}
      />

      {/* Persistent Global Toast Message */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-purple-950/95 border border-purple-500 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-bounce">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 flex justify-center items-start p-2 sm:p-4">
        {/* VIEW 1: TRAVELER APPLICATION */}
        {activeView === 'traveler' && (
          <div className={`w-full flex flex-col transition-all duration-200 ${
            isMobileFrame
              ? 'max-w-[430px] h-[860px] rounded-[44px] shadow-2xl border-[8px] border-stone-800/80 dark:border-stone-950 bg-white dark:bg-[#0f0a1c] overflow-hidden relative'
              : 'max-w-4xl min-h-[820px] rounded-3xl border border-purple-900/40 bg-white dark:bg-[#0f0a1c]'
          }`}>
            {/* Mobile Device Status Bar */}
            {isMobileFrame && (
              <div className="h-6 w-full flex items-center justify-between px-6 text-[11px] text-stone-400 shrink-0 bg-transparent z-20">
                <div className="flex items-center gap-1.5 font-bold">
                  <span>9:41</span>
                  {tripTimer.isActive && (
                    <span className="text-[9px] font-mono text-purple-600 dark:text-purple-300 font-black">
                      ⏱ {Math.floor(tripTimer.remainingSeconds / 60)}m
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[10px]">
                  {isOfflineSimulated ? (
                    <span className="text-amber-500 font-bold">OFFLINE</span>
                  ) : (
                    <span className="text-emerald-500 font-bold">5G</span>
                  )}
                  <span>100%</span>
                </div>
              </div>
            )}

            {/* Scrollable Interior Container (Restricts vertical overflow!) */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
              {/* TAB 1: SAFETY (Screenshot 1) */}
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
                  onOpenProfile={() => setShowProfileModal(true)}
                  theme={theme}
                />
              )}

              {/* TAB 2: EXPLORE / MAPS & ARTICLES (Screenshot 2) */}
              {travelerTab === 'map' && (
                <MapScreen
                  onAskSerenaAI={(query) => {
                    setTravelerTab('ai');
                  }}
                  onTriggerUpgradePrompt={() => {
                    setIsFreemiumPrompt(true);
                    setCheckoutBookingItem(null);
                    setShowSubscriptionModal(true);
                  }}
                  theme={theme}
                />
              )}

              {/* TAB 3: RIDES & STAYS (Screenshots 3 & 4) */}
              {travelerTab === 'stays' && (
                <StaysScreen
                  onBookStay={handleBookStay}
                  theme={theme}
                />
              )}

              {/* TAB 4: COMMUNITY (Screenshots 5, 6 & 7) */}
              {travelerTab === 'buddies' && (
                <BuddyFeedScreen
                  user={user}
                  onOpenVerification={() => setTravelerTab('verify')}
                  onBookGuide={handleBookGuide}
                  theme={theme}
                />
              )}

              {/* TAB 5: SERENA AI CONCIERGE */}
              {travelerTab === 'ai' && (
                <AiSafetyAssistant
                  currentCity="Kandy, Sri Lanka"
                  theme={theme}
                />
              )}

              {/* SUB-SCREEN: OFFLINE EMERGENCY MODE (Screenshot 8) */}
              {travelerTab === 'offline' && (
                <OfflineEmergencyScreen
                  onBack={() => setTravelerTab('safety')}
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
            </div>

            {/* FIXED BOTTOM NAVIGATION BAR: Exactly the 5 Tabs matching PDF screenshots! */}
            <nav className={`shrink-0 border-t px-2 py-2 flex items-center justify-around z-30 transition-colors ${
              isDark
                ? 'bg-[#0b0518]/95 border-purple-900/40 backdrop-blur-md'
                : 'bg-white/95 border-purple-100 shadow-md backdrop-blur-md'
            }`}>
              {[
                { id: 'safety', label: 'Safety', icon: Shield },
                { id: 'map', label: 'Explore', icon: MapPin },
                { id: 'stays', label: 'Rides & Stays', icon: Building2 },
                { id: 'buddies', label: 'Community', icon: Users },
                { id: 'ai', label: 'Serena', icon: Sparkles },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = travelerTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setTravelerTab(tab.id as any)}
                    className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition ${
                      isActive
                        ? 'text-purple-600 dark:text-purple-300 font-extrabold'
                        : 'text-stone-400 hover:text-purple-600 font-medium'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-purple-600 dark:text-purple-400 stroke-[2.5]' : 'text-stone-400'}`} />
                    <span className="text-[10px] tracking-tight">{tab.label}</span>
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

      {/* FAKE CALL DISRUPTION FULLSCREEN OVERLAY (Up to 1 minute long) */}
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

      {/* PROFILE PAGE / MODAL (Piyumi Anuradha, editable contacts, switch to premium) */}
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
