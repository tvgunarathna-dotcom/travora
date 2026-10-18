import React from 'react';
import {
  ArrowLeft,
  Star,
  Clock,
  Compass,
  ShieldCheck,
  MapPin,
  Bookmark,
  Share2,
  Calendar,
  Sparkles,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { AreaArticle } from '../../types';

interface ArticleDetailModalProps {
  article: AreaArticle | null;
  onClose: () => void;
  onAskSerena: (query: string) => void;
  theme: 'dark' | 'light';
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  article,
  onClose,
  onAskSerena,
  theme,
}) => {
  if (!article) return null;
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className={`w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl my-auto transition-all ${
        isDark ? 'bg-[#150a28] text-white border border-purple-800/50' : 'bg-white text-stone-900 border border-purple-100'
      }`}>
        {/* Hero Banner with TripAdvisor Style Controls */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-stone-900">
          <img
            src={article.heroImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/40" />

          {/* Top Bar Floating Buttons */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center backdrop-blur-md transition active:scale-95"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <button
                className="w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center backdrop-blur-md transition"
                title="Save Article"
              >
                <Bookmark className="w-4 h-4" />
              </button>
              <button
                className="w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center backdrop-blur-md transition"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Title on Hero */}
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-600 text-white inline-block mb-1.5 shadow-sm">
              {article.category} · {article.destinationCity}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-md">
              {article.title}
            </h1>
            <p className="text-xs text-purple-200 mt-1 line-clamp-1">
              {article.subtitle}
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 flex flex-col gap-5 max-h-[65vh] overflow-y-auto">
          {/* Rating and Metadata Strip */}
          <div className={`flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl border ${
            isDark ? 'bg-purple-950/40 border-purple-800/40' : 'bg-purple-50/80 border-purple-100'
          }`}>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5 text-amber-500">
                <Star className="w-4 h-4 fill-amber-500" />
                <span className="font-extrabold text-sm text-stone-900 dark:text-white">
                  {article.rating}
                </span>
              </div>
              <span className="text-xs text-stone-700 dark:text-stone-300 font-medium">
                ({article.reviewsCount} reviews)
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-purple-800 dark:text-purple-300 font-bold">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {article.duration}
              </span>
              <span className="flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" /> {article.difficulty}
              </span>
            </div>
          </div>

          {/* Solo Female Traveler Safety Index Callout */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/60 to-indigo-950/60 border border-purple-500/50 text-white flex items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-purple-300">
                  Female Solo Safety Rating
                </span>
                <p className="text-sm font-black text-white">{article.soloFemaleSafetyRating}</p>
              </div>
            </div>
            <div className="text-right text-[11px] text-purple-200">
              <span className="block font-semibold">Entry: {article.entryFee}</span>
              <span className="text-[10px] text-purple-300/80">Best: {article.bestTimeOfDay}</span>
            </div>
          </div>

          {/* Overview Section */}
          <div>
            <h3 className="text-sm font-extrabold mb-1.5 text-stone-900 dark:text-purple-200">
              Overview
            </h3>
            <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
              {article.overview}
            </p>
          </div>

          {/* Key Safety Tips for Solo Women */}
          <div className={`p-4 rounded-2xl border ${
            isDark ? 'bg-black/40 border-purple-800/50' : 'bg-purple-50/60 border-purple-200'
          }`}>
            <div className="flex items-center gap-2 mb-2 text-purple-600 dark:text-purple-300 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Key Safety Tips for Female Solo Travelers</span>
            </div>
            <ul className="flex flex-col gap-2">
              {article.keySafetyTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-stone-700 dark:text-stone-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Highlights */}
          <div>
            <h3 className="text-sm font-extrabold mb-2 text-stone-900 dark:text-purple-200">
              Experience Highlights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {article.highlights.map((h, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                    isDark ? 'bg-purple-950/20 border-purple-900/40 text-stone-200' : 'bg-white border-purple-100 text-stone-800'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Photo Gallery */}
          {article.photos && article.photos.length > 0 && (
            <div>
              <h3 className="text-sm font-extrabold mb-2 text-stone-900 dark:text-purple-200">
                Photo Gallery
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {article.photos.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Photo ${idx + 1}`}
                    className="w-full h-24 object-cover rounded-xl border border-purple-900/30"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Traveler Reviews */}
          <div>
            <h3 className="text-sm font-extrabold mb-2 text-stone-900 dark:text-purple-200">
              Recent Solo Female Reviews
            </h3>
            <div className="flex flex-col gap-2">
              {article.travelerReviews.map((rev, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border text-xs ${
                    isDark ? 'bg-stone-900/60 border-purple-900/40 text-stone-200' : 'bg-stone-50 border-stone-200 text-stone-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <img
                        src={rev.avatar}
                        alt={rev.author}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="font-bold text-stone-900 dark:text-white">
                        {rev.author}
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-stone-600 dark:text-stone-300 italic">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className={`p-4 border-t flex items-center justify-between gap-3 ${
          isDark ? 'bg-[#0f0a1c] border-purple-900/50' : 'bg-purple-50 border-purple-100'
        }`}>
          <button
            onClick={() => {
              onAskSerena(`What are the latest safety tips and night curfews for visiting ${article.title}?`);
              onClose();
            }}
            className="flex-1 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition"
          >
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span>Ask Serena AI About This Trail</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-purple-300 dark:border-purple-800 text-xs font-semibold hover:bg-purple-100 dark:hover:bg-purple-950 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
