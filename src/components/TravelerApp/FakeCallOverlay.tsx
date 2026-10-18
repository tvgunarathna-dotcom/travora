import React, { useState, useEffect } from 'react';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ShieldAlert,
  UserCheck,
  Settings,
  Sparkles,
  Radio,
} from 'lucide-react';
import { soundEffects } from '../../services/soundEffects';
import { FakeCallPersona } from '../../types';
import { mockFakeCallPersonas } from '../../data/mockData';

interface FakeCallOverlayProps {
  initialPersonaId?: string;
  onDismiss: () => void;
  onTriggerSos: () => void;
}

export const FakeCallOverlay: React.FC<FakeCallOverlayProps> = ({
  initialPersonaId = 'mom',
  onDismiss,
  onTriggerSos,
}) => {
  const [selectedPersonaId, setSelectedPersonaId] = useState(initialPersonaId);
  const [callState, setCallState] = useState<'incoming' | 'connected'>('incoming');
  const [callDuration, setCallDuration] = useState(0); // 0 to 60 seconds (1 minute max)
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const [activeDialogueIndex, setActiveDialogueIndex] = useState(0);

  // Get active persona
  const currentPersona: FakeCallPersona =
    mockFakeCallPersonas.find((p) => p.id === selectedPersonaId) || mockFakeCallPersonas[0];

  const script = currentPersona.dialogueScript;

  // Ringtone handling for incoming state
  useEffect(() => {
    if (callState === 'incoming') {
      soundEffects.startRingtone();
    } else {
      soundEffects.stopRingtone();
    }

    return () => {
      soundEffects.stopRingtone();
      soundEffects.stopSpeaking();
    };
  }, [callState]);

  // Duration timer: runs up to 60 seconds (1 minute long recording)
  useEffect(() => {
    let timer: any;
    if (callState === 'connected') {
      timer = setInterval(() => {
        setCallDuration((prev) => {
          if (prev >= 60) {
            // Auto complete at 1 minute
            clearInterval(timer);
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callState]);

  // Sync dialogue line based on current callDuration
  useEffect(() => {
    if (callState === 'connected') {
      // Find the dialogue turn corresponding to current seconds
      let matchedIndex = 0;
      for (let i = script.length - 1; i >= 0; i--) {
        if (callDuration >= script[i].timeOffsetSeconds) {
          matchedIndex = i;
          break;
        }
      }

      if (matchedIndex !== activeDialogueIndex) {
        setActiveDialogueIndex(matchedIndex);
        const line = script[matchedIndex];
        if (line && line.spokenText && isSpeaker) {
          soundEffects.speakPersonaDialogue(line.spokenText, currentPersona.voicePitch, currentPersona.voiceRate);
        }
      }
    }
  }, [callDuration, callState, isSpeaker, script, activeDialogueIndex, currentPersona]);

  // Speak initial greeting on connect
  const handleAnswerCall = () => {
    setCallState('connected');
    setCallDuration(0);
    setActiveDialogueIndex(0);
    const firstLine = script[0];
    if (firstLine && firstLine.spokenText && isSpeaker) {
      setTimeout(() => {
        soundEffects.speakPersonaDialogue(firstLine.spokenText, currentPersona.voicePitch, currentPersona.voiceRate);
      }, 400);
    }
  };

  const handleHangUp = () => {
    soundEffects.stopSpeaking();
    soundEffects.stopRingtone();
    onDismiss();
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0b0518] text-white flex flex-col justify-between p-6 select-none animate-fadeIn">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-radial from-purple-900/30 via-transparent to-black pointer-events-none" />

      {/* Top Header & Caller Info */}
      <div className="relative z-10 flex flex-col items-center pt-8 text-center">
        {/* Verification Shield Indicator */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-semibold mb-4">
          <UserCheck className="w-3.5 h-3.5 text-purple-400" />
          <span>TRAVORA Discreet Safety Line · 1-Min Recording</span>
        </div>

        {/* Big Avatar */}
        <div className="relative mb-3">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-700 to-fuchsia-500 p-1 flex items-center justify-center shadow-2xl shadow-purple-900/50">
            <div className="w-full h-full rounded-full bg-stone-900 flex items-center justify-center text-3xl">
              {currentPersona.label.slice(-2)}
            </div>
          </div>
          {callState === 'connected' && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-stone-950 flex items-center justify-center">
              <Radio className="w-3 h-3 text-white animate-pulse" />
            </div>
          )}
        </div>

        {/* Caller Name & Subtitle */}
        <h2 className="text-2xl font-black text-white tracking-wide">
          {currentPersona.callerName}
        </h2>
        <p className="text-xs text-purple-300/80 mt-0.5">
          {currentPersona.relationship} · {currentPersona.callerNumber}
        </p>

        {/* Call Status / 1-Minute Duration Counter */}
        <div className="mt-3">
          {callState === 'incoming' ? (
            <span className="text-xs font-bold text-purple-400 animate-pulse tracking-wider">
              INCOMING CALL...
            </span>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <span className="text-sm font-mono font-bold text-emerald-400">
                {formatSeconds(callDuration)} / 1:00
              </span>
              <div className="w-40 h-1.5 bg-stone-800 rounded-full overflow-hidden mt-0.5">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 transition-all duration-1000"
                  style={{ width: `${(callDuration / 60) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Middle Interactive Section: Live Spoken Dialogue Script */}
      {callState === 'connected' && (
        <div className="relative z-10 flex-1 flex flex-col justify-center my-4 max-w-sm mx-auto w-full">
          <div className="bg-stone-900/90 border border-purple-500/40 rounded-2xl p-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-purple-900/40 pb-2 mb-3">
              <span className="text-[10px] uppercase tracking-wider text-purple-300 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-400" />
                Live Conversation Script
              </span>
              <button
                onClick={() => {
                  const line = script[activeDialogueIndex];
                  if (line && line.spokenText) {
                    soundEffects.speakPersonaDialogue(line.spokenText, currentPersona.voicePitch, currentPersona.voiceRate);
                  }
                }}
                className="text-[10px] text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
              >
                <Volume2 className="w-3 h-3" /> Replay Line
              </button>
            </div>

            {/* Current Active Dialogue Line */}
            <div className="flex flex-col gap-2.5 min-h-[110px] justify-center">
              {script[activeDialogueIndex] && (
                <div
                  key={activeDialogueIndex}
                  className={`p-3 rounded-xl border transition-all ${
                    script[activeDialogueIndex].speaker === 'You'
                      ? 'bg-purple-950/60 border-purple-500/50 text-purple-200'
                      : 'bg-black/50 border-purple-800/40 text-white'
                  }`}
                >
                  <span className="text-[10px] font-bold block mb-1 text-purple-400">
                    {script[activeDialogueIndex].speaker}:
                  </span>
                  <p className="text-xs sm:text-sm font-medium leading-relaxed">
                    {script[activeDialogueIndex].text}
                  </p>
                </div>
              )}
            </div>

            <p className="text-[10px] text-purple-300/60 text-center mt-2">
              Audio plays automatically. Speak naturally to exit the situation safely.
            </p>
          </div>
        </div>
      )}

      {/* Bottom Controls */}
      <div className="relative z-10 w-full max-w-sm mx-auto pb-4">
        {callState === 'incoming' ? (
          /* Incoming Call Actions: Accept or Decline */
          <div className="flex items-center justify-around px-6">
            {/* Decline */}
            <div className="flex flex-col items-center gap-1.5">
              <button
                onClick={handleHangUp}
                className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg shadow-rose-900/40 active:scale-95 transition"
              >
                <PhoneOff className="w-7 h-7" />
              </button>
              <span className="text-xs text-stone-300 font-medium">Decline</span>
            </div>

            {/* Accept */}
            <div className="flex flex-col items-center gap-1.5">
              <button
                onClick={handleAnswerCall}
                className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-900/40 animate-bounce active:scale-95 transition"
              >
                <Phone className="w-7 h-7 fill-white" />
              </button>
              <span className="text-xs text-stone-300 font-medium">Accept (1 Min)</span>
            </div>
          </div>
        ) : (
          /* Active Call In-Call Controls */
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              {/* Mute Button */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`py-3 rounded-2xl border flex flex-col items-center justify-center gap-1 transition ${
                  isMuted ? 'bg-amber-600/30 border-amber-500 text-amber-300' : 'bg-stone-900 border-stone-800 text-stone-300'
                }`}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                <span className="text-[10px]">{isMuted ? 'Muted' : 'Mute'}</span>
              </button>

              {/* Speaker Toggle */}
              <button
                onClick={() => {
                  const next = !isSpeaker;
                  setIsSpeaker(next);
                  if (!next) soundEffects.stopSpeaking();
                }}
                className={`py-3 rounded-2xl border flex flex-col items-center justify-center gap-1 transition ${
                  isSpeaker ? 'bg-purple-600/30 border-purple-500 text-purple-300' : 'bg-stone-900 border-stone-800 text-stone-300'
                }`}
              >
                {isSpeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                <span className="text-[10px]">{isSpeaker ? 'Speaker On' : 'Ear Audio'}</span>
              </button>

              {/* Silent SOS Button */}
              <button
                onClick={() => {
                  handleHangUp();
                  onTriggerSos();
                }}
                className="py-3 rounded-2xl border border-rose-900/60 bg-rose-950/40 text-rose-300 flex flex-col items-center justify-center gap-1 hover:bg-rose-900/50 transition"
              >
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                <span className="text-[10px]">Silent SOS</span>
              </button>
            </div>

            {/* End Call Button */}
            <div className="flex justify-center mt-2">
              <button
                onClick={handleHangUp}
                className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-xl shadow-rose-950 active:scale-95 transition"
                title="End Call"
              >
                <PhoneOff className="w-7 h-7" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
