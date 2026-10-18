import React, { useState } from 'react';
import {
  X,
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  Camera,
  Compass,
  CheckCircle,
  Plus,
  Sparkles,
} from 'lucide-react';
import { AreaArticle } from '../../types';

interface AddArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddArticle: (article: AreaArticle) => void;
  currentDistrict: string;
  theme: 'dark' | 'light';
}

const photoPresets = [
  {
    label: 'Mountain Ridge / Hike',
    url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1000&auto=format&fit=crop&q=85',
  },
  {
    label: 'Sacred Temple / Culture',
    url: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?w=1000&auto=format&fit=crop&q=85',
  },
  {
    label: 'Lakeside / Water Promenade',
    url: 'https://images.unsplash.com/photo-1588258524675-c63589b76c8c?w=1000&auto=format&fit=crop&q=85',
  },
  {
    label: 'Ceylon Tea Estate & Factory',
    url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=1000&auto=format&fit=crop&q=85',
  },
  {
    label: 'Coastal Beach & Ramparts',
    url: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=1000&auto=format&fit=crop&q=85',
  },
];

export const AddArticleModal: React.FC<AddArticleModalProps> = ({
  isOpen,
  onClose,
  onAddArticle,
  currentDistrict,
  theme,
}) => {
  const isDark = theme === 'dark';

  const [destinationName, setDestinationName] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [district, setDistrict] = useState(currentDistrict || 'Kandy');
  const [category, setCategory] = useState('Scenic Walks & Parks');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [soloSafetyRating, setSoloSafetyRating] = useState('4.9 / 5.0 (Tourist Police & Well-lit)');
  const [duration, setDuration] = useState('1.5 - 2 Hours');
  const [bestTimeOfDay, setBestTimeOfDay] = useState('Early Morning (06:30 AM) or Golden Hour Sunset');
  const [entryFee, setEntryFee] = useState('Free public access');
  const [overview, setOverview] = useState('');
  const [safetyTips, setSafetyTips] = useState('');
  const [highlights, setHighlights] = useState('');
  const [heroImage, setHeroImage] = useState(photoPresets[0].url);
  const [userReview, setUserReview] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destinationName.trim() || !title.trim() || !overview.trim()) return;

    const tipsArray = safetyTips
      .split('\n')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const highlightsArray = highlights
      .split('\n')
      .map((h) => h.trim())
      .filter((h) => h.length > 0);

    const newArticle: AreaArticle = {
      id: `art_user_${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim() || `Essential solo guide & traveler review for ${destinationName}`,
      destinationCity: district,
      category,
      heroImage: heroImage.trim() || photoPresets[0].url,
      rating: rating,
      reviewsCount: 1,
      readTime: '4 min read',
      difficulty: 'Easy',
      duration,
      bestTimeOfDay,
      entryFee,
      soloFemaleSafetyRating: soloSafetyRating,
      overview: overview.trim(),
      keySafetyTips: tipsArray.length > 0 ? tipsArray : [
        'Stay on well-lit main corridors after dark.',
        'Use verified HelaGo rides or metered tuk-tuks for transit.',
        'Keep live GPS broadcast active with your emergency contacts.',
      ],
      highlights: highlightsArray.length > 0 ? highlightsArray : [
        `${destinationName} scenic viewpoint`,
        'Safe female-friendly cafes nearby',
        'Direct access to public transport & tourist police',
      ],
      photos: [
        heroImage.trim() || photoPresets[0].url,
        photoPresets[1].url,
      ],
      travelerReviews: [
        {
          author: 'Piyumi Anuradha (Verified Author)',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          country: 'Sri Lanka',
          rating: rating,
          comment: userReview.trim() || 'Had a wonderful and completely safe visit. Highly recommended for solo female travelers visiting Sri Lanka!',
          date: 'Just now',
        },
      ],
    };

    onAddArticle(newArticle);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className={`w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl my-auto transition-all border ${
        isDark ? 'bg-[#150a28] text-white border-purple-800/60' : 'bg-white text-stone-900 border-purple-200'
      }`}>
        {/* Modal Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          isDark ? 'border-purple-900/40 bg-[#1c0f38]' : 'border-purple-100 bg-purple-50/70'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-400">
              <Compass className="w-4 h-4 text-purple-600 dark:text-purple-300" />
            </div>
            <div>
              <h2 className="font-black text-sm sm:text-base text-stone-900 dark:text-white">
                Write Destination Article & Review
              </h2>
              <p className="text-[11px] text-stone-600 dark:text-purple-200">
                Share authentic descriptions, reviews, and star ratings for solo travelers
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-xl transition ${
              isDark ? 'hover:bg-purple-900/50 text-stone-400 hover:text-white' : 'hover:bg-purple-100 text-stone-600 hover:text-stone-900'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 flex flex-col gap-4 max-h-[78vh] overflow-y-auto text-xs">
          {/* Destination & District */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-extrabold text-[11px] text-stone-800 dark:text-purple-200 block mb-1">
                Destination Name *
              </label>
              <input
                type="text"
                required
                value={destinationName}
                onChange={(e) => setDestinationName(e.target.value)}
                placeholder="e.g. Little Adam’s Peak, Ella"
                className={`w-full p-2.5 rounded-xl border outline-none font-medium ${
                  isDark ? 'bg-black/40 border-purple-800/60 text-white placeholder-stone-500' : 'bg-purple-50/40 border-purple-200 text-stone-900 placeholder-stone-400'
                }`}
              />
            </div>

            <div>
              <label className="font-extrabold text-[11px] text-stone-800 dark:text-purple-200 block mb-1">
                District / Region *
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className={`w-full p-2.5 rounded-xl border outline-none font-medium cursor-pointer ${
                  isDark ? 'bg-stone-900 border-purple-800/60 text-white' : 'bg-purple-50/40 border-purple-200 text-stone-900'
                }`}
              >
                <option value="Kandy">Kandy District</option>
                <option value="Colombo">Colombo District</option>
                <option value="Galle">Galle District</option>
                <option value="Ella">Ella / Badulla</option>
                <option value="Nuwara Eliya">Nuwara Eliya</option>
                <option value="Jaffna">Jaffna District</option>
                <option value="Trincomalee">Trincomalee</option>
                <option value="Matara">Matara & Mirissa</option>
                <option value="Sigiriya">Sigiriya & Matale</option>
                <option value="Anuradhapura">Anuradhapura</option>
              </select>
            </div>
          </div>

          {/* Article Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-extrabold text-[11px] text-stone-800 dark:text-purple-200 block mb-1">
                Article Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sunrise Hike to Little Adam’s Peak: Solo Guide"
                className={`w-full p-2.5 rounded-xl border outline-none font-medium ${
                  isDark ? 'bg-black/40 border-purple-800/60 text-white placeholder-stone-500' : 'bg-purple-50/40 border-purple-200 text-stone-900 placeholder-stone-400'
                }`}
              />
            </div>

            <div>
              <label className="font-extrabold text-[11px] text-stone-800 dark:text-purple-200 block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full p-2.5 rounded-xl border outline-none font-medium cursor-pointer ${
                  isDark ? 'bg-stone-900 border-purple-800/60 text-white' : 'bg-purple-50/40 border-purple-200 text-stone-900'
                }`}
              >
                <option value="Outdoor Adventures & Trails">Outdoor Adventures & Trails</option>
                <option value="Culture & Sacred Heritage">Culture & Sacred Heritage</option>
                <option value="Scenic Walks & Parks">Scenic Walks & Parks</option>
                <option value="Heritage & Culinary">Heritage & Culinary</option>
                <option value="Coastal Beach & Surfing">Coastal Beach & Surfing</option>
                <option value="Nature & Wildlife">Nature & Wildlife</option>
              </select>
            </div>
          </div>

          {/* INTERACTIVE STAR RATING (1 - 5 STARS) */}
          <div className={`p-3.5 rounded-2xl border ${
            isDark ? 'bg-[#1a0f35] border-purple-800/60' : 'bg-amber-50/60 border-amber-200'
          }`}>
            <label className="font-extrabold text-xs text-stone-900 dark:text-white block mb-1.5 flex items-center justify-between">
              <span>Your Star Rating for this Destination *</span>
              <span className="text-amber-500 font-black text-xs">
                {rating} / 5 Stars {rating === 5 ? '★ (Outstanding)' : rating >= 4 ? '★ (Very Good)' : '★'}
              </span>
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= (hoverRating ?? rating)
                        ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                        : isDark
                        ? 'text-stone-600'
                        : 'text-stone-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-[11px] text-stone-600 dark:text-stone-300 ml-2">
                Click a star to rate
              </span>
            </div>
          </div>

          {/* Personal Review & Feedback */}
          <div>
            <label className="font-extrabold text-[11px] text-stone-800 dark:text-purple-200 block mb-1">
              Your Review & Personal Experience *
            </label>
            <textarea
              rows={2}
              required
              value={userReview}
              onChange={(e) => setUserReview(e.target.value)}
              placeholder="Tell other solo travelers what your experience was like, whether locals were helpful, safe cafes nearby..."
              className={`w-full p-2.5 rounded-xl border outline-none font-medium leading-relaxed ${
                isDark ? 'bg-black/40 border-purple-800/60 text-white placeholder-stone-500' : 'bg-purple-50/40 border-purple-200 text-stone-900 placeholder-stone-400'
              }`}
            />
          </div>

          {/* Detailed Description / Story */}
          <div>
            <label className="font-extrabold text-[11px] text-stone-800 dark:text-purple-200 block mb-1">
              Detailed Article Description & Story *
            </label>
            <textarea
              rows={3}
              required
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              placeholder="Describe the atmosphere, historical context, trails, best vantage points, views, and overall solo travel vibe..."
              className={`w-full p-2.5 rounded-xl border outline-none font-medium leading-relaxed ${
                isDark ? 'bg-black/40 border-purple-800/60 text-white placeholder-stone-500' : 'bg-purple-50/40 border-purple-200 text-stone-900 placeholder-stone-400'
              }`}
            />
          </div>

          {/* Safety Tips & Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-extrabold text-[11px] text-stone-800 dark:text-purple-200 block mb-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-300" />
                <span>Safety Tips for Solo Women (1 per line)</span>
              </label>
              <textarea
                rows={3}
                value={safetyTips}
                onChange={(e) => setSafetyTips(e.target.value)}
                placeholder="e.g.
Start hike before 07:00 AM
Take water and sun protection
Hire licensed female guide for secluded ridge"
                className={`w-full p-2.5 rounded-xl border outline-none font-mono text-[11px] ${
                  isDark ? 'bg-black/40 border-purple-800/60 text-white placeholder-stone-500' : 'bg-purple-50/40 border-purple-200 text-stone-900 placeholder-stone-400'
                }`}
              />
            </div>

            <div>
              <label className="font-extrabold text-[11px] text-stone-800 dark:text-purple-200 block mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Key Highlights (1 per line)</span>
              </label>
              <textarea
                rows={3}
                value={highlights}
                onChange={(e) => setHighlights(e.target.value)}
                placeholder="e.g.
360-degree mountain ridge panorama
Working tea factory & tasting
Direct train connection"
                className={`w-full p-2.5 rounded-xl border outline-none font-mono text-[11px] ${
                  isDark ? 'bg-black/40 border-purple-800/60 text-white placeholder-stone-500' : 'bg-purple-50/40 border-purple-200 text-stone-900 placeholder-stone-400'
                }`}
              />
            </div>
          </div>

          {/* Cover Photo Selection */}
          <div>
            <label className="font-extrabold text-[11px] text-stone-800 dark:text-purple-200 block mb-1.5 flex items-center gap-1">
              <Camera className="w-3.5 h-3.5 text-purple-600 dark:text-purple-300" />
              <span>Select Cover Photo Preset (or paste URL)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-2">
              {photoPresets.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => setHeroImage(preset.url)}
                  className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all relative ${
                    heroImage === preset.url
                      ? 'border-purple-600 ring-2 ring-purple-500/50 scale-102'
                      : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={preset.url} alt={preset.label} className="w-full h-14 object-cover" />
                  <span className="absolute inset-x-0 bottom-0 bg-black/75 text-white text-[8px] font-bold py-0.5 px-1 truncate text-center">
                    {preset.label}
                  </span>
                </div>
              ))}
            </div>
            <input
              type="url"
              value={heroImage}
              onChange={(e) => setHeroImage(e.target.value)}
              placeholder="Or enter custom image URL (https://...)"
              className={`w-full p-2 rounded-xl border outline-none text-xs ${
                isDark ? 'bg-black/40 border-purple-800/60 text-white placeholder-stone-500' : 'bg-purple-50/40 border-purple-200 text-stone-900 placeholder-stone-400'
              }`}
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-purple-900/30">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2.5 rounded-xl font-bold transition ${
                isDark ? 'bg-stone-800 text-stone-300 hover:bg-stone-700' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-extrabold px-6 py-2.5 rounded-xl shadow-md active:scale-95 transition flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Publish Destination Article</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
