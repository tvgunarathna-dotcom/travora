import React, { useState } from 'react';
import {
  User,
  Shield,
  ShieldCheck,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle,
  X,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { initialCurrentUser } from '../../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignInAsUser: (user: UserProfile) => void;
  onOpenAu10tix: () => void;
  theme: 'dark' | 'light';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSignInAsUser,
  onOpenAu10tix,
  theme,
}) => {
  const isDark = theme === 'dark';
  const [tab, setTab] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleQuickSignInPiyumi = () => {
    onSignInAsUser(initialCurrentUser);
    onClose();
  };

  const handleSignInUnverified = () => {
    const unverifiedUser: UserProfile = {
      ...initialCurrentUser,
      id: 'usr_unverified_traveler',
      name: name.trim() || 'New Solo Traveler',
      email: email.trim() || 'traveler@travora.travel',
      isVerified: false,
      verificationProvider: undefined,
      verificationDate: undefined,
      pinkShieldBadgeHash: undefined,
    };
    onSignInAsUser(unverifiedUser);
    onClose();
    // Prompt to verify immediately
    setTimeout(() => {
      onOpenAu10tix();
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSignInUnverified();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        className={`w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border transition-all ${
          isDark ? 'bg-[#150a28] border-purple-500/50 text-white' : 'bg-white border-purple-200 text-stone-900'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="/assets/aistudio/TRAVORA-Compass-Transparent_cd89c439.png"
              alt="Travora Logo"
              className="w-8 h-8 object-contain shrink-0"
            />
            <div>
              <h3 className="font-black text-sm text-white">Travora Account</h3>
              <p className="text-[10px] text-purple-200">Female Solo Traveler Safety Network</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-purple-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col gap-4 text-xs">
          {/* Quick Demo Sign In Cards */}
          <div className="flex flex-col gap-2">
            <span className="font-extrabold text-[11px] text-stone-600 dark:text-purple-300 uppercase tracking-wider">
              1-Click Fast Sign In
            </span>

            {/* Piyumi Anuradha (Verified) */}
            <button
              onClick={handleQuickSignInPiyumi}
              className={`p-3 rounded-2xl border text-left flex items-center justify-between transition ${
                isDark
                  ? 'bg-purple-950/40 border-purple-700/60 hover:bg-purple-900/50'
                  : 'bg-purple-50 border-purple-300 hover:bg-purple-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <img
                  src={initialCurrentUser.avatar}
                  alt="Piyumi"
                  className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xs text-stone-900 dark:text-white">Piyumi Anuradha</span>
                    <span className="text-[9px] bg-emerald-600 text-white font-extrabold px-1.5 py-0.2 rounded-full">
                      VERIFIED ✓
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-600 dark:text-purple-300">AU10TIX ID Verified • Kandy, LK</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-purple-600 dark:text-purple-300" />
            </button>

            {/* Unverified Traveler (Prompts AU10TIX) */}
            <button
              onClick={handleSignInUnverified}
              className={`p-3 rounded-2xl border text-left flex items-center justify-between transition ${
                isDark
                  ? 'bg-black/30 border-amber-800/50 hover:bg-black/50'
                  : 'bg-amber-50/70 border-amber-300 hover:bg-amber-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-500">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xs text-stone-900 dark:text-white">Unverified Traveler</span>
                    <span className="text-[9px] bg-amber-500 text-stone-950 font-extrabold px-1.5 py-0.2 rounded-full">
                      NEEDS AU10TIX
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-600 dark:text-amber-300">Prompts AU10TIX verification immediately</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-500" />
            </button>
          </div>

          <div className="flex items-center gap-2 my-1">
            <div className="flex-1 h-px bg-purple-900/30 dark:bg-purple-900/50" />
            <span className="text-[10px] text-stone-400 font-bold">OR CUSTOM LOGIN</span>
            <div className="flex-1 h-px bg-purple-900/30 dark:bg-purple-900/50" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {tab === 'register' && (
              <div>
                <label className="text-[11px] font-bold text-stone-700 dark:text-purple-300 block mb-1">
                  Full Legal Name (as per Passport/NIC)
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Piyumi Anuradha"
                  className={`w-full p-2.5 rounded-xl border outline-none font-medium ${
                    isDark ? 'bg-black/40 border-purple-800 text-white' : 'bg-purple-50/50 border-purple-200 text-stone-900'
                  }`}
                />
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold text-stone-700 dark:text-purple-300 block mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className={`w-full p-2.5 pl-8 rounded-xl border outline-none font-medium ${
                    isDark ? 'bg-black/40 border-purple-800 text-white' : 'bg-purple-50/50 border-purple-200 text-stone-900'
                  }`}
                />
                <Mail className="w-4 h-4 text-stone-400 absolute left-2.5 top-3" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-stone-700 dark:text-purple-300 block mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full p-2.5 pl-8 rounded-xl border outline-none font-medium ${
                    isDark ? 'bg-black/40 border-purple-800 text-white' : 'bg-purple-50/50 border-purple-200 text-stone-900'
                  }`}
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-2.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs shadow-md transition active:scale-98 mt-1"
            >
              {tab === 'signin' ? 'Sign In & Access Safety Network' : 'Create Account & Verify with AU10TIX'}
            </button>
          </form>

          {/* Toggle Tab */}
          <div className="text-center text-[11px]">
            {tab === 'signin' ? (
              <p className="text-stone-600 dark:text-purple-300">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setTab('register')}
                  className="font-black text-purple-700 dark:text-purple-200 underline"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p className="text-stone-600 dark:text-purple-300">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setTab('signin')}
                  className="font-black text-purple-700 dark:text-purple-200 underline"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
