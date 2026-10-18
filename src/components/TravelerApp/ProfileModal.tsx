import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Phone,
  Plus,
  Trash2,
  Save,
  X,
  Clock,
  Sparkles,
  Sun,
  Moon,
  CheckCircle,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { UserProfile, EmergencyContact } from '../../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSaveUser: (updatedUser: UserProfile) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onUpgradePrompt: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSaveUser,
  theme,
  onToggleTheme,
  onUpgradePrompt,
}) => {
  const isDark = theme === 'dark';

  // Form states
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.bio);
  const [nationality, setNationality] = useState(user.nationality);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(user.emergencyContacts);
  
  // New contact inputs
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('Friend');
  const [showAddContact, setShowAddContact] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const maxFreeContacts = 4;
  const canAddMoreContacts = user.subscriptionStatus === 'premium_monthly' || emergencyContacts.length < maxFreeContacts;

  const handleAddContact = () => {
    if (!newContactName.trim() || !newContactPhone.trim()) return;
    if (!canAddMoreContacts) {
      onUpgradePrompt();
      return;
    }

    const newContact: EmergencyContact = {
      id: `c_${Date.now()}`,
      name: newContactName,
      phone: newContactPhone,
      relationship: newContactRelation,
      notifySms: true,
      notifyPush: true,
    };

    setEmergencyContacts([...emergencyContacts, newContact]);
    setNewContactName('');
    setNewContactPhone('');
    setShowAddContact(false);
  };

  const handleDeleteContact = (id: string) => {
    setEmergencyContacts(emergencyContacts.filter((c) => c.id !== id));
  };

  const handleSaveAll = () => {
    onSaveUser({
      ...user,
      name,
      email,
      bio,
      nationality,
      emergencyContacts,
    });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1000);
  };

  const activityLogs = [
    { title: 'Safe Check-in Confirmed via PIN 1234', time: 'Today, 08:45 AM', type: 'safety' },
    { title: 'AU10TIX Identity Verification Completed', time: 'Oct 01, 2026', type: 'kyc' },
    { title: 'HelaGo Ride Completed · WP CAB-4482', time: 'Oct 13, 2026', type: 'transport' },
    { title: 'Saved Stay · Mirissa Surf Co-Living', time: 'Oct 12, 2026', type: 'stay' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className={`w-full max-w-lg rounded-3xl border shadow-2xl p-5 sm:p-6 space-y-5 max-h-[90vh] overflow-y-auto ${
        isDark
          ? 'bg-[#130f1f] border-purple-900/50 text-stone-100'
          : 'bg-white border-purple-100 text-stone-900'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-900/20 dark:border-purple-900/40">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-600 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 bg-purple-700 text-white p-0.5 rounded-full border border-white">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold">{user.name}</h2>
                <span className="bg-purple-500/20 text-purple-700 dark:text-purple-300 text-[10px] px-2 py-0.5 rounded-full font-bold border border-purple-500/30">
                  AU10TIX ID VERIFIED
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">{user.nationality} · {user.email}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-purple-900/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Basic Editable Info */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
            Personal Details
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-stone-500 dark:text-stone-400 block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-purple-600 ${
                  isDark
                    ? 'bg-stone-900/90 border-purple-900/40 text-stone-100'
                    : 'bg-purple-50/50 border-purple-100 text-stone-900'
                }`}
              />
            </div>
            <div>
              <label className="text-stone-500 dark:text-stone-400 block mb-1">Nationality</label>
              <input
                type="text"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-purple-600 ${
                  isDark
                    ? 'bg-stone-900/90 border-purple-900/40 text-stone-100'
                    : 'bg-purple-50/50 border-purple-100 text-stone-900'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-stone-500 dark:text-stone-400 block mb-1">Bio & Travel Ethos</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-purple-600 ${
                isDark
                  ? 'bg-stone-900/90 border-purple-900/40 text-stone-100'
                  : 'bg-purple-50/50 border-purple-100 text-stone-900'
              }`}
            />
          </div>
        </div>

        {/* Section 2: Dedicated Emergency Contacts Manager (Up to 4 for Free) */}
        <div className="space-y-3 pt-2 border-t border-purple-900/20 dark:border-purple-900/40">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                Emergency Contacts ({emergencyContacts.length}/{maxFreeContacts} Free Tier)
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Auto-notified with GPS coordinates during SOS or missed trip timer
              </p>
            </div>

            {canAddMoreContacts ? (
              <button
                onClick={() => setShowAddContact(!showAddContact)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Contact</span>
              </button>
            ) : (
              <button
                onClick={onUpgradePrompt}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-purple-600 text-white text-[11px] font-bold shadow-xs"
              >
                <Sparkles className="w-3 h-3" />
                <span>Unlimited (&gt;4)</span>
              </button>
            )}
          </div>

          {/* Add contact mini-form */}
          {showAddContact && (
            <div className={`p-3 rounded-2xl border space-y-2 text-xs ${
              isDark ? 'bg-stone-900/90 border-purple-900/50' : 'bg-purple-50 border-purple-200'
            }`}>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Contact Name"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  className={`p-2 rounded-lg border text-xs focus:outline-none ${
                    isDark ? 'bg-stone-950 border-stone-800' : 'bg-white border-purple-200'
                  }`}
                />
                <input
                  type="tel"
                  placeholder="+Country Phone"
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                  className={`p-2 rounded-lg border text-xs focus:outline-none ${
                    isDark ? 'bg-stone-950 border-stone-800' : 'bg-white border-purple-200'
                  }`}
                />
                <select
                  value={newContactRelation}
                  onChange={(e) => setNewContactRelation(e.target.value)}
                  className={`p-2 rounded-lg border text-xs focus:outline-none ${
                    isDark ? 'bg-stone-950 border-stone-800 text-stone-200' : 'bg-white border-purple-200 text-stone-800'
                  }`}
                >
                  <option value="Sister">Sister</option>
                  <option value="Mother">Mother</option>
                  <option value="Partner">Partner</option>
                  <option value="Friend">Friend</option>
                  <option value="Doctor">Doctor</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setShowAddContact(false)}
                  className="px-2.5 py-1 rounded-md text-stone-500 hover:text-stone-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddContact}
                  className="px-3 py-1 rounded-md bg-purple-600 text-white text-xs font-bold"
                >
                  Save Contact
                </button>
              </div>
            </div>
          )}

          {/* Contacts list */}
          <div className="space-y-1.5">
            {emergencyContacts.map((contact) => (
              <div
                key={contact.id}
                className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                  isDark ? 'bg-stone-900/60 border-purple-900/30' : 'bg-purple-50/50 border-purple-100'
                }`}
              >
                <div>
                  <div className="font-semibold text-stone-200 dark:text-stone-100 flex items-center gap-1.5">
                    {contact.name}
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 font-normal">
                      ({contact.relationship})
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">{contact.phone}</div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20 px-1.5 py-0.5 rounded font-mono">
                    SMS+Push
                  </span>
                  <button
                    onClick={() => handleDeleteContact(contact.id)}
                    className="p-1 text-stone-400 hover:text-red-500"
                    title="Remove Contact"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Theme Preferences & Activity Logs */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-purple-900/20 dark:border-purple-900/40 text-xs">
          {/* Theme switcher */}
          <div className={`p-3 rounded-2xl border flex flex-col justify-between gap-2 ${
            isDark ? 'bg-stone-900/60 border-purple-900/30' : 'bg-purple-50/40 border-purple-100'
          }`}>
            <div>
              <div className="font-bold">App Visual Theme</div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400">
                Currently in {isDark ? 'Dark Violet' : 'Light Lilac'} mode
              </div>
            </div>
            <button
              onClick={onToggleTheme}
              className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-600 dark:text-purple-300 font-semibold"
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{isDark ? 'Switch to Light' : 'Switch to Dark'}</span>
            </button>
          </div>

          {/* KYC Badge Info */}
          <div className={`p-3 rounded-2xl border flex flex-col justify-between gap-2 ${
            isDark ? 'bg-stone-900/60 border-purple-900/30' : 'bg-purple-50/40 border-purple-100'
          }`}>
            <div>
              <div className="font-bold flex items-center gap-1 text-emerald-500">
                <CheckCircle className="w-3.5 h-3.5" />
                AU10TIX Shield
              </div>
              <div className="text-[10px] text-stone-500 dark:text-stone-400 font-mono truncate">
                {user.pinkShieldBadgeHash}
              </div>
            </div>
            <span className="text-[10px] text-stone-400">
              Government Passport + 3D Liveness Verified
            </span>
          </div>
        </div>

        {/* Past Activity Logs */}
        <div className="space-y-2 pt-2 border-t border-purple-900/20 dark:border-purple-900/40">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Recent Safety Activity
          </h3>
          <div className="space-y-1.5 text-xs">
            {activityLogs.map((log, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-xl border flex items-center justify-between text-[11px] ${
                  isDark ? 'bg-stone-950/60 border-stone-800' : 'bg-purple-50/30 border-purple-100'
                }`}
              >
                <span className="text-stone-300 dark:text-stone-200">{log.title}</span>
                <span className="text-[10px] text-stone-500 font-mono">{log.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Save CTA */}
        <div className="pt-2 flex gap-3">
          <button
            onClick={onClose}
            className={`flex-1 py-2.5 rounded-xl border font-semibold text-xs ${
              isDark ? 'border-stone-800 text-stone-400 hover:text-white' : 'border-stone-200 text-stone-600 hover:text-stone-900'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSaveAll}
            className="flex-1 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition"
          >
            {saveSuccess ? <CheckCircle className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{saveSuccess ? 'Changes Saved!' : 'Save Profile'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
