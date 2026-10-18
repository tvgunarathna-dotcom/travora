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

  // Section Selector matching Screenshot 5:
  // 'guides' -> Screenshot 6 (Verified Female Travel Guides)
  // 'buddies' -> Screenshot 7 (Community Travel Buddy Network)
  const [activeSection, setActiveSection] = useState<'buddies' | 'guides'>('buddies');

  // Sub-tabs under buddies: 'posts' (Buddy Requests) vs 'travelers' (Traveler Directory)
  const [buddySubTab, setBuddySubTab] = useState<'posts' | 'travelers'>('posts');

  // Search & Filter state
  const [filterCity, setFilterCity] = useState<string>('all');
  const [filterBudget, setFilterBudget] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Community Posts (Supports edit and delete)
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(mockCommunityPosts);
  const [showPostModal, setShowPostModal] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  // Post Request Form State (with Calendar & Clock pickers)
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

  // Open Edit Modal
  const handleOpenEditModal = (post: CommunityPost) => {
    setEditingPostId(post.postId);
    setFormTitle(post.activityTitle);
    setFormDestination(post.destinationCity);
    setFormStartDate(post.startDate);
    setFormEndDate(post.endDate);
    setFormStartTime(post.startTime || '08:00');
    setFormEndTime(post.endTime || '17:00');
    setFormBudget(post.budgetTier);
    setFormTransport(post.transportMode);
    setFormDetails(post.activityDetails);
    setShowPostModal(true);
  };

  // Delete Request
  const handleDeletePost = (postId: string) => {
    if (window.confirm('Are you sure you want to delete this travel buddy request?')) {
      setCommunityPosts((prev) => prev.filter((p) => p.postId !== postId));
    }
  };

  // Save / Submit Post (Create or Update)
  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingPostId) {
      // Update
      setCommunityPosts((prev) =>
        prev.map((p) =>
          p.postId === editingPostId
            ? {
                ...p,
                activityTitle: formTitle,
                destinationCity: formDestination,
                startDate: formStartDate,
                endDate: formEndDate,
                startTime: formStartTime,
                endTime: formEndTime,
                budgetTier: formBudget,
                transportMode: formTransport,
                activityDetails: formDetails,
              }
            : p
        )
      );
    } else {
      // Create new
      const newPost: CommunityPost = {
        postId: `post_${Date.now()}`,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        isVerified: true,
        destinationCity: formDestination,
        startDate: formStartDate,
        endDate: formEndDate,
        startTime: formStartTime,
        endTime: formEndTime,
        budgetTier: formBudget,
        transportMode: formTransport,
        activityTitle: formTitle,
        activityDetails: formDetails || 'Looking for verified female travel companions to explore safely together.',
        tags: ['VerifiedBuddy', 'SafeMeetup'],
        responsesCount: 0,
        createdAt: 'Just now',
      };
      setCommunityPosts([newPost, ...communityPosts]);
    }

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
          TOP SECTION SELECTOR (MATCHING SCREENSHOT 5)
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
              : 'bg-white border-purple-100 text-stone-900 shadow-xs hover:border-purple-300'
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
          <p className="text-xs text-stone-600 dark:text-purple-200/80 pl-10 leading-relaxed">
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
              : 'bg-white border-purple-100 text-stone-900 shadow-xs hover:border-purple-300'
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
          <p className="text-xs text-stone-600 dark:text-purple-200/80 pl-10 leading-relaxed">
            100% AU10TIX ID & Liveness Verified Female Travelers connecting for shared cabs, trails, and safe meetups.
          </p>
        </div>
      </div>

      {/* ========================================================
          VIEW A: VERIFIED FEMALE GUIDES (MATCHING SCREENSHOT 6)
         ======================================================== */}
      {activeSection === 'guides' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h4 className="font-black text-sm text-stone-900 dark:text-white">
              Licensed Guides Directory ({mockTravelGuides.length})
            </h4>
            <span className="text-xs text-purple-600 dark:text-purple-300 font-semibold">
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
                    : 'bg-white border-purple-100 text-stone-900 shadow-xs'
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
                      <p className="text-[11px] text-purple-600 dark:text-purple-300 font-medium">
                        {guide.city}
                      </p>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {guide.licenseNumber}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 text-amber-500 font-black text-xs justify-end">
                      <Star className="w-3 h-3 fill-amber-500" />
                      <span>{guide.rating}</span>
                    </div>
                    <span className="text-xs font-black text-purple-700 dark:text-purple-300 block mt-0.5">
                      LKR {guide.dailyRateLKR.toLocaleString()}/day
                    </span>
                    <span className="text-[9px] text-stone-400">~${guide.dailyRateUSD}/day</span>
                  </div>
                </div>

                {/* Bio Quote */}
                <p className="text-xs text-stone-600 dark:text-stone-300 italic mb-3 leading-relaxed">
                  "{guide.bio}"
                </p>

                {/* Badges / Specialties */}
                <div className="flex flex-wrap gap-1.5 mb-3 text-[10px]">
                  <span className="bg-purple-950/40 border border-purple-800/40 text-purple-300 px-2 py-0.5 rounded font-medium">
                    🌐 {guide.languages.join(', ')}
                  </span>
                  {guide.specialties.map((spec, i) => (
                    <span
                      key={i}
                      className="bg-black/30 border border-purple-900/40 text-purple-200 px-2 py-0.5 rounded font-medium"
                    >
                      ✓ {spec}
                    </span>
                  ))}
                </div>

                {/* Action Buttons matching Screenshot 6 */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-purple-900/30">
                  <button
                    onClick={() => setActiveChatBuddy(guide)}
                    className="py-2 rounded-xl border border-purple-500/40 bg-purple-950/30 hover:bg-purple-950/60 text-purple-300 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Message</span>
                  </button>

                  <button
                    onClick={() => onBookGuide && onBookGuide(guide)}
                    className="py-2 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Book Escort Guide (12%)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          VIEW B: COMMUNITY TRAVEL BUDDY NETWORK (MATCHING SCREENSHOT 7)
         ======================================================== */}
      {activeSection === 'buddies' && (
        <div className="flex flex-col gap-3">
          {/* Header with '+ Post Request' Button (Screenshot 7) */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-black text-sm text-stone-900 dark:text-white">
                Community Travel Buddy Network
              </h4>
              <p className="text-[10px] text-stone-500 dark:text-purple-300">
                100% AU10TIX ID & Liveness Verified Female Travelers
              </p>
            </div>

            <button
              onClick={handleOpenCreateModal}
              className="bg-gradient-to-r from-purple-700 to-fuchsia-600 hover:from-purple-800 hover:to-fuchsia-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1 shadow-md shadow-purple-900/20 active:scale-95 transition shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post Request</span>
            </button>
          </div>

          {/* Sub Tabs: Buddy Requests (3) vs Traveler Directory (4) */}
          <div className="flex items-center gap-4 border-b border-purple-900/30 pb-2 text-xs font-bold">
            <button
              onClick={() => setBuddySubTab('posts')}
              className={`pb-1 transition border-b-2 ${
                buddySubTab === 'posts'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-300'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              Buddy Requests ({filteredPosts.length})
            </button>
            <button
              onClick={() => setBuddySubTab('travelers')}
              className={`pb-1 transition border-b-2 ${
                buddySubTab === 'travelers'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-300'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              Traveler Directory ({verifiedTravelBuddies.length})
            </button>
          </div>

          {/* Filter Dropdowns & Keyword Search (Screenshot 7) */}
          <div className="grid grid-cols-2 gap-2">
            <select
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className={`py-1.5 px-2.5 rounded-xl border text-xs font-semibold outline-none ${
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
              className={`py-1.5 px-2.5 rounded-xl border text-xs font-semibold outline-none ${
                isDark ? 'bg-[#150a28] border-purple-800/50 text-purple-200' : 'bg-white border-purple-200 text-purple-900'
              }`}
            >
              <option value="all">All Budgets</option>
              <option value="$">$ (Budget / Backpacker)</option>
              <option value="$$">$$ (Comfort / Split Cab)</option>
              <option value="$$$">$$$ (Premium / Luxury)</option>
            </select>
          </div>

          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
            isDark ? 'bg-[#150a28] border-purple-800/50 text-white' : 'bg-white border-purple-200 text-stone-900'
          }`}>
            <Search className="w-3.5 h-3.5 text-purple-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search keywords (e.g. electric cab, train, hike)..."
              className="bg-transparent text-xs outline-none w-full"
            />
          </div>

          {/* BUDDY REQUESTS FEED (Matching Screenshot 7) */}
          {buddySubTab === 'posts' ? (
            <div className="flex flex-col gap-3">
              {filteredPosts.map((post) => {
                const isMyPost = post.userId === user.id;

                return (
                  <div
                    key={post.postId}
                    className={`rounded-2xl border p-4 shadow-sm transition ${
                      isDark
                        ? 'bg-[#150a28] border-purple-800/40 text-white'
                        : 'bg-white border-purple-100 text-stone-900 shadow-xs'
                    }`}
                  >
                    {/* Post User Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={post.userAvatar}
                          alt={post.userName}
                          className="w-10 h-10 rounded-full object-cover border border-purple-500/60"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-xs sm:text-sm text-stone-900 dark:text-white">
                              {post.userName}
                            </span>
                            <span className="text-[9px] bg-purple-900/60 text-purple-300 font-bold px-1.5 py-0.2 rounded border border-purple-500/30">
                              AU10TIX ✔
                            </span>
                          </div>
                          <p className="text-[10px] text-stone-500 dark:text-stone-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-purple-400" /> {post.destinationCity} ·{' '}
                            <Calendar className="w-3 h-3 text-purple-400" /> {post.startDate} to {post.endDate}
                          </p>
                          {post.startTime && (
                            <p className="text-[9px] text-purple-300 flex items-center gap-1 mt-0.5">
                              <Clock className="w-2.5 h-2.5 text-purple-400" /> Depart: {post.startTime} - Return: {post.endTime}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] bg-purple-950/60 border border-purple-800/50 text-purple-300 font-bold px-2 py-0.5 rounded-md block">
                          Budget {post.budgetTier}
                        </span>
                        <span className="text-[10px] text-purple-400 font-semibold block mt-1">
                          {post.transportMode}
                        </span>
                        <span className="text-[9px] text-stone-400 block mt-0.5">{post.createdAt}</span>
                      </div>
                    </div>

                    {/* Activity Title & Details */}
                    <h5 className="font-black text-xs sm:text-sm text-purple-700 dark:text-purple-200 mt-2">
                      {post.activityTitle}
                    </h5>
                    <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                      {post.activityDetails}
                    </p>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between border-t border-purple-900/30 pt-2.5 mt-3">
                      <div className="flex flex-wrap gap-1">
                        {post.tags.map((tag, i) => (
                          <span key={i} className="text-[10px] text-stone-400 dark:text-purple-300/80">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* If My Post: Show Edit & Delete per User Request! */}
                      {isMyPost ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(post)}
                            className="p-1.5 rounded-lg bg-purple-900/40 text-purple-300 hover:bg-purple-800 text-xs font-bold flex items-center gap-1"
                            title="Edit Request"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.postId)}
                            className="p-1.5 rounded-lg bg-rose-950/40 text-rose-300 hover:bg-rose-900 text-xs font-bold flex items-center gap-1"
                            title="Delete Request"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            const buddy = verifiedTravelBuddies.find((b) => b.name === post.userName) || verifiedTravelBuddies[0];
                            setActiveChatBuddy(buddy);
                          }}
                          className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Connect & Chat</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* TRAVELER DIRECTORY (Screenshot 7 secondary tab) */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {verifiedTravelBuddies.map((buddy) => (
                <div
                  key={buddy.id}
                  className={`rounded-2xl border p-3.5 shadow-xs transition flex flex-col justify-between ${
                    isDark ? 'bg-[#150a28] border-purple-800/40 text-white' : 'bg-white border-purple-100 text-stone-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <img
                      src={buddy.avatar}
                      alt={buddy.name}
                      className="w-11 h-11 rounded-full object-cover border border-purple-500"
                    />
                    <div>
                      <h5 className="font-extrabold text-xs text-stone-900 dark:text-white">
                        {buddy.name}, {buddy.age}
                      </h5>
                      <p className="text-[10px] text-purple-400 font-medium">
                        {buddy.nationality} · {buddy.currentCity}
                      </p>
                      <span className="text-[9px] text-emerald-400 font-semibold block">
                        ✓ {buddy.verificationBadgeType}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-300 line-clamp-2 italic mb-2">
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
          MODAL: POST / EDIT BUDDY REQUEST (CALENDAR & CLOCK PICKER)
         ======================================================== */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#150a28] border border-purple-500/50 rounded-3xl p-5 max-w-md w-full text-white shadow-2xl my-auto">
            <div className="flex items-center justify-between border-b border-purple-900/40 pb-2.5 mb-3">
              <h3 className="font-black text-sm text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span>{editingPostId ? 'Edit Travel Buddy Request' : 'Post New Travel Buddy Request'}</span>
              </h3>
              <button onClick={() => setShowPostModal(false)} className="text-stone-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePost} className="flex flex-col gap-3 text-xs">
              {/* Activity Title */}
              <div>
                <label className="text-purple-300 font-bold block mb-1">
                  Activity Title
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Share Electric Cab from Kandy to Galle Fort"
                  className="w-full p-2 rounded-xl bg-black/50 border border-purple-800 text-white outline-none"
                />
              </div>

              {/* Destination City */}
              <div>
                <label className="text-purple-300 font-bold block mb-1">
                  Destination City / Region
                </label>
                <input
                  type="text"
                  required
                  value={formDestination}
                  onChange={(e) => setFormDestination(e.target.value)}
                  placeholder="e.g. Kandy, Galle, Ella"
                  className="w-full p-2 rounded-xl bg-black/50 border border-purple-800 text-white outline-none"
                />
              </div>

              {/* DATE PICKER (CALENDAR) & TIME PICKER (CLOCK) */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-black/40 border border-purple-800/40">
                {/* Start Date & Time */}
                <div>
                  <label className="text-[10px] text-purple-300 font-bold flex items-center gap-1 mb-1">
                    <Calendar className="w-3 h-3 text-purple-400" /> Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full p-1.5 rounded-lg bg-stone-900 border border-purple-700 text-white text-xs outline-none"
                  />
                  <label className="text-[10px] text-purple-300 font-bold flex items-center gap-1 mt-1.5 mb-1">
                    <Clock className="w-3 h-3 text-purple-400" /> Start Time
                  </label>
                  <input
                    type="time"
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    className="w-full p-1.5 rounded-lg bg-stone-900 border border-purple-700 text-white text-xs outline-none"
                  />
                </div>

                {/* End Date & Time */}
                <div>
                  <label className="text-[10px] text-purple-300 font-bold flex items-center gap-1 mb-1">
                    <Calendar className="w-3 h-3 text-purple-400" /> Return Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="w-full p-1.5 rounded-lg bg-stone-900 border border-purple-700 text-white text-xs outline-none"
                  />
                  <label className="text-[10px] text-purple-300 font-bold flex items-center gap-1 mt-1.5 mb-1">
                    <Clock className="w-3 h-3 text-purple-400" /> Return Time
                  </label>
                  <input
                    type="time"
                    value={formEndTime}
                    onChange={(e) => setFormEndTime(e.target.value)}
                    className="w-full p-1.5 rounded-lg bg-stone-900 border border-purple-700 text-white text-xs outline-none"
                  />
                </div>
              </div>

              {/* Budget & Transport Mode */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-purple-300 font-bold block mb-1">
                    Budget Tier
                  </label>
                  <select
                    value={formBudget}
                    onChange={(e) => setFormBudget(e.target.value as any)}
                    className="w-full p-2 rounded-xl bg-black/50 border border-purple-800 text-white text-xs outline-none"
                  >
                    <option value="$">$ (Budget Backpacker)</option>
                    <option value="$$">$$ (Comfort / Split Cab)</option>
                    <option value="$$$">$$$ (Premium / Luxury)</option>
                  </select>
                </div>

                <div>
                  <label className="text-purple-300 font-bold block mb-1">
                    Transport Mode
                  </label>
                  <select
                    value={formTransport}
                    onChange={(e) => setFormTransport(e.target.value as any)}
                    className="w-full p-2 rounded-xl bg-black/50 border border-purple-800 text-white text-xs outline-none"
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
                <label className="text-purple-300 font-bold block mb-1">
                  Trip Details & Meeting Safety Preferences
                </label>
                <textarea
                  rows={3}
                  value={formDetails}
                  onChange={(e) => setFormDetails(e.target.value)}
                  placeholder="Share your planned route, safe public meetup spot, and what kind of buddy you'd like to travel with..."
                  className="w-full p-2 rounded-xl bg-black/50 border border-purple-800 text-white text-xs outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="flex-1 py-2 rounded-xl bg-stone-800 text-stone-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-purple-700 to-fuchsia-600 text-white font-black shadow-md hover:from-purple-800 hover:to-fuchsia-700"
                >
                  {editingPostId ? 'Save Changes' : 'Post Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIRECT CHAT MODAL */}
      {activeChatBuddy && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#150a28] border border-purple-500/50 rounded-3xl p-4 max-w-sm w-full text-white shadow-2xl flex flex-col h-[480px]">
            <div className="flex items-center justify-between border-b border-purple-900/40 pb-2.5">
              <div className="flex items-center gap-2">
                <img
                  src={activeChatBuddy.avatar}
                  alt={activeChatBuddy.name}
                  className="w-8 h-8 rounded-full object-cover border border-purple-400"
                />
                <div>
                  <h4 className="font-black text-xs text-white">{activeChatBuddy.name}</h4>
                  <span className="text-[9px] text-emerald-400 font-semibold">AU10TIX Verified ✓</span>
                </div>
              </div>
              <button onClick={() => setActiveChatBuddy(null)} className="text-stone-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto py-3 space-y-2 text-xs">
              {((chatMessages['id' in activeChatBuddy ? activeChatBuddy.id : activeChatBuddy.guideId]) || []).map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2.5 rounded-2xl max-w-[85%] ${
                    msg.senderId === user.id
                      ? 'ml-auto bg-purple-700 text-white rounded-br-xs'
                      : 'mr-auto bg-stone-900 text-stone-200 border border-purple-900/40 rounded-bl-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="text-[9px] text-purple-300/80 block text-right mt-0.5">
                    {msg.timestamp}
                  </span>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="flex items-center gap-1.5 border-t border-purple-900/40 pt-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type safe message..."
                className="flex-1 p-2 rounded-xl bg-black/50 border border-purple-800 text-xs text-white outline-none"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white"
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
