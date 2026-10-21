import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Camera,
  CheckCircle,
  AlertCircle,
  FileText,
  UserCheck,
  RefreshCw,
  Lock,
  X,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface Au10tixVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  onCompleteVerification: (idType: 'Passport' | 'National ID' | 'Drivers License', badgeHash: string) => void;
  theme: 'dark' | 'light';
}

export const Au10tixVerificationModal: React.FC<Au10tixVerificationModalProps> = ({
  isOpen,
  onClose,
  userName,
  onCompleteVerification,
  theme,
}) => {
  const isDark = theme === 'dark';

  const [step, setStep] = useState<'select_id' | 'scan_doc' | 'liveness' | 'approved'>('select_id');
  const [idType, setIdType] = useState<'Passport' | 'National ID' | 'Drivers License'>('Passport');
  const [docCountry, setDocCountry] = useState('Sri Lanka');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [livenessStage, setLivenessStage] = useState<'center' | 'turn_right' | 'smile' | 'analyzing'>('center');

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setStep('select_id');
      setIsScanning(false);
      setScanProgress(0);
      setLivenessStage('center');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartDocScan = () => {
    setStep('scan_doc');
    setIsScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          return 100;
        }
        return prev + 25;
      });
    }, 450);
  };

  const handleStartLiveness = () => {
    setStep('liveness');
    setLivenessStage('center');

    // Simulate 3D liveness prompts
    setTimeout(() => {
      setLivenessStage('turn_right');
    }, 1200);

    setTimeout(() => {
      setLivenessStage('smile');
    }, 2400);

    setTimeout(() => {
      setLivenessStage('analyzing');
    }, 3600);

    setTimeout(() => {
      setStep('approved');
    }, 4800);
  };

  const handleFinish = () => {
    const badgeHash = `AU10TIX:SHA256:${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 6)}`;
    onCompleteVerification(idType, badgeHash);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        className={`w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border transition-all ${
          isDark ? 'bg-[#150a28] border-purple-500/50 text-white' : 'bg-white border-purple-200 text-stone-900'
        }`}
      >
        {/* AU10TIX Brand Header */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 p-4 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-500/30 border border-purple-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-black text-sm tracking-wider text-emerald-400">AU10TIX</span>
                  <span className="text-[10px] bg-purple-800/80 text-purple-200 px-1.5 py-0.2 rounded font-bold">
                    InstaScreener™
                  </span>
                </div>
                <p className="text-[10px] text-purple-200">Automated Identity & 3D Liveness Verification</p>
              </div>
            </div>

            <button onClick={onClose} className="p-1 rounded-lg text-purple-300 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Progress */}
          <div className="flex items-center justify-between mt-3 text-[10px] text-purple-200 font-bold border-t border-purple-800/50 pt-2">
            <span className={step === 'select_id' ? 'text-amber-300 font-black' : ''}>1. Select ID</span>
            <span>→</span>
            <span className={step === 'scan_doc' ? 'text-amber-300 font-black' : ''}>2. Document Scan</span>
            <span>→</span>
            <span className={step === 'liveness' ? 'text-amber-300 font-black' : ''}>3. 3D Liveness</span>
            <span>→</span>
            <span className={step === 'approved' ? 'text-emerald-400 font-black' : ''}>4. Verified</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex flex-col gap-4">
          {/* STEP 1: SELECT ID DOCUMENT */}
          {step === 'select_id' && (
            <div className="flex flex-col gap-3">
              <div className="text-center">
                <h3 className="font-black text-base text-stone-900 dark:text-white">Verify Your Identity</h3>
                <p className="text-xs text-stone-600 dark:text-purple-200 mt-0.5">
                  Travora partners with AU10TIX to protect solo female travelers. Every buddy and host must verify their
                  government-issued ID.
                </p>
              </div>

              {/* Country selection */}
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-purple-200 block mb-1">
                  Issuing Country / Region
                </label>
                <select
                  value={docCountry}
                  onChange={(e) => setDocCountry(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border text-xs font-medium outline-none ${
                    isDark ? 'bg-black/40 border-purple-800 text-white' : 'bg-purple-50/50 border-purple-200 text-stone-900'
                  }`}
                >
                  <option value="Sri Lanka">Sri Lanka 🇱🇰</option>
                  <option value="United Kingdom">United Kingdom 🇬🇧</option>
                  <option value="Australia">Australia 🇦🇺</option>
                  <option value="France">France 🇫🇷</option>
                  <option value="Germany">Germany 🇩🇪</option>
                  <option value="United States">United States 🇺🇸</option>
                  <option value="India">India 🇮🇳</option>
                </select>
              </div>

              {/* Document Type Cards */}
              <div className="flex flex-col gap-2">
                {[
                  { type: 'Passport', title: 'Passport (Recommended)', desc: 'Fastest verification & global SLTDA pass' },
                  { type: 'National ID', title: 'Sri Lankan National ID (NIC)', desc: 'Smart NIC card with barcode & hologram' },
                  { type: 'Drivers License', title: 'Driver’s License', desc: 'Valid government photocard license' },
                ].map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setIdType(item.type as any)}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition ${
                      idType === item.type
                        ? 'border-purple-600 bg-purple-100 dark:bg-purple-950/60 shadow-sm'
                        : isDark
                        ? 'border-purple-900/40 bg-black/20 hover:border-purple-700'
                        : 'border-purple-200 bg-white hover:border-purple-400'
                    }`}
                  >
                    <FileText
                      className={`w-5 h-5 mt-0.5 ${
                        idType === item.type ? 'text-purple-700 dark:text-purple-300' : 'text-stone-400'
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-stone-900 dark:text-white">{item.title}</span>
                        {idType === item.type && <CheckCircle className="w-4 h-4 text-purple-600 fill-purple-600/20" />}
                      </div>
                      <p className="text-[10px] text-stone-600 dark:text-stone-400 mt-0.5">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/40 flex items-center gap-2 text-[11px] text-purple-900 dark:text-purple-300">
                <Lock className="w-4 h-4 shrink-0 text-purple-600" />
                <span>AU10TIX 256-bit encrypted data tunnel. ID photos are never shared publicly.</span>
              </div>

              <button
                onClick={handleStartDocScan}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md active:scale-98 transition"
              >
                <span>Continue to Document Scan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: DOCUMENT SCANNING ANIMATION */}
          {step === 'scan_doc' && (
            <div className="flex flex-col gap-3 items-center text-center">
              <h3 className="font-black text-base text-stone-900 dark:text-white">Scanning {idType}</h3>
              <p className="text-xs text-stone-600 dark:text-purple-200">
                Position the photo page of your {idType} inside the viewfinder frame.
              </p>

              {/* Viewfinder frame */}
              <div className="w-full h-48 rounded-2xl border-2 border-dashed border-purple-500 bg-black/80 relative flex flex-col items-center justify-center overflow-hidden shadow-inner">
                {/* Laser scan bar */}
                <div
                  className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] transition-all duration-300"
                  style={{ top: `${scanProgress}%` }}
                />

                <div className="border border-purple-400/40 rounded-xl p-3 w-4/5 text-left bg-purple-950/40 backdrop-blur-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-9 rounded bg-purple-700/50 flex items-center justify-center text-[10px] text-purple-200">
                      PHOTO
                    </div>
                    <div>
                      <p className="text-[10px] text-white font-mono font-bold">{userName.toUpperCase()}</p>
                      <p className="text-[8px] text-purple-300 font-mono">DOC: N9482103859 • LK</p>
                    </div>
                  </div>
                  <div className="h-1.5 bg-purple-800/80 rounded w-full mb-1" />
                  <div className="h-1.5 bg-purple-800/80 rounded w-2/3" />
                </div>

                <div className="absolute bottom-2 flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded-full text-[10px] text-emerald-400 font-mono font-bold">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Optical Security Check: {scanProgress}%</span>
                </div>
              </div>

              {scanProgress === 100 ? (
                <div className="w-full flex flex-col gap-2">
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-xs text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Hologram & Security Checks Passed ✓</span>
                  </div>
                  <button
                    onClick={handleStartLiveness}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-purple-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md active:scale-98 transition"
                  >
                    <span>Proceed to 3D Biometric Liveness</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <p className="text-[11px] text-stone-500">Hold steady while AU10TIX captures edge coordinates...</p>
              )}
            </div>
          )}

          {/* STEP 3: 3D BIOMETRIC LIVENESS SELFIE */}
          {step === 'liveness' && (
            <div className="flex flex-col gap-3 items-center text-center">
              <h3 className="font-black text-base text-stone-900 dark:text-white">AU10TIX InstaScreener™</h3>
              <p className="text-xs text-stone-600 dark:text-purple-200">
                Fit your face within the oval. This prevents fake accounts and deepfakes.
              </p>

              {/* Oval Viewfinder */}
              <div className="w-52 h-64 rounded-full border-4 border-dashed border-emerald-400 bg-gradient-to-b from-purple-950/70 to-black relative flex flex-col items-center justify-center shadow-xl overflow-hidden">
                <div className="w-36 h-48 rounded-full border-2 border-emerald-300/40 flex flex-col items-center justify-center relative">
                  <Camera className="w-8 h-8 text-emerald-400 mb-2" />

                  {/* Liveness Stage Prompts */}
                  {livenessStage === 'center' && (
                    <span className="text-[11px] text-white font-bold bg-black/70 px-2 py-0.5 rounded-full animate-pulse">
                      Hold still in center...
                    </span>
                  )}
                  {livenessStage === 'turn_right' && (
                    <span className="text-[11px] text-amber-300 font-bold bg-black/70 px-2 py-0.5 rounded-full animate-bounce">
                      Turn head slightly right 👉
                    </span>
                  )}
                  {livenessStage === 'smile' && (
                    <span className="text-[11px] text-emerald-300 font-bold bg-black/70 px-2 py-0.5 rounded-full animate-pulse">
                      Now smile gently 😊
                    </span>
                  )}
                  {livenessStage === 'analyzing' && (
                    <div className="flex items-center gap-1 text-[11px] text-purple-300 font-bold bg-black/70 px-2 py-0.5 rounded-full">
                      <RefreshCw className="w-3 h-3 animate-spin text-purple-400" />
                      <span>Biometric Mesh Match...</span>
                    </div>
                  )}
                </div>

                <div className="absolute bottom-2 text-[9px] text-stone-300 font-mono">
                  AU10TIX 3D FACIAL RECOGNITION
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: INSTANT APPROVAL */}
          {step === 'approved' && (
            <div className="flex flex-col gap-3 items-center text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center shadow-lg">
                <CheckCircle className="w-9 h-9 text-emerald-500" />
              </div>

              <div>
                <h3 className="font-black text-lg text-stone-900 dark:text-white">Identity Verified by AU10TIX</h3>
                <p className="text-xs text-stone-600 dark:text-purple-200 mt-0.5">
                  Congratulations, {userName}! Your identity has been verified against Sri Lankan Tourism Authority records.
                </p>
              </div>

              {/* Certificate badge */}
              <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-purple-950 via-indigo-950 to-purple-950 border border-purple-500/60 text-white text-left shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">AU10TIX TRUST VERIFICATION</span>
                  <span className="text-[9px] bg-emerald-500 text-stone-950 font-black px-1.5 py-0.2 rounded">
                    CONFIRMED ✓
                  </span>
                </div>
                <p className="text-xs font-bold text-white">Holder: {userName}</p>
                <p className="text-[10px] text-purple-300 font-mono mt-0.5">Document: {idType} (Official SLTDA Audit)</p>
                <p className="text-[10px] text-purple-300 font-mono">Biometric Match: 99.8% Confirmed</p>
                <p className="text-[9px] text-stone-400 font-mono mt-1">Hash: AU10TIX:SHA256:9f2c81e3a47d</p>
              </div>

              <button
                onClick={handleFinish}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-purple-600 hover:from-emerald-700 hover:to-purple-700 text-white font-black text-xs shadow-lg active:scale-98 transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Activate Verified Profile Badge</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
