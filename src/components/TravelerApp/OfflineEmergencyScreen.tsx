import React, { useState } from 'react';
import {
  WifiOff,
  Phone,
  Database,
  Search,
  Languages,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
} from 'lucide-react';
import { DualTranslation } from '../../types';
import { dualTranslationsDictionary } from '../../data/mockData';
import { apiService } from '../../services/api';

interface OfflineEmergencyScreenProps {
  currentCountry?: string;
  onSelectCountry?: (code: string) => void;
  onTriggerUpgradePrompt?: () => void;
  onBack?: () => void;
  theme: 'dark' | 'light';
}

export const OfflineEmergencyScreen: React.FC<OfflineEmergencyScreenProps> = ({
  onBack,
  theme,
}) => {
  const isDark = theme === 'dark';
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'danger' | 'medical' | 'washroom' | 'transport'>('all');

  // Custom Phrase Translator State (Accurate Sinhala & Tamil with NO voice button)
  const [customInputText, setCustomInputText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [customTranslations, setCustomTranslations] = useState<DualTranslation[]>([]);

  const filteredPhrases = dualTranslationsDictionary.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  const handleTranslateCustom = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customInputText.trim() || isTranslating) return;
    setIsTranslating(true);
    try {
      const res = await apiService.translateCustomPhrase(customInputText.trim());
      if (res.success && res.translation) {
        setCustomTranslations([res.translation, ...customTranslations]);
        setCustomInputText('');
      }
    } catch (e) {
      console.warn('Translate error:', e);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-3 sm:p-4 pb-20 select-none">
      {/* Back button if available */}
      {onBack && (
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-200 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-stone-500">Back to Safety Dashboard</span>
        </div>
      )}

      {/* TOP HEADER CARD: Offline Emergency Mode (Zero-Data) (Matching Screenshot 8) */}
      <div className={`rounded-2xl border p-4 shadow-md flex items-center justify-between ${
        isDark ? 'bg-[#180d33] border-purple-800/40 text-white' : 'bg-purple-950 border-purple-900 text-white'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-800/60 border border-purple-500/40 flex items-center justify-center shrink-0">
            <WifiOff className="w-4 h-4 text-purple-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-black text-sm sm:text-base text-white">
                Offline Emergency Mode
              </h2>
              <span className="text-xs text-purple-300 font-bold">(Zero-Data)</span>
            </div>
            <p className="text-[10px] text-purple-200/70 mt-0.5">
              100% accessible without cellular data or Wi-Fi
            </p>
          </div>
        </div>

        <div className="bg-purple-800/40 border border-purple-400/30 rounded-lg px-2 py-1 text-center shrink-0">
          <span className="text-[9px] font-mono font-bold text-purple-200 tracking-wider flex items-center gap-1">
            <Database className="w-2.5 h-2.5" /> SQLITE CACHED
          </span>
        </div>
      </div>

      {/* SECTION 1: DIRECT HOTLINES: SRI LANKA (Matching Screenshot 8) */}
      <div className={`rounded-2xl border p-4 shadow-sm ${
        isDark ? 'bg-[#150a28] border-purple-800/40 text-white' : 'bg-white border-purple-200 text-stone-900 shadow-xs'
      }`}>
        <div className="flex items-center justify-between border-b border-purple-900/30 pb-2 mb-3">
          <div className="flex items-center gap-1.5 text-purple-800 dark:text-purple-300 text-xs font-black uppercase tracking-wider">
            <Phone className="w-3.5 h-3.5" />
            <span>Direct Hotlines: Sri Lanka</span>
          </div>
          <span className="text-[10px] text-stone-600 dark:text-stone-400 font-bold">Tap to call</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* National Police */}
          <a
            href="tel:119"
            className={`p-3 rounded-xl border flex items-center justify-between transition ${
              isDark ? 'border-purple-900/30 bg-black/20 hover:bg-purple-950/40' : 'border-purple-200 bg-purple-50/50 hover:bg-purple-100'
            }`}
          >
            <div>
              <span className="text-[9px] uppercase tracking-wider text-stone-600 dark:text-stone-400 font-bold block">
                National Police
              </span>
              <span className="text-base font-black text-stone-900 dark:text-white">
                119
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-500 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
          </a>

          {/* Tourist Police */}
          <a
            href="tel:1912"
            className={`p-3 rounded-xl border flex items-center justify-between transition ${
              isDark ? 'border-purple-900/30 bg-black/20 hover:bg-purple-950/40' : 'border-purple-200 bg-purple-50/50 hover:bg-purple-100'
            }`}
          >
            <div>
              <span className="text-[9px] uppercase tracking-wider text-purple-700 dark:text-purple-400 font-bold block">
                Tourist Police
              </span>
              <span className="text-base font-black text-purple-700 dark:text-purple-300">
                1912
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-purple-600/20 text-purple-400 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
          </a>

          {/* Free EMS Ambulance */}
          <a
            href="tel:1990"
            className="p-3 rounded-xl border border-purple-900/30 bg-black/20 hover:bg-purple-950/40 flex items-center justify-between transition"
          >
            <div>
              <span className="text-[9px] uppercase tracking-wider text-stone-400 font-bold block">
                Free EMS Ambulance
              </span>
              <span className="text-xs font-black text-stone-900 dark:text-white block">
                1990 <span className="text-[9px] font-normal text-stone-400">(Suwa Seriya)</span>
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
          </a>

          {/* Women's Bureau */}
          <a
            href="tel:1938"
            className="p-3 rounded-xl border border-purple-900/30 bg-black/20 hover:bg-purple-950/40 flex items-center justify-between transition"
          >
            <div>
              <span className="text-[9px] uppercase tracking-wider text-stone-400 font-bold block">
                Women's Bureau
              </span>
              <span className="text-xs font-black text-stone-900 dark:text-white block">
                1938 <span className="text-[9px] font-normal text-stone-400">(National Committee)</span>
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-fuchsia-600/20 text-fuchsia-400 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
          </a>
        </div>
      </div>

      {/* SECTION 2: CUSTOM SAFETY TRANSLATOR (Matching Screenshot 8) */}
      <div className={`rounded-2xl border p-4 shadow-sm ${
        isDark ? 'bg-[#150a28] border-purple-800/40 text-white' : 'bg-white border-purple-200 text-stone-900 shadow-xs'
      }`}>
        <div className="flex items-center gap-2 mb-1 text-purple-800 dark:text-purple-300 font-black text-xs uppercase tracking-wider">
          <Languages className="w-4 h-4" />
          <span>Custom Safety Translator (Sinhala & Tamil)</span>
        </div>
        <p className="text-[11px] text-stone-600 dark:text-stone-300 mb-3 font-medium">
          Type any phrase to translate with accurate phonetics and native script.
        </p>

        {/* Translation Input & Button */}
        <form onSubmit={handleTranslateCustom} className="flex gap-2 mb-3">
          <input
            type="text"
            value={customInputText}
            onChange={(e) => setCustomInputText(e.target.value)}
            placeholder="Type custom medical or safety phrase..."
            className={`flex-1 p-2.5 rounded-xl border text-xs outline-none font-medium ${
              isDark ? 'bg-black/50 border-purple-800 text-white' : 'bg-purple-50/50 border-purple-200 text-stone-900'
            }`}
          />
          <button
            type="submit"
            disabled={isTranslating || !customInputText.trim()}
            className="bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-md disabled:opacity-50 transition"
          >
            {isTranslating ? 'Translating...' : 'Translate'}
          </button>
        </form>

        {/* Display Custom Translation Result (NO voice icon as requested) */}
        {customTranslations.length > 0 && (
          <div className="flex flex-col gap-2 mt-2">
            {customTranslations.map((tr, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-purple-950/40 border border-purple-700/50 text-white text-xs"
              >
                <div className="font-bold text-stone-900 dark:text-white mb-1.5 flex items-center justify-between">
                  <span>"{tr.english}"</span>
                  <span className="text-[9px] bg-purple-900 text-purple-200 px-1.5 py-0.2 rounded font-mono">
                    Translated
                  </span>
                </div>

                {/* Sinhala */}
                <div className="p-2 rounded-lg bg-black/40 border border-purple-900/40 mb-1.5">
                  <span className="text-[10px] text-purple-300 font-bold block">Sinhala:</span>
                  <p className="text-sm font-semibold text-white mt-0.5">{tr.sinhalaText}</p>
                  <p className="text-[10px] text-purple-200/80 italic mt-0.5 font-mono">{tr.sinhalaPhonetic}</p>
                </div>

                {/* Tamil */}
                <div className="p-2 rounded-lg bg-black/40 border border-purple-900/40">
                  <span className="text-[10px] text-purple-300 font-bold block">Tamil:</span>
                  <p className="text-sm font-semibold text-white mt-0.5">{tr.tamilText}</p>
                  <p className="text-[10px] text-purple-200/80 italic mt-0.5 font-mono">{tr.tamilPhonetic}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 3: EMERGENCY PHRASEBOOK (Matching Screenshot 8) */}
      <div className={`rounded-2xl border p-4 shadow-sm ${
        isDark ? 'bg-[#150a28] border-purple-800/40 text-white' : 'bg-white border-purple-200 text-stone-900 shadow-xs'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-black text-xs sm:text-sm text-stone-900 dark:text-white">
            EMERGENCY PHRASEBOOK (SINHALA & TAMIL)
          </h3>
          <span className="text-[10px] bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300 font-extrabold px-2 py-0.5 rounded-full border border-purple-300 dark:border-purple-800/40">
            {filteredPhrases.length} phrases
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar text-[11px] font-semibold mb-3">
          {[
            { id: 'all', label: 'All' },
            { id: 'danger', label: '🚨 Urgent / Police' },
            { id: 'medical', label: '🏥 Medical' },
            { id: 'washroom', label: '🌸 Period / Washroom' },
            { id: 'transport', label: '🛺 Transport / Night' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3 py-1 rounded-xl border shrink-0 transition ${
                selectedCategory === cat.id
                  ? 'bg-purple-700 text-white border-purple-500 font-bold'
                  : isDark
                  ? 'bg-black/30 border-purple-900/40 text-stone-300'
                  : 'bg-stone-100 border-stone-200 text-stone-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Phrase Cards (NO voice button as requested by user) */}
        <div className="flex flex-col gap-3">
          {filteredPhrases.map((phrase, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-purple-900/40 bg-black/30 text-white shadow-xs"
            >
              <h4 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-white mb-2">
                {phrase.english}
              </h4>

              {/* Sinhala Box */}
              <div className="p-2 rounded-lg bg-purple-950/30 border border-purple-900/40 mb-2">
                <span className="text-[10px] text-purple-400 font-bold block">Sinhala:</span>
                <p className="text-sm font-black text-white mt-0.5">{phrase.sinhalaText}</p>
                <p className="text-[10px] text-purple-200/80 italic mt-0.5 font-mono">{phrase.sinhalaPhonetic}</p>
              </div>

              {/* Tamil Box */}
              <div className="p-2 rounded-lg bg-purple-950/30 border border-purple-900/40">
                <span className="text-[10px] text-purple-400 font-bold block">Tamil:</span>
                <p className="text-sm font-black text-white mt-0.5">{phrase.tamilText}</p>
                <p className="text-[10px] text-purple-200/80 italic mt-0.5 font-mono">{phrase.tamilPhonetic}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
