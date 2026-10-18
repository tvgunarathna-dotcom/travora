import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, ShieldAlert, UserCheck, Settings, VolumeX, Sparkles } from 'lucide-react';
import { soundEffects } from '../../services/soundEffects';
import { FakeCallPersona } from '../../types';
import { fakeCallPersonas } from '../../data/mockData';

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
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true); // Default to speaker so spoken audio plays
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [customPersonaModal, setCustomPersonaModal] = useState(false);
  const [customName, setCustomName] = useState('Dad 🚗');
  const [customNumber, setCustomNumber] = useState('+1 (555) 019-2834');
  const [customLine, setCustomLine] = useState("Hey kiddo, I'm parked outside waiting. Come on out right now.");

  // Get active persona
  const currentPersona: FakeCallPersona =
    fakeCallPersonas.find((p) => p.id === selectedPersonaId) || {
      id: 'custom',
      label: customName,
      callerName: customName,
      callerNumber: customNumber,
      relationship: 'Emergency Contact',
      voicePitch: 1.0,
      voiceRate: 0.95,
      dialogueScript: [
        {
          speaker: customName,
          text: customLine,
          spokenText: customLine,
        },
        {
          speaker: 'You',
          text: "(Speak naturally: 'Got it, walking out the front doors right now!')",
          spokenText: '',
        },
        {
          speaker: customName,
          text: "Okay, I'm watching the doors with my hazard lights on. See you in a minute.",
          spokenText: "Okay, I'm watching the doors with my hazard lights on. See you in a minute.",
        },
      ],
    };

  const script = currentPersona.dialogueScript;

  // Ringtone handling
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

  // Duration timer
  useEffect(() => {
    let timer: any;
    if (callState === 'connected') {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callState]);

  // Automatic spoken dialogue audio via Web Speech Synthesis when connected and speaker is on
  useEffect(() => {
    if (callState === 'connected' && isSpeaker) {
      const line = script[dialogueIndex];
      if (line && line.spokenText) {
        soundEffects.speakPersonaDialogue(line.spokenText, currentPersona.voicePitch, currentPersona.voiceRate);
      }
    }
  }, [callState, dialogueIndex, isSpeaker, selectedPersonaId]);

  // Auto-advance dialogue script
  useEffect(() => {
    if (callState === 'connected') {
      const interval = setInterval(() => {
        setDialogueIndex((prev) => (prev < script.length - 1 ? prev + 1 : prev));
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [callState, script.length]);

  const handleAccept = () => {
    soundEffects.stopRingtone();
    setCallState('connected');
  };

  const handleDecline = () => {
    soundEffects.stopRingtone();
    soundEffects.stopSpeaking();
    onDismiss();
  };

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-gradient-to-b from-[#160c28] via-[#0f071e] to-black text-white p-5 backdrop-blur-2xl animate-in fade-in duration-200 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Banner / Privacy Bar */}
      <div className="flex items-center justify-between text-xs text-purple-300 pt-1">
        <span className="flex items-center gap-1.5 font-bold text-purple-300">
          <ShieldAlert className="w-4 h-4 text-purple-400" />
          TRAVORA Discreet Disruption Call
        </span>
        <button
          onClick={onTriggerSos}
          className="bg-red-950/90 border border-red-600/70 hover:bg-red-900 text-red-200 px-2.5 py-1 rounded-lg text-[11px] font-bold shadow-md transition"
        >
          Silent Panic SOS
        </button>
      </div>

      {/* Caller Persona Selector (Visible while incoming) */}
      {callState === 'incoming' && (
        <div className="w-full max-w-sm mx-auto mt-2">
          <div className="flex items-center justify-between text-[11px] text-purple-200 mb-1 px-1">
            <span>Select Caller Persona:</span>
            <button
              onClick={() => setCustomPersonaModal(true)}
              className="text-purple-400 hover:text-purple-300 underline font-semibold flex items-center gap-1"
            >
              <Settings className="w-3 h-3" /> Custom Persona
            </button>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
            {fakeCallPersonas.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedPersonaId(p.id);
                  setDialogueIndex(0);
                }}
                className={`px-2.5 py-1 rounded-lg shrink-0 font-medium border transition ${
                  selectedPersonaId === p.id
                    ? 'bg-purple-600 text-white border-purple-400 font-bold shadow-sm'
                    : 'bg-stone-900/80 text-stone-300 border-purple-900/40 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Caller Info Display */}
      <div className="flex flex-col items-center justify-center my-auto space-y-4">
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-amber-500 p-1 flex items-center justify-center shadow-2xl">
            <div className="w-full h-full rounded-full bg-[#160c28] flex items-center justify-center text-4xl font-extrabold text-purple-200">
              {currentPersona.callerName.charAt(0)}
            </div>
          </div>
          {callState === 'connected' && (
            <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-[#160c28] animate-pulse" />
          )}
        </div>

        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-white">{currentPersona.callerName}</h2>
          <p className="text-xs text-purple-300/80 font-mono">{currentPersona.callerNumber}</p>
          <p className="text-sm font-semibold text-purple-400">
            {callState === 'incoming' ? 'Incoming Cellular Call...' : formatDuration(callDuration)}
          </p>
        </div>

        {/* Scripted Dialogue & Live Speech Box */}
        {callState === 'connected' && (
          <div className="w-full max-w-sm mt-3 p-4 rounded-2xl bg-stone-950/80 border border-purple-900/60 text-left space-y-2 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between text-[11px] font-bold text-purple-300 uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" /> Spoken Dialogue Transcript:
              </span>
              {isSpeaker && (
                <span className="text-emerald-400 font-mono text-[10px] flex items-center gap-1">
                  <Volume2 className="w-3 h-3 animate-pulse" /> Voice Playing
                </span>
              )}
            </div>

            <div className="text-xs text-stone-200 bg-[#160c28]/90 p-3 rounded-xl border border-purple-900/40 leading-relaxed min-h-[50px] flex items-center">
              <div>
                <span className="font-bold text-purple-300">{script[dialogueIndex]?.speaker}: </span>
                {script[dialogueIndex]?.text}
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1">
              <span>Cue {dialogueIndex + 1} of {script.length}</span>
              <button
                onClick={() => setDialogueIndex((prev) => (prev + 1) % script.length)}
                className="text-purple-400 hover:text-purple-300 font-bold underline"
              >
                Skip to Next Line →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* In-Call Controls or Incoming Accept/Decline */}
      {callState === 'incoming' ? (
        <div className="pb-8 pt-4 flex items-center justify-around max-w-sm mx-auto w-full">
          {/* Decline Button */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={handleDecline}
              aria-label="Decline Call"
              className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white shadow-xl active:scale-95 transition"
            >
              <PhoneOff className="w-7 h-7" />
            </button>
            <span className="text-xs font-semibold text-stone-300">Decline</span>
          </div>

          {/* Accept Button */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={handleAccept}
              aria-label="Accept Call"
              className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center text-white shadow-xl active:scale-95 transition animate-bounce"
            >
              <Phone className="w-7 h-7" />
            </button>
            <span className="text-xs font-semibold text-stone-300">Accept</span>
          </div>
        </div>
      ) : (
        <div className="pb-6 space-y-5 max-w-sm mx-auto w-full">
          <div className="grid grid-cols-3 gap-3 text-center">
            {/* Mute */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3 rounded-2xl flex flex-col items-center gap-1 transition ${
                isMuted
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50'
                  : 'bg-stone-900/80 text-stone-300 border border-stone-800'
              }`}
            >
              {isMuted ? <MicOff className="w-5 h-5 text-purple-300" /> : <Mic className="w-5 h-5" />}
              <span className="text-[11px] font-medium">{isMuted ? 'Muted' : 'Mute'}</span>
            </button>

            {/* Speaker & Spoken Voice Toggle */}
            <button
              onClick={() => {
                const next = !isSpeaker;
                setIsSpeaker(next);
                if (!next) soundEffects.stopSpeaking();
              }}
              className={`p-3 rounded-2xl flex flex-col items-center gap-1 transition ${
                isSpeaker
                  ? 'bg-purple-600 text-white border border-purple-400 shadow-md'
                  : 'bg-stone-900/80 text-stone-300 border border-stone-800'
              }`}
            >
              {isSpeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              <span className="text-[11px] font-medium">{isSpeaker ? 'Voice On' : 'Earpiece'}</span>
            </button>

            {/* Next Cue */}
            <button
              onClick={() => setDialogueIndex((prev) => (prev + 1) % script.length)}
              className="p-3 rounded-2xl bg-stone-900/80 text-stone-300 border border-stone-800 flex flex-col items-center gap-1 hover:bg-stone-800"
            >
              <span className="text-base font-bold">💬</span>
              <span className="text-[11px] font-medium">Next Cue</span>
            </button>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleDecline}
              className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white shadow-xl active:scale-95 transition"
            >
              <PhoneOff className="w-7 h-7" />
            </button>
          </div>
        </div>
      )}

      {/* Custom Persona Setup Modal */}
      {customPersonaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl bg-[#1a0f30] border border-purple-800 p-5 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Configure Custom Caller Persona
            </h3>
            <div className="space-y-2 text-xs">
              <div>
                <label className="text-purple-300 block mb-1">Caller Name</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-stone-950 border border-purple-900/50 text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-purple-300 block mb-1">Caller Phone Number</label>
                <input
                  type="text"
                  value={customNumber}
                  onChange={(e) => setCustomNumber(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-stone-950 border border-purple-900/50 text-white focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="text-purple-300 block mb-1">Opening Voice Line</label>
                <textarea
                  rows={2}
                  value={customLine}
                  onChange={(e) => setCustomLine(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-stone-950 border border-purple-900/50 text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setCustomPersonaModal(false)}
                className="flex-1 py-2 rounded-xl border border-stone-700 text-stone-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setSelectedPersonaId('custom');
                  setCustomPersonaModal(false);
                }}
                className="flex-1 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold"
              >
                Use Persona
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
