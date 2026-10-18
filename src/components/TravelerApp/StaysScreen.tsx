import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  Star,
  MapPin,
  Lock,
  AlertTriangle,
  CreditCard,
  ChevronRight,
  Filter,
  CheckCircle,
} from 'lucide-react';
import { SafeStay } from '../../types';
import { mockSafeStays } from '../../data/mockData';

interface StaysScreenProps {
  onBookStay: (stay: SafeStay) => void;
  theme: 'dark' | 'light';
}

export const StaysScreen: React.FC<StaysScreenProps> = ({
  onBookStay,
  theme,
}) => {
  const isDark = theme === 'dark';
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStayForDetails, setSelectedStayForDetails] = useState<SafeStay | null>(null);

  const filteredStays = mockSafeStays.filter((stay) => {
    if (selectedCity !== 'all' && stay.city.toLowerCase() !== selectedCity.toLowerCase()) {
      return false;
    }
    if (selectedType !== 'all' && stay.type !== selectedType) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-4 pb-14 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header Banner */}
      <div className={`p-4 rounded-3xl border space-y-2.5 ${
        isDark ? 'bg-[#150f24] border-purple-900/40' : 'bg-white border-purple-100 shadow-sm'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-600/20 text-purple-600 dark:text-purple-300">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold tracking-tight">Verified Stays & Female Co-Living</h2>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                100% safety-audited hostels, boutique villas & dorms
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-bold">
            PINK SHIELD AUDITED
          </span>
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pt-1">
          <span className="text-[11px] text-stone-500 dark:text-stone-400 shrink-0">Destination:</span>
          {['all', 'Colombo', 'Mirissa', 'Kandy', 'Ella'].map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCity(c)}
              className={`px-2.5 py-1 rounded-xl shrink-0 font-semibold border transition ${
                selectedCity === c
                  ? 'bg-purple-700 text-white border-purple-600 shadow-xs'
                  : isDark
                  ? 'bg-stone-900 border-purple-900/30 text-stone-400'
                  : 'bg-purple-50 border-purple-100 text-purple-900'
              }`}
            >
              {c === 'all' ? 'All Sri Lanka' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Stays List */}
      <div className="space-y-3.5">
        {filteredStays.map((stay) => (
          <div
            key={stay.stayId}
            className={`rounded-3xl border overflow-hidden transition hover:shadow-lg ${
              isDark ? 'bg-[#150f24] border-purple-900/40' : 'bg-white border-purple-100 shadow-sm'
            }`}
          >
            {/* Image Banner */}
            <div className="relative h-44 w-full overflow-hidden">
              <img
                src={stay.images[0]}
                alt={stay.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute top-3 left-3 bg-purple-900/90 backdrop-blur-md border border-purple-400/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-purple-300" />
                Pink Shield Verified
              </div>

              <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-amber-300 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {stay.rating} ({stay.reviewsCount})
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[10px] bg-white/20 backdrop-blur-md px-1.5 py-0.2 rounded font-medium">
                  {stay.type}
                </span>
                <h3 className="text-sm sm:text-base font-bold leading-snug mt-0.5">{stay.name}</h3>
                <div className="text-[11px] text-purple-200 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-purple-300" />
                  <span>{stay.location}</span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-4 space-y-3">
              {/* Safety Amenities Checklist */}
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                  Verified Safety Amenities:
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[11px] text-stone-600 dark:text-stone-300">
                  {stay.safetyAmenities.slice(0, 4).map((amenity, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Unlit Area Warning if present */}
              {stay.unlitAreaWarning && (
                <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-600 dark:text-amber-300 flex items-start gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" />
                  <span><strong>Night Walking Alert:</strong> {stay.unlitAreaWarning}</span>
                </div>
              )}

              {/* Price & BNPL Breakdown */}
              <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
                isDark ? 'bg-stone-950/80 border-purple-900/30' : 'bg-purple-50/50 border-purple-100'
              }`}>
                <div>
                  <div className="text-[10px] text-stone-400">Nightly Rate</div>
                  <div className="font-extrabold text-sm font-mono text-purple-600 dark:text-purple-300">
                    LKR {stay.pricePerNightLKR.toLocaleString()}{' '}
                    <span className="text-[11px] text-stone-400 font-normal">(~${stay.priceUSD})</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-stone-400">Koko & Mintpay 3x</div>
                  <div className="font-bold font-mono text-emerald-600 dark:text-emerald-400 text-xs">
                    3 × LKR {stay.kokoMonthlyLKR.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => onBookStay(stay)}
                  className="flex-1 py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Reserve with 12% Platform Fee</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
