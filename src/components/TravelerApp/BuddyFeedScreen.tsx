import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  MessageCircle,
  MapPin,
  Calendar,
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
} from 'lucide-react';
import { UserProfile, TravelBuddy, CommunityPost, ChatMessage } from '../../types';
import { verifiedTravelBuddies, mockCommunityPosts } from '../../data/mockData';
import { apiService } from '../../services/api';

interface BuddyFeedScreenProps {
  user: UserProfile;
  onOpenVerification: () => void;
  theme: 'dark' | 'light';
}

export const BuddyFeedScreen: React.FC<BuddyFeedScreenProps> = ({
  user,
  onOpenVerification,
  theme,
}) => {
  const isDark = theme === 'dark';

  // Sub-tabs: 'posts' (Community Buddy Requests) vs 'travelers' (Verified Directory)
  const [subTab, setSubTab] = useState<'posts' | 'travelers'>('posts');
  
  // Search & Filter state
  const [filterCity, setFilterCity] = useState<string>('all');
  const [filterBudget, setFilterBudget] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Community Posts
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(mockCommunityPosts);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Post Form
  const [postTitle, setPostTitle] = useState('');
  const [postDestination, setPostDestination] = useState('Galle & Mirissa');
  const [postStartDate, setPostStartDate] = useState('2026-10-18');
  const [postEndDate, setPostEndDate] = useState('2026-10-21');
  const [postBudget, setPostBudget] = useState<'$' | '$$' | '$$$'>('$$');
  const [postTransport, setPostTransport] = useState<'HelaGo Cab' | 'Train' | 'Tuk-Tuk' | 'Shared Van' | 'Walking'>('HelaGo Cab');
  const [postDetails, setPostDetails] = useState('');

  // Chat State
  const [selectedBuddy, setSelectedBuddy] = useState<TravelBuddy | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      senderId: 'tb_elena',
      text: 'Hey Maya! Are you still planning to take the HelaGo electric ride to Galle Fort tomorrow?',
      timestamp: '09:12 AM',
    },
    {
      id: 'm2',
      senderId: 'usr_maya_colombo',
      text: 'Yes! Sanduni P. is our Pink Shield verified driver. We can meet right outside Barefoot Cafe.',
      timestamp: '09:14 AM',
    },
  ]);
  const [newMessageText, setNewMessageText] = useState('');

  // Gated Access Check: Unverified travelers cannot view or message
  if (!user.isVerified) {
    return (
      <div className={`p-6 rounded-3xl border text-center space-y-4 my-6 ${
        isDark ? 'bg-[#150f24] border-purple-900/50' : 'bg-white border-purple-100 shadow-lg'
      }`}>
        <div className="w-14 h-14 rounded-full bg-purple-600/20 text-purple-600 dark:text-purple-300 flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold">Gated AU10TIX Female Community</h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto leading-relaxed">
            Direct messaging and community travel buddy requests are strictly gated to travelers who have completed AU10TIX government passport and 3D optical liveness verification.
          </p>
        </div>

        <button
          onClick={onOpenVerification}
          className="px-6 py-3 rounded-2xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs shadow-md transition"
        >
          Verify Passport with AU10TIX (1 Min)
        </button>
      </div>
    );
  }

  // Create post handler
  const handleCreatePost = async () => {
    if (!postTitle.trim() || !postDetails.trim()) return;

    const newPost: CommunityPost = {
      postId: `post_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      isVerified: true,
      destinationCity: postDestination,
      startDate: postStartDate,
      endDate: postEndDate,
      budgetTier: postBudget,
      transportMode: postTransport,
      activityTitle: postTitle,
      activityDetails: postDetails,
      tags: ['VerifiedTraveler', postDestination.split(' ')[0]],
      responsesCount: 0,
      createdAt: 'Just now',
    };

    setCommunityPosts([newPost, ...communityPosts]);
    setShowCreateModal(false);
    setPostTitle('');
    setPostDetails('');
  };

  // Filter posts
  const filteredPosts = communityPosts.filter((post) => {
    if (filterCity !== 'all' && !post.destinationCity.toLowerCase().includes(filterCity.toLowerCase())) {
      return false;
    }
    if (filterBudget !== 'all' && post.budgetTier !== filterBudget) {
      return false;
    }
    if (searchQuery.trim() && !post.activityTitle.toLowerCase().includes(searchQuery.toLowerCase()) && !post.activityDetails.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Direct chat thread
  if (selectedBuddy) {
    return (
      <div className="space-y-3 pb-14 animate-in fade-in duration-150">
        {/* Chat header */}
        <div className={`p-3 rounded-2xl border flex items-center justify-between ${
          isDark ? 'bg-[#150f24] border-purple-900/40' : 'bg-white border-purple-100 shadow-sm'
        }`}>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setSelectedBuddy(null)}
              className="p-1.5 rounded-lg border border-purple-900/30 text-stone-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <img
              src={selectedBuddy.avatar}
              alt={selectedBuddy.name}
              className="w-9 h-9 rounded-full object-cover border border-purple-600"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold">{selectedBuddy.name}</h3>
                <span className="text-[9px] bg-purple-500/20 text-purple-600 dark:text-purple-300 px-1 rounded font-mono font-bold">
                  AU10TIX ✓
                </span>
              </div>
              <p className="text-[10px] text-stone-400">{selectedBuddy.nationality} · {selectedBuddy.tripsCompleted} trips</p>
            </div>
          </div>

          <button
            onClick={() => alert(`Report filed for ${selectedBuddy.name}. TRAVORA trust team alerted.`)}
            className="text-stone-400 hover:text-red-500 p-1.5"
            title="Report / Safety Flag"
          >
            <AlertOctagon className="w-4 h-4" />
          </button>
        </div>

        {/* Public meetup venue advice */}
        <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-[11px] text-purple-600 dark:text-purple-300 flex items-center justify-between">
          <span>Safe Meetup Spot: {selectedBuddy.safeMeetupLocation}</span>
          <button
            onClick={() => {
              setChatMessages((prev) => [
                ...prev,
                {
                  id: `loc_${Date.now()}`,
                  senderId: user.id,
                  text: '📍 Shared Live Safe Zone Location: Cinnamon Gardens (Colombo 07)',
                  timestamp: 'Just now',
                  isLocationShare: true,
                },
              ]);
            }}
            className="font-bold underline flex items-center gap-1"
          >
            <Share2 className="w-3 h-3" /> Share Pin
          </button>
        </div>

        {/* Messages */}
        <div className={`space-y-2.5 min-h-[260px] p-3 rounded-2xl border ${
          isDark ? 'bg-black/40 border-purple-900/30' : 'bg-purple-50/30 border-purple-100'
        }`}>
          {chatMessages.map((msg) => {
            const isMe = msg.senderId === user.id || msg.senderId === 'usr_maya_colombo';
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                    isMe
                      ? 'bg-purple-700 text-white rounded-br-xs'
                      : isDark
                      ? 'bg-stone-900 border border-purple-900/40 text-stone-200 rounded-bl-xs'
                      : 'bg-white border border-purple-100 text-stone-800 rounded-bl-xs shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-stone-500 mt-0.5 px-1">{msg.timestamp}</span>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessageText}
            onChange={(e) => setNewMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newMessageText.trim()) {
                setChatMessages([
                  ...chatMessages,
                  { id: `m_${Date.now()}`, senderId: user.id, text: newMessageText, timestamp: 'Just now' },
                ]);
                setNewMessageText('');
              }
            }}
            placeholder={`Message ${selectedBuddy.name.split(' ')[0]}...`}
            className={`flex-1 rounded-2xl px-4 py-2.5 text-xs border focus:outline-none focus:border-purple-600 ${
              isDark ? 'bg-[#150f24] border-purple-900/40 text-stone-100' : 'bg-white border-purple-200 text-stone-900'
            }`}
          />
          <button
            onClick={() => {
              if (newMessageText.trim()) {
                setChatMessages([
                  ...chatMessages,
                  { id: `m_${Date.now()}`, senderId: user.id, text: newMessageText, timestamp: 'Just now' },
                ]);
                setNewMessageText('');
              }
            }}
            className="p-2.5 rounded-2xl bg-purple-700 hover:bg-purple-600 text-white shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-14 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header & Post Creator CTA */}
      <div className={`p-4 rounded-3xl border space-y-3 ${
        isDark ? 'bg-[#150f24] border-purple-900/40' : 'bg-white border-purple-100 shadow-sm'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-extrabold tracking-tight">
              Community Travel Buddy Network
            </h2>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              100% AU10TIX ID & Liveness Verified Female Travelers
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post Request</span>
          </button>
        </div>

        {/* Sub-tab Switcher: 'posts' vs 'travelers' */}
        <div className="flex gap-2 text-xs border-b border-purple-900/20 dark:border-purple-900/40 pb-2">
          <button
            onClick={() => setSubTab('posts')}
            className={`font-bold pb-0.5 transition ${
              subTab === 'posts'
                ? 'text-purple-600 dark:text-purple-300 border-b-2 border-purple-600'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Buddy Requests ({filteredPosts.length})
          </button>
          <button
            onClick={() => setSubTab('travelers')}
            className={`font-bold pb-0.5 transition ${
              subTab === 'travelers'
                ? 'text-purple-600 dark:text-purple-300 border-b-2 border-purple-600'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Traveler Directory ({verifiedTravelBuddies.length})
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs">
          {/* City filter */}
          <select
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className={`px-2.5 py-1 rounded-xl border text-xs font-medium focus:outline-none ${
              isDark ? 'bg-stone-900 border-purple-900/50 text-stone-200' : 'bg-purple-50 border-purple-200 text-stone-800'
            }`}
          >
            <option value="all">All Cities</option>
            <option value="Colombo">Colombo</option>
            <option value="Galle">Galle</option>
            <option value="Mirissa">Mirissa</option>
            <option value="Kandy">Kandy</option>
          </select>

          {/* Budget filter */}
          <select
            value={filterBudget}
            onChange={(e) => setFilterBudget(e.target.value)}
            className={`px-2.5 py-1 rounded-xl border text-xs font-medium focus:outline-none ${
              isDark ? 'bg-stone-900 border-purple-900/50 text-stone-200' : 'bg-purple-50 border-purple-200 text-stone-800'
            }`}
          >
            <option value="all">All Budgets</option>
            <option value="$">$ (Budget / Hostels)</option>
            <option value="$$">$$ (Mid / Private Stays)</option>
            <option value="$$$">$$$ (Luxury / Villas)</option>
          </select>

          {/* Search box */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keywords..."
            className={`flex-1 min-w-[120px] px-3 py-1 rounded-xl border text-xs focus:outline-none ${
              isDark ? 'bg-stone-900 border-purple-900/50 text-stone-200' : 'bg-purple-50 border-purple-200 text-stone-800'
            }`}
          />
        </div>
      </div>

      {/* SUB-TAB 1: COMMUNITY BUDDY REQUESTS */}
      {subTab === 'posts' && (
        <div className="space-y-3">
          {filteredPosts.map((post) => (
            <div
              key={post.postId}
              className={`p-4 rounded-3xl border space-y-3 transition hover:shadow-md ${
                isDark ? 'bg-[#150f24] border-purple-900/40' : 'bg-white border-purple-100 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src={post.userAvatar}
                    alt={post.userName}
                    className="w-10 h-10 rounded-full object-cover border border-purple-600"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs">{post.userName}</span>
                      <span className="text-[9px] bg-purple-500/20 text-purple-600 dark:text-purple-300 px-1 rounded font-bold">
                        AU10TIX ✓
                      </span>
                    </div>
                    <div className="text-[10px] text-stone-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-purple-400" />
                      <span>{post.destinationCity}</span>
                      <span>·</span>
                      <Calendar className="w-3 h-3 text-purple-400" />
                      <span>{post.startDate} to {post.endDate}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded-full font-bold">
                    Budget {post.budgetTier} · {post.transportMode}
                  </span>
                  <div className="text-[10px] text-stone-400 mt-1">{post.createdAt}</div>
                </div>
              </div>

              <div>
                <h4 className="text-xs sm:text-sm font-bold text-purple-600 dark:text-purple-300">{post.activityTitle}</h4>
                <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                  {post.activityDetails}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-purple-900/20 dark:border-purple-900/40 text-xs">
                <div className="flex gap-1 text-[10px]">
                  {post.tags.map((tag, i) => (
                    <span key={i} className="text-stone-400">#{tag}</span>
                  ))}
                </div>

                <button
                  onClick={() => {
                    const match = verifiedTravelBuddies.find((b) => b.name === post.userName) || verifiedTravelBuddies[0];
                    setSelectedBuddy(match);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Connect & Chat</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUB-TAB 2: VERIFIED TRAVELER DIRECTORY */}
      {subTab === 'travelers' && (
        <div className="space-y-3">
          {verifiedTravelBuddies.map((buddy) => (
            <div
              key={buddy.id}
              className={`p-4 rounded-3xl border space-y-3 ${
                isDark ? 'bg-[#150f24] border-purple-900/40' : 'bg-white border-purple-100 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={buddy.avatar}
                    alt={buddy.name}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-purple-600"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold">{buddy.name}</h3>
                      <span className="text-xs text-stone-400">({buddy.age})</span>
                      <span className="text-[10px] bg-purple-500/20 text-purple-600 dark:text-purple-300 px-1.5 py-0.2 rounded-full font-bold">
                        AU10TIX ✓
                      </span>
                    </div>
                    <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1 mt-0.5">
                      <span>{buddy.nationality}</span>
                      <span>·</span>
                      <span className="text-purple-600 dark:text-purple-300 font-mono text-[11px] font-bold">{buddy.currentCity}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedBuddy(buddy)}
                  className="p-2 rounded-xl bg-purple-600/20 text-purple-600 dark:text-purple-300 hover:bg-purple-600 hover:text-white transition"
                  title="Direct Message"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed bg-purple-500/5 dark:bg-stone-950/60 p-2.5 rounded-2xl border border-purple-900/20">
                "{buddy.bio}"
              </p>

              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 pt-1 border-t border-purple-900/20 dark:border-purple-900/40">
                <div className="flex items-center gap-1 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-purple-400" />
                  <span>Safe Meetup: <strong>{buddy.safeMeetupLocation}</strong></span>
                </div>
                <button
                  onClick={() => setSelectedBuddy(buddy)}
                  className="text-purple-600 dark:text-purple-400 font-bold hover:underline"
                >
                  Open Chat →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE POST MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className={`w-full max-w-md rounded-3xl border p-5 sm:p-6 space-y-4 shadow-2xl ${
            isDark ? 'bg-[#150f24] border-purple-900/60 text-white' : 'bg-white border-purple-200 text-stone-900'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-purple-500" />
                Create Travel Buddy Request
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-stone-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-stone-400 block mb-1">Activity Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Split HelaGo cab to Galle Fort & Sunset Tea"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border focus:outline-none focus:border-purple-600 ${
                    isDark ? 'bg-stone-950 border-purple-900/40' : 'bg-purple-50 border-purple-200'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-400 block mb-1">Destination City</label>
                  <input
                    type="text"
                    value={postDestination}
                    onChange={(e) => setPostDestination(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border focus:outline-none focus:border-purple-600 ${
                      isDark ? 'bg-stone-950 border-purple-900/40' : 'bg-purple-50 border-purple-200'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-stone-400 block mb-1">Transport Mode</label>
                  <select
                    value={postTransport}
                    onChange={(e) => setPostTransport(e.target.value as any)}
                    className={`w-full p-2.5 rounded-xl border focus:outline-none ${
                      isDark ? 'bg-stone-950 border-purple-900/40 text-stone-200' : 'bg-purple-50 border-purple-200 text-stone-800'
                    }`}
                  >
                    <option value="HelaGo Cab">HelaGo Cab</option>
                    <option value="Train">Scenic Train</option>
                    <option value="Tuk-Tuk">Metered Tuk-Tuk</option>
                    <option value="Shared Van">Shared Van</option>
                    <option value="Walking">Walking Escort</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-400 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={postStartDate}
                    onChange={(e) => setPostStartDate(e.target.value)}
                    className={`w-full p-2 rounded-xl border focus:outline-none ${
                      isDark ? 'bg-stone-950 border-purple-900/40 text-stone-200' : 'bg-purple-50 border-purple-200 text-stone-800'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-stone-400 block mb-1">Budget Tier</label>
                  <div className="grid grid-cols-3 gap-1">
                    {(['$', '$$', '$$$'] as const).map((tier) => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => setPostBudget(tier)}
                        className={`py-1.5 rounded-lg font-bold border transition ${
                          postBudget === tier
                            ? 'bg-purple-600 text-white border-purple-500'
                            : 'bg-stone-900 border-stone-800 text-stone-400'
                        }`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-stone-400 block mb-1">Activity & Route Details</label>
                <textarea
                  rows={3}
                  placeholder="Share details on where you want to go, meetup preferences, and itinerary..."
                  value={postDetails}
                  onChange={(e) => setPostDetails(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border focus:outline-none focus:border-purple-600 ${
                    isDark ? 'bg-stone-950 border-purple-900/40' : 'bg-purple-50 border-purple-200'
                  }`}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-stone-700 text-stone-400 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                className="flex-1 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold shadow-md transition"
              >
                Publish Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
