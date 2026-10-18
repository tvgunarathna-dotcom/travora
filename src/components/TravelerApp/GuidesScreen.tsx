import React, { useState } from 'react';
import {
  Compass,
  Star,
  MapPin,
  Globe,
  ShieldCheck,
  CheckCircle,
  Calendar,
  Lock,
  MessageCircle,
} from 'lucide-react';
import { TravelGuide } from '../../types';
import { mockTravelGuides } from '../../data/mockData';

interface GuidesScreenProps {
  onBookGuide: (guide: TravelGuide) => void;
  onChatWithGuide: (guide: TravelGuide) => void;
  theme: 'dark' | 'light';
}

export const GuidesScreen: React.FC<GuidesScreenProps> = ({
  onBookGuide,
  onChatWithGuide,
  theme,
}) => {
  const isDark = theme === 'dark';
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');

  const guides = mockTravelGuides;

  return (
    <div className="space-y-4 pb-14 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header Banner */}
      <div className={`p-4 rounded-3xl border space-y-2 ${
        isDark ? 'bg-[#150f24] border-purple-900/40' : 'bg-white border-purple-100 shadow-sm'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-600/20 text-purple-600 dark:text-purple-300">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold tracking-tight">Verified Female Travel Guides</h2>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Licensed, background-checked local guides for solo women
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-bold">
            SLTDA LICENSED
          </span>
        </div>

        <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
          Navigate markets, sacred temples, and isolated hiking ridges with safety-vetted female escorts who speak fluent local languages.
        </p>
      </div>

      {/* Guides Grid */}
      <div className="space-y-3.5">
        {guides.map((guide) => (
          <div
            key={guide.guideId}
            className={`p-4 rounded-3xl border space-y-3 transition hover:shadow-lg ${
              isDark ? 'bg-[#150f24] border-purple-900/40' : 'bg-white border-purple-100 shadow-sm'
            }`}
          >
            {/* Guide Head Info */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={guide.avatar}
                    alt={guide.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-600 shadow-md"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-purple-700 text-white p-0.5 rounded-full border border-white">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm sm:text-base font-bold">{guide.name}</h3>
                    <span className="text-amber-500 font-bold text-xs flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-500" /> {guide.rating}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3 h-3 text-purple-400" />
                    <span>{guide.city}</span>
                    <span>·</span>
                    <span className="font-mono text-purple-600 dark:text-purple-300">{guide.licenseNumber}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-mono font-extrabold text-purple-600 dark:text-purple-300">
                  LKR {guide.dailyRateLKR.toLocaleString()}/day
                </div>
                <div className="text-[10px] text-stone-400 font-mono">~${guide.dailyRateUSD}/day</div>
              </div>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed bg-purple-500/5 dark:bg-stone-950/60 p-3 rounded-2xl border border-purple-900/20">
              "{guide.bio}"
            </p>

            {/* Languages & Specialties */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400">
                <Globe className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Languages: <strong>{guide.languages.join(', ')}</strong></span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {guide.specialties.map((spec, i) => (
                  <span
                    key={i}
                    className={`text-[10px] px-2 py-0.5 rounded-lg border font-medium ${
                      isDark ? 'bg-stone-900 border-purple-900/40 text-stone-300' : 'bg-purple-50 border-purple-200 text-purple-900'
                    }`}
                  >
                    ✓ {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1 border-t border-purple-900/10 dark:border-purple-900/30">
              <button
                onClick={() => onChatWithGuide(guide)}
                className={`px-3 py-2.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 ${
                  isDark ? 'border-purple-800 text-purple-300 hover:bg-purple-950/40' : 'border-purple-200 text-purple-700 hover:bg-purple-50'
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Message</span>
              </button>
              <button
                onClick={() => onBookGuide(guide)}
                className="flex-1 py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Book Escort Guide (12% Platform Fee)</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
