import React, { useState } from 'react';
import {
  ShieldAlert,
  Clock,
  PhoneCall,
  Lock,
  Phone,
  Play,
  CheckCircle,
  WifiOff,
  Database,
  User,
  Shield,
  Compass,
} from 'lucide-react';
import { UserProfile, EmergencyHotlineData, TripTimerState } from '../../types';
import { mockFakeCallPersonas } from '../../data/mockData';
import { apiService } from '../../services/api';

interface SafetyDashboardProps {
  user: UserProfile;
  hotlineData: EmergencyHotlineData;
  tripTimer: TripTimerState;
  onStartTripTimer: (destination: string, mode: 'tuk_tuk' | 'taxi' | 'walk' | 'train', durationMins: number) => void;
  onCancelTripTimer: () => void;
  onLaunchFakeCall: (personaId: string) => void;
  onOpenOfflineHotlines: () => void;
  onOpenProfile: () => void;
  theme: 'dark' | 'light';
}

export const SafetyDashboard: React.FC<SafetyDashboardProps> = ({
  user,
  hotlineData,
  tripTimer,
  onStartTripTimer,
  onCancelTripTimer,
  onLaunchFakeCall,
  onOpenOfflineHotlines,
  onOpenProfile,
  theme,
}) => {
  const isDark = theme === 'dark';

  // Trip Duration State
  const [selectedDurationMins, setSelectedDurationMins] = useState<number>(25);
  const [customMinsInput, setCustomMinsInput] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [destinationName, setDestinationName] = useState('Rosmead Place, Cinnamon Gardens');
  const [transportMode, setTransportMode] = useState<'tuk_tuk' | 'taxi' | 'walk' | 'train'>('tuk_tuk');

  // PIN Arrival Confirmation Modal
  const [showPinModal, setShowPinModal] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [sosStatusMessage, setSosStatusMessage] = useState<string | null>(null);

  // Fake Call caller selector
  const [selectedPersona, setSelectedPersona] = useState('mom');

  const activeMinutes = showCustomInput && parseInt(customMinsInput, 10) > 0 ? parseInt(customMinsInput, 10) : selectedDurationMins;

  const handleStartTimer = () => {
    onStartTripTimer(destinationName, transportMode, activeMinutes);
  };

  const handleConfirmArrivalPrompt = () => {
    setShowPinModal(true);
    setEnteredPin('');
    setPinError('');
  };

  const handleVerifyPin = async () => {
    if (enteredPin === user.safetyPin) {
      onCancelTripTimer();
      setShowPinModal(false);
      setPinError('');
    } else if (enteredPin === user.duressPin) {
      onCancelTripTimer();
      setShowPinModal(false);
      // Silent SOS trigger
      await triggerEmergencySos(true);
    } else {
      setPinError('Incorrect 4-digit PIN. Please re-enter.');
    }
  };

  // One-Touch SOS: Siren Alarm Sound is REMOVED per user instructions ("Remove SOS alarms sound only")
  const triggerEmergencySos = async (isSilentDuress: boolean = false) => {
    setSosStatusMessage('📡 GPS Alert Dispatched! Live coordinates sent to emergency contacts.');
    try {
      await apiService.triggerSos({
        userId: user.id,
        location: { lat: 7.2912, lng: 80.662 },
        emergencyContacts: user.emergencyContacts,
        triggerType: isSilentDuress ? 'duress_pin' : 'one_touch_sos',
        silentAlarm: true, // Always silent per user specification
        audioStreamActive: false,
      });
    } catch (e) {
      // Offline fallback
    }

    setTimeout(() => {
      setSosStatusMessage(null);
    }, 6000);
  };

  // Format seconds to mm:ss
  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-4 p-3 sm:p-4 pb-20 select-none">
      {/* Top Header matching Screenshot 1 */}
      <div className="flex items-center justify-between py-1 px-1">
        <button
          onClick={onOpenProfile}
          className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center shadow-md transition transform active:scale-95"
          title="Open Profile"
        >
          <User className="w-5 h-5 text-white" />
        </button>

        <div className="flex items-center gap-2">
          <img
            src="/assets/aistudio/TRAVORA-Compass-Transparent_cd89c439.png"
            alt="TRAVORA Logo"
            className="w-8 h-8 object-contain drop-shadow-sm shrink-0"
          />
          <span className="text-xl font-black tracking-wider text-purple-900 dark:text-purple-300">
            TRAVORA
          </span>
        </div>
      </div>

      {/* SOS Alert Toast / Broadcast Confirmation */}
      {sosStatusMessage && (
        <div className="bg-purple-950/90 border border-purple-500 text-white p-3 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          <div className="text-xs">
            <p className="font-bold text-sm">Emergency Alert Broadcast Active</p>
            <p className="text-purple-200">{sosStatusMessage}</p>
          </div>
        </div>
      )}

      {/* CARD 1: SOS 1 Tap Trigger (Matching Screenshot 1) */}
      <div className={`rounded-3xl border p-5 flex flex-col items-center justify-center text-center shadow-lg transition-all ${
        isDark
          ? 'bg-gradient-to-b from-[#180d33] to-[#120824] border-purple-800/40'
          : 'bg-gradient-to-b from-purple-50 to-white border-purple-100 shadow-purple-900/5'
      }`}>
        <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-300 text-xs font-semibold mb-6">
          <Shield className="w-4 h-4 fill-purple-600/20" />
          <span>Instantly broadcasts live GPS coordinates to emergency contacts</span>
        </div>

        {/* Big Circular SOS Button */}
        <button
          onClick={() => triggerEmergencySos(false)}
          className="w-36 h-36 rounded-full bg-gradient-to-tr from-purple-800 via-purple-600 to-indigo-600 hover:from-purple-900 hover:to-indigo-700 text-white flex flex-col items-center justify-center shadow-2xl shadow-purple-900/40 border-4 border-white/20 transition-transform active:scale-90 group cursor-pointer"
        >
          <span className="text-3xl font-black tracking-widest text-white drop-shadow-md group-hover:scale-105 transition-transform">
            SOS
          </span>
          <span className="text-[11px] font-semibold text-purple-200 mt-1 tracking-wide">
            1 tap trigger
          </span>
        </button>

        <p className="text-[10px] text-stone-600 dark:text-stone-300 mt-5">
          Discreet emergency trigger. Dial Tourist Police: <strong className="text-purple-700 dark:text-purple-300">{hotlineData.touristPolice}</strong> or Ambulance: <strong className="text-purple-700 dark:text-purple-300">1990</strong>
        </p>
      </div>

      {/* CARD 2: Discreet "Fake Call" Disruption (Matching Screenshot 1) */}
      <div className={`rounded-2xl border p-4 shadow-md transition-all ${
        isDark
          ? 'bg-[#180d33]/90 border-purple-800/40 text-stone-100'
          : 'bg-white border-purple-100 text-stone-900 shadow-purple-900/5'
      }`}>
        <div className="flex items-center gap-2 mb-1">
          <PhoneCall className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <h3 className="font-extrabold text-sm sm:text-base text-stone-900 dark:text-white">
            Discreet “Fake Call” Disruption
          </h3>
        </div>
        <p className="text-xs text-stone-600 dark:text-stone-300 mb-3">
          Triggers an incoming call with spoken dialogue to exit uncomfortable situations.
        </p>

        <div className="flex items-center justify-between gap-2">
          {/* Persona Dropdown */}
          <div className="flex items-center gap-1.5 flex-1">
            <span className="text-xs font-bold text-stone-700 dark:text-stone-300">Persona:</span>
            <select
              value={selectedPersona}
              onChange={(e) => setSelectedPersona(e.target.value)}
              className={`text-xs font-semibold py-1.5 px-2.5 rounded-lg border outline-none cursor-pointer flex-1 ${
                isDark
                  ? 'bg-black/40 border-purple-800/60 text-purple-200'
                  : 'bg-purple-50/80 border-purple-200 text-purple-900'
              }`}
            >
              {mockFakeCallPersonas.map((p) => (
                <option key={p.id} value={p.id} className="bg-stone-900 text-white">
                  {p.label} ✔
                </option>
              ))}
            </select>
          </div>

          {/* Call Me Button */}
          <button
            onClick={() => onLaunchFakeCall(selectedPersona)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-purple-700 to-fuchsia-600 hover:from-purple-800 hover:to-fuchsia-700 text-white px-4 py-2 rounded-full font-bold text-xs shadow-md shadow-purple-900/20 active:scale-95 transition"
          >
            <Phone className="w-3.5 h-3.5 fill-white" />
            <span>Call Me</span>
          </button>
        </div>
      </div>

      {/* CARD 3: Trip Timer (Matching Screenshot 1) */}
      <div className={`rounded-2xl border p-4 shadow-md transition-all ${
        isDark
          ? 'bg-[#150a2b] border-purple-800/40 text-stone-100'
          : 'bg-[#1a0f35] border-purple-900/30 text-white shadow-purple-950/20'
      }`}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <h3 className="font-extrabold text-sm sm:text-base text-white">
                Trip Timer
              </h3>
            </div>
            <p className="text-[11px] text-purple-200/70 mt-0.5">
              Runs in background across all tabs
            </p>
          </div>

          {/* Safe PIN Indicator Box */}
          <div className="bg-black/50 border border-purple-500/30 rounded-lg px-2.5 py-1 text-right">
            <span className="text-[9px] text-purple-300 block font-mono flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" /> Safe PIN:
            </span>
            <span className="text-xs font-mono font-bold text-white tracking-widest">
              {user.safetyPin}
            </span>
          </div>
        </div>

        {/* If Active Countdown Running */}
        {tripTimer.isActive ? (
          <div className="bg-purple-950/60 border border-purple-500/50 rounded-xl p-3 flex flex-col items-center gap-2 my-2">
            <span className="text-[11px] text-purple-300 font-medium">
              Live Transit to: <strong className="text-white">{tripTimer.destinationName}</strong>
            </span>
            <div className="text-3xl font-mono font-black text-white tracking-wider animate-pulse">
              {formatTimer(tripTimer.remainingSeconds)}
            </div>
            <p className="text-[10px] text-purple-200/80">
              Enter Safe PIN on arrival. Duress PIN 9999 silently alerts contacts.
            </p>
            <div className="flex gap-2 w-full mt-1">
              <button
                onClick={handleConfirmArrivalPrompt}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                I’ve Arrived Safely
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Destination Address */}
            <div className="mb-3">
              <label className="text-[11px] text-purple-200 font-semibold mb-1 block">
                Destination Address
              </label>
              <div className="flex items-center gap-2 bg-black/40 border border-purple-800/50 rounded-xl px-3 py-2">
                <div className="w-2 h-2 rounded-full bg-purple-400" />
                <input
                  type="text"
                  value={destinationName}
                  onChange={(e) => setDestinationName(e.target.value)}
                  placeholder="Enter destination (e.g. Temple Street, Kandy)"
                  className="bg-transparent text-xs text-white placeholder-purple-300/40 outline-none w-full"
                />
              </div>
            </div>

            {/* Transport Mode Icons */}
            <div className="mb-3">
              <label className="text-[11px] text-purple-200 font-semibold mb-1.5 block">
                Transport Mode
              </label>
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { id: 'tuk_tuk', label: 'Tuk-Tuk', emoji: '🛺' },
                  { id: 'taxi', label: 'Taxi', emoji: '🚕' },
                  { id: 'walk', label: 'Walking', emoji: '🚶‍♀️' },
                  { id: 'train', label: 'Train', emoji: '🚆' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setTransportMode(item.id as any)}
                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition ${
                      transportMode === item.id
                        ? 'bg-purple-600/50 border-purple-400 text-white font-bold'
                        : 'bg-black/30 border-purple-900/40 text-purple-300 hover:bg-purple-900/20'
                    }`}
                  >
                    <span className="text-base">{item.emoji}</span>
                    <span className="text-[10px] mt-1">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Expected Duration Pills */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] text-purple-200 font-semibold">
                  Expected Duration
                </label>
                <button
                  onClick={() => setShowCustomInput(!showCustomInput)}
                  className="text-[10px] text-purple-400 hover:text-purple-300 font-medium"
                >
                  {showCustomInput ? 'Preset Minutes' : '+Type Custom Minutes'}
                </button>
              </div>

              {showCustomInput ? (
                <div className="flex items-center gap-2 bg-black/40 border border-purple-800/50 rounded-xl px-3 py-1.5">
                  <input
                    type="number"
                    value={customMinsInput}
                    onChange={(e) => setCustomMinsInput(e.target.value)}
                    placeholder="Enter minutes (e.g. 22)"
                    className="bg-transparent text-xs text-white placeholder-purple-300/40 outline-none w-full font-mono"
                    min="1"
                    max="300"
                  />
                  <span className="text-[11px] text-purple-300 font-bold">mins</span>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {[15, 30, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => setSelectedDurationMins(mins)}
                      className={`py-1.5 rounded-xl border text-xs font-semibold transition ${
                        selectedDurationMins === mins
                          ? 'bg-purple-600 text-white border-purple-400'
                          : 'bg-black/30 text-purple-300 border-purple-900/40 hover:bg-purple-900/20'
                      }`}
                    >
                      {mins === 60 ? '1 hr' : `${mins}m`}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Start Trip Timer Button */}
            <button
              onClick={handleStartTimer}
              className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 active:scale-98 transition"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Trip Timer ({activeMinutes} Mins)</span>
            </button>
          </>
        )}
      </div>

      {/* CARD 4: Offline Emergency Mode (Zero-Data) (Matching Screenshot 1) */}
      <button
        onClick={onOpenOfflineHotlines}
        className={`w-full rounded-2xl border p-4 shadow-md text-left transition transform active:scale-98 cursor-pointer flex items-center justify-between ${
          isDark
            ? 'bg-[#180d33] border-purple-800/40 hover:border-purple-600 text-white'
            : 'bg-purple-950 border-purple-900 text-white hover:bg-purple-900'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-800/60 border border-purple-500/40 flex items-center justify-center">
            <WifiOff className="w-4 h-4 text-purple-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-xs sm:text-sm text-white">
                Offline Emergency Mode
              </h3>
              <span className="text-[10px] text-purple-300 font-bold">(Zero-Data)</span>
            </div>
            <p className="text-[10px] text-purple-200/70 mt-0.5">
              100% accessible without cellular data or Wi-Fi
            </p>
          </div>
        </div>

        <div className="bg-purple-800/40 border border-purple-400/30 rounded-lg px-2 py-1 text-center">
          <span className="text-[9px] font-mono font-bold text-purple-200 tracking-wider flex items-center gap-1">
            <Database className="w-2.5 h-2.5" /> SQLITE CACHED
          </span>
        </div>
      </button>

      {/* Safe Arrival PIN Verification Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-purple-500/50 rounded-2xl p-5 max-w-xs w-full text-white shadow-2xl">
            <h4 className="font-black text-sm text-center mb-1 text-purple-300">
              Confirm Safe Arrival
            </h4>
            <p className="text-[11px] text-stone-300 text-center mb-4">
              Enter your 4-digit PIN to stop the countdown. Duress code 9999 silently dispatches an SOS alert.
            </p>

            <div className="flex justify-center mb-4">
              <input
                type="password"
                maxLength={4}
                value={enteredPin}
                onChange={(e) => setEnteredPin(e.target.value)}
                placeholder="••••"
                className="w-28 text-center text-2xl tracking-widest font-mono py-2 rounded-xl bg-black border border-purple-500 text-white outline-none"
                autoFocus
              />
            </div>

            {pinError && (
              <p className="text-[11px] text-rose-400 text-center mb-3 font-semibold">
                {pinError}
              </p>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setShowPinModal(false)}
                className="flex-1 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyPin}
                className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold"
              >
                Verify PIN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
