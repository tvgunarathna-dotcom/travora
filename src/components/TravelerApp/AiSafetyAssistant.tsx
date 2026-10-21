import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  RotateCcw,
  CheckCircle,
} from 'lucide-react';
import { apiService } from '../../services/api';
import { soundEffects } from '../../services/soundEffects';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AiSafetyAssistantProps {
  initialPrompt?: string;
  currentCity?: string;
  theme: 'dark' | 'light';
}

export const AiSafetyAssistant: React.FC<AiSafetyAssistantProps> = ({
  initialPrompt,
  currentCity = 'Colombo, Sri Lanka',
  theme,
}) => {
  const isDark = theme === 'dark';

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init_1',
      role: 'assistant',
      content: `Hello! I'm **Serena**, your personal TRAVORA travel companion and AI concierge. 

I'm here 24/7 to provide you with **personalized travel advice**, safe walking routes in **${currentCity}**, sacred temple dress codes, hidden cultural gems, and custom itinerary suggestions across Kandy, Galle, Colombo, Ella, Nuwara Eliya, Jaffna, Trincomalee, and beyond. How can I assist your journey today?`,
      timestamp: 'Active Now',
    },
  ]);

  const [inputText, setInputText] = useState(initialPrompt || '');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceChatEnabled, setVoiceChatEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const samplePrompts = [
    'Top safe things to do in Kandy for a solo female traveler',
    'Best sunset walking route & safe cafes in Galle Fort',
    'Temple dress codes & etiquette for Temple of the Tooth',
    'Tips for scenic train ride from Kandy to Ella',
    'How safe is Pettah Market & Colombo 07 in the evening?',
    'What to pack for Gregory Lake & Nuwara Eliya weather?',
  ];

  // Speech-to-Text simulation / Web Speech API
  const handleToggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      // Simulate voice input
      setIsListening(true);
      setTimeout(() => {
        setInputText('Is it safe to walk along Galle Face beach after 10 PM?');
        setIsListening(false);
      }, 1500);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        handleSend(transcript);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await apiService.querySerena(query, { city: currentCity });
      const replyContent = response.reply || "I'm Serena, your safety companion. Let me look that up for you.";

      const assistantMsg: Message = {
        id: `a_${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // If voice chat is enabled, speak the answer aloud!
      if (voiceChatEnabled) {
        // Strip markdown hashes for cleaner speech
        const cleanSpeech = replyContent.replace(/[#*`_]/g, '');
        soundEffects.speakPersonaDialogue(cleanSpeech.substring(0, 220), 1.1, 1.0);
      }
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: 'Unable to reach cloud network. Local emergency hotlines: Police 119, Tourist Police 1912, Free Ambulance 1990.',
          timestamp: 'Offline Note',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 pb-14 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Serena Header Banner */}
      <div className={`p-4 rounded-3xl border flex items-center justify-between ${
        isDark ? 'bg-[#150f24] border-purple-900/40' : 'bg-white border-purple-100 shadow-sm'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-700 via-purple-600 to-fuchsia-500 p-0.5 shadow-md flex items-center justify-center text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-extrabold">Serena · AI Safety Concierge</h2>
              <span className="text-[10px] bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30 px-1.5 rounded-full font-bold">
                24/7 ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Voice-enabled solo travel guide · {currentCity}
            </p>
          </div>
        </div>

        {/* Voice Chat Toggle */}
        <button
          onClick={() => {
            const next = !voiceChatEnabled;
            setVoiceChatEnabled(next);
            if (!next) soundEffects.stopSpeaking();
          }}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
            voiceChatEnabled
              ? 'bg-purple-600 text-white border-purple-500 shadow-xs'
              : isDark
              ? 'bg-stone-900 border-purple-900/40 text-stone-400'
              : 'bg-purple-50 border-purple-100 text-purple-700'
          }`}
        >
          {voiceChatEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span>{voiceChatEnabled ? 'Voice Chat ON' : 'Voice Chat OFF'}</span>
        </button>
      </div>

      {/* Suggested Quick Questions */}
      <div className="space-y-1.5">
        <div className="text-[10px] text-stone-500 dark:text-stone-400 font-bold uppercase tracking-wider px-1">
          Safety Topics for Solo Travelers:
        </div>
        <div className="grid grid-cols-2 gap-2">
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className={`p-2.5 rounded-2xl border text-left text-[11px] transition line-clamp-2 ${
                isDark
                  ? 'bg-stone-900/70 border-purple-900/30 text-stone-300 hover:border-purple-600'
                  : 'bg-white border-purple-100 text-stone-700 hover:border-purple-400 shadow-xs'
              }`}
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </div>

      {/* Messages Stream */}
      <div className="space-y-3 min-h-[280px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`p-2 rounded-2xl shrink-0 ${
              msg.role === 'user'
                ? 'bg-purple-700 text-white'
                : 'bg-purple-600/20 text-purple-600 dark:text-purple-300 border border-purple-500/30'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`p-3.5 rounded-3xl text-xs leading-relaxed max-w-[85%] ${
                msg.role === 'user'
                  ? 'bg-purple-700 text-white rounded-tr-xs'
                  : isDark
                  ? 'bg-[#150f24] border border-purple-900/40 text-stone-200 rounded-tl-xs space-y-2'
                  : 'bg-white border border-purple-100 text-stone-800 rounded-tl-xs shadow-xs space-y-2'
              }`}
            >
              <div className="whitespace-pre-line leading-relaxed">
                {msg.content}
              </div>
              <div className="text-[9px] text-stone-400 text-right mt-1">
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-purple-950/20 rounded-2xl border border-purple-900/40 w-fit text-xs text-purple-300">
            <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
            <span>Serena is analyzing real-time safety advisories...</span>
          </div>
        )}
      </div>

      {/* Input Bar with Voice-to-Text Button */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleToggleVoiceInput}
          className={`p-3 rounded-2xl border transition ${
            isListening
              ? 'bg-red-600 text-white border-red-500 animate-pulse'
              : isDark
              ? 'bg-stone-900 border-purple-900/40 text-purple-400'
              : 'bg-purple-50 border-purple-200 text-purple-700'
          }`}
          title="Speak to Serena (Voice Recognition)"
        >
          {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={isListening ? 'Listening to your voice...' : 'Ask Serena about night curfews, temple dress codes, tuk-tuks...'}
          className={`flex-1 rounded-2xl px-4 py-3 text-xs border focus:outline-none focus:border-purple-600 ${
            isDark ? 'bg-[#150f24] border-purple-900/40 text-stone-100' : 'bg-white border-purple-200 text-stone-900'
          }`}
        />

        <button
          onClick={() => handleSend()}
          disabled={!inputText.trim() || isLoading}
          className="p-3 rounded-2xl bg-purple-700 hover:bg-purple-600 text-white shadow-md disabled:opacity-50 active:scale-95 transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
