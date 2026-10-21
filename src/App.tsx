import React, { useState, useEffect } from 'react';
import {
  Shield,
  MapPin,
  Building2,
  Users,
  Sparkles,
  PhoneCall,
  Download,
  AlertTriangle,
  UserCheck,
  Crown,
  LogIn,
  CheckCircle,
} from 'lucide-react';
import {
  UserProfile,
  TripTimerState,
  EmergencyHotlineData,
  SafeStay,
  TravelGuide,
} from './types';
import { initialCurrentUser, fallbackHotlines } from './data/mockData';
import { Header } from './components/Header';
import { SafetyDashboard } from './components/TravelerApp/SafetyDashboard';
import { MapScreen } from './components/TravelerApp/MapScreen';
import { StaysScreen } from './components/TravelerApp/StaysScreen';
import { BuddyFeedScreen } from './components/TravelerApp/BuddyFeedScreen';
import { OfflineEmergencyScreen } from './components/TravelerApp/OfflineEmergencyScreen';
import { AiSafetyAssistant } from './components/TravelerApp/AiSafetyAssistant';
import { FakeCallOverlay } from './components/TravelerApp/FakeCallOverlay';
import { SubscriptionModal } from './components/TravelerApp/SubscriptionModal';
import { ProfileModal } from './components/TravelerApp/ProfileModal';
import { PremiumSuiteScreen } from './components/TravelerApp/PremiumSuiteScreen';
import { Au10tixVerificationModal } from './components/TravelerApp/Au10tixVerificationModal';
import { AuthModal } from './components/TravelerApp/AuthModal';
import { ArchitectureModal } from './components/ArchitectureView/ArchitectureModal';
import { apiService } from './services/api';
import { soundEffects } from './services/soundEffects';

export default function App() {
  // Top-level View State: 'traveler' | 'premium' (Separate Premium Edition) | 'architecture'
  const [activeView, setActiveView] = useState<'traveler' | 'premium' | 'architecture'>('traveler');

  // Traveler App Tabs
  const [travelerTab, setTravelerTab] = useState<'safety' | 'map' | 'stays' | 'buddies' | 'ai' | 'offline' | 'premium'>('safety');

  // Theme State: 'dark' | 'light'
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('travora_theme');
    return (saved as 'dark' | 'light') || 'light';
  });

  // Account State: 'verified' | 'unverified' | 'guest'
  const [accountMode, setAccountMode] = useState<'verified' | 'unverified' | 'guest'>('verified');

  // User Profile: Default Piyumi Anuradha
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('travora_user_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
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
  const [showAu10tixModal, setShowAu10tixModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
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

  // Handle Account Mode changes
  const handleSetAccountMode = (mode: 'verified' | 'unverified' | 'guest') => {
    setAccountMode(mode);
    if (mode === 'verified') {
      setUser({
        ...initialCurrentUser,
        name: 'Piyumi Anuradha',
        isVerified: true,
        verificationProvider: 'AU10TIX',
        pinkShieldBadgeHash: 'AU10TIX:SHA256:9f2c81e3a47d',
      });
      triggerToast('Signed in as Piyumi Anuradha (AU10TIX Verified ✓)');
    } else if (mode === 'unverified') {
      setUser({
        ...initialCurrentUser,
        name: 'Piyumi Anuradha',
        isVerified: false,
        verificationProvider: undefined,
        verificationDate: undefined,
        pinkShieldBadgeHash: undefined,
      });
      triggerToast('Account switched to Unverified. Prompting AU10TIX verification.');
    } else {
      // Guest mode
      setUser({
        ...initialCurrentUser,
        id: 'guest_user',
        name: 'Guest Traveler',
        email: 'guest@travora.travel',
        isVerified: false,
        verificationProvider: undefined,
        verificationDate: undefined,
        pinkShieldBadgeHash: undefined,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      });
      triggerToast('Switched to Guest Mode (Not Signed In).');
    }
  };

  const handleAu10tixComplete = (idType: any, badgeHash: string) => {
    setUser((prev) => ({
      ...prev,
      isVerified: true,
      verificationProvider: 'AU10TIX',
      verificationDate: new Date().toISOString().split('T')[0],
      idType,
      pinkShieldBadgeHash: badgeHash,
    }));
    setAccountMode('verified');
    triggerToast('🎉 AU10TIX Biometric Verification Successful! Verified Pink Shield Badge issued.');
  };

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
    if (accountMode === 'guest') {
      setShowAuthModal(true);
      return;
    }
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
    if (accountMode === 'guest') {
      setShowAuthModal(true);
      return;
    }
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
    <div
      className={`min-h-screen flex flex-col font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-200 ${
        isDark ? 'bg-[#0b0518] text-stone-100' : 'bg-[#FAF5FF] text-stone-900'
      }`}
    >
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
        onOpenVerification={() => setShowAu10tixModal(true)}
        onOpenAuth={() => setShowAuthModal(true)}
        accountMode={accountMode}
        onSetAccountMode={handleSetAccountMode}
      />

      {/* Persistent Global Toast Message */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-purple-950/95 border border-purple-500 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-bounce">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 flex justify-center items-start p-2 sm:p-4">
        {/* VIEW 1: SOLO TRAVELER APPLICATION */}
        {activeView === 'traveler' && (
          <div
            className={`w-full flex flex-col transition-all duration-200 ${
              isMobileFrame
                ? 'max-w-[430px] h-[860px] rounded-[44px] shadow-2xl border-[8px] border-stone-800/80 dark:border-stone-950 bg-white dark:bg-[#0f0a1c] overflow-hidden relative'
                : 'max-w-4xl min-h-[820px] rounded-3xl border border-purple-900/40 bg-white dark:bg-[#0f0a1c]'
            }`}
          >
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

            {/* UNVERIFIED / GUEST PROMPT BANNER */}
            {accountMode === 'unverified' && (
              <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-stone-950 px-3 py-2 text-xs font-bold flex items-center justify-between gap-2 shadow-xs shrink-0 z-20">
                <div className="flex items-center gap-1.5 truncate">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-stone-950" />
                  <span className="truncate">Identity Unverified. Complete AU10TIX biometric scan to unlock shield badge.</span>
                </div>
                <button
                  onClick={() => setShowAu10tixModal(true)}
                  className="px-2.5 py-1 rounded-lg bg-stone-950 text-amber-300 hover:text-white font-black text-[11px] shrink-0 transition active:scale-95"
                >
                  Verify Now
                </button>
              </div>
            )}

            {accountMode === 'guest' && (
              <div className="bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-800 text-white px-3 py-2 text-xs font-bold flex items-center justify-between gap-2 shadow-xs shrink-0 z-20">
                <div className="flex items-center gap-1.5 truncate">
                  <LogIn className="w-4 h-4 shrink-0 text-purple-300" />
                  <span className="truncate">Browsing as Guest. Sign in to activate live GPS beacon & travel buddy chat.</span>
                </div>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-2.5 py-1 rounded-lg bg-white text-purple-900 hover:bg-purple-100 font-black text-[11px] shrink-0 transition active:scale-95"
                >
                  Sign In
                </button>
              </div>
            )}

            {/* Scrollable Interior Container */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
              {/* TAB 1: SAFETY */}
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

              {/* TAB 2: EXPLORE / MAPS & ARTICLES */}
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

              {/* TAB 3: RIDES & STAYS */}
              {travelerTab === 'stays' && (
                <StaysScreen
                  onBookStay={handleBookStay}
                  theme={theme}
                />
              )}

              {/* TAB 4: COMMUNITY & TRAVEL BUDDIES */}
              {travelerTab === 'buddies' && (
                <BuddyFeedScreen
                  user={user}
                  onOpenVerification={() => setShowAu10tixModal(true)}
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

              {/* TAB 6: DEDICATED PREMIUM SUITE (Accessible inside mobile frame too!) */}
              {travelerTab === 'premium' && (
                <div className="p-3 sm:p-4">
                  <PremiumSuiteScreen
                    user={user}
                    onUpdateUser={setUser}
                    onOpenMap={() => setTravelerTab('map')}
                    theme={theme}
                  />
                </div>
              )}

              {/* SUB-SCREEN: OFFLINE EMERGENCY MODE */}
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

            {/* FIXED BOTTOM NAVIGATION BAR */}
            <nav
              className={`shrink-0 border-t px-2 py-2 flex items-center justify-around z-30 transition-colors ${
                isDark
                  ? 'bg-[#0b0518]/95 border-purple-900/40 backdrop-blur-md'
                  : 'bg-white/95 border-purple-100 shadow-md backdrop-blur-md'
              }`}
            >
              {[
                { id: 'safety', label: 'Safety', icon: Shield },
                { id: 'map', label: 'Explore', icon: MapPin },
                { id: 'stays', label: 'Stays', icon: Building2 },
                { id: 'buddies', label: 'Community', icon: Users },
                { id: 'ai', label: 'Serena', icon: Sparkles },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = travelerTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setTravelerTab(tab.id as any)}
                    className={`flex flex-col items-center gap-1 py-1 px-1.5 rounded-xl transition ${
                      isActive
                        ? tab.id === 'premium'
                          ? 'text-amber-500 font-extrabold'
                          : 'text-purple-600 dark:text-purple-300 font-extrabold'
                        : 'text-stone-400 hover:text-purple-600 font-medium'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isActive
                          ? tab.id === 'premium'
                            ? 'text-amber-500 stroke-[2.5]'
                            : 'text-purple-600 dark:text-purple-400 stroke-[2.5]'
                          : 'text-stone-400'
                      }`}
                    />
                    <span className="text-[10px] tracking-tight">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* VIEW 2: STANDALONE SEPARATE PREMIUM VERSION SCREEN */}
        {activeView === 'premium' && (
          <div className="w-full max-w-5xl">
            <PremiumSuiteScreen
              user={user}
              onUpdateUser={setUser}
              onOpenMap={() => {
                setActiveView('traveler');
                setTravelerTab('map');
              }}
              theme={theme}
              onBackToStandard={() => setActiveView('traveler')}
            />
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

      {/* PROFILE PAGE / MODAL */}
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
          setActiveView('premium');
        }}
        onOpenAu10tix={() => setShowAu10tixModal(true)}
      />

      {/* AU10TIX IDENTITY VERIFICATION MODAL */}
      <Au10tixVerificationModal
        isOpen={showAu10tixModal}
        onClose={() => setShowAu10tixModal(false)}
        userName={user.name}
        onCompleteVerification={handleAu10tixComplete}
        theme={theme}
      />

      {/* AUTH & SIGN IN MODAL FOR GUESTS */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSignInAsUser={(newUser) => {
          setUser(newUser);
          setAccountMode(newUser.isVerified ? 'verified' : 'unverified');
          triggerToast(`Signed in as ${newUser.name}`);
        }}
        onOpenAu10tix={() => setShowAu10tixModal(true)}
        theme={theme}
      />

      {/* SUBSCRIPTION MODAL */}
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
