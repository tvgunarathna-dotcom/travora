import React, { useState } from 'react';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  X,
  Lock,
  ArrowRight,
  Download,
  Percent,
  Phone,
} from 'lucide-react';
import { apiService } from '../../services/api';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingItem?: {
    title: string;
    partnerName: string;
    amountLKR: number;
    amountUSD: number;
    serviceType: 'hostel' | 'tour' | 'transport' | 'guide';
  } | null;
  onSuccess: (bookingId?: string) => void;
  theme: 'dark' | 'light';
  isFreemiumPrompt?: boolean;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  bookingItem,
  onSuccess,
  theme,
  isFreemiumPrompt = false,
}) => {
  const isDark = theme === 'dark';
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'koko_bnpl' | 'mintpay_bnpl'>('koko_bnpl');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const isBookingCheckout = !!bookingItem;
  const totalAmount = bookingItem?.amountLKR || 12500;
  const commissionRate = 0.12; // 12% TRAVORA platform fee
  const platformCommission = Math.round(totalAmount * commissionRate);
  const partnerNetPayout = totalAmount - platformCommission;
  const installmentAmount = Math.round(totalAmount / 3);

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      if (isBookingCheckout) {
        const res = await apiService.createBooking({
          partnerId: 'prt_selected',
          partnerName: bookingItem.partnerName,
          serviceType: bookingItem.serviceType,
          totalAmount,
          currency: 'LKR',
          paymentMethod,
          status: 'confirmed',
        });
        setTimeout(() => {
          setIsProcessing(false);
          onSuccess(res.booking?.bookingId);
        }, 1100);
      } else {
        setTimeout(() => {
          setIsProcessing(false);
          onSuccess();
        }, 1100);
      }
    } catch (e) {
      setIsProcessing(false);
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className={`w-full max-w-md rounded-3xl border p-5 sm:p-6 space-y-4 shadow-2xl relative ${
        isDark ? 'bg-[#150f24] border-purple-900/60 text-stone-100' : 'bg-white border-purple-100 text-stone-900'
      }`}>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-xl text-stone-400 hover:text-stone-200"
        >
          <X className="w-4 h-4" />
        </button>

        {isBookingCheckout ? (
          /* BOOKING CHECKOUT WITH 12% PLATFORM SPLIT & BNPL */
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              Verified Pink Shield Checkout (12% Platform Fee)
            </div>

            <div>
              <h3 className="text-base font-bold leading-tight">{bookingItem?.title}</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{bookingItem?.partnerName}</p>
            </div>

            {/* Price & 12% Commission Transparency */}
            <div className={`p-3.5 rounded-2xl border space-y-2 text-xs ${
              isDark ? 'bg-stone-950/80 border-purple-900/40' : 'bg-purple-50/60 border-purple-100'
            }`}>
              <div className="flex justify-between items-center">
                <span className="text-stone-500 dark:text-stone-400">Total Booking Amount:</span>
                <span className="font-extrabold font-mono text-base text-purple-600 dark:text-purple-300">
                  LKR {totalAmount.toLocaleString()} (~${bookingItem?.amountUSD})
                </span>
              </div>

              <div className={`p-2.5 rounded-xl border text-[11px] space-y-1 ${
                isDark ? 'bg-black/50 border-stone-800 text-stone-400' : 'bg-white border-purple-100 text-stone-600'
              }`}>
                <div className="flex justify-between">
                  <span>TRAVORA Safety & Escort Fee (12%):</span>
                  <span className="text-purple-600 dark:text-purple-400 font-mono font-bold">
                    LKR {platformCommission.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Direct Partner Payout (88%):</span>
                  <span className="text-emerald-500 font-mono font-bold">
                    LKR {partnerNetPayout.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-500 dark:text-stone-400 block">
                Select Payment Gateway
              </label>

              {/* Koko BNPL */}
              <div
                onClick={() => setPaymentMethod('koko_bnpl')}
                className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                  paymentMethod === 'koko_bnpl'
                    ? 'bg-purple-600/15 border-purple-600'
                    : isDark
                    ? 'bg-stone-950 border-stone-800 text-stone-400'
                    : 'bg-purple-50/40 border-purple-100 text-stone-700'
                }`}
              >
                <div>
                  <div className="text-xs font-bold flex items-center gap-2">
                    <span>Koko BNPL (3 Installments)</span>
                    <span className="text-[10px] bg-purple-500/20 text-purple-600 dark:text-purple-300 px-1.5 rounded font-bold">
                      0% Interest
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400">
                    3 monthly payments of <strong className="font-mono text-purple-600 dark:text-purple-300">LKR {installmentAmount.toLocaleString()}</strong>
                  </div>
                </div>
                <div className="w-4 h-4 rounded-full border border-purple-500 flex items-center justify-center">
                  {paymentMethod === 'koko_bnpl' && <div className="w-2 h-2 rounded-full bg-purple-600" />}
                </div>
              </div>

              {/* Mintpay BNPL */}
              <div
                onClick={() => setPaymentMethod('mintpay_bnpl')}
                className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                  paymentMethod === 'mintpay_bnpl'
                    ? 'bg-emerald-500/15 border-emerald-500'
                    : isDark
                    ? 'bg-stone-950 border-stone-800 text-stone-400'
                    : 'bg-purple-50/40 border-purple-100 text-stone-700'
                }`}
              >
                <div>
                  <div className="text-xs font-bold flex items-center gap-2">
                    <span>Mintpay Pay in 3</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-500 px-1.5 rounded font-bold">
                      Zero Fees
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400">
                    3 payments of <strong className="font-mono text-emerald-500">LKR {installmentAmount.toLocaleString()}</strong>
                  </div>
                </div>
                <div className="w-4 h-4 rounded-full border border-emerald-500 flex items-center justify-center">
                  {paymentMethod === 'mintpay_bnpl' && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                </div>
              </div>

              {/* Credit / Debit Card */}
              <div
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                  paymentMethod === 'card'
                    ? 'bg-purple-600/15 border-purple-600'
                    : isDark
                    ? 'bg-stone-950 border-stone-800 text-stone-400'
                    : 'bg-purple-50/40 border-purple-100 text-stone-700'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <CreditCard className="w-4 h-4 text-purple-500" />
                  <span>Visa / Mastercard / Amex</span>
                </div>
                <div className="w-4 h-4 rounded-full border border-purple-500 flex items-center justify-center">
                  {paymentMethod === 'card' && <div className="w-2 h-2 rounded-full bg-purple-600" />}
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full py-3 rounded-2xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs shadow-md active:scale-98 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>
                {isProcessing
                  ? 'Processing Gateway Security...'
                  : paymentMethod.includes('bnpl')
                  ? `Pay 1st Installment (LKR ${installmentAmount.toLocaleString()})`
                  : `Pay Total LKR ${totalAmount.toLocaleString()}`}
              </span>
            </button>
          </div>
        ) : (
          /* GLOBAL $4.99/MO FREEMIUM SUBSCRIPTION UPGRADE */
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-700 to-fuchsia-600 text-white flex items-center justify-center mx-auto mb-2 shadow-lg">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold">TRAVORA Global Solo Explorer</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Unlock full offline vector maps, unlimited emergency contacts & 10% discounts
              </p>
            </div>

            <div className={`p-4 rounded-2xl border text-center space-y-0.5 ${
              isDark ? 'bg-stone-950/80 border-purple-900/40' : 'bg-purple-50/80 border-purple-200'
            }`}>
              <div className="text-3xl font-extrabold font-mono text-purple-600 dark:text-purple-300">
                $4.99 <span className="text-xs font-normal text-stone-400">/ month</span>
              </div>
              <p className="text-[11px] text-purple-500 font-semibold">Cancel anytime · 7-day free trial</p>
            </div>

            {/* Premium Perks Callouts matching user's exact specification */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-purple-950/30 border border-purple-800/40">
                <Download className="w-4 h-4 text-purple-400 shrink-0" />
                <span><strong>Offline maps</strong> (High-res vector maps & safe zone overlays)</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-purple-950/30 border border-purple-800/40">
                <CheckCircle className="w-4 h-4 text-purple-400 shrink-0" />
                <span><strong>Priority booking</strong> on verified hostels & female-escort guides</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-purple-950/30 border border-purple-800/40">
                <Phone className="w-4 h-4 text-purple-400 shrink-0" />
                <span><strong>More emergency contacts</strong> (Store unlimited contacts beyond 4)</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-purple-950/30 border border-purple-800/40">
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                <span><strong>Share live location with loved ones on the go</strong></span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-purple-950/30 border border-purple-800/40">
                <Percent className="w-4 h-4 text-purple-400 shrink-0" />
                <span><strong>Exclusive discounts</strong> on partner stays and SLTDA tours</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-700 via-purple-600 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-500 text-white font-bold text-xs shadow-md active:scale-98 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CreditCard className="w-4 h-4" />
              <span>{isProcessing ? 'Activating Subscription...' : 'Start 7-Day Free Trial ($4.99/mo)'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
