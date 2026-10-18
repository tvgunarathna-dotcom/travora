import React, { useState } from 'react';
import {
  WifiOff,
  Phone,
  Volume2,
  AlertTriangle,
  HeartPulse,
  Compass,
  Sparkles,
  Download,
  CheckCircle,
  Globe,
  Share2,
  Languages,
  Send,
  Lock,
} from 'lucide-react';
import { EmergencyHotlineData, DualTranslation } from '../../types';
import { fallbackHotlines, dualTranslationsDictionary } from '../../data/mockData';
import { soundEffects } from '../../services/soundEffects';
import { apiService } from '../../services/api';

interface OfflineEmergencyScreenProps {
  currentCountry: string;
  onSelectCountry: (code: string) => void;
  onTriggerUpgradePrompt: () => void;
  theme: 'dark' | 'light';
}

export const OfflineEmergencyScreen: React.FC<OfflineEmergencyScreenProps> = ({
  currentCountry,
  onSelectCountry,
  onTriggerUpgradePrompt,
  theme,
}) => {
  const isDark = theme === 'dark';
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'danger' | 'medical' | 'general' | 'directions'>('all');
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);

  // Custom Phrase Translator State (Sinhala & Tamil)
  const [customInputText, setCustomInputText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [customTranslations, setCustomTranslations] = useState<DualTranslation[]>([]);

  const hotline: EmergencyHotlineData = fallbackHotlines[currentCountry] || fallbackHotlines['LK'];

  const filteredPhrases = dualTranslationsDictionary.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  const handleSpeak = (text: string, key: string) => {
    setSpeakingKey(key);
    soundEffects.speakPhrase(text, 'en');
    setTimeout(() => {
      setSpeakingKey(null);
    }, 2000);
  };

  const handleTranslateCustom = async () => {
    if (!customInputText.trim() || isTranslating) return;
    setIsTranslating(true);
    try {
      const res = await apiService.translateCustomPhrase(customInputText);
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
    <div className="space-y-4 pb-14 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Offline Status & Download Trigger */}
      <div className={`p-4 rounded-3xl border space-y-3 ${
        isDark ? 'bg-[#150f24] border-purple-900/40' : 'bg-white border-purple-100 shadow-sm'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-600/20 text-purple-600 dark:text-purple-300">
              <WifiOff className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold tracking-tight">
                Offline Emergency Mode (Zero-Data)
              </h2>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                100% accessible without cellular data or Wi-Fi
              </p>
            </div>
          </div>

          <span className="text-[10px] bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-bold">
            SQLITE CACHED
          </span>
        </div>

        {/* Offline Vector Map Download Trigger (Freemium Gated) */}
        <div className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
          isDark ? 'bg-stone-950/80 border-purple-900/40' : 'bg-purple-50/60 border-purple-100'
        }`}>
          <div>
            <div className="font-bold text-xs flex items-center gap-1.5">
              <Download className="w-4 h-4 text-purple-500" />
              Download Offline Vector Map (Sri Lanka)
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              High-res offline GPS navigation & safe zone overlays (140 MB)
            </p>
          </div>

          <button
            onClick={onTriggerUpgradePrompt}
            className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white text-[11px] font-bold shadow-xs transition"
          >
            <Lock className="w-3 h-3" />
            <span>Download (Premium)</span>
          </button>
        </div>

        {/* Country Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pt-1">
          <span className="text-[11px] text-stone-500 dark:text-stone-400 shrink-0">Hotline Country:</span>
          {Object.entries(fallbackHotlines).map(([code, data]) => (
            <button
              key={code}
              onClick={() => onSelectCountry(code)}
              className={`px-2.5 py-1 rounded-xl shrink-0 font-semibold border transition ${
                currentCountry === code
                  ? 'bg-purple-700 text-white border-purple-600 shadow-xs'
                  : isDark
                  ? 'bg-stone-900 border-purple-900/30 text-stone-400'
                  : 'bg-purple-50 border-purple-100 text-purple-900'
              }`}
            >
              {data.country.split(' ')[0]} ({code})
            </button>
          ))}
        </div>
      </div>

      {/* Emergency Hotlines Directory */}
      <div className={`p-4 rounded-3xl border space-y-3 ${
        isDark ? 'bg-[#150f24] border-purple-900/40' : 'bg-white border-purple-100 shadow-sm'
      }`}>
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
            <Phone className="w-4 h-4" />
            Direct Hotlines: {hotline.country}
          </h3>
          <span className="text-[11px] text-stone-400">Tap to call</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <a
            href={`tel:${hotline.police.split(' ')[0]}`}
            className={`p-3 rounded-2xl border flex items-center justify-between ${
              isDark ? 'bg-stone-950 border-stone-800' : 'bg-purple-50/40 border-purple-100'
            }`}
          >
            <div>
              <div className="text-[10px] text-stone-400 uppercase font-semibold">National Police</div>
              <div className="text-base font-black font-mono">{hotline.police}</div>
            </div>
            <Phone className="w-4 h-4 text-blue-500" />
          </a>

          <a
            href={`tel:${hotline.touristPolice.split(' ')[0]}`}
            className={`p-3 rounded-2xl border flex items-center justify-between ${
              isDark ? 'bg-stone-950 border-purple-900/40' : 'bg-purple-50/40 border-purple-200'
            }`}
          >
            <div>
              <div className="text-[10px] text-purple-600 dark:text-purple-400 uppercase font-semibold">Tourist Police</div>
              <div className="text-base font-black font-mono text-purple-600 dark:text-purple-300">{hotline.touristPolice}</div>
            </div>
            <Phone className="w-4 h-4 text-purple-500" />
          </a>

          <a
            href={`tel:${hotline.ambulance.split(' ')[0]}`}
            className={`p-3 rounded-2xl border flex items-center justify-between ${
              isDark ? 'bg-stone-950 border-stone-800' : 'bg-purple-50/40 border-purple-100'
            }`}
          >
            <div>
              <div className="text-[10px] text-stone-400 uppercase font-semibold">Free EMS Ambulance</div>
              <div className="text-xs font-bold font-mono text-emerald-500 truncate max-w-[100px]">
                {hotline.ambulance}
              </div>
            </div>
            <HeartPulse className="w-4 h-4 text-emerald-500 shrink-0" />
          </a>

          <a
            href={`tel:${hotline.womenHelpline.split(' ')[0]}`}
            className={`p-3 rounded-2xl border flex items-center justify-between ${
              isDark ? 'bg-stone-950 border-stone-800' : 'bg-purple-50/40 border-purple-100'
            }`}
          >
            <div>
              <div className="text-[10px] text-stone-400 uppercase font-semibold">Women's Bureau</div>
              <div className="text-xs font-bold font-mono text-purple-500 truncate max-w-[100px]">
                {hotline.womenHelpline}
              </div>
            </div>
            <Phone className="w-4 h-4 text-purple-500 shrink-0" />
          </a>
        </div>
      </div>

      {/* CUSTOM TRANSLATOR TOOL (SINHALA & TAMIL) */}
      <div className={`p-4 rounded-3xl border space-y-3 ${
        isDark ? 'bg-[#150f24] border-purple-900/40' : 'bg-white border-purple-100 shadow-sm'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
              <Languages className="w-4 h-4" />
              Custom Safety Translator (Sinhala & Tamil)
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Type any phrase to translate with phonetics & audio
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={customInputText}
            onChange={(e) => setCustomInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTranslateCustom()}
            placeholder="Type custom medical or safety phrase in English..."
            className={`flex-1 rounded-2xl px-3.5 py-2.5 text-xs border focus:outline-none focus:border-purple-600 ${
              isDark ? 'bg-stone-950 border-purple-900/40 text-stone-100' : 'bg-purple-50 border-purple-200 text-stone-900'
            }`}
          />
          <button
            onClick={handleTranslateCustom}
            disabled={!customInputText.trim() || isTranslating}
            className="px-4 py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs shadow-xs disabled:opacity-50"
          >
            {isTranslating ? 'Translating...' : 'Translate'}
          </button>
        </div>

        {/* Custom translated cards */}
        {customTranslations.map((item, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-2xl border space-y-2 text-xs ${
              isDark ? 'bg-stone-950 border-purple-900/50' : 'bg-purple-50 border-purple-200'
            }`}
          >
            <div className="font-bold text-xs text-purple-600 dark:text-purple-300">"{item.english}"</div>

            {/* Sinhala */}
            <div className="flex items-start justify-between gap-2 p-2 rounded-xl bg-purple-600/10 border border-purple-500/20">
              <div>
                <span className="text-[10px] text-purple-500 font-bold block">Sinhala:</span>
                <div className="text-sm font-semibold">{item.sinhalaText}</div>
                <div className="text-[11px] font-mono text-amber-500 dark:text-amber-300">🗣️ "{item.sinhalaPhonetic}"</div>
              </div>
              <button
                onClick={() => handleSpeak(item.sinhalaPhonetic, `custom_sin_${idx}`)}
                className="p-1.5 rounded-lg bg-purple-600 text-white"
                title="Speak Sinhala"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tamil */}
            <div className="flex items-start justify-between gap-2 p-2 rounded-xl bg-blue-600/10 border border-blue-500/20">
              <div>
                <span className="text-[10px] text-blue-500 font-bold block">Tamil:</span>
                <div className="text-sm font-semibold">{item.tamilText}</div>
                <div className="text-[11px] font-mono text-cyan-500 dark:text-cyan-300">🗣️ "{item.tamilPhonetic}"</div>
              </div>
              <button
                onClick={() => handleSpeak(item.tamilPhonetic, `custom_tam_${idx}`)}
                className="p-1.5 rounded-lg bg-blue-600 text-white"
                title="Speak Tamil"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PRE-TRANSLATED EMERGENCY PHRASEBOOK */}
      <div className={`p-4 rounded-3xl border space-y-3 ${
        isDark ? 'bg-[#150f24] border-purple-900/40' : 'bg-white border-purple-100 shadow-sm'
      }`}>
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            Emergency Phrasebook (Sinhala & Tamil)
          </h3>
          <span className="text-xs text-stone-400">{filteredPhrases.length} phrases</span>
        </div>

        {/* Phrase Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-[11px]">
          {[
            { id: 'all', label: 'All' },
            { id: 'danger', label: '🚨 Urgent / Police' },
            { id: 'medical', label: '🏥 Medical' },
            { id: 'general', label: '🌸 Period / Washroom' },
            { id: 'directions', label: '🧭 Directions' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-2.5 py-1 rounded-xl shrink-0 font-semibold transition ${
                selectedCategory === cat.id
                  ? 'bg-purple-700 text-white shadow-xs'
                  : isDark
                  ? 'bg-stone-900 border-purple-900/30 text-stone-400'
                  : 'bg-purple-50 border-purple-100 text-purple-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* List of Phrases */}
        <div className="space-y-3">
          {filteredPhrases.map((phrase, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border space-y-2 text-xs ${
                isDark ? 'bg-stone-950/80 border-purple-900/30' : 'bg-purple-50/40 border-purple-100'
              }`}
            >
              <div className="font-bold text-stone-900 dark:text-white leading-snug">
                {phrase.english}
              </div>

              {/* Sinhala */}
              <div className="flex items-start justify-between gap-2 p-2 rounded-xl bg-purple-600/10 border border-purple-500/20">
                <div>
                  <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold block">Sinhala:</span>
                  <div className="text-sm font-semibold text-stone-800 dark:text-stone-200">{phrase.sinhalaText}</div>
                  <div className="text-[11px] font-mono text-amber-600 dark:text-amber-300">🗣️ "{phrase.sinhalaPhonetic}"</div>
                </div>
                <button
                  onClick={() => handleSpeak(phrase.sinhalaPhonetic, `p_sin_${idx}`)}
                  className="p-1.5 rounded-lg bg-purple-600 text-white shrink-0 hover:bg-purple-500"
                  title="Speak Sinhala"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Tamil */}
              <div className="flex items-start justify-between gap-2 p-2 rounded-xl bg-blue-600/10 border border-blue-500/20">
                <div>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold block">Tamil:</span>
                  <div className="text-sm font-semibold text-stone-800 dark:text-stone-200">{phrase.tamilText}</div>
                  <div className="text-[11px] font-mono text-cyan-600 dark:text-cyan-300">🗣️ "{phrase.tamilPhonetic}"</div>
                </div>
                <button
                  onClick={() => handleSpeak(phrase.tamilPhonetic, `p_tam_${idx}`)}
                  className="p-1.5 rounded-lg bg-blue-600 text-white shrink-0 hover:bg-blue-500"
                  title="Speak Tamil"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
