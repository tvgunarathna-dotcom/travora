export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  notifySms: boolean;
  notifyPush: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  nationality: string;
  isVerified: boolean;
  verificationProvider?: 'AU10TIX' | 'Persona' | 'Didit' | 'Stripe Identity';
  verificationDate?: string;
  idType?: 'Passport' | 'National ID' | 'Drivers License';
  pinkShieldBadgeHash?: string;
  subscriptionStatus: 'free' | 'premium_monthly';
  emergencyContacts: EmergencyContact[];
  safetyPin: string; // e.g. "1234", duress pin "9999"
  duressPin: string;
  bio: string;
  currentCity: string;
  travelStyle: string[];
  themePreference: 'dark' | 'light';
  savedStaysCount: number;
}

export interface SafetyZone {
  zoneId: string;
  zoneName: string;
  city: string;
  safetyScore: number; // 0 - 100
  level: 'safe' | 'caution' | 'alert';
  streetLightingIndex: number; // 0 - 10
  crimeRiskIndex: number; // 0 - 10
  activeSoloTravelers: number;
  userReportsCount: number;
  recommendedCurfew: string;
  notes: string;
  polygon: { lat: number; lng: number }[];
  center: { lat: number; lng: number };
}

export interface MapPOI {
  poiId: string;
  name: string;
  category: 'police' | 'tourist_police' | 'hospital' | 'safe_cafe' | 'pharmacy' | 'restroom';
  city: string;
  address: string;
  coordinates: { lat: number; lng: number };
  open24Hours: boolean;
  operatingHours?: string;
  rating: number;
  reviewsCount: number;
  isVerifiedLocalBusiness?: boolean;
  phone?: string;
  image?: string;
  safetyFeatures: string[];
  stockedProducts?: string[];
}

export interface AreaArticle {
  id: string;
  title: string;
  subtitle: string;
  destinationCity: string;
  category: string;
  heroImage: string;
  rating: number;
  reviewsCount: number;
  readTime: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  duration: string;
  bestTimeOfDay: string;
  entryFee: string;
  soloFemaleSafetyRating: string;
  overview: string;
  keySafetyTips: string[];
  highlights: string[];
  photos: string[];
  travelerReviews: {
    author: string;
    avatar: string;
    country: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

export interface EmergencyHotlineData {
  country: string;
  police: string;
  touristPolice: string;
  ambulance: string;
  womenHelpline: string;
  consularNote: string;
}

export interface TravelBuddy {
  id: string;
  name: string;
  age: number;
  nationality: string;
  avatar: string;
  isVerified: boolean;
  verificationBadgeType: 'AU10TIX Verified' | 'Gov ID + 3D Liveness' | 'Pink Shield Elite';
  tripsCompleted: number;
  currentCity: string;
  datesInCity: string;
  languages: string[];
  interests: string[];
  bio: string;
  lookingFor: string;
  safeMeetupLocation: string;
  verifiedSince: string;
}

export interface CommunityPost {
  postId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  isVerified: boolean;
  destinationCity: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  budgetTier: '$' | '$$' | '$$$';
  transportMode: 'HelaGo Cab' | 'Train' | 'Tuk-Tuk' | 'Shared Van' | 'Walking';
  activityTitle: string;
  activityDetails: string;
  tags: string[];
  responsesCount: number;
  createdAt: string;
}

export interface SafeStay {
  stayId: string;
  name: string;
  type: 'Boutique Villa' | 'Female-Only Dorm' | 'Eco Surf Lodge' | 'Heritage Guesthouse' | 'City Hotel';
  city: string;
  location: string;
  coordinates: { lat: number; lng: number };
  pricePerNightLKR: number;
  priceUSD: number;
  rating: number;
  reviewsCount: number;
  stars: number;
  isPinkShieldVerified: boolean;
  safetyAmenities: string[];
  generalAmenities: string[];
  unlitAreaWarning?: string;
  dealTag?: string;
  images: string[];
  safetyIndexes: {
    securityStaff: number; // 0-10
    femaleOnlyFloors: boolean;
    smartKeycards: boolean;
    cctvMonitoring: boolean;
    streetLighting: number; // 0-10
  };
  reviews: { author: string; avatar: string; rating: number; comment: string; date: string }[];
  kokoMonthlyLKR: number;
  mintpayMonthlyLKR: number;
}

export interface TravelGuide {
  guideId: string;
  name: string;
  avatar: string;
  city: string;
  locationsServed: string[];
  languages: string[];
  rating: number;
  reviewsCount: number;
  hourlyRateLKR: number;
  dailyRateLKR: number;
  dailyRateUSD: number;
  isPinkShieldCertified: boolean;
  licenseNumber: string;
  bio: string;
  specialties: string[];
}

export interface HelaGoDriver {
  driverId: string;
  name: string;
  rating: number;
  vehicleType: string;
  vehicleModel: string;
  licensePlate: string;
  etaMinutes: number;
  pinkShieldCertified: boolean;
  totalRides: number;
  fareEstimate: number;
  currency: string;
  driverImage: string;
}

export interface Booking {
  bookingId: string;
  userId: string;
  userName: string;
  partnerId: string;
  partnerName: string;
  serviceType: 'hostel' | 'tour' | 'transport' | 'guide';
  roomOrSeat: string;
  checkInDate: string;
  totalAmount: number;
  currency: string;
  commissionRate: number; // 0.12 (12%)
  commissionEarned: number;
  partnerPayout: number;
  paymentMethod: 'card' | 'koko_bnpl' | 'mintpay_bnpl';
  status: 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  bnplSchedule?: {
    installment: number;
    amount: number;
    dueDate: string;
    status: 'paid' | 'pending';
  }[] | null;
}

export interface TripTimerState {
  isActive: boolean;
  destinationName: string;
  transportMode: 'tuk_tuk' | 'taxi' | 'walk' | 'train';
  totalSeconds: number;
  remainingSeconds: number;
  startTime: string;
  status: 'idle' | 'running' | 'warning' | 'completed' | 'sos_dispatched';
}

export interface DualTranslation {
  english: string;
  sinhalaText: string;
  sinhalaPhonetic: string;
  tamilText: string;
  tamilPhonetic: string;
  category?: 'medical' | 'danger' | 'directions' | 'general' | 'transport' | 'washroom';
}

export interface FakeCallPersona {
  id: string;
  label: string;
  callerName: string;
  callerNumber: string;
  relationship: string;
  voicePitch: number;
  voiceRate: number;
  totalDurationSeconds: number;
  dialogueScript: {
    timeOffsetSeconds: number; // When this turn occurs (e.g. 0s, 12s, 24s, 38s, 50s)
    speaker: string;
    text: string;
    spokenText: string;
  }[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
  isLocationShare?: boolean;
  coords?: { lat: number; lng: number };
}

export interface PartnerStats {
  totalBookingsCount: number;
  totalVolumeLKR: number;
  commissionPaidToTravoraLKR: number;
  netPartnerEarningsLKR: number;
  averageReviewScore: number;
  femaleDriverUtilization: string;
}
