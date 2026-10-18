import React, { useState, useEffect } from 'react';
import {
  Building2,
  TrendingUp,
  ShieldCheck,
  CheckCircle,
  Calendar,
  CreditCard,
  DollarSign,
  Clock,
  Car,
} from 'lucide-react';
import { Booking, PartnerStats } from '../../types';
import { apiService } from '../../services/api';

interface PartnerDashboardProps {
  theme?: 'dark' | 'light';
}

export const PartnerDashboard: React.FC<PartnerDashboardProps> = ({ theme = 'dark' }) => {
  const isDark = theme === 'dark';
  const [partnerStats, setPartnerStats] = useState<PartnerStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'hostel' | 'transport' | 'guide'>('all');

  useEffect(() => {
    loadPartnerData();
  }, []);

  const loadPartnerData = async () => {
    try {
      const res = await apiService.getPartnerStats();
      if (res.success) {
        setPartnerStats(res.metrics);
        setBookings(res.recentBookings);
      }
    } catch (e) {
      console.warn('Partner stats load fallback:', e);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filterType === 'all') return true;
    return b.serviceType === filterType;
  });

  return (
    <div className="space-y-4 pb-14 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Partner Identity Hero */}
      <div className={`p-5 rounded-3xl border space-y-3 ${
        isDark ? 'bg-[#150f24] border-purple-900/40' : 'bg-white border-purple-100 shadow-sm'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-700 to-fuchsia-600 text-white shadow-md">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold">Mirissa Surf Stay & HelaGo Fleet</h2>
                <span className="bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  PINK SHIELD PARTNER
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Partner ID: <span className="font-mono text-purple-600 dark:text-purple-300">prt_mirissa_surf_01</span> · Tier: Verified Host & Transport
              </p>
            </div>
          </div>

          <span className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 w-fit">
            <ShieldCheck className="w-3.5 h-3.5" />
            Safety Audit: 98.8%
          </span>
        </div>

        <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed border-t border-purple-900/20 dark:border-purple-900/40 pt-3">
          TRAVORA operates an automated <strong>12% platform commission split</strong> with direct payouts to host and driver accounts via weekly local bank settlement, supporting Koko & Mintpay BNPL checkouts.
        </p>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <div className={`p-4 rounded-2xl border space-y-1 ${
          isDark ? 'bg-[#150f24] border-purple-900/40' : 'bg-white border-purple-100 shadow-xs'
        }`}>
          <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
            Gross Bookings
          </div>
          <div className="text-lg font-black font-mono">
            LKR {partnerStats?.totalVolumeLKR.toLocaleString() || '40,000'}
          </div>
          <div className="text-[10px] text-emerald-500 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3" /> +18.4% this week
          </div>
        </div>

        <div className={`p-4 rounded-2xl border space-y-1 ${
          isDark ? 'bg-[#150f24] border-purple-900/40' : 'bg-white border-purple-100 shadow-xs'
        }`}>
          <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
            Net Partner Payout
          </div>
          <div className="text-lg font-black text-emerald-500 font-mono">
            LKR {partnerStats?.netPartnerEarningsLKR.toLocaleString() || '35,200'}
          </div>
          <div className="text-[10px] text-stone-400">88% direct payout</div>
        </div>

        <div className={`p-4 rounded-2xl border space-y-1 ${
          isDark ? 'bg-[#150f24] border-purple-900/40' : 'bg-white border-purple-100 shadow-xs'
        }`}>
          <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
            TRAVORA Split (12%)
          </div>
          <div className="text-lg font-black text-purple-600 dark:text-purple-300 font-mono">
            LKR {partnerStats?.commissionPaidToTravoraLKR.toLocaleString() || '4,800'}
          </div>
          <div className="text-[10px] text-stone-400">Auto-deducted platform fee</div>
        </div>

        <div className={`p-4 rounded-2xl border space-y-1 ${
          isDark ? 'bg-[#150f24] border-purple-900/40' : 'bg-white border-purple-100 shadow-xs'
        }`}>
          <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
            Guest Rating
          </div>
          <div className="text-lg font-black text-amber-500 font-mono">
            4.96 ★
          </div>
          <div className="text-[10px] text-stone-400">318 verified solo reviews</div>
        </div>
      </div>

      {/* Bookings & 12% Split Table */}
      <div className={`p-4 rounded-3xl border space-y-3.5 ${
        isDark ? 'bg-[#150f24] border-purple-900/40' : 'bg-white border-purple-100 shadow-sm'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Live Bookings & Commission Settlement
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Real-time payment split on Koko, Mintpay, and Card bookings
            </p>
          </div>

          <div className="flex items-center gap-1 text-xs">
            {(['all', 'hostel', 'transport', 'guide'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 rounded-xl font-bold transition capitalize ${
                  filterType === type
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {filteredBookings.map((b) => (
            <div
              key={b.bookingId}
              className={`p-3 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs ${
                isDark ? 'bg-stone-950/70 border-purple-900/30' : 'bg-purple-50/50 border-purple-100'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{b.userName}</span>
                  <span className="font-mono text-[10px] text-stone-400">({b.bookingId})</span>
                  <span className="bg-purple-500/20 text-purple-600 dark:text-purple-300 text-[9px] px-1.5 py-0.2 rounded font-bold uppercase">
                    {b.serviceType}
                  </span>
                </div>
                <div className="text-stone-500 dark:text-stone-400 text-[11px] mt-0.5">
                  {b.roomOrSeat} · Date: <span className="font-mono">{b.checkInDate}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-right">
                <div>
                  <div className="font-bold font-mono">
                    LKR {b.totalAmount.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-stone-400">
                    Paid via <span className="font-bold text-purple-600 dark:text-purple-300 uppercase">{b.paymentMethod.replace('_', ' ')}</span>
                  </div>
                </div>

                <div className="border-l border-purple-900/30 pl-3 text-left">
                  <div className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">
                    12% Fee: -LKR {b.commissionEarned.toLocaleString()}
                  </div>
                  <div className="text-xs font-bold text-emerald-500 font-mono">
                    Net: LKR {b.partnerPayout.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
