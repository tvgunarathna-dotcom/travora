import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Phone,
  Plus,
  Trash2,
  Save,
  X,
  Sparkles,
  Sun,
  Moon,
  CheckCircle,
  Edit2,
  Lock,
  MapPin,
  Compass,
  ArrowRight,
  Share2,
  Download,
  Percent,
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

  // Editable Account Details
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.bio);
  const [nationality, setNationality] = useState(user.nationality);
  const [currentCity, setCurrentCity] = useState(user.currentCity);
  const [safetyPin, setSafetyPin] = useState(user.safetyPin);

  // Editable Emergency Contacts list
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(user.emergencyContacts);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);

  // Inline edit contact temp state
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRelation, setEditRelation] = useState('');

  // Add Contact Form
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('Family');

  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const maxFreeContacts = 4;
  const canAddMoreContacts = user.subscriptionStatus === 'premium_monthly' || emergencyContacts.length < maxFreeContacts;

  const handleStartEditContact = (c: EmergencyContact) => {
    setEditingContactId(c.id);
    setEditName(c.name);
    setEditPhone(c.phone);
    setEditRelation(c.relationship);
  };

  const handleSaveContactEdit = (id: string) => {
    setEmergencyContacts((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, name: editName, phone: editPhone, relationship: editRelation }
          : c
      )
    );
    setEditingContactId(null);
  };

  const handleAddContact = () => {
    if (!newContactName.trim() || !newContactPhone.trim()) return;
    if (!canAddMoreContacts) {
      onUpgradePrompt();
      return;
    }

    const newC: EmergencyContact = {
      id: `c_${Date.now()}`,
      name: newContactName,
      phone: newContactPhone,
      relationship: newContactRelation,
      notifySms: true,
      notifyPush: true,
    };

    setEmergencyContacts([...emergencyContacts, newC]);
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
      currentCity,
      safetyPin,
      emergencyContacts,
    });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className={`w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl my-auto transition-all ${
        isDark ? 'bg-[#150a28] text-white border border-purple-800/50' : 'bg-white text-stone-900 border border-purple-100'
      }`}>
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 border-b border-purple-900/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-black text-sm sm:text-base text-stone-900 dark:text-white">
                My Profile & Account
              </h2>
              <p className="text-[10px] text-stone-500 dark:text-purple-300">
                Piyumi Anuradha · AU10TIX ID Verified
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-200 transition"
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-900 text-stone-500 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 flex flex-col gap-5 max-h-[75vh] overflow-y-auto">
          {/* PROMINENT VERIFIED USER STATUS CARD */}
          <div className={`p-4 rounded-2xl border transition-all ${
            user.isVerified
              ? isDark
                ? 'bg-gradient-to-r from-emerald-950/60 via-purple-950/50 to-indigo-950/50 border-emerald-500/50 text-white shadow-md'
                : 'bg-emerald-50/90 border-emerald-300 text-stone-900 shadow-sm'
              : isDark
              ? 'bg-rose-950/40 border-rose-800/40 text-stone-200'
              : 'bg-rose-50 border-rose-200 text-stone-900'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-emerald-400 shadow-md"
                  />
                  {user.isVerified && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-xs">
                      <CheckCircle className="w-3 h-3 text-white fill-white" />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-base text-stone-900 dark:text-white">
                      {name}
                    </h3>
                    {user.isVerified ? (
                      <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>VERIFIED USER ✓</span>
                      </span>
                    ) : (
                      <span className="text-[10px] bg-stone-300 text-stone-800 font-bold px-2 py-0.5 rounded-full">
                        Unverified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-700 dark:text-purple-200 mt-0.5 font-medium">
                    {email} · {currentCity}
                  </p>
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-300 font-mono font-bold mt-0.5">
                    ID: SLTDA-AU10TIX:SHA256:9f2c81e3a47d
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] bg-purple-700 text-white px-2 py-0.5 rounded-md font-bold uppercase tracking-wider block">
                  100% Trust Score
                </span>
                <span className="text-[9px] text-stone-600 dark:text-stone-300 mt-1 block">
                  Passport Verified
                </span>
              </div>
            </div>

            {/* Verification Proof Metrics */}
            <div className={`mt-3 pt-3 border-t grid grid-cols-3 gap-2 text-center text-xs ${
              isDark ? 'border-purple-800/40 text-stone-200' : 'border-emerald-200 text-stone-800'
            }`}>
              <div className="p-1 rounded-lg bg-black/10 dark:bg-black/30">
                <span className="text-[10px] text-stone-600 dark:text-stone-400 block font-medium">Status</span>
                <span className="font-extrabold text-emerald-700 dark:text-emerald-300 text-xs">Verified ✓</span>
              </div>
              <div className="p-1 rounded-lg bg-black/10 dark:bg-black/30">
                <span className="text-[10px] text-stone-600 dark:text-stone-400 block font-medium">Identity Provider</span>
                <span className="font-extrabold text-purple-700 dark:text-purple-300 text-xs">AU10TIX Global</span>
              </div>
              <div className="p-1 rounded-lg bg-black/10 dark:bg-black/30">
                <span className="text-[10px] text-stone-600 dark:text-stone-400 block font-medium">Biometric Match</span>
                <span className="font-extrabold text-emerald-700 dark:text-emerald-300 text-xs">3D Liveness 100%</span>
              </div>
            </div>
          </div>

          {/* ========================================================
              SWITCH TO PREMIUM SECTION (All 5 user-requested features)
             ======================================================== */}
          <div className="rounded-2xl p-4 bg-gradient-to-br from-purple-950 via-[#1e0d3d] to-indigo-950 border border-purple-500/60 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                <h4 className="font-black text-sm text-white">
                  TRAVORA Premium
                </h4>
              </div>
              <span className="text-[10px] bg-amber-400/20 text-amber-300 font-black px-2 py-0.5 rounded uppercase tracking-wider border border-amber-400/30">
                $4.99 / Month
              </span>
            </div>

            <p className="text-xs text-purple-200 mb-3">
              Unlock complete safety privileges and offline resilience on every trip:
            </p>

            {/* 5 EXACT PREMIUM FEATURES REQUESTED */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-4">
              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-black/30 border border-purple-800/40">
                <Download className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>Offline maps</span>
              </div>
              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-black/30 border border-purple-800/40">
                <CheckCircle className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>Priority booking</span>
              </div>
              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-black/30 border border-purple-800/40">
                <Phone className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>More emergency contacts</span>
              </div>
              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-black/30 border border-purple-800/40">
                <Share2 className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>Share live location with loved ones on the go</span>
              </div>
              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-black/30 border border-purple-800/40 sm:col-span-2">
                <Percent className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>Exclusive discounts on stays & verified tours</span>
              </div>
            </div>

            <button
              onClick={() => {
                onUpgradePrompt();
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-purple-500 to-fuchsia-500 hover:from-amber-500 hover:to-fuchsia-600 text-stone-950 font-black text-xs flex items-center justify-center gap-2 shadow-md transition active:scale-98"
            >
              <span>Switch to Premium</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* EDITABLE PERSONAL DETAILS */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-purple-600 dark:text-purple-300">
              Personal Details
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border outline-none ${
                    isDark ? 'bg-black/40 border-purple-800 text-white' : 'bg-purple-50/50 border-purple-200 text-stone-900'
                  }`}
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border outline-none ${
                    isDark ? 'bg-black/40 border-purple-800 text-white' : 'bg-purple-50/50 border-purple-200 text-stone-900'
                  }`}
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                  Home / Base City
                </label>
                <input
                  type="text"
                  value={currentCity}
                  onChange={(e) => setCurrentCity(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border outline-none ${
                    isDark ? 'bg-black/40 border-purple-800 text-white' : 'bg-purple-50/50 border-purple-200 text-stone-900'
                  }`}
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                  Arrival Safe PIN
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={safetyPin}
                  onChange={(e) => setSafetyPin(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border outline-none font-mono tracking-widest ${
                    isDark ? 'bg-black/40 border-purple-800 text-white' : 'bg-purple-50/50 border-purple-200 text-stone-900'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                Travel Bio & Safety Preferences
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                  isDark ? 'bg-black/40 border-purple-800 text-white' : 'bg-purple-50/50 border-purple-200 text-stone-900'
                }`}
              />
            </div>
          </div>

          {/* ========================================================
              EMERGENCY CONTACTS (EDITABLE BY USER)
             ======================================================== */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-purple-600 dark:text-purple-300">
                  Emergency Contacts ({emergencyContacts.length})
                </h4>
                <p className="text-[10px] text-stone-500 dark:text-stone-400">
                  Default names and numbers are fully editable. Alerted during SOS & Trip Timers.
                </p>
              </div>

              {canAddMoreContacts && (
                <button
                  onClick={() => setShowAddContact(!showAddContact)}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Contact</span>
                </button>
              )}
            </div>

            {/* List of Contacts */}
            <div className="flex flex-col gap-2">
              {emergencyContacts.map((contact) => {
                const isEditing = editingContactId === contact.id;

                return (
                  <div
                    key={contact.id}
                    className={`p-3 rounded-2xl border text-xs transition ${
                      isDark ? 'bg-black/30 border-purple-900/40' : 'bg-purple-50/40 border-purple-200'
                    }`}
                  >
                    {isEditing ? (
                      /* Inline Contact Editor */
                      <div className="flex flex-col gap-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Contact Name (e.g. Sarah Miller)"
                          className="p-1.5 rounded-lg bg-stone-900 border border-purple-500 text-white text-xs outline-none"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                            placeholder="Phone (+94 ...)"
                            className="p-1.5 rounded-lg bg-stone-900 border border-purple-500 text-white text-xs outline-none"
                          />
                          <input
                            type="text"
                            value={editRelation}
                            onChange={(e) => setEditRelation(e.target.value)}
                            placeholder="Relationship"
                            className="p-1.5 rounded-lg bg-stone-900 border border-purple-500 text-white text-xs outline-none"
                          />
                        </div>
                        <div className="flex justify-end gap-2 mt-1">
                          <button
                            onClick={() => setEditingContactId(null)}
                            className="px-2.5 py-1 rounded-lg bg-stone-800 text-[10px] text-stone-300"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveContactEdit(contact.id)}
                            className="px-2.5 py-1 rounded-lg bg-purple-600 text-[10px] text-white font-bold"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Contact Display with Edit & Delete actions */
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-purple-600/30 text-purple-400 flex items-center justify-center shrink-0">
                            <Phone className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-extrabold text-stone-900 dark:text-white block">
                              {contact.name}
                            </span>
                            <span className="text-[10px] text-stone-500 dark:text-purple-300">
                              {contact.relationship} · {contact.phone}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleStartEditContact(contact)}
                            className="p-1.5 rounded-lg bg-purple-900/40 text-purple-300 hover:bg-purple-800 transition"
                            title="Edit Contact Name/Phone"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteContact(contact.id)}
                            className="p-1.5 rounded-lg bg-rose-950/40 text-rose-300 hover:bg-rose-900 transition"
                            title="Delete Contact"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add Contact Form Drawer */}
            {showAddContact && (
              <div className="p-3 rounded-2xl border border-purple-500/50 bg-black/50 text-xs flex flex-col gap-2">
                <input
                  type="text"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  placeholder="Contact Name (e.g. Kasun Brother)"
                  className="p-2 rounded-xl bg-stone-900 border border-purple-800 text-white outline-none"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    placeholder="Phone number"
                    className="p-2 rounded-xl bg-stone-900 border border-purple-800 text-white outline-none"
                  />
                  <input
                    type="text"
                    value={newContactRelation}
                    onChange={(e) => setNewContactRelation(e.target.value)}
                    placeholder="Relationship"
                    className="p-2 rounded-xl bg-stone-900 border border-purple-800 text-white outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2 mt-1">
                  <button
                    onClick={() => setShowAddContact(false)}
                    className="px-3 py-1.5 rounded-xl bg-stone-800 text-stone-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddContact}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-purple-900/30 flex items-center justify-between gap-3">
          {saveSuccess ? (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Profile Updated!
            </span>
          ) : (
            <span className="text-[11px] text-stone-400">
              Changes save locally in browser storage
            </span>
          )}

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-purple-800 text-xs font-semibold hover:bg-stone-800 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAll}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-700 to-fuchsia-600 hover:from-purple-800 hover:to-fuchsia-700 text-white font-black text-xs shadow-md transition active:scale-98"
            >
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
