import React from 'react';
import {
  Shield,
  Compass,
  Smartphone,
  Maximize2,
  Wifi,
  WifiOff,
  UserCheck,
  Building2,
  Code2,
  Sun,
  Moon,
  User,
  Lock,
  Sparkles,
  AlertTriangle,
  LogIn,
} from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  activeView: 'traveler' | 'premium' | 'architecture';
  onSelectView: (view: 'traveler' | 'premium' | 'architecture') => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  isOfflineSimulated: boolean;
  onToggleOffline: () => void;
  user: UserProfile;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenProfile: () => void;
  onOpenVerification: () => void;
  onOpenAuth: () => void;
  accountMode: 'verified' | 'unverified' | 'guest';
  onSetAccountMode: (mode: 'verified' | 'unverified' | 'guest') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onSelectView,
  isMobileFrame,
  onToggleMobileFrame,
  isOfflineSimulated,
  onToggleOffline,
  user,
  theme,
  onToggleTheme,
  onOpenProfile,
  onOpenVerification,
  onOpenAuth,
  accountMode,
  onSetAccountMode,
}) => {
  const isDark = theme === 'dark';
  const isGuest = accountMode === 'guest';

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
        isDark
          ? 'bg-[#0f0a1c]/95 border-purple-900/40 text-stone-100'
          : 'bg-white/95 border-purple-200 text-stone-900 shadow-xs'
      } px-3 sm:px-4 py-2`}
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-2">
        {/* Upper Bar: Brand, Views & Actions */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-2.5">
          {/* Brand Logo & Compass Shield */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-2">
              <img
                src="/assets/aistudio/TRAVORA-Compass-Transparent_cd89c439.png"
                alt="TRAVORA Compass Logo"
                className="w-9 h-9 sm:w-10 sm:h-10 object-contain drop-shadow-sm shrink-0"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm sm:text-base font-extrabold tracking-wider text-purple-800 dark:text-purple-300">
                    TRAVORA
                  </span>
                  <span className="text-[9px] bg-purple-100 dark:bg-purple-500/15 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-500/30 px-1 py-0.2 rounded font-mono font-black">
                    FEMALE SAFETY
                  </span>
                </div>
                <p className="text-[10px] text-stone-600 dark:text-stone-300 font-medium -mt-0.5">
                  AU10TIX Verified Solo Travel Network
                </p>
              </div>
            </div>

            {/* Quick controls on mobile */}
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                onClick={onToggleTheme}
                className={`p-1.5 rounded-lg border text-xs transition ${
                  isDark ? 'bg-stone-900 border-purple-900/40 text-amber-300' : 'bg-purple-50 border-purple-200 text-purple-700'
                }`}
                title="Toggle Dark/Light Mode"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {isGuest ? (
                <button
                  onClick={onOpenAuth}
                  className="px-2 py-1 rounded-lg bg-purple-700 text-white text-[11px] font-bold"
                >
                  Sign In
                </button>
              ) : (
                <button
                  onClick={onOpenProfile}
                  className="p-1 rounded-lg border border-purple-600/40 text-purple-600 dark:text-purple-300 relative"
                  title="My Profile"
                >
                  <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full object-cover" />
                  {user.isVerified && (
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
                  )}
                </button>
              )}

              <button
                onClick={onToggleMobileFrame}
                className={`p-1.5 rounded-lg border ${
                  isDark ? 'bg-stone-900 border-stone-800 text-stone-300' : 'bg-stone-100 border-stone-200 text-stone-700'
                }`}
              >
                {isMobileFrame ? <Maximize2 className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* View Switcher: Standard Traveler App, 👑 Premium Version & Tech Specs */}
          <div
            className={`flex items-center gap-1 p-1 rounded-xl border text-xs w-full md:w-auto justify-center ${
              isDark ? 'bg-stone-900/90 border-purple-900/30' : 'bg-purple-50/80 border-purple-200'
            }`}
          >
            <button
              onClick={() => onSelectView('traveler')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
                activeView === 'traveler'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'text-stone-700 dark:text-stone-300 hover:text-purple-700'
              }`}
            >
              <span>👩 Solo Traveler App</span>
            </button>

            {/* SEPARATE PREMIUM VERSION BUTTON */}
            <button
              onClick={() => onSelectView('premium')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
                activeView === 'premium'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-black shadow-md'
                  : 'text-amber-600 dark:text-amber-300 hover:text-amber-500'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>👑 Premium Edition</span>
            </button>

            <button
              onClick={() => onSelectView('architecture')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
                activeView === 'architecture'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'text-stone-700 dark:text-stone-300 hover:text-purple-700'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Specs</span>
            </button>
          </div>

          {/* Desktop Controls (Right side) */}
          <div className="hidden md:flex items-center gap-2">
            {/* Offline Mode Simulator Toggle */}
            <button
              onClick={onToggleOffline}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition ${
                isOfflineSimulated
                  ? 'bg-amber-500/20 text-amber-500 dark:text-amber-300 border-amber-500/40 font-bold'
                  : isDark
                  ? 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                  : 'bg-stone-100 border-stone-200 text-stone-600 hover:text-stone-900'
              }`}
              title="Toggle offline simulated mode to test zero-data resilience"
            >
              {isOfflineSimulated ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5 text-emerald-500" />}
              <span>{isOfflineSimulated ? 'Offline Sim' : 'Cloud Online'}</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-lg border text-xs transition ${
                isDark
                  ? 'bg-stone-900 border-purple-900/40 text-amber-300 hover:text-amber-200'
                  : 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* Verification / Auth Badge */}
            {isGuest ? (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-xs transition"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In / Register</span>
              </button>
            ) : (
              <button
                onClick={user.isVerified ? onOpenProfile : onOpenVerification}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition ${
                  user.isVerified
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-400 font-extrabold shadow-xs'
                    : 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-500 font-extrabold animate-pulse'
                }`}
                title={user.isVerified ? 'AU10TIX Verified Identity' : 'Click to verify with AU10TIX'}
              >
                {user.isVerified ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>AU10TIX Verified ✓</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Verify with AU10TIX</span>
                  </>
                )}
              </button>
            )}

            {/* My Profile Icon */}
            {!isGuest && (
              <button
                onClick={onOpenProfile}
                className={`flex items-center gap-2 p-1.5 pl-2 rounded-lg border text-xs font-semibold transition ${
                  isDark
                    ? 'bg-stone-900 border-purple-900/40 text-stone-200 hover:border-purple-600'
                    : 'bg-purple-50 border-purple-200 text-purple-900 hover:bg-purple-100'
                }`}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-5 h-5 rounded-full object-cover border border-purple-500"
                />
                <span>Profile</span>
              </button>
            )}

            {/* Mobile Shell Switcher */}
            <button
              onClick={onToggleMobileFrame}
              className={`p-2 rounded-lg border transition ${
                isDark
                  ? 'bg-stone-900 border-stone-800 text-stone-300 hover:text-white'
                  : 'bg-stone-100 border-stone-200 text-stone-700 hover:text-stone-900'
              }`}
              title={isMobileFrame ? 'Expand to Full View' : 'Constrain to Mobile Viewport'}
            >
              {isMobileFrame ? <Maximize2 className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Lower Quick-Switch Persona Bar: Test all 3 requested user states in 1 click! */}
        <div
          className={`flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 rounded-xl border text-[11px] font-bold ${
            isDark ? 'bg-black/30 border-purple-900/30' : 'bg-purple-50/50 border-purple-200'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span className="text-stone-500 dark:text-purple-300/80 font-medium">Test Persona:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onSetAccountMode('verified')}
                className={`px-2.5 py-0.5 rounded-md transition ${
                  accountMode === 'verified'
                    ? 'bg-emerald-600 text-white font-extrabold shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                🟢 Verified (Piyumi)
              </button>
              <button
                onClick={() => onSetAccountMode('unverified')}
                className={`px-2.5 py-0.5 rounded-md transition ${
                  accountMode === 'unverified'
                    ? 'bg-amber-500 text-stone-950 font-extrabold shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                🟡 Unverified (AU10TIX Prompt)
              </button>
              <button
                onClick={() => onSetAccountMode('guest')}
                className={`px-2.5 py-0.5 rounded-md transition ${
                  accountMode === 'guest'
                    ? 'bg-purple-700 text-white font-extrabold shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                ⚪ Guest (Not Signed In)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-purple-700 dark:text-purple-300">
            {accountMode === 'verified' && <span>✓ Full Safety & Buddy Chat Active</span>}
            {accountMode === 'unverified' && <span>⚠️ Needs AU10TIX Document & Liveness Scan</span>}
            {accountMode === 'guest' && <span>🔒 Guest Mode — Sign in to unlock full suite</span>}
          </div>
        </div>
      </div>
    </header>
  );
};
