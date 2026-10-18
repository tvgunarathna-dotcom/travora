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
} from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  activeView: 'traveler' | 'partner' | 'architecture';
  onSelectView: (view: 'traveler' | 'partner' | 'architecture') => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  isOfflineSimulated: boolean;
  onToggleOffline: () => void;
  user: UserProfile;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenProfile: () => void;
  onOpenVerification: () => void;
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
}) => {
  const isDark = theme === 'dark';

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
      isDark
        ? 'bg-[#0f0a1c]/95 border-purple-900/40 text-stone-100'
        : 'bg-white/95 border-purple-100 text-stone-900 shadow-xs'
    } px-3 sm:px-4 py-2`}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        {/* Brand Logo & Compass Shield */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-800 via-purple-600 to-fuchsia-500 p-0.5 flex items-center justify-center shadow-md shadow-purple-900/20">
              <div className={`w-full h-full rounded-[10px] flex items-center justify-center relative ${
                isDark ? 'bg-[#0f0a1c]' : 'bg-white'
              }`}>
                <Shield className="w-4 h-4 text-purple-600 fill-purple-600/20" />
                <Compass className="w-2.5 h-2.5 text-purple-400 absolute" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-extrabold tracking-wider text-purple-600 dark:text-purple-300">
                  TRAVORA
                </span>
                <span className="text-[9px] bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30 px-1 py-0.2 rounded font-mono font-bold">
                  FEMALE SAFETY
                </span>
              </div>
              <p className="text-[10px] text-stone-500 dark:text-stone-400 -mt-0.5">
                AU10TIX Verified Community & Dual-Sided Safety
              </p>
            </div>
          </div>

          {/* Quick controls on mobile */}
          <div className="flex items-center gap-1.5 md:hidden">
            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className={`p-1.5 rounded-lg border text-xs transition ${
                isDark ? 'bg-stone-900 border-purple-900/40 text-amber-300' : 'bg-purple-50 border-purple-200 text-purple-700'
              }`}
              title="Toggle Dark/Light Mode"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Profile Avatar */}
            <button
              onClick={onOpenProfile}
              className="p-1 rounded-lg border border-purple-600/40 text-purple-600 dark:text-purple-300"
              title="My Profile"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-5 h-5 rounded-full object-cover"
              />
            </button>

            {/* Viewport switch */}
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

        {/* View Switcher: Traveler App vs Partner Portal vs Architecture */}
        <div className={`flex items-center gap-1 p-1 rounded-xl border text-xs w-full md:w-auto justify-center ${
          isDark ? 'bg-stone-900/90 border-purple-900/30' : 'bg-purple-50/80 border-purple-100'
        }`}>
          <button
            onClick={() => onSelectView('traveler')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
              activeView === 'traveler'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'text-stone-500 dark:text-stone-400 hover:text-purple-600'
            }`}
          >
            <span>👩 Traveler App</span>
          </button>

          <button
            onClick={() => onSelectView('partner')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
              activeView === 'partner'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'text-stone-500 dark:text-stone-400 hover:text-purple-600'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Partner Portal (12%)</span>
          </button>

          <button
            onClick={() => onSelectView('architecture')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
              activeView === 'architecture'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'text-stone-500 dark:text-stone-400 hover:text-purple-600'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Tech Specs & Schemas</span>
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

          {/* Verification Badge Indicator */}
          <button
            onClick={onOpenVerification}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition ${
              user.isVerified
                ? 'bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-500/40'
                : 'bg-rose-950/40 text-rose-400 border-rose-700/60'
            }`}
            title="Click to manage AU10TIX verification"
          >
            {user.isVerified ? (
              <>
                <UserCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span className="font-semibold">AU10TIX ID Verified ✓</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-rose-400" />
                <span className="font-semibold">Unverified (Click)</span>
              </>
            )}
          </button>

          {/* My Profile Icon */}
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
    </header>
  );
};
