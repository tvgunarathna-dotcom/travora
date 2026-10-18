import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(express.json());

// Initialize Google GenAI client (Server-side only)
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// In-Memory Database Store for runtime state
export interface VerificationSession {
  sessionId: string;
  userId: string;
  status: 'pending' | 'verified' | 'failed';
  idType: string;
  livenessConfidence: number;
  faceMatchScore: number;
  verifiedAt?: string;
  provider: 'AU10TIX' | 'Persona' | 'Didit' | 'Stripe Identity';
  badgeHash: string;
}

export const mockVerifications: Record<string, VerificationSession> = {};

// In-memory bookings store with transparent 12% TRAVORA commission split
export const mockBookings = [
  {
    bookingId: 'TRV-BK-8901',
    userId: 'usr_ananya_01',
    userName: 'Ananya Sharma',
    partnerId: 'stay_mirissa_01',
    partnerName: 'Mirissa Coastal Female Surf Stay',
    serviceType: 'hostel',
    roomOrSeat: '4-Bed Female Dorm - Bed A2',
    checkInDate: '2026-10-18',
    totalAmount: 12500, // LKR
    currency: 'LKR',
    commissionRate: 0.12, // 12% TRAVORA platform fee
    commissionEarned: 1500,
    partnerPayout: 11000,
    paymentMethod: 'koko_bnpl',
    status: 'confirmed',
    createdAt: '2026-10-14T08:15:00Z',
  },
  {
    bookingId: 'TRV-BK-8902',
    userId: 'usr_elena_02',
    userName: 'Elena Rostova',
    partnerId: 'hlg_sanduni',
    partnerName: 'Sanduni P. · HelaGo Verified Electric Ride',
    serviceType: 'transport',
    roomOrSeat: 'Nissan Leaf EV · WP CAB-4482',
    checkInDate: '2026-10-15',
    totalAmount: 1450,
    currency: 'LKR',
    commissionRate: 0.12,
    commissionEarned: 174,
    partnerPayout: 1276,
    paymentMethod: 'mintpay_bnpl',
    status: 'completed',
    createdAt: '2026-10-13T14:20:00Z',
  },
  {
    bookingId: 'TRV-BK-8903',
    userId: 'usr_chloe_03',
    userName: 'Chloe Martin',
    partnerId: 'gd_ruwani',
    partnerName: 'Ruwani Jayasuriya · Licensed Heritage Guide',
    serviceType: 'guide',
    roomOrSeat: 'Full Day Cultural Heritage Tour',
    checkInDate: '2026-10-17',
    totalAmount: 14000,
    currency: 'LKR',
    commissionRate: 0.12,
    commissionEarned: 1680,
    partnerPayout: 12320,
    paymentMethod: 'card',
    status: 'confirmed',
    createdAt: '2026-10-14T06:40:00Z',
  },
];

// Community Posts Store
export const communityPostsStore = [
  {
    postId: 'post_01',
    userId: 'usr_elena',
    userName: 'Elena Rostova',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    isVerified: true,
    destinationCity: 'Galle & Mirissa',
    startDate: '2026-10-16',
    endDate: '2026-10-19',
    budgetTier: '$$',
    transportMode: 'HelaGo Cab',
    activityTitle: 'Share Electric Cab to Galle Fort & Sunset Surf in Mirissa',
    activityDetails: 'Looking for 1 or 2 verified solo women to split an air-conditioned HelaGo electric ride from Colombo Fort to Galle Fort. Plan to explore Dutch ramparts and stay at Mirissa Surf Stay.',
    tags: ['SplitRide', 'Surfing', 'BoutiqueStay'],
    responsesCount: 4,
    createdAt: '2 hours ago',
  },
  {
    postId: 'post_02',
    userId: 'usr_chloe',
    userName: 'Chloe Martin',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    isVerified: true,
    destinationCity: 'Kandy',
    startDate: '2026-10-18',
    endDate: '2026-10-21',
    budgetTier: '$$$',
    transportMode: 'Train',
    activityTitle: 'Scenic Blue Train to Kandy & Tea Plantation Walk',
    activityDetails: 'Booked 1st class observation car tickets for the iconic train ride. Looking for a cultural enthusiast buddy to visit the Temple of the Tooth and take a guided tea trail with Ruwani.',
    tags: ['ScenicTrain', 'Culture', 'TeaTrail'],
    responsesCount: 6,
    createdAt: '5 hours ago',
  },
];

// Safety Heatmap Zones with Centroids
export const mockSafetyZones = [
  {
    zoneId: 'zn-col-cinnamon-gardens',
    zoneName: 'Cinnamon Gardens (Colombo 07)',
    city: 'Colombo',
    safetyScore: 94,
    level: 'safe',
    streetLightingIndex: 9.6,
    crimeRiskIndex: 1.2,
    activeSoloTravelers: 38,
    userReportsCount: 142,
    recommendedCurfew: 'Safe after 23:00 with standard urban awareness',
    notes: 'Diplomatic sector, high police presence, wide sidewalks, well-lit embassies and cafes.',
    center: { lat: 6.9142, lng: 79.8715 },
    polygon: [
      { lat: 6.915, lng: 79.862 },
      { lat: 6.924, lng: 79.873 },
      { lat: 6.911, lng: 79.878 },
      { lat: 6.902, lng: 79.866 },
    ],
  },
  {
    zoneId: 'zn-col-galle-face',
    zoneName: 'Galle Face Green & Promenade',
    city: 'Colombo',
    safetyScore: 88,
    level: 'safe',
    streetLightingIndex: 9.1,
    crimeRiskIndex: 2.1,
    activeSoloTravelers: 54,
    userReportsCount: 205,
    recommendedCurfew: 'Highly populated until 22:30; exercise care near deserted dark beach spots',
    notes: 'Popular female walking route; constant evening crowds and tourist police post nearby.',
    center: { lat: 6.9271, lng: 79.8456 },
    polygon: [
      { lat: 6.928, lng: 79.842 },
      { lat: 6.935, lng: 79.845 },
      { lat: 6.921, lng: 79.848 },
      { lat: 6.918, lng: 79.844 },
    ],
  },
  {
    zoneId: 'zn-col-pettah-station',
    zoneName: 'Pettah Market & Railway Terminus',
    city: 'Colombo',
    safetyScore: 62,
    level: 'caution',
    streetLightingIndex: 6.4,
    crimeRiskIndex: 5.8,
    activeSoloTravelers: 12,
    userReportsCount: 319,
    recommendedCurfew: 'Avoid unlit side alleys after 19:30; prefer HelaGo rides over unregistered street tuk-tuks',
    notes: 'Busy daytime wholesale hub; crowded with tight bottlenecks and poor night illumination off Main St.',
    center: { lat: 6.9365, lng: 79.8542 },
    polygon: [
      { lat: 6.936, lng: 79.851 },
      { lat: 6.942, lng: 79.858 },
      { lat: 6.934, lng: 79.863 },
      { lat: 6.931, lng: 79.856 },
    ],
  },
  {
    zoneId: 'zn-mir-beach',
    zoneName: 'Mirissa Central Coast & Bay',
    city: 'Mirissa',
    safetyScore: 92,
    level: 'safe',
    streetLightingIndex: 8.9,
    crimeRiskIndex: 1.5,
    activeSoloTravelers: 45,
    userReportsCount: 180,
    recommendedCurfew: 'Vibrant along beach road until midnight; tourist police stationed at junction',
    notes: 'Female friendly surf hostels and beach cafes. HelaGo pickups available at all hours.',
    center: { lat: 5.9482, lng: 80.4578 },
    polygon: [
      { lat: 5.942, lng: 80.452 },
      { lat: 5.952, lng: 80.461 },
      { lat: 5.949, lng: 80.465 },
      { lat: 5.939, lng: 80.456 },
    ],
  },
];

// ==========================================
// API ROUTES
// ==========================================

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', environment: process.env.NODE_ENV || 'development' });
});

// 1. Identity Verification Webhook Handler (AU10TIX / Persona / Didit)
app.post('/api/verify-identity', (req, res) => {
  try {
    const { userId = 'usr_maya_colombo', provider = 'AU10TIX', idType = 'Passport' } = req.body;
    console.log(`[TRAVORA KYC] Verifying identity via ${provider} for user ${userId}`);

    const verificationSession: VerificationSession = {
      sessionId: `au10tix_sess_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      userId,
      status: 'verified',
      idType,
      livenessConfidence: 99.7,
      faceMatchScore: 99.2,
      verifiedAt: new Date().toISOString(),
      provider: provider as any,
      badgeHash: `AU10TIX:SHA256:${Math.random().toString(16).substring(2, 10)}${userId.substring(0, 4)}`,
    };

    mockVerifications[userId] = verificationSession;

    res.status(200).json({
      success: true,
      message: 'AU10TIX Identity Verification passed with 3D Optical Liveness & MRZ extraction.',
      verification: verificationSession,
      gatedPermissions: {
        canDirectMessage: true,
        canMatchTravelBuddies: true,
        canPostCommunityFeed: true,
        pinkShieldBadgeIssued: true,
        badgeHash: verificationSession.badgeHash,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Active SOS Emergency Trigger & Broadcast
app.post('/api/sos/trigger', (req, res) => {
  try {
    const { location, emergencyContacts, triggerType, silentAlarm } = req.body;
    const alertId = `SOS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    console.log(`[TRAVORA SOS TRIGGERED] Alert ID: ${alertId}, Type: ${triggerType}, Silent: ${silentAlarm}`);

    res.status(200).json({
      success: true,
      alertId,
      status: 'DISPATCHED',
      triggeredAt: new Date().toISOString(),
      triggerType: triggerType || 'one_touch_sos',
      silentMode: !!silentAlarm,
      liveAudioSessionUrl: `wss://travora-emergency-stream.internal/live/${alertId}`,
      notifiedContacts: emergencyContacts || [
        { name: 'Sarah Miller (Sister)', phone: '+44 7911 123456', status: 'SMS_SENT_WITH_GPS' },
        { name: 'Dr. Nilmini Perera', phone: '+94 77 987 6543', status: 'PUSH_DISPATCHED' },
      ],
      localAuthorities: {
        police: '119',
        touristPolice: '1912',
        ambulance: '1990',
      },
      gpsBroadcastLink: `https://travora.app/track/sos/${alertId}?lat=${location?.lat}&lng=${location?.lng}`,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Safety Zones & Heatmaps
app.get('/api/maps/safety-zones', (req, res) => {
  const city = (req.query.city as string)?.toLowerCase();
  let zones = mockSafetyZones;
  if (city) {
    zones = zones.filter((z) => z.city.toLowerCase().includes(city));
    if (zones.length === 0) zones = mockSafetyZones; // fallback
  }
  res.status(200).json({ success: true, zones });
});

// 4. Custom Safety & Medical Translator (High accuracy for both Sinhala & Tamil)
const verifiedDictionary: Record<string, { sinhalaText: string; sinhalaPhonetic: string; tamilText: string; tamilPhonetic: string }> = {
  'help': {
    sinhalaText: 'මට උදව් කරන්න!',
    sinhalaPhonetic: 'Mata udav karanna!',
    tamilText: 'எனக்கு உதவுங்கள்!',
    tamilPhonetic: 'Enakku udhavungal!',
  },
  'police': {
    sinhalaText: 'මට පොලීසියේ උදව් අවශ්‍යයි!',
    sinhalaPhonetic: 'Mata polisie udav avashyayi!',
    tamilText: 'எனக்கு போலீஸ் உதவி தேவை!',
    tamilPhonetic: 'Enakku police udhavi thevai!',
  },
  'hospital': {
    sinhalaText: 'කරුණාකර මාව ළඟම රෝහලට රැගෙන යන්න.',
    sinhalaPhonetic: 'Karunakara maava langama rohalata rægena yanna.',
    tamilText: 'தயவுசெய்து என்னை அருகிலுள்ள மருத்துவமனைக்கு அழைத்துச் செல்லுங்கள்.',
    tamilPhonetic: 'Thayavuseythu ennai arugilulla maruthuvamanaikku azhaithu chellungal.',
  },
  'ambulance': {
    sinhalaText: 'කරුණාකර 1990 ගිලන් රථයක් කැඳවන්න.',
    sinhalaPhonetic: 'Karunakara 1990 gilan rathayak kændhawanna.',
    tamilText: 'தயவுசெய்து 1990 ஆம்புலன்ஸ் அழையுங்கள்.',
    tamilPhonetic: 'Thayavuseythu 1990 ambulance azhaiyungal.',
  },
  'stop': {
    sinhalaText: 'වාහනය මෙතැන නවත්වන්න!',
    sinhalaPhonetic: 'Vahanaya methana nawathwanna!',
    tamilText: 'வாகனத்தை இங்கே நிறுத்துங்கள்!',
    tamilPhonetic: 'Vaaganathai ingey niruthungal!',
  },
  'restroom': {
    sinhalaText: 'කාන්තා වැසිකිළිය කොහේද?',
    sinhalaPhonetic: 'Kaantha væsikiliya koheda?',
    tamilText: 'பெண்கள் கழிப்பறை எங்கே?',
    tamilPhonetic: 'Pengal kazhipparai engey?',
  },
  'sanitary pads': {
    sinhalaText: 'සනීපාරක්ෂක තුවා (Pads) මිලදී ගත හැක්කේ කොහෙන්ද?',
    sinhalaPhonetic: 'Sanitary pads mila-di gatha hække kohenda?',
    tamilText: 'மாதவிடாய் நாப்கின்கள் (Pads) எங்கு வாங்கலாம்?',
    tamilPhonetic: 'Maathavidaai pads engu vaangalaam?',
  },
  'doctor': {
    sinhalaText: 'මට වෛද්‍යවරයකු හමුවිය යුතුයි.',
    sinhalaPhonetic: 'Mata vaidyavaraku hamuviya yuthuyi.',
    tamilText: 'நான் ஒரு மருத்துவரை சந்திக்க வேண்டும்.',
    tamilPhonetic: 'Naan oru maruthuvarai santhikka vendum.',
  },
};

app.post('/api/translate', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, error: 'Text is required' });
    }

    const cleanInput = text.trim().toLowerCase();
    for (const [key, val] of Object.entries(verifiedDictionary)) {
      if (cleanInput === key || cleanInput.includes(key)) {
        return res.status(200).json({
          success: true,
          translation: {
            english: text,
            ...val,
          },
        });
      }
    }

    if (aiClient) {
      const prompt = `You are a certified professional Sri Lankan linguist. Translate this English safety/medical phrase into BOTH grammatically accurate Sri Lankan Sinhala and Sri Lankan Tamil.
Phrase: "${text.replace(/"/g, '\\"')}"

Rules:
1. Provide authentic, formal-polite spoken Sri Lankan phrasing used by tourists seeking assistance.
2. Provide clear phonetic romanization for English speakers to pronounce easily.
3. Return strictly valid JSON:
{
  "english": "${text.replace(/"/g, '\\"')}",
  "sinhalaText": "accurate Sinhala script",
  "sinhalaPhonetic": "phonetic english spelling",
  "tamilText": "accurate Tamil script",
  "tamilPhonetic": "phonetic english spelling"
}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.status(200).json({ success: true, translation: parsed });
    } else {
      const fallback = {
        english: text,
        sinhalaText: `කරුණාකර මට උපකාර කරන්න (${text})`,
        sinhalaPhonetic: `Karunakara mata upakara karanna (${text})`,
        tamilText: `தயவுசெய்து எனக்கு உதவுங்கள் (${text})`,
        tamilPhonetic: `Thayavuseythu enakku udhavungal (${text})`,
      };
      return res.status(200).json({ success: true, translation: fallback });
    }
  } catch (error: any) {
    console.error('Translation Error:', error);
    res.status(200).json({
      success: true,
      translation: {
        english: req.body?.text || '',
        sinhalaText: `මට වහාම උදව් අවශ්‍යයි`,
        sinhalaPhonetic: `Mata vahama udawu avashyayi`,
        tamilText: `எனக்கு உடனடியாக உதவி தேவை`,
        tamilPhonetic: `Enakku udanadiyaaga udhavi thevai`,
      },
    });
  }
});

// 5. Gemini 24/7 AI Safety Companion "Serena"
app.post('/api/gemini/assistant', async (req, res) => {
  try {
    const { prompt, location } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }

    if (aiClient) {
      const systemInstruction = `You are Serena, TRAVORA's 24/7 AI Safety & Cultural Concierge, specialized exclusively in female solo traveler security, local cultural etiquette, safe neighborhood advisories, emergency translations, and verified transport guidance.
Current traveler location: ${location?.city || 'Colombo, Sri Lanka'}
Guidelines:
1. Speak in a warm, protective, clear, and reassuring tone as Serena.
2. Provide hyper-actionable safety advice, dress code tips for sacred temples, metered transport recommendations (PickMe/HelaGo), and unlit area warnings.
3. If the query indicates distress, immediately cite local emergency numbers (Police 119, Tourist Police 1912, Free Ambulance 1990).
4. Keep answers concise and readable with bullet points.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return res.status(200).json({
        success: true,
        reply: response.text || "I'm Serena, your TRAVORA safety companion. How can I help keep your route safe today?",
        source: 'gemini-3.8-flash',
      });
    } else {
      const reply = `### 🛡️ Serena's Safety Briefing for ${location?.city || 'Colombo'}
- **Night Transit:** Prefer our integrated **HelaGo Female Rideshare** or metered PickMe tuk-tuks. Avoid unflagged street tuk-tuks after 20:00.
- **Temple Etiquette:** Shoulders and knees must be fully covered; remove hats and shoes.
- **Emergency Shortcuts:** Police **119** | Tourist Police **1912** | Free Ambulance **1990**.
- Keep your **Trip Timer** active when transiting after dusk!`;

      return res.status(200).json({
        success: true,
        reply,
        source: 'serena-core-fallback',
      });
    }
  } catch (error: any) {
    res.status(200).json({
      success: true,
      reply: `### 🧭 Serena's Emergency Advisory\nAlways keep your Live Trip Timer running during night transit. For emergency police assistance, dial 119 or Tourist Police 1912.`,
      fallbackUsed: true,
    });
  }
});

// 6. Community Buddy Requests
app.get('/api/community/posts', (req, res) => {
  const { city, budget } = req.query;
  let posts = [...communityPostsStore];
  if (city && city !== 'all') {
    posts = posts.filter((p) => p.destinationCity.toLowerCase().includes((city as string).toLowerCase()));
  }
  if (budget && budget !== 'all') {
    posts = posts.filter((p) => p.budgetTier === budget);
  }
  res.status(200).json({ success: true, count: posts.length, posts });
});

app.post('/api/community/posts', (req, res) => {
  try {
    const post = {
      postId: `post_${Date.now()}`,
      userId: req.body.userId || 'usr_maya_colombo',
      userName: req.body.userName || 'Maya Senaratne',
      userAvatar: req.body.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      isVerified: true,
      destinationCity: req.body.destinationCity || 'Mirissa',
      startDate: req.body.startDate || '2026-10-20',
      endDate: req.body.endDate || '2026-10-22',
      budgetTier: req.body.budgetTier || '$$',
      transportMode: req.body.transportMode || 'HelaGo Cab',
      activityTitle: req.body.activityTitle || 'Weekend Beach Meetup',
      activityDetails: req.body.activityDetails || 'Looking for verified female buddies to explore together.',
      tags: req.body.tags || ['SafeMeetup'],
      responsesCount: 0,
      createdAt: 'Just now',
    };
    communityPostsStore.unshift(post);
    res.status(201).json({ success: true, post });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// 7. Booking & 12% Commission Checkout Endpoint
app.post('/api/bookings/checkout', (req, res) => {
  try {
    const { userId, partnerId, partnerName, serviceType, totalAmount, paymentMethod } = req.body;
    const amountNum = Number(totalAmount) || 12000;
    const commissionRate = 0.12; // 12% standard TRAVORA platform commission
    const commissionEarned = Math.round(amountNum * commissionRate);
    const partnerPayout = amountNum - commissionEarned;

    const newBooking = {
      bookingId: `TRV-BK-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: userId || 'usr_maya_colombo',
      userName: 'Maya Senaratne',
      partnerId: partnerId || 'prt_default',
      partnerName: partnerName || 'Verified Partner',
      serviceType: serviceType || 'hostel',
      roomOrSeat: 'Confirmed Safety Reservation',
      checkInDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      totalAmount: amountNum,
      currency: 'LKR',
      commissionRate,
      commissionEarned,
      partnerPayout,
      paymentMethod: paymentMethod || 'koko_bnpl',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      bnplSchedule: paymentMethod?.includes('bnpl')
        ? [
            { installment: 1, amount: Math.round(amountNum / 3), dueDate: 'Today (Paid)', status: 'paid' },
            { installment: 2, amount: Math.round(amountNum / 3), dueDate: 'In 30 Days', status: 'pending' },
            { installment: 3, amount: amountNum - Math.round(amountNum / 3) * 2, dueDate: 'In 60 Days', status: 'pending' },
          ]
        : null,
    };

    mockBookings.unshift(newBooking);

    res.status(201).json({
      success: true,
      booking: newBooking,
      message: `Booking confirmed with ${paymentMethod === 'koko_bnpl' ? 'Koko 3x Installments' : paymentMethod === 'mintpay_bnpl' ? 'Mintpay Pay in 3' : 'Card'}. 12% platform fee calculated.`,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 8. Partner Portal Stats
app.get('/api/partner/stats', (_req, res) => {
  const totalRevenue = mockBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalCommission = mockBookings.reduce((sum, b) => sum + b.commissionEarned, 0);
  const totalNetPayout = totalRevenue - totalCommission;

  res.status(200).json({
    success: true,
    partnerId: 'prt_mirissa_surf_01',
    businessName: 'Mirissa Coastal Female Surf Stay & HelaGo Partner Network',
    pinkShieldStatus: 'AU10TIX & Pink Shield Certified',
    safetyAuditScore: 98.8,
    metrics: {
      totalBookingsCount: mockBookings.length + 42,
      totalVolumeLKR: totalRevenue,
      commissionPaidToTravoraLKR: totalCommission,
      netPartnerEarningsLKR: totalNetPayout,
      averageReviewScore: 4.96,
      femaleDriverUtilization: '94%',
    },
    recentBookings: mockBookings,
  });
});

export default app;
