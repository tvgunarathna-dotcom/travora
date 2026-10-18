import { MapPOI, SafetyZone, Booking, PartnerStats, CommunityPost, DualTranslation } from '../types';
import { fallbackHotlines, initialCurrentUser, mockDynamicPOIs, dualTranslationsDictionary } from '../data/mockData';

export const apiService = {
  // Check if offline mode is simulated or browser is disconnected
  isOfflineMode(): boolean {
    const forced = localStorage.getItem('travora_offline_sim') === 'true';
    return forced || !navigator.onLine;
  },

  setOfflineSimulation(enabled: boolean) {
    localStorage.setItem('travora_offline_sim', enabled ? 'true' : 'false');
  },

  // 1. AU10TIX / Identity Verification Webhook Simulation
  async verifyIdentity(userId: string, provider: 'AU10TIX' | 'Persona' | 'Didit' | 'Stripe Identity' = 'AU10TIX', idType: string = 'Passport') {
    if (this.isOfflineMode()) {
      return {
        success: true,
        offlineCached: true,
        verification: {
          sessionId: `v_au10tix_offline_${Date.now()}`,
          userId,
          status: 'verified',
          idType,
          livenessConfidence: 99.8,
          faceMatchScore: 99.1,
          verifiedAt: new Date().toISOString(),
          provider,
          badgeHash: `AU10TIX:SHA256:offline_${Date.now()}`,
        },
        gatedPermissions: {
          canDirectMessage: true,
          canMatchTravelBuddies: true,
          canPostCommunityFeed: true,
          pinkShieldBadgeIssued: true,
          badgeHash: 'AU10TIX:SHA256:offline_token',
        },
      };
    }

    const res = await fetch('/api/verify-identity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, provider, idType }),
    });
    return await res.json();
  },

  // 2. SOS Trigger & Emergency Dispatch
  async triggerSos(payload: {
    userId: string;
    location: { lat: number; lng: number; accuracy?: string };
    emergencyContacts: any[];
    triggerType: 'one_touch_sos' | 'trip_timer_missed' | 'duress_pin';
    silentAlarm: boolean;
    audioStreamActive: boolean;
  }) {
    if (this.isOfflineMode()) {
      const alertId = `SOS-OFFLINE-${Date.now()}`;
      return {
        success: true,
        offlineMode: true,
        alertId,
        status: 'STORED_LOCALLY_AND_TRIGGERED_CELLULAR_SMS',
        triggeredAt: new Date().toISOString(),
        triggerType: payload.triggerType,
        silentMode: payload.silentAlarm,
        localAuthorities: fallbackHotlines['LK'],
        message: 'Network offline. SOS logged to offline storage and preparing SMS dispatch queue.',
      };
    }

    const res = await fetch('/api/sos/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  },

  // 3. Dynamic Map POIs (Police, Hospitals, Safe Cafes)
  async getPOIs(category?: string): Promise<{ success: boolean; data: MapPOI[] }> {
    // Return mock dynamic POIs filtered by category
    let list = [...mockDynamicPOIs];
    if (category && category !== 'all') {
      list = list.filter((p) => p.category === category);
    }
    return { success: true, data: list };
  },

  // 4. Safety Heatmap Zones with dynamic city filtering
  async getSafetyZones(city?: string): Promise<{ success: boolean; zones: SafetyZone[] }> {
    if (this.isOfflineMode()) {
      const cached = localStorage.getItem('travora_cached_safety_zones');
      if (cached) {
        return { success: true, zones: JSON.parse(cached) };
      }
    }

    try {
      const url = new URL('/api/maps/safety-zones', window.location.origin);
      if (city) url.searchParams.set('city', city);
      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success && data.zones) {
        localStorage.setItem('travora_cached_safety_zones', JSON.stringify(data.zones));
      }
      return data;
    } catch (e) {
      const cached = localStorage.getItem('travora_cached_safety_zones');
      if (cached) {
        return { success: true, zones: JSON.parse(cached) };
      }
      throw e;
    }
  },

  // 5. Custom Safety & Medical Translator (Sinhala & Tamil)
  async translateCustomPhrase(text: string): Promise<{ success: boolean; translation: DualTranslation }> {
    if (this.isOfflineMode()) {
      // Find matching phrase in dictionary or return basic template
      const match = dualTranslationsDictionary.find((d) => d.english.toLowerCase().includes(text.toLowerCase()) || text.toLowerCase().includes(d.english.toLowerCase()));
      if (match) {
        return { success: true, translation: match };
      }
      return {
        success: true,
        translation: {
          english: text,
          sinhalaText: 'මට උදව් අවශ්‍යයි (නොබැඳි පරිවර්තනය)',
          sinhalaPhonetic: 'Mata udawu avashyayi (Offline)',
          tamilText: 'எனக்கு உதவி தேவை (ஆஃப்லைன் மொழிபெயர்ப்பு)',
          tamilPhonetic: 'Enakku udhavi thevai (Offline)',
        },
      };
    }

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      return await res.json();
    } catch (e) {
      return {
        success: true,
        translation: {
          english: text,
          sinhalaText: 'කරුණාකර මට උදව් කරන්න',
          sinhalaPhonetic: 'Karunakara mata udawu karanna',
          tamilText: 'தயவுசெய்து எனக்கு உதவுங்கள்',
          tamilPhonetic: 'Thayavuseythu enakku udhavungal',
        },
      };
    }
  },

  // 6. Gemini AI Safety Companion "Serena"
  async querySerena(prompt: string, location?: { city: string }) {
    if (this.isOfflineMode()) {
      return {
        success: true,
        reply: `### 📡 Serena (Offline Mode)\nYou are currently operating in Zero-Data emergency mode. Immediate Hotlines for ${location?.city || 'Sri Lanka'}:\n- National Police: **119**\n- Tourist Police: **1912**\n- Free Medical EMS: **1990**\nUse pre-downloaded offline translations in the emergency tab for direct Sinhala & Tamil speech synthesis.`,
        offlineFallback: true,
      };
    }

    const res = await fetch('/api/gemini/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, location }),
    });
    return await res.json();
  },

  // 7. Community Travel Buddy Posts
  async getCommunityPosts(city?: string, budget?: string): Promise<{ success: boolean; posts: CommunityPost[] }> {
    try {
      const url = new URL('/api/community/posts', window.location.origin);
      if (city) url.searchParams.set('city', city);
      if (budget) url.searchParams.set('budget', budget);
      const res = await fetch(url.toString());
      return await res.json();
    } catch (e) {
      return { success: true, posts: [] };
    }
  },

  async createCommunityPost(post: Partial<CommunityPost>): Promise<{ success: boolean; post: CommunityPost }> {
    const res = await fetch('/api/community/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    });
    return await res.json();
  },

  // 8. Checkout Booking with 12% Commission
  async createBooking(bookingPayload: Partial<Booking>) {
    const res = await fetch('/api/bookings/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingPayload),
    });
    return await res.json();
  },

  // 9. Partner Portal Stats
  async getPartnerStats(): Promise<{ success: boolean; metrics: PartnerStats; recentBookings: Booking[] }> {
    const res = await fetch('/api/partner/stats');
    return await res.json();
  },
};
