import React, { useState } from 'react';
import {
  Database,
  Code2,
  Server,
  Layers,
  Copy,
  Check,
  ShieldCheck,
  GitBranch,
} from 'lucide-react';

export const ArchitectureModal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'schemas' | 'endpoints' | 'architecture' | 'webhooks'>('schemas');
  const [schemaFormat, setSchemaFormat] = useState<'postgresql' | 'firestore' | 'mongodb'>('postgresql');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const postgresqlDdl = `-- ==========================================
-- TRAVORA PRODUCTION POSTGRESQL RELATIONAL SCHEMA
-- ==========================================

-- 1. USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(30),
    is_verified BOOLEAN DEFAULT FALSE,
    verification_provider VARCHAR(50) DEFAULT 'Persona', -- 'Persona' | 'Didit' | 'Stripe'
    verification_badge_hash VARCHAR(128),
    id_type VARCHAR(50),
    subscription_status VARCHAR(30) DEFAULT 'free', -- 'free' | 'premium_monthly'
    safety_pin_hash VARCHAR(128) NOT NULL,
    duress_pin_hash VARCHAR(128) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. EMERGENCY CONTACTS TABLE
CREATE TABLE emergency_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    contact_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(30) NOT NULL,
    relationship VARCHAR(50),
    notify_sms BOOLEAN DEFAULT TRUE,
    notify_push BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. SAFETY HEATMAP ZONES TABLE (PostGIS GeoJSON support)
CREATE TABLE safety_heatmap_zones (
    zone_id VARCHAR(64) PRIMARY KEY,
    zone_name VARCHAR(120) NOT NULL,
    city VARCHAR(80) NOT NULL,
    safety_score INT CHECK (safety_score BETWEEN 0 AND 100),
    street_lighting_index DECIMAL(3, 1), -- 0.0 to 10.0
    crime_risk_index DECIMAL(3, 1),
    active_solo_travelers INT DEFAULT 0,
    user_reports_count INT DEFAULT 0,
    recommended_curfew TEXT,
    polygon_boundary JSONB NOT NULL, -- GeoJSON Polygon coordinates
    last_indexed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. HYGIENE & SANITARY POIS TABLE
CREATE TABLE hygiene_pois (
    poi_id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(40) CHECK (category IN ('pharmacy', 'restroom', 'hygiene_store', 'emergency_clinic')),
    city VARCHAR(80) NOT NULL,
    address TEXT NOT NULL,
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    open_24_hours BOOLEAN DEFAULT FALSE,
    operating_hours VARCHAR(60),
    stocked_products TEXT[], -- ['organic_pads', 'tampons', 'menstrual_cups', 'contraceptives']
    clean_restroom_rating DECIMAL(2, 1) DEFAULT 5.0,
    is_pink_shield_partner BOOLEAN DEFAULT FALSE,
    phone_number VARCHAR(40)
);

-- 5. EMERGENCY HOTLINES DIRECTORY TABLE
CREATE TABLE emergency_hotlines (
    country_code VARCHAR(3) PRIMARY KEY, -- ISO 3166-1 alpha-2 e.g. 'LK', 'TH'
    country_name VARCHAR(80) NOT NULL,
    police VARCHAR(20) NOT NULL,
    tourist_police VARCHAR(20) NOT NULL,
    ambulance VARCHAR(40) NOT NULL,
    women_helpline VARCHAR(40),
    consular_notes TEXT
);

-- 6. PARTNER ACCOUNTS & COMMISSION SPLITS
CREATE TABLE partner_accounts (
    partner_id VARCHAR(64) PRIMARY KEY,
    business_name VARCHAR(150) NOT NULL,
    business_type VARCHAR(40) CHECK (business_type IN ('hostel', 'tour', 'transport_fleet')),
    contact_email VARCHAR(255) NOT NULL,
    is_pink_shield_certified BOOLEAN DEFAULT TRUE,
    commission_rate DECIMAL(4, 2) DEFAULT 0.12, -- 10% to 15%
    payout_bank_account JSONB
);

-- 7. BOOKINGS & BNPL TRANSACTION SPLITS
CREATE TABLE bookings (
    booking_id VARCHAR(64) PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    partner_id VARCHAR(64) REFERENCES partner_accounts(partner_id),
    service_type VARCHAR(40) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(5) DEFAULT 'LKR',
    commission_earned DECIMAL(10, 2) NOT NULL, -- 10-15% platform split
    partner_payout DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(40) CHECK (payment_method IN ('card', 'koko_bnpl', 'mintpay_bnpl')),
    booking_status VARCHAR(30) DEFAULT 'confirmed',
    bnpl_schedule JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. EMERGENCY SOS ALERTS DISPATCH AUDIT LOG
CREATE TABLE emergency_sos_alerts (
    alert_id VARCHAR(64) PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    trigger_type VARCHAR(40) CHECK (trigger_type IN ('one_touch_sos', 'trip_timer_missed', 'duress_pin')),
    is_silent_alarm BOOLEAN DEFAULT FALSE,
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    accuracy_meters INT,
    live_audio_session_url TEXT,
    notified_contacts JSONB,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`;

  const firestoreSchema = `// ==========================================
// TRAVORA CLOUD FIRESTORE COLLECTIONS & DOCUMENT MODELS
// ==========================================

// Collection: /users/{userId}
interface UserDocument {
  id: string; // Document ID (UID)
  fullName: string;
  email: string;
  phoneNumber: string;
  isVerified: boolean; // Gated access gatekeeper flag
  verificationDetails: {
    provider: 'Persona' | 'Didit' | 'Stripe Identity';
    verifiedAt: FirebaseFirestore.Timestamp;
    livenessScore: number; // e.g. 99.4
    faceMatchScore: number; // e.g. 98.7
    badgeHash: string; // Cryptographic SHA256 audit proof
  };
  subscriptionStatus: 'free' | 'premium_monthly';
  safetySettings: {
    safetyPinHash: string; // bcrypt hash of 4-digit safe arrival PIN
    duressPinHash: string; // bcrypt hash of duress silent alarm PIN
  };
  emergencyContacts: Array<{
    contactId: string;
    name: string;
    phone: string;
    relationship: string;
    notifySms: boolean;
    notifyPush: boolean;
  }>;
  createdAt: FirebaseFirestore.Timestamp;
}

// Collection: /safetyHeatmaps/{zoneId}
interface SafetyHeatmapDocument {
  zoneId: string;
  zoneName: string;
  city: string;
  safetyScore: number; // 0 - 100
  level: 'safe' | 'caution' | 'alert';
  streetLightingIndex: number;
  crimeRiskIndex: number;
  activeSoloTravelers: number;
  userReportsCount: number;
  recommendedCurfew: string;
  polygonBoundary: Array<{ lat: number; lng: number }>;
  lastUpdated: FirebaseFirestore.Timestamp;
}

// Collection: /hygienePOIs/{poiId}
interface HygienePOIDocument {
  poiId: string;
  name: string;
  category: 'pharmacy' | 'restroom' | 'hygiene' | 'emergency_clinic';
  city: string;
  address: string;
  geopoint: FirebaseFirestore.GeoPoint;
  open24Hours: boolean;
  operatingHours?: string;
  stockedProducts: string[];
  cleanRestroomRating: number;
  isPinkShieldPartner: boolean;
  phone?: string;
}

// Collection: /emergencyHotlines/{countryCode}
interface EmergencyHotlineDocument {
  countryCode: string; // 'LK', 'TH', 'VN', 'ID', 'IN'
  countryName: string;
  police: string;
  touristPolice: string;
  ambulance: string;
  womenHelpline: string;
  consularNotes: string;
}

// Collection: /bookings/{bookingId}
interface BookingDocument {
  bookingId: string;
  userId: string;
  partnerId: string;
  partnerName: string;
  serviceType: 'hostel' | 'tour' | 'transport';
  totalAmount: number;
  currency: 'LKR' | 'USD';
  commissionRate: number; // 0.10 to 0.15
  commissionEarned: number;
  partnerPayout: number;
  paymentMethod: 'card' | 'koko_bnpl' | 'mintpay_bnpl';
  status: 'confirmed' | 'completed' | 'cancelled';
  bnplSchedule?: Array<{
    installment: number;
    amount: number;
    dueDate: string;
    status: 'paid' | 'pending';
  }>;
  createdAt: FirebaseFirestore.Timestamp;
}`;

  const mongodbMongoose = `// ==========================================
// TRAVORA MONGOOSE ODM DATA MODELS
// ==========================================
import mongoose, { Schema, Document } from 'mongoose';

// 1. User Schema with Gated Security
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  isVerified: { type: Boolean, default: false, index: true },
  verificationSession: {
    provider: { type: String, enum: ['Persona', 'Didit', 'Stripe Identity'] },
    verifiedAt: { type: Date },
    badgeHash: { type: String },
    livenessScore: { type: Number },
  },
  subscriptionStatus: { type: String, enum: ['free', 'premium_monthly'], default: 'free' },
  emergencyContacts: [{
    name: String,
    phone: String,
    relationship: String,
    notifySms: { type: Boolean, default: true },
  }],
  safetyPinHash: { type: String, required: true },
  duressPinHash: { type: String, required: true },
}, { timestamps: true });

// 2. Hygiene POIs with Geospatial 2dsphere Index
const HygienePOISchema = new Schema({
  poiId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, enum: ['pharmacy', 'restroom', 'hygiene', 'emergency_clinic'] },
  city: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  open24Hours: { type: Boolean, default: false },
  stockedProducts: [String],
  cleanRestroomRating: { type: Number, default: 5.0 },
  isPinkShieldPartner: { type: Boolean, default: false },
});
HygienePOISchema.index({ location: '2dsphere' });

// 3. Bookings with Automated Commission Split
const BookingSchema = new Schema({
  bookingId: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  partnerId: { type: String, required: true },
  serviceType: { type: String, enum: ['hostel', 'tour', 'transport'], required: true },
  totalAmount: { type: Number, required: true },
  currency: { type: String, default: 'LKR' },
  commissionRate: { type: Number, default: 0.12 },
  commissionEarned: { type: Number, required: true },
  partnerPayout: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['card', 'koko_bnpl', 'mintpay_bnpl'], required: true },
  status: { type: String, default: 'confirmed' },
}, { timestamps: true });

export const User = mongoose.model('User', UserSchema);
export const HygienePOI = mongoose.model('HygienePOI', HygienePOISchema);
export const Booking = mongoose.model('Booking', BookingSchema);`;

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-xl">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              TRAVORA Technical Architecture & Data Models
            </h2>
            <p className="text-xs text-stone-400">
              Principal Full-Stack Engineer and Lead UI/UX Architect System Specs
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-stone-800 text-xs">
          {[
            { id: 'schemas', label: '1. Database Schemas', icon: Database },
            { id: 'endpoints', label: '2. Express API Routes', icon: Server },
            { id: 'webhooks', label: '3. Identity Webhook Spec', icon: ShieldCheck },
            { id: 'architecture', label: '4. System Dataflow', icon: GitBranch },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition ${
                  activeTab === tab.id
                    ? 'bg-rose-600 text-white shadow-sm font-semibold'
                    : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: DATABASE SCHEMAS */}
      {activeTab === 'schemas' && (
        <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400 font-semibold">Select Schema Syntax:</span>
              {(['postgresql', 'firestore', 'mongodb'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setSchemaFormat(fmt)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition ${
                    schemaFormat === fmt
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                      : 'bg-stone-950 text-stone-400 border border-stone-800'
                  }`}
                >
                  {fmt.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                const text =
                  schemaFormat === 'postgresql'
                    ? postgresqlDdl
                    : schemaFormat === 'firestore'
                    ? firestoreSchema
                    : mongodbMongoose;
                copyToClipboard(text, 'schema');
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs"
            >
              {copiedKey === 'schema' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedKey === 'schema' ? 'Copied' : 'Copy Schema'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-stone-950 border border-stone-800/90 text-stone-300 text-[11px] font-mono overflow-x-auto max-h-[460px] leading-relaxed">
            {schemaFormat === 'postgresql' && postgresqlDdl}
            {schemaFormat === 'firestore' && firestoreSchema}
            {schemaFormat === 'mongodb' && mongodbMongoose}
          </pre>
        </div>
      )}

      {/* TAB 2: API ENDPOINTS & LOGIC */}
      {activeTab === 'endpoints' && (
        <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Node.js Express / Cloud Function Routes
            </h3>
            <span className="text-[11px] font-mono text-emerald-400">Mounted on port 3000</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Route 1 */}
            <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-500/20 text-blue-400 font-mono font-bold px-2 py-0.5 rounded text-[11px]">
                    POST
                  </span>
                  <span className="font-mono text-white font-bold">/api/verify-identity</span>
                </div>
                <span className="text-[10px] text-stone-500 font-mono">Persona/Didit Webhook</span>
              </div>
              <p className="text-stone-400 text-[11px]">
                Validates Government ID optical extraction and 3D selfie liveness score. Issues Pink Shield cryptographic badge token and un-gates user permissions.
              </p>
            </div>

            {/* Route 2 */}
            <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-red-500/20 text-red-400 font-mono font-bold px-2 py-0.5 rounded text-[11px]">
                    POST
                  </span>
                  <span className="font-mono text-white font-bold">/api/sos/trigger</span>
                </div>
                <span className="text-[10px] text-stone-500 font-mono">Critical Dispatch</span>
              </div>
              <p className="text-stone-400 text-[11px]">
                Initiates encrypted live audio stream (WebSocket bridge), dispatches emergency SMS with GPS tracking link to trusted contacts, and auto-dials local tourist police.
              </p>
            </div>

            {/* Route 3 */}
            <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-500/20 text-emerald-400 font-mono font-bold px-2 py-0.5 rounded text-[11px]">
                    GET
                  </span>
                  <span className="font-mono text-white font-bold">/api/maps/hygiene-pins</span>
                </div>
                <span className="text-[10px] text-stone-500 font-mono">Spatial Query</span>
              </div>
              <p className="text-stone-400 text-[11px]">
                Fetches geospatial POIs with filters for 24h pharmacies, clean public restrooms (4.8+ rating), and stocked menstrual care products.
              </p>
            </div>

            {/* Route 4 */}
            <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-purple-500/20 text-purple-400 font-mono font-bold px-2 py-0.5 rounded text-[11px]">
                    POST
                  </span>
                  <span className="font-mono text-white font-bold">/api/gemini/assistant</span>
                </div>
                <span className="text-[10px] text-stone-500 font-mono">@google/genai SDK</span>
              </div>
              <p className="text-stone-400 text-[11px]">
                Server-side Gemini 3.8 Flash query with safety system instructions for cultural etiquette, night transit curfews, and emergency translations.
              </p>
            </div>

            {/* Route 5 */}
            <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-500/20 text-amber-400 font-mono font-bold px-2 py-0.5 rounded text-[11px]">
                    POST
                  </span>
                  <span className="font-mono text-white font-bold">/api/bookings/checkout</span>
                </div>
                <span className="text-[10px] text-stone-500 font-mono">Local BNPL & Split</span>
              </div>
              <p className="text-stone-400 text-[11px]">
                Processes Koko / Mintpay 3-installment checkouts or Card payments with automated 10%-15% platform commission splits.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: IDENTITY WEBHOOK SPEC */}
      {activeTab === 'webhooks' && (
        <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Persona / Didit / Stripe Identity Webhook Payload
          </h3>
          <p className="text-xs text-stone-400">
            Incoming event payload verified via HMAC-SHA256 signature header:
          </p>

          <pre className="p-4 rounded-xl bg-stone-950 border border-stone-800 text-stone-300 text-[11px] font-mono overflow-x-auto leading-relaxed">
{`{
  "event": "inquiry.completed",
  "inquiry_id": "inq_94bf01a3",
  "created_at": "2026-10-04T08:30:00Z",
  "data": {
    "user_id": "usr_maya_colombo",
    "status": "passed",
    "checks": {
      "government_id": {
        "status": "passed",
        "document_type": "passport",
        "issuing_country": "LKA",
        "expiration_date": "2032-05-14",
        "barcode_mrz_valid": true
      },
      "live_optical_selfie": {
        "status": "passed",
        "liveness_confidence": 0.994,
        "anti_spoofing_score": 0.998,
        "deepfake_detection_risk": "negligible"
      },
      "face_comparison": {
        "status": "passed",
        "match_confidence": 0.987
      }
    }
  },
  "travora_issued_token": {
    "badge": "PINK_SHIELD_VERIFIED",
    "badge_hash": "SHA256:7c9e01a84f3d2b",
    "gated_permissions": ["direct_messaging", "buddy_matching", "community_feed"]
  }
}`}
          </pre>
        </div>
      )}

      {/* TAB 4: ARCHITECTURE FLOW */}
      {activeTab === 'architecture' && (
        <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Dual-Sided Architecture & Safety Mesh
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
              <div className="font-bold text-rose-400">Regular User App (Solo Female)</div>
              <ul className="space-y-1 text-stone-300 text-[11px]">
                <li>• Biometric Gated Access (Persona KYC)</li>
                <li>• Trip Timer with Duress PIN protection</li>
                <li>• Web Audio Synthesizer Fake Call overlay</li>
                <li>• One-Touch SOS with encrypted audio streaming</li>
                <li>• Google Maps GeoJSON Heatmaps & Hygiene pins</li>
                <li>• 100% Offline SQLite Cache with phrasebook</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
              <div className="font-bold text-cyan-400">B2B Partner Portal & Transport</div>
              <ul className="space-y-1 text-stone-300 text-[11px]">
                <li>• Verified Hostels & Boutique Accommodations</li>
                <li>• HelaGo Female Rideshare fleet dispatch</li>
                <li>• Automated 10%-15% platform commission splits</li>
                <li>• Native Sri Lankan BNPL (Koko & Mintpay)</li>
                <li>• Pink Shield Safety Compliance audit</li>
                <li>• Live Guest Radar for active traveler routes</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
