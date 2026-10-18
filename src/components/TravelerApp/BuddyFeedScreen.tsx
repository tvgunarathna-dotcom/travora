import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  MessageCircle,
  MapPin,
  Calendar,
  Clock,
  Globe,
  Sparkles,
  Send,
  ArrowLeft,
  Share2,
  AlertOctagon,
  Plus,
  Search,
  Filter,
  DollarSign,
  Car,
  X,
  Edit2,
  Trash2,
  Star,
  CheckCircle,
  Compass,
  AlertTriangle,
} from 'lucide-react';
import { UserProfile, TravelBuddy, CommunityPost, ChatMessage, TravelGuide } from '../../types';
import { verifiedTravelBuddies, mockCommunityPosts, mockTravelGuides } from '../../data/mockData';

interface BuddyFeedScreenProps {
  user: UserProfile;
  onOpenVerification: () => void;
  onBookGuide?: (guide: TravelGuide) => void;
  theme: 'dark' | 'light';
}

export const BuddyFeedScreen: React.FC<BuddyFeedScreenProps> = ({
  user,
  onOpenVerification,
  onBookGuide,
  theme,
}) => {
  const isDark = theme === 'dark';

  // Section Selector: 'buddies' vs 'guides'
  const [activeSection, setActiveSection] = useState<'buddies' | 'guides'>('buddies');

  // Sub-tabs: 'posts' (Requests) vs 'travelers' (Directory)
  const [buddySubTab, setBuddySubTab] = useState<'posts' | 'travelers'>('posts');

  // Search & Filter state
  const [filterCity, setFilterCity] = useState<string>('all');
  const [filterBudget, setFilterBudget] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Community Posts
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() => {
    const saved = localStorage.getItem('travora_community_posts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return mockCommunityPosts;
      }
    }
    return mockCommunityPosts;
  });

  const [showPostModal, setShowPostModal] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  // In-App Delete Confirmation Modal State (Reliable in sandboxed iframes)
  const [postToDelete, setPostToDelete] = useState<CommunityPost | null>(null);

  // Form State with valid date/time defaults
  const [formTitle, setFormTitle] = useState('');
  const [formDestination, setFormDestination] = useState('Kandy');
  const [formStartDate, setFormStartDate] = useState('2026-10-20');
  const [formEndDate, setFormEndDate] = useState('2026-10-22');
  const [formStartTime, setFormStartTime] = useState('08:00');
  const [formEndTime, setFormEndTime] = useState('17:00');
  const [formBudget, setFormBudget] = useState<'$' | '$$' | '$$$'>('$$');
  const [formTransport, setFormTransport] = useState<'HelaGo Cab' | 'Train' | 'Tuk-Tuk' | 'Shared Van' | 'Walking'>('HelaGo Cab');
  const [formDetails, setFormDetails] = useState('');

  // Direct Messaging Modal State
  const [activeChatBuddy, setActiveChatBuddy] = useState<TravelBuddy | TravelGuide | null>(null);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({
    tb_elena: [
      {
        id: 'm1',
        senderId: 'tb_elena',
        text: "Hi Piyumi! Saw your note on the Hanthana trail. Would love to split an electric HelaGo cab tomorrow morning!",
        timestamp: '10:15 AM',
      },
    ],
  });
  const [inputMsg, setInputMsg] = useState('');

  // Helper to ensure YYYY-MM-DD format for <input type="date">
  const normalizeDate = (raw: string | undefined): string => {
    if (!raw) return '2026-10-20';
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw.trim())) return raw.trim();
    // Try to parse or fallback
    const parsed = new Date(raw);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().split('T')[0];
    }
    return '2026-10-20';
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingPostId(null);
    setFormTitle('');
    setFormDestination('Kandy');
    setFormStartDate('2026-10-20');
    setFormEndDate('2026-10-22');
    setFormStartTime('08:00');
    setFormEndTime('17:00');
    setFormBudget('$$');
    setFormTransport('HelaGo Cab');
    setFormDetails('');
    setShowPostModal(true);
  };

  // Open Edit Modal with normalized dates
  const handleOpenEditModal = (post: CommunityPost) => {
    setEditingPostId(post.postId);
    setFormTitle(post.activityTitle);
    setFormDestination(post.destinationCity);
    setFormStartDate(normalizeDate(post.startDate));
    setFormEndDate(normalizeDate(post.endDate));
    setFormStartTime(post.startTime || '08:00');
    setFormEndTime(post.endTime || '17:00');
    setFormBudget(post.budgetTier);
    setFormTransport(post.transportMode);
    setFormDetails(post.activityDetails);
    setShowPostModal(true);
  };

  // Trigger Delete Confirmation Modal
  const handleRequestDelete = (post: CommunityPost) => {
    setPostToDelete(post);
  };

  // Confirm In-App Deletion
  const handleConfirmDelete = () => {
    if (!postToDelete) return;
    const updated = communityPosts.filter((p) => p.postId !== postToDelete.postId);
    setCommunityPosts(updated);
    try {
      localStorage.setItem('travora_community_posts', JSON.stringify(updated));
    } catch (e) {}
    setPostToDelete(null);
  };

  // Save / Update Post
  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    let updatedPosts: CommunityPost[];

    if (editingPostId) {
      // Update existing post
      updatedPosts = communityPosts.map((p) =>
        p.postId === editingPostId
          ? {
              ...p,
              activityTitle: formTitle.trim(),
              destinationCity: formDestination.trim(),
              startDate: formStartDate,
              endDate: formEndDate,
              startTime: formStartTime,
              endTime: formEndTime,
              budgetTier: formBudget,
              transportMode: formTransport,
              activityDetails: formDetails.trim(),
            }
          : p
      );
    } else {
      // Create new post
      const newPost: CommunityPost = {
        postId: `post_${Date.now()}`,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        isVerified: true,
        destinationCity: formDestination.trim(),
        startDate: formStartDate,
        endDate: formEndDate,
        startTime: formStartTime,
        endTime: formEndTime,
        budgetTier: formBudget,
        transportMode: formTransport,
        activityTitle: formTitle.trim(),
        activityDetails: formDetails.trim() || 'Looking for verified female travel companions to explore safely together.',
        tags: ['VerifiedBuddy', 'SafeMeetup'],
        responsesCount: 0,
        createdAt: 'Just now',
      };
      updatedPosts = [newPost, ...communityPosts];
    }

    setCommunityPosts(updatedPosts);
    try {
      localStorage.setItem('travora_community_posts', JSON.stringify(updatedPosts));
    } catch (e) {}

    setShowPostModal(false);
  };

  const handleSendMessage = () => {
    if (!inputMsg.trim() || !activeChatBuddy) return;
    const buddyId = 'id' in activeChatBuddy ? activeChatBuddy.id : activeChatBuddy.guideId;
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: user.id,
      text: inputMsg.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => ({
      ...prev,
      [buddyId]: [...(prev[buddyId] || []), newMsg],
    }));
    setInputMsg('');
  };

  const filteredPosts = communityPosts.filter((post) => {
    if (filterCity !== 'all' && !post.destinationCity.toLowerCase().includes(filterCity.toLowerCase())) {
      return false;
    }
    if (filterBudget !== 'all' && post.budgetTier !== filterBudget) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        post.activityTitle.toLowerCase().includes(q) ||
        post.activityDetails.toLowerCase().includes(q) ||
        post.destinationCity.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-4 p-3 sm:p-4 pb-20 select-none">
      {/* ========================================================
          TOP SECTION SELECTOR: GUIDES VS COMMUNITY NETWORK
         ======================================================== */}
      <div className="flex flex-col gap-3">
        {/* Card 1: Verified Female Travel Guides Selector */}
        <div
          onClick={() => setActiveSection('guides')}
          className={`rounded-2xl border p-4 shadow-md cursor-pointer transition transform active:scale-98 ${
            activeSection === 'guides'
              ? 'bg-[#180d33] border-purple-500 text-white shadow-purple-900/30 ring-2 ring-purple-600/50'
              : isDark
              ? 'bg-[#150a28] border-purple-900/40 text-stone-200 hover:border-purple-700'
              : 'bg-white border-purple-200 text-stone-900 shadow-xs hover:border-purple-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-700/60 border border-purple-500/40 flex items-center justify-center">
                <Compass className="w-4 h-4 text-purple-200" />
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-stone-900 dark:text-white">
                Verified Female Travel Guides
              </h3>
            </div>
            <span className="text-[9px] bg-purple-900 text-purple-200 border border-purple-500/40 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
              SLTDA LICENSED
            </span>
          </div>
          <p className="text-xs text-stone-700 dark:text-purple-200/80 pl-10 leading-relaxed font-medium">
            Navigate markets, sacred temples, and isolated hiking ridges with safety-vetted female escorts who speak fluent local languages.
          </p>
        </div>

        {/* Card 2: Community Travel Buddy Network Selector */}
        <div
          onClick={() => setActiveSection('buddies')}
          className={`rounded-2xl border p-4 shadow-md cursor-pointer transition transform active:scale-98 ${
            activeSection === 'buddies'
              ? 'bg-[#180d33] border-purple-500 text-white shadow-purple-900/30 ring-2 ring-purple-600/50'
              : isDark
              ? 'bg-[#150a28] border-purple-900/40 text-stone-200 hover:border-purple-700'
              : 'bg-white border-purple-200 text-stone-900 shadow-xs hover:border-purple-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-700/60 border border-purple-500/40 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-purple-200" />
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-stone-900 dark:text-white">
                Community Travel Buddy Network
              </h3>
            </div>
            <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
              100% VERIFIED
            </span>
          </div>
          <p className="text-xs text-stone-700 dark:text-purple-200/80 pl-10 leading-relaxed font-medium">
            100% AU10TIX ID & Liveness Verified Female Travelers connecting for shared cabs, trails, and safe meetups.
          </p>
        </div>
      </div>

      {/* ========================================================
          VIEW A: VERIFIED FEMALE GUIDES
         ======================================================== */}
      {activeSection === 'guides' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h4 className="font-black text-sm text-stone-900 dark:text-white">
              Licensed Guides Directory ({mockTravelGuides.length})
            </h4>
            <span className="text-xs text-purple-700 dark:text-purple-300 font-bold">
              Kandy & Central Province
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {mockTravelGuides.map((guide) => (
              <div
                key={guide.guideId}
                className={`rounded-2xl border p-4 shadow-sm transition ${
                  isDark
                    ? 'bg-[#150a28] border-purple-800/40 text-white'
                    : 'bg-white border-purple-200 text-stone-900 shadow-xs'
                }`}
              >
                {/* Guide Header */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-3">
                    <img
                      src={guide.avatar}
                      alt={guide.name}
                      className="w-12 h-12 rounded-xl object-cover border-2 border-purple-500/60 shadow-md"
                    />
                    <div>
                      <h4 className="font-black text-sm sm:text-base text-stone-900 dark:text-white leading-tight">
                        {guide.name}
                      </h4>
                      <p className="text-[11px] text-purple-700 dark:text-purple-300 font-bold">
                        {guide.city}
                      </p>
                      <span className="text-[10px] text-stone-500 dark:text-stone-400 font-mono">
                        {guide.licenseNumber}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 text-amber-500 font-black text-xs justify-end">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{guide.rating}</span>
                    </div>
                    <span className="text-xs font-black text-purple-800 dark:text-purple-300 block mt-0.5">
                      LKR {guide.dailyRateLKR.toLocaleString()}/day
                    </span>
                    <span className="text-[9px] text-stone-500 dark:text-stone-400 font-medium">~${guide.dailyRateUSD}/day</span>
                  </div>
                </div>

                {/* Bio Quote */}
                <p className="text-xs text-stone-700 dark:text-stone-300 italic mb-3 leading-relaxed">
                  "{guide.bio}"
                </p>

                {/* Specialties */}
                <div className="flex flex-wrap gap-1.5 mb-3 text-[10px]">
                  <span className="bg-purple-100 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-800/40 text-purple-900 dark:text-purple-300 px-2 py-0.5 rounded font-bold">
                    🌐 {guide.languages.join(', ')}
                  </span>
                  {guide.specialties.map((spec, i) => (
                    <span
                      key={i}
                      className="bg-stone-100 dark:bg-black/30 border border-stone-200 dark:border-purple-900/40 text-stone-700 dark:text-purple-200 px-2 py-0.5 rounded font-medium"
                    >
                      ✓ {spec}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-purple-900/30">
                  <button
                    onClick={() => setActiveChatBuddy(guide)}
                    className="py-2 rounded-xl border border-purple-500/40 bg-purple-100/60 dark:bg-purple-950/30 hover:bg-purple-200 dark:hover:bg-purple-950/60 text-purple-800 dark:text-purple-300 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Message</span>
                  </button>

                  <button
                    onClick={() => onBookGuide && onBookGuide(guide)}
                    className="py-2 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Book Escort Guide</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          VIEW B: COMMUNITY TRAVEL BUDDY NETWORK
         ======================================================== */}
      {activeSection === 'buddies' && (
        <div className="flex flex-col gap-3">
          {/* Header with '+ Post Request' Button */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-black text-sm text-stone-900 dark:text-white">
                Community Travel Buddy Network
              </h4>
              <p className="text-[10px] text-stone-600 dark:text-purple-300 font-medium">
                100% AU10TIX ID & Liveness Verified Female Travelers
              </p>
            </div>

            <button
              onClick={handleOpenCreateModal}
              className="bg-gradient-to-r from-purple-700 to-fuchsia-600 hover:from-purple-800 hover:to-fuchsia-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1 shadow-md shadow-purple-900/20 active:scale-95 transition shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Post Request</span>
            </button>
          </div>

          {/* Sub Tabs: Requests vs Directory */}
          <div className="flex items-center gap-4 border-b border-purple-900/30 pb-2 text-xs font-bold">
            <button
              onClick={() => setBuddySubTab('posts')}
              className={`pb-1 transition border-b-2 ${
                buddySubTab === 'posts'
                  ? 'border-purple-600 text-purple-700 dark:text-purple-300'
                  : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-800'
              }`}
            >
              Buddy Requests ({filteredPosts.length})
            </button>
            <button
              onClick={() => setBuddySubTab('travelers')}
              className={`pb-1 transition border-b-2 ${
                buddySubTab === 'travelers'
                  ? 'border-purple-600 text-purple-700 dark:text-purple-300'
                  : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-800'
              }`}
            >
              Traveler Directory ({verifiedTravelBuddies.length})
            </button>
          </div>

          {/* Filter Dropdowns */}
          <div className="grid grid-cols-2 gap-2">
            <select
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className={`py-1.5 px-2.5 rounded-xl border text-xs font-bold outline-none cursor-pointer ${
                isDark ? 'bg-[#150a28] border-purple-800/50 text-purple-200' : 'bg-white border-purple-200 text-purple-900'
              }`}
            >
              <option value="all">All Cities</option>
              <option value="kandy">Kandy</option>
              <option value="galle">Galle & Mirissa</option>
              <option value="colombo">Colombo</option>
              <option value="ella">Ella</option>
            </select>

            <select
              value={filterBudget}
              onChange={(e) => setFilterBudget(e.target.value)}
              className={`py-1.5 px-2.5 rounded-xl border text-xs font-bold outline-none cursor-pointer ${
                isDark ? 'bg-[#150a28] border-purple-800/50 text-purple-200' : 'bg-white border-purple-200 text-purple-900'
              }`}
            >
              <option value="all">All Budgets</option>
              <option value="$">$ (Budget / Backpacker)</option>
              <option value="$$">$$ (Comfort / Split Cab)</option>
              <option value="$$$">$$$ (Premium / Luxury)</option>
            </select>
          </div>

          {/* Keyword Search Input */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
            isDark ? 'bg-[#150a28] border-purple-800/50 text-white' : 'bg-white border-purple-200 text-stone-900 shadow-xs'
          }`}>
            <Search className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search keywords (e.g. electric cab, train, hike, sunrise)..."
              className="bg-transparent text-xs text-stone-900 dark:text-white placeholder-stone-500 dark:placeholder-stone-400 outline-none w-full font-medium"
            />
          </div>

          {/* BUDDY REQUESTS FEED */}
          {buddySubTab === 'posts' ? (
            <div className="flex flex-col gap-3">
              {filteredPosts.map((post) => {
                const isMyPost =
                  post.userId === user.id ||
                  post.userName === user.name ||
                  post.userId === 'usr_piyumi_kandy' ||
                  post.postId === 'post_03';

                return (
                  <div
                    key={post.postId}
                    className={`rounded-2xl border p-4 shadow-sm transition ${
                      isDark
                        ? 'bg-[#150a28] border-purple-800/40 text-white'
                        : 'bg-white border-purple-200 text-stone-900 shadow-xs'
                    }`}
                  >
                    {/* Post User Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={post.userAvatar}
                          alt={post.userName}
                          className="w-10 h-10 rounded-full object-cover border border-purple-500/60 shadow-xs"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-xs sm:text-sm text-stone-900 dark:text-white">
                              {post.userName}
                            </span>
                            <span className="text-[9px] bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300 font-extrabold px-1.5 py-0.2 rounded border border-purple-300 dark:border-purple-500/30">
                              AU10TIX ✔
                            </span>
                          </div>
                          <p className="text-[10px] text-stone-600 dark:text-stone-300 flex items-center gap-1 mt-0.5 font-medium">
                            <MapPin className="w-3 h-3 text-purple-600 dark:text-purple-400" /> {post.destinationCity} ·{' '}
                            <Calendar className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                            <span className="font-bold text-stone-800 dark:text-purple-200">{post.startDate} to {post.endDate}</span>
                          </p>
                          {post.startTime && (
                            <p className="text-[9px] text-stone-600 dark:text-purple-300 flex items-center gap-1 mt-0.5 font-medium">
                              <Clock className="w-2.5 h-2.5 text-purple-500" /> Depart: {post.startTime} - Return: {post.endTime}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] bg-purple-100 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800/50 text-purple-900 dark:text-purple-300 font-extrabold px-2 py-0.5 rounded-md block">
                          Budget {post.budgetTier}
                        </span>
                        <span className="text-[10px] text-purple-700 dark:text-purple-400 font-bold block mt-1">
                          {post.transportMode}
                        </span>
                        <span className="text-[9px] text-stone-500 dark:text-stone-400 block mt-0.5">{post.createdAt}</span>
                      </div>
                    </div>

                    {/* Activity Title & Details */}
                    <h5 className="font-black text-xs sm:text-sm text-purple-800 dark:text-purple-200 mt-2">
                      {post.activityTitle}
                    </h5>
                    <p className="text-xs text-stone-700 dark:text-stone-300 mt-1 leading-relaxed font-medium">
                      {post.activityDetails}
                    </p>

                    {/* Footer Actions: Edit & Delete */}
                    <div className="flex items-center justify-between border-t border-purple-900/30 pt-2.5 mt-3">
                      <div className="flex flex-wrap gap-1">
                        {post.tags.map((tag, i) => (
                          <span key={i} className="text-[10px] text-stone-500 dark:text-purple-300/80 font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Both author & testing users can edit/delete requests */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(post)}
                          className="px-2.5 py-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800 text-xs font-bold flex items-center gap-1 transition"
                          title="Edit Dates, Times, or Details"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleRequestDelete(post)}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-900 text-xs font-bold flex items-center gap-1 transition"
                          title="Delete Request"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>

                        {!isMyPost && (
                          <button
                            onClick={() => {
                              const buddy = verifiedTravelBuddies.find((b) => b.name === post.userName) || verifiedTravelBuddies[0];
                              setActiveChatBuddy(buddy);
                            }}
                            className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm active:scale-95 transition ml-1"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Chat</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* TRAVELER DIRECTORY */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {verifiedTravelBuddies.map((buddy) => (
                <div
                  key={buddy.id}
                  className={`rounded-2xl border p-3.5 shadow-xs transition flex flex-col justify-between ${
                    isDark ? 'bg-[#150a28] border-purple-800/40 text-white' : 'bg-white border-purple-200 text-stone-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <img
                      src={buddy.avatar}
                      alt={buddy.name}
                      className="w-11 h-11 rounded-full object-cover border border-purple-500 shadow-xs"
                    />
                    <div>
                      <h5 className="font-extrabold text-xs text-stone-900 dark:text-white">
                        {buddy.name}, {buddy.age}
                      </h5>
                      <p className="text-[10px] text-purple-700 dark:text-purple-300 font-bold">
                        {buddy.nationality} · {buddy.currentCity}
                      </p>
                      <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold block">
                        ✓ {buddy.verificationBadgeType}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-stone-700 dark:text-stone-300 line-clamp-2 italic mb-2 leading-relaxed">
                    "{buddy.bio}"
                  </p>
                  <button
                    onClick={() => setActiveChatBuddy(buddy)}
                    className="w-full py-1.5 rounded-xl bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1 hover:bg-purple-800 transition"
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>Message Buddy</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          MODAL: EDIT OR POST TRAVEL BUDDY REQUEST (CALENDAR & CLOCK)
         ======================================================== */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className={`border rounded-3xl p-5 max-w-md w-full shadow-2xl my-auto transition-all ${
            isDark ? 'bg-[#150a28] border-purple-500/50 text-white' : 'bg-white border-purple-200 text-stone-900'
          }`}>
            <div className="flex items-center justify-between border-b border-purple-900/40 pb-2.5 mb-3">
              <h3 className="font-black text-sm text-stone-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>{editingPostId ? 'Edit Travel Buddy Request & Dates' : 'Post New Travel Buddy Request'}</span>
              </h3>
              <button
                onClick={() => setShowPostModal(false)}
                className="text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePost} className="flex flex-col gap-3 text-xs">
              {/* Activity Title */}
              <div>
                <label className="text-stone-800 dark:text-purple-300 font-extrabold block mb-1">
                  Activity Title
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Share Electric Cab from Kandy to Galle Fort"
                  className={`w-full p-2 rounded-xl border outline-none font-medium ${
                    isDark ? 'bg-black/50 border-purple-800 text-white' : 'bg-purple-50/50 border-purple-200 text-stone-900'
                  }`}
                />
              </div>

              {/* Destination City */}
              <div>
                <label className="text-stone-800 dark:text-purple-300 font-extrabold block mb-1">
                  Destination City / Region
                </label>
                <input
                  type="text"
                  required
                  value={formDestination}
                  onChange={(e) => setFormDestination(e.target.value)}
                  placeholder="e.g. Kandy, Galle, Ella"
                  className={`w-full p-2 rounded-xl border outline-none font-medium ${
                    isDark ? 'bg-black/50 border-purple-800 text-white' : 'bg-purple-50/50 border-purple-200 text-stone-900'
                  }`}
                />
              </div>

              {/* CALENDAR DATE & CLOCK TIME PICKERS */}
              <div className={`p-3 rounded-2xl border ${
                isDark ? 'bg-black/40 border-purple-800/40' : 'bg-purple-50/60 border-purple-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-[11px] text-purple-700 dark:text-purple-300 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>Travel Dates & Times</span>
                  </span>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400 font-mono">
                    {formStartDate} → {formEndDate}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  {/* Start Date */}
                  <div>
                    <label className="text-[10px] text-stone-700 dark:text-purple-200 font-bold block mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formStartDate}
                      onChange={(e) => setFormStartDate(e.target.value)}
                      className={`w-full p-2 rounded-lg border text-xs outline-none font-bold ${
                        isDark ? 'bg-stone-900 border-purple-700 text-white' : 'bg-white border-purple-300 text-stone-900'
                      }`}
                    />
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="text-[10px] text-stone-700 dark:text-purple-200 font-bold block mb-1">
                      Return Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formEndDate}
                      onChange={(e) => setFormEndDate(e.target.value)}
                      className={`w-full p-2 rounded-lg border text-xs outline-none font-bold ${
                        isDark ? 'bg-stone-900 border-purple-700 text-white' : 'bg-white border-purple-300 text-stone-900'
                      }`}
                    />
                  </div>
                </div>

                {/* Quick Date Stepper Helpers */}
                <div className="flex items-center gap-1.5 mb-2.5">
                  <span className="text-[9px] text-stone-500 font-medium">Quick Dates:</span>
                  {[
                    { label: 'Today', days: 0 },
                    { label: 'Tomorrow', days: 1 },
                    { label: '+3 Days', days: 3 },
                    { label: '+1 Week', days: 7 },
                  ].map((preset) => (
                    <button
                      type="button"
                      key={preset.label}
                      onClick={() => {
                        const target = new Date();
                        target.setDate(target.getDate() + preset.days);
                        const str = target.toISOString().split('T')[0];
                        setFormStartDate(str);

                        const returnTarget = new Date(target);
                        returnTarget.setDate(returnTarget.getDate() + 2);
                        setFormEndDate(returnTarget.toISOString().split('T')[0]);
                      }}
                      className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/50 text-purple-900 dark:text-purple-200 text-[9px] font-bold hover:bg-purple-200"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Clock Pickers */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-purple-800/30">
                  <div>
                    <label className="text-[10px] text-stone-700 dark:text-purple-200 font-bold flex items-center gap-1 mb-1">
                      <Clock className="w-3 h-3 text-purple-500" /> Depart Time
                    </label>
                    <input
                      type="time"
                      value={formStartTime}
                      onChange={(e) => setFormStartTime(e.target.value)}
                      className={`w-full p-2 rounded-lg border text-xs outline-none font-bold ${
                        isDark ? 'bg-stone-900 border-purple-700 text-white' : 'bg-white border-purple-300 text-stone-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-stone-700 dark:text-purple-200 font-bold flex items-center gap-1 mb-1">
                      <Clock className="w-3 h-3 text-purple-500" /> Return Time
                    </label>
                    <input
                      type="time"
                      value={formEndTime}
                      onChange={(e) => setFormEndTime(e.target.value)}
                      className={`w-full p-2 rounded-lg border text-xs outline-none font-bold ${
                        isDark ? 'bg-stone-900 border-purple-700 text-white' : 'bg-white border-purple-300 text-stone-900'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Budget & Transport Mode */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-800 dark:text-purple-300 font-extrabold block mb-1">
                    Budget Tier
                  </label>
                  <select
                    value={formBudget}
                    onChange={(e) => setFormBudget(e.target.value as any)}
                    className={`w-full p-2 rounded-xl border text-xs outline-none font-medium cursor-pointer ${
                      isDark ? 'bg-black/50 border-purple-800 text-white' : 'bg-purple-50/50 border-purple-200 text-stone-900'
                    }`}
                  >
                    <option value="$">$ (Budget Backpacker)</option>
                    <option value="$$">$$ (Comfort / Split Cab)</option>
                    <option value="$$$">$$$ (Premium / Luxury)</option>
                  </select>
                </div>

                <div>
                  <label className="text-stone-800 dark:text-purple-300 font-extrabold block mb-1">
                    Transport Mode
                  </label>
                  <select
                    value={formTransport}
                    onChange={(e) => setFormTransport(e.target.value as any)}
                    className={`w-full p-2 rounded-xl border text-xs outline-none font-medium cursor-pointer ${
                      isDark ? 'bg-black/50 border-purple-800 text-white' : 'bg-purple-50/50 border-purple-200 text-stone-900'
                    }`}
                  >
                    <option value="HelaGo Cab">HelaGo Electric Cab</option>
                    <option value="Train">Scenic Blue Train</option>
                    <option value="Tuk-Tuk">Metered Pink Tuk-Tuk</option>
                    <option value="Shared Van">Shared Executive Van</option>
                    <option value="Walking">Walking / Hike</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-stone-800 dark:text-purple-300 font-extrabold block mb-1">
                  Trip Details & Meeting Safety Preferences
                </label>
                <textarea
                  rows={3}
                  value={formDetails}
                  onChange={(e) => setFormDetails(e.target.value)}
                  placeholder="Share your planned route, safe public meetup spot, and what kind of buddy you'd like to travel with..."
                  className={`w-full p-2 rounded-xl border text-xs outline-none font-medium leading-relaxed ${
                    isDark ? 'bg-black/50 border-purple-800 text-white' : 'bg-purple-50/50 border-purple-200 text-stone-900'
                  }`}
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-purple-900/30">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className={`flex-1 py-2 rounded-xl font-bold ${
                    isDark ? 'bg-stone-800 text-stone-300' : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-purple-700 to-fuchsia-600 hover:from-purple-800 hover:to-fuchsia-700 text-white font-extrabold shadow-md active:scale-95 transition"
                >
                  {editingPostId ? 'Save Changes' : 'Publish Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          IN-APP DELETE CONFIRMATION MODAL (100% Reliable in iFrame)
         ======================================================== */}
      {postToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`rounded-3xl border p-5 max-w-sm w-full shadow-2xl transition-all ${
            isDark ? 'bg-[#150a28] border-rose-700/60 text-white' : 'bg-white border-rose-300 text-stone-900'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-500 border border-rose-500/40 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="font-black text-base text-center text-stone-900 dark:text-white mb-1">
              Delete Travel Buddy Request?
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 text-center mb-4 leading-relaxed font-medium">
              Are you sure you want to delete <strong className="text-stone-900 dark:text-white">"{postToDelete.activityTitle}"</strong>? This will remove the post from the community feed.
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPostToDelete(null)}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition ${
                  isDark ? 'bg-stone-800 text-stone-300 hover:bg-stone-700' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                Keep Request
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DIRECT CHAT MODAL */}
      {activeChatBuddy && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className={`w-full max-w-md h-[550px] rounded-3xl overflow-hidden shadow-2xl flex flex-col border ${
            isDark ? 'bg-[#150a28] border-purple-800 text-white' : 'bg-white border-purple-200 text-stone-900'
          }`}>
            {/* Chat Header */}
            <div className="p-3.5 bg-purple-900/40 border-b border-purple-800/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={activeChatBuddy.avatar}
                  alt={activeChatBuddy.name}
                  className="w-9 h-9 rounded-full object-cover border border-purple-400"
                />
                <div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-stone-900 dark:text-white">
                    {activeChatBuddy.name}
                  </h4>
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-2.5 h-2.5" /> AU10TIX ID Verified
                  </span>
                </div>
              </div>
              <button onClick={() => setActiveChatBuddy(null)} className="p-1.5 rounded-lg text-stone-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-2.5 text-xs">
              {((chatMessages['id' in activeChatBuddy ? activeChatBuddy.id : activeChatBuddy.guideId]) || []).map((msg) => {
                const isMe = msg.senderId === user.id;
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[80%] p-2.5 rounded-2xl ${
                      isMe ? 'bg-purple-700 text-white rounded-br-xs' : isDark ? 'bg-stone-800 text-stone-200 rounded-bl-xs' : 'bg-purple-50 text-stone-900 border border-purple-200 rounded-bl-xs'
                    }`}>
                      <p className="leading-relaxed font-medium">{msg.text}</p>
                    </div>
                    <span className="text-[9px] text-stone-500 mt-0.5">{msg.timestamp}</span>
                  </div>
                );
              })}
            </div>

            {/* Message Input Footer */}
            <div className="p-3 border-t border-purple-900/30 flex items-center gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a safe travel message..."
                className={`flex-1 p-2 rounded-xl border outline-none text-xs font-medium ${
                  isDark ? 'bg-black/50 border-purple-800 text-white' : 'bg-purple-50/50 border-purple-200 text-stone-900'
                }`}
              />
              <button
                onClick={handleSendMessage}
                className="bg-purple-700 hover:bg-purple-800 text-white p-2 rounded-xl transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
