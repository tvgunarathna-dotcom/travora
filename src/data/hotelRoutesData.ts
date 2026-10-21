export interface RouteStep {
  stepNumber: number;
  title: string;
  instruction: string;
  distance: string;
  safeHighlight: string;
  safetyNote?: string;
  iconType: 'start' | 'turn' | 'landmark' | 'destination' | 'caution';
}

export interface HotelMapLandmark {
  x: number;
  y: number;
  name: string;
  icon: string;
  tag?: string;
  isSafetyPost?: boolean;
}

export interface HotelRouteData {
  stayId: string;
  hotelName: string;
  city: string;
  address: string;
  environmentDescription: string;
  userLiveLocation: {
    label: string;
    neighborhood: string;
    city: string;
    coordinates: { lat: number; lng: number };
  };
  destinationCoordinates: { lat: number; lng: number };
  distanceKm: number;
  walkingMinutes: number;
  drivingMinutes: number;
  routeType:
    | 'urban_historic'
    | 'hills_winding'
    | 'mountain_tea'
    | 'lakeside_promenade'
    | 'mountain_ridge'
    | 'coastal_beach'
    | 'colonial_rampart';
  lightingSafetyIndex: number;
  elevationNote?: string;
  safeCorridorName: string;
  walkingSteps: RouteStep[];
  drivingSteps: RouteStep[];
  svgMap: {
    theme:
      | 'kandy_city'
      | 'kandy_hills'
      | 'hanthana_foothills'
      | 'kandy_lake'
      | 'ella_ridge'
      | 'mirissa_beach'
      | 'galle_fort';
    viewBox: string;
    userPoint: { x: number; y: number; label: string };
    hotelPoint: { x: number; y: number; label: string };
    walkingPathD: string;
    drivingPathD: string;
    safeCorridors: { d: string; label?: string }[];
    landmarks: HotelMapLandmark[];
    waterFeature?: {
      type: 'lake' | 'ocean' | 'stream';
      name: string;
      d: string;
      labelX: number;
      labelY: number;
    };
    contours?: { d: string; opacity?: number }[];
  };
}

export const hotelRoutesMap: Record<string, HotelRouteData> = {
  // 1. Sevana City Hotel - Urban Historic Kandy Center Grid
  stay_sevana_city: {
    stayId: 'stay_sevana_city',
    hotelName: 'Sevana City Hotel',
    city: 'Kandy',
    address: 'No. 32, Yatinuwara Veediya, Kandy City Center',
    environmentDescription: 'Historic colonial grid, wide paved sidewalks, 24/7 tourist police station, and commercial streetlights.',
    userLiveLocation: {
      label: 'Dalada Veediya (Central Kandy)',
      neighborhood: 'Queen’s Hotel Crossing',
      city: 'Kandy',
      coordinates: { lat: 7.2936, lng: 80.638 },
    },
    destinationCoordinates: { lat: 7.2915, lng: 80.634 },
    distanceKm: 1.1,
    walkingMinutes: 14,
    drivingMinutes: 4,
    routeType: 'urban_historic',
    lightingSafetyIndex: 9.4,
    safeCorridorName: 'Dalada Veediya & Yatinuwara Commercial Safe Corridor',
    elevationNote: 'Flat city terrain · Level sidewalks with pedestrian barriers',
    walkingSteps: [
      {
        stepNumber: 1,
        title: 'Depart Dalada Veediya Safe Promenade',
        instruction: 'Head 320m west past the Queen’s Hotel perimeter. Continuous high-lumen municipal street lighting and wide brick walkway.',
        distance: '320 m',
        safeHighlight: 'Street lighting index 9.6/10 · Active pedestrian foot-traffic',
        iconType: 'start',
      },
      {
        stepNumber: 2,
        title: 'Pass Central Tourist Police & Clock Tower Roundabout',
        instruction: 'Cross at the designated signalized zebra crossing. 24/7 staffed Tourist Police booth and CCTV surveillance overhead.',
        distance: '280 m',
        safeHighlight: 'Tourist Police Station SLTDA Booth · High-visibility crossing',
        iconType: 'landmark',
      },
      {
        stepNumber: 3,
        title: 'Turn Right onto Colombo Street & Yatinuwara Veediya',
        instruction: 'Follow the illuminated commercial lane. Bright jewelry shopfronts and evening cafe terraces line both sides.',
        distance: '350 m',
        safeHighlight: 'Commercial lighting · Active late-night pharmacy presence',
        iconType: 'turn',
      },
      {
        stepNumber: 4,
        title: 'Arrive at Sevana City Hotel (No. 32)',
        instruction: 'Destination is on your right. Uniformed security guard at the driveway entrance with smart keycard access lobby.',
        distance: '150 m',
        safeHighlight: 'Pink Shield verified gate · 24/7 security guard on duty',
        iconType: 'destination',
      },
    ],
    drivingSteps: [
      {
        stepNumber: 1,
        title: 'Start on Dalada Veediya Westbound',
        instruction: 'Drive west along Dalada Veediya through the city one-way system.',
        distance: '400 m',
        safeHighlight: 'Paved two-lane road with clear lane markers',
        iconType: 'start',
      },
      {
        stepNumber: 2,
        title: 'Navigate Clock Tower Roundabout',
        instruction: 'Take the second exit onto Colombo Street following traffic signals.',
        distance: '250 m',
        safeHighlight: 'Police traffic post monitoring intersection',
        iconType: 'turn',
      },
      {
        stepNumber: 3,
        title: 'Turn Right onto Yatinuwara Veediya',
        instruction: 'Continue 300m north. Sevana City Hotel valet entrance will be on the right.',
        distance: '450 m',
        safeHighlight: 'Dedicated hotel drop-off bay with luggage porter',
        iconType: 'destination',
      },
    ],
    svgMap: {
      theme: 'kandy_city',
      viewBox: '0 0 520 360',
      userPoint: { x: 95, y: 220, label: 'You (Dalada Veediya)' },
      hotelPoint: { x: 410, y: 110, label: 'Sevana City Hotel' },
      walkingPathD: 'M 95 220 L 190 220 L 250 180 L 310 180 L 370 140 L 410 110',
      drivingPathD: 'M 95 220 L 210 220 L 250 190 L 330 190 L 410 120',
      safeCorridors: [
        { d: 'M 30 220 L 500 220', label: 'Dalada Veediya Main Road' },
        { d: 'M 250 30 L 250 330', label: 'Colombo Street' },
        { d: 'M 370 40 L 370 320', label: 'Yatinuwara Veediya' },
        { d: 'M 140 50 L 140 310', label: 'D.S. Senanayake St' },
      ],
      landmarks: [
        { x: 215, y: 220, name: 'Clock Tower Roundabout', icon: '🕒', tag: 'Roundabout' },
        { x: 250, y: 155, name: 'Central Tourist Police', icon: '👮‍♀️', tag: '24/7 Safe Post', isSafetyPost: true },
        { x: 330, y: 145, name: 'Kandy City Center (KCC)', icon: '🏬', tag: 'Mall' },
        { x: 120, y: 245, name: 'Queen’s Hotel Esplanade', icon: '🏛️', tag: 'Historic' },
      ],
      waterFeature: {
        type: 'lake',
        name: 'Kandy Lake (West Shore)',
        d: 'M 10 280 C 40 260, 60 310, 80 360 L 0 360 Z',
        labelX: 18,
        labelY: 330,
      },
    },
  },

  // 2. Kandy View Hotel - George E De Silva Mawatha, Kandy Hills
  stay_kandy_view: {
    stayId: 'stay_kandy_view',
    hotelName: 'Kandy View Hotel',
    city: 'Kandy',
    address: 'George E De Silva Mawatha, Kandy Hills',
    environmentDescription: 'Tranquil hillside residential street ascending into the hills, overlooking Kandy Lake and Udawatta Kele nature forest.',
    userLiveLocation: {
      label: 'Kandy Lake South Promenade',
      neighborhood: 'Anagarika Dharmapala Mw',
      city: 'Kandy',
      coordinates: { lat: 7.291, lng: 80.642 },
    },
    destinationCoordinates: { lat: 7.2891, lng: 80.6385 },
    distanceKm: 2.3,
    walkingMinutes: 29,
    drivingMinutes: 8,
    routeType: 'hills_winding',
    lightingSafetyIndex: 8.8,
    safeCorridorName: 'South Lake Promenade & George E De Silva Hill Corridor',
    elevationNote: '+85m Elevation climb · Scenic winding hill road with solar lanterns',
    walkingSteps: [
      {
        stepNumber: 1,
        title: 'Depart South Lake Promenade Walkway',
        instruction: 'Stroll 450m west along the lake-edge pedestrian promenade with stone protective parapets and solar lamps.',
        distance: '450 m',
        safeHighlight: 'Protected pedestrian lake path · Continuous lighting',
        iconType: 'start',
      },
      {
        stepNumber: 2,
        title: 'Turn South onto George E De Silva Mawatha',
        instruction: 'Pass the quiet diplomatic residential guard booth and start the gentle upward incline.',
        distance: '550 m',
        safeHighlight: 'Residential security patrol post at road entry',
        iconType: 'turn',
      },
      {
        stepNumber: 3,
        title: 'Follow Winding Hill Curves past Rajapihilla Terrace',
        instruction: 'Follow the ascending asphalt road. Panoramic views over the lake open up on your right. Solar streetlights illuminate every curve.',
        distance: '900 m',
        safeHighlight: 'Solar-powered street lighting at every hairpin bend',
        iconType: 'landmark',
      },
      {
        stepNumber: 4,
        title: 'Arrive at Kandy View Hotel Entrance',
        instruction: 'Hotel gates and greeting lobby are straight ahead on the hillside terrace with illuminated signage.',
        distance: '400 m',
        safeHighlight: 'Gated entrance with 24/7 security attendant & CCTV',
        iconType: 'destination',
      },
    ],
    drivingSteps: [
      {
        stepNumber: 1,
        title: 'Head West along Lake South Road',
        instruction: 'Drive along Anagarika Dharmapala Mawatha with clear lake views.',
        distance: '500 m',
        safeHighlight: 'Smooth asphalt lakeside road',
        iconType: 'start',
      },
      {
        stepNumber: 2,
        title: 'Turn Left up George E De Silva Mawatha',
        instruction: 'Ascend the hillside road at moderate speed through residential curves.',
        distance: '1.4 km',
        safeHighlight: 'Well-paved road with convex safety mirrors on turns',
        iconType: 'turn',
      },
      {
        stepNumber: 3,
        title: 'Arrive at Kandy View Hotel Forecourt',
        instruction: 'Pull directly into the private guest parking forecourt.',
        distance: '400 m',
        safeHighlight: 'Private gated parking with on-site attendant',
        iconType: 'destination',
      },
    ],
    svgMap: {
      theme: 'kandy_hills',
      viewBox: '0 0 520 360',
      userPoint: { x: 85, y: 250, label: 'You (Lake Promenade)' },
      hotelPoint: { x: 420, y: 85, label: 'Kandy View Hotel' },
      walkingPathD: 'M 85 250 Q 140 230 180 260 T 260 210 Q 320 180 360 140 T 420 85',
      drivingPathD: 'M 85 250 C 130 250, 190 280, 240 240 C 290 200, 340 180, 420 85',
      safeCorridors: [
        { d: 'M 20 270 Q 150 240 280 290', label: 'Lake Drive Safe Walk' },
        { d: 'M 180 260 C 230 220, 310 180, 430 80', label: 'George E De Silva Mw' },
        { d: 'M 250 140 Q 320 110 400 60', label: 'Rajapihilla Terrace' },
      ],
      landmarks: [
        { x: 195, y: 240, name: 'Lake Hill Police Booth', icon: '👮‍♀️', tag: 'Safe Post', isSafetyPost: true },
        { x: 290, y: 175, name: 'Kandy Valley Viewpoint', icon: '🔭', tag: '360° Overlook' },
        { x: 370, y: 130, name: 'Udawatta Kele Forest Ridge', icon: '🌲', tag: 'Nature Sanctuary' },
      ],
      waterFeature: {
        type: 'lake',
        name: 'Kandy Lake (South Bay)',
        d: 'M 20 340 Q 120 260 220 300 Q 280 320 310 360 L 0 360 Z',
        labelX: 90,
        labelY: 330,
      },
      contours: [
        { d: 'M 120 180 Q 260 120 480 140', opacity: 0.15 },
        { d: 'M 160 120 Q 300 70 500 90', opacity: 0.2 },
        { d: 'M 220 70 Q 350 20 520 40', opacity: 0.25 },
      ],
    },
  },

  // 3. Linwood forest Bungalow - Hanthana Range Foothills, Kandy
  stay_linwood_forest: {
    stayId: 'stay_linwood_forest',
    hotelName: 'Linwood forest Bungalow',
    city: 'Kandy',
    address: 'Hanthana Range Foothills, Kandy',
    environmentDescription: 'Mountain pine forest and scenic Ceylon tea estate terraces, fresh alpine breeze and birdsong along Hanthana foothills.',
    userLiveLocation: {
      label: 'Hanthana Lower Gate Junction',
      neighborhood: 'General Hospital Roundabout',
      city: 'Kandy',
      coordinates: { lat: 7.282, lng: 80.628 },
    },
    destinationCoordinates: { lat: 7.2755, lng: 80.645 },
    distanceKm: 4.8,
    walkingMinutes: 55,
    drivingMinutes: 14,
    routeType: 'mountain_tea',
    lightingSafetyIndex: 8.5,
    safeCorridorName: 'Hanthana Mountain Road & Tea Estate Corridor',
    elevationNote: '+240m Mountain Ascent · Winding tea plantation road with estate guard gates',
    walkingSteps: [
      {
        stepNumber: 1,
        title: 'Depart Hanthana Lower Gate Checkpoint',
        instruction: 'Start at the well-lit lower Hanthana junction. Smooth tarmac road flanked by tall eucalyptus trees and estate signs.',
        distance: '800 m',
        safeHighlight: 'Estate security post · Clear emergency telephone poles',
        iconType: 'start',
      },
      {
        stepNumber: 2,
        title: 'Cross Hanthana Mountain Stream Stone Bridge',
        instruction: 'Pass the scenic stone bridge over the babbling mountain stream. Guarded entry into the Ceylon Tea Estate district.',
        distance: '1.2 km',
        safeHighlight: 'Estate guardhouse & SLTDA Eco-Tourism safe checkpoint',
        iconType: 'landmark',
      },
      {
        stepNumber: 3,
        title: 'Ascend Tea Terrace Serpentine Switchbacks',
        instruction: 'Follow the curving mountain road winding gently through manicured green tea terraces. Regular solar-powered milestone lamps.',
        distance: '2.1 km',
        safeHighlight: 'Solar lighting every 40 meters · 100% vehicle visibility',
        iconType: 'turn',
      },
      {
        stepNumber: 4,
        title: 'Arrive at Linwood Forest Bungalow Estate',
        instruction: 'Turn into the gated pine-tree courtyard of Linwood Bungalow. Welcoming female host and on-site caretaker greeting.',
        distance: '700 m',
        safeHighlight: 'Private estate gate with solar backup power & CCTV',
        iconType: 'destination',
      },
    ],
    drivingSteps: [
      {
        stepNumber: 1,
        title: 'Ascend Hanthana Mountain Road (B-12)',
        instruction: 'Drive up the scenic asphalt road through tea gardens with slow steady speed.',
        distance: '2.5 km',
        safeHighlight: 'Well-maintained road with stone safety verges',
        iconType: 'start',
      },
      {
        stepNumber: 2,
        title: 'Pass Ceylon Tea Museum Turnoff',
        instruction: 'Keep right along the upper ridge road following signs to Hanthana Foothill Villas.',
        distance: '1.6 km',
        safeHighlight: 'Clear reflective road markers',
        iconType: 'turn',
      },
      {
        stepNumber: 3,
        title: 'Enter Private Linwood Bungalow Driveway',
        instruction: 'Drive through the stone pillar entrance into the bungalow parking pavilion.',
        distance: '700 m',
        safeHighlight: 'Covered guest parking with security floodlights',
        iconType: 'destination',
      },
    ],
    svgMap: {
      theme: 'hanthana_foothills',
      viewBox: '0 0 520 360',
      userPoint: { x: 70, y: 290, label: 'You (Hanthana Lower Gate)' },
      hotelPoint: { x: 430, y: 75, label: 'Linwood Forest Bungalow' },
      walkingPathD: 'M 70 290 Q 140 270 170 240 T 240 190 Q 290 140 330 150 T 390 100 L 430 75',
      drivingPathD: 'M 70 290 C 130 280, 190 230, 240 200 C 310 160, 360 130, 430 75',
      safeCorridors: [
        { d: 'M 40 310 Q 160 270 240 210 Q 320 160 450 70', label: 'Hanthana Mountain Road' },
        { d: 'M 220 230 L 310 260', label: 'Tea Museum Byway' },
      ],
      landmarks: [
        { x: 195, y: 220, name: 'Mountain Stream Stone Bridge', icon: '🌉', tag: 'Checkpoint', isSafetyPost: true },
        { x: 300, y: 200, name: 'Ceylon Tea Terraces', icon: '🍃', tag: 'Heritage Estate' },
        { x: 360, y: 135, name: 'Pine Forest Reserve Canopy', icon: '🌲', tag: 'Protected Woods' },
        { x: 420, y: 140, name: 'Hanthana Peak Vista', icon: '⛰️', tag: 'Mountain Ridge' },
      ],
      waterFeature: {
        type: 'stream',
        name: 'Hanthana Mountain Stream',
        d: 'M 160 360 Q 190 280 210 210 Q 230 140 250 0',
        labelX: 190,
        labelY: 330,
      },
      contours: [
        { d: 'M 0 160 Q 260 90 520 120', opacity: 0.18 },
        { d: 'M 0 100 Q 250 40 520 70', opacity: 0.25 },
        { d: 'M 0 50 Q 270 0 520 20', opacity: 0.35 },
      ],
    },
  },

  // 4. Heaven Seven Hotel Kandy - Upper Lake Road, Overlooking Kandy Lake
  stay_heaven_seven: {
    stayId: 'stay_heaven_seven',
    hotelName: 'Heaven Seven Hotel Kandy',
    city: 'Kandy',
    address: 'Upper Lake Road, Overlooking Kandy Lake',
    environmentDescription: 'Panoramic royal lakeside road, direct unobstructed vistas of Kandy Lake, royal island pavilion, and golden roof of Temple of the Tooth.',
    userLiveLocation: {
      label: 'Temple of the Tooth Promenade',
      neighborhood: 'Royal Bathhouse (Ulpange)',
      city: 'Kandy',
      coordinates: { lat: 7.2936, lng: 80.6413 },
    },
    destinationCoordinates: { lat: 7.2895, lng: 80.6412 },
    distanceKm: 1.8,
    walkingMinutes: 22,
    drivingMinutes: 6,
    routeType: 'lakeside_promenade',
    lightingSafetyIndex: 9.6,
    safeCorridorName: 'Royal Lake Promenade & Upper Lake Scenic Drive Corridor',
    elevationNote: '+45m Gentle Hill Crest · Scenic heritage walking path around the lake',
    walkingSteps: [
      {
        stepNumber: 1,
        title: 'Depart Royal Bathhouse (Ulpange) Forecourt',
        instruction: 'Start walking along the illuminated stone-paved lake promenade. Historic lotus-bud parapet and ornamental heritage lighting.',
        distance: '400 m',
        safeHighlight: 'Temple security perimeter · 24/7 SLTDA police bicycle patrols',
        iconType: 'start',
      },
      {
        stepNumber: 2,
        title: 'Follow Lake Perimeter past Malwathu Maha Viharaya',
        instruction: 'Walk clockwise along the serene lakeside path. Safe pedestrian walkway separated from traffic by decorative stone bollards.',
        distance: '650 m',
        safeHighlight: 'Bright lakeside lamp posts every 15 meters · High footfall',
        iconType: 'landmark',
      },
      {
        stepNumber: 3,
        title: 'Ascend Upper Lake Drive Crest',
        instruction: 'Follow the gentle ascending road leading up to the panoramic Upper Lake viewpoint. Unbroken view of the entire lake and royal island.',
        distance: '500 m',
        safeHighlight: 'Illuminated viewpoint terrace with tourist police booth',
        iconType: 'turn',
      },
      {
        stepNumber: 4,
        title: 'Arrive at Heaven Seven Hotel Kandy',
        instruction: 'Destination is on the right with multi-level balconies and rooftop restaurant overlook. Smart RFID security gate.',
        distance: '250 m',
        safeHighlight: '24/7 security guard & smart RFID keycard access',
        iconType: 'destination',
      },
    ],
    drivingSteps: [
      {
        stepNumber: 1,
        title: 'Head South on Lake Perimeter Road',
        instruction: 'Drive along the lakeside avenue with royal water views on your right.',
        distance: '750 m',
        safeHighlight: 'Well-lit two-lane lakeside road',
        iconType: 'start',
      },
      {
        stepNumber: 2,
        title: 'Turn Left onto Upper Lake Road',
        instruction: 'Climb the gentle curve to Upper Lake Drive with panoramic overlooks.',
        distance: '750 m',
        safeHighlight: 'Smooth gradient with safety barriers',
        iconType: 'turn',
      },
      {
        stepNumber: 3,
        title: 'Arrive at Heaven Seven Hotel Forecourt',
        instruction: 'Pull up to the grand reception drop-off area with valet assistance.',
        distance: '300 m',
        safeHighlight: 'Private covered guest arrival foyer',
        iconType: 'destination',
      },
    ],
    svgMap: {
      theme: 'kandy_lake',
      viewBox: '0 0 520 360',
      userPoint: { x: 105, y: 120, label: 'You (Temple of the Tooth)' },
      hotelPoint: { x: 415, y: 250, label: 'Heaven Seven Hotel' },
      walkingPathD: 'M 105 120 Q 140 100 200 95 T 320 120 Q 370 170 390 210 L 415 250',
      drivingPathD: 'M 105 120 C 180 85, 330 110, 380 180 C 400 215, 410 230, 415 250',
      safeCorridors: [
        { d: 'M 90 90 Q 250 80 430 110', label: 'North Lake Walk' },
        { d: 'M 90 90 C 80 250, 240 310, 440 260', label: 'Upper Lake Drive Loop' },
      ],
      landmarks: [
        { x: 80, y: 110, name: 'Temple of the Tooth', icon: '🛕', tag: 'Sacred UNESCO' },
        { x: 140, y: 135, name: 'Royal Bathhouse (Ulpange)', icon: '🏛️', tag: 'Heritage' },
        { x: 260, y: 195, name: 'Royal Island (Kiri Muhuda)', icon: '🏝️', tag: 'Lake Island' },
        { x: 360, y: 215, name: 'Upper Lake Overlook', icon: '🌅', tag: 'Sunset Point', isSafetyPost: true },
      ],
      waterFeature: {
        type: 'lake',
        name: 'Kandy Lake (Bogambara Wewa)',
        d: 'M 140 140 C 230 110, 360 140, 370 210 C 370 270, 260 290, 160 260 C 110 230, 100 170, 140 140 Z',
        labelX: 200,
        labelY: 200,
      },
    },
  },

  // 5. Ella Mountain Female Eco Lodge & Shala - Passara Road, Ella Mountain Ridge
  stay_ella_eco: {
    stayId: 'stay_ella_eco',
    hotelName: 'Ella Mountain Female Eco Lodge & Shala',
    city: 'Ella',
    address: 'Passara Road, Ella Mountain Ridge',
    environmentDescription: 'Misty mountain ridge with fresh pine air, sweeping panoramas towards the famous Nine Arches Bridge and Little Adam’s Peak.',
    userLiveLocation: {
      label: 'Ella Railway Station Plaza',
      neighborhood: 'Ella Town Center Junction',
      city: 'Ella',
      coordinates: { lat: 6.8667, lng: 81.0465 },
    },
    destinationCoordinates: { lat: 6.8712, lng: 81.0485 },
    distanceKm: 2.2,
    walkingMinutes: 26,
    drivingMinutes: 7,
    routeType: 'mountain_ridge',
    lightingSafetyIndex: 8.9,
    safeCorridorName: 'Ella Main Town & Passara Ridge Safe Walking Trail',
    elevationNote: '+110m Scenic Ridge Walk · Certified trail with solar studs & eco-host checkpoints',
    walkingSteps: [
      {
        stepNumber: 1,
        title: 'Depart Ella Railway Station Plaza',
        instruction: 'Exit the colonial stone station into the well-lit Ella town square with lively organic cafes and tourist information desk.',
        distance: '350 m',
        safeHighlight: 'Tourist Police Help Desk & 24/7 cafe streetlights',
        iconType: 'start',
      },
      {
        stepNumber: 2,
        title: 'Turn East onto Passara Mountain Ridge Road',
        instruction: 'Follow the dedicated pedestrian safety verge along Passara Road. Refreshing mountain breeze and solar cat-eye studs on tarmac.',
        distance: '850 m',
        safeHighlight: 'Dedicated pedestrian walking strip with solar road studs',
        iconType: 'turn',
      },
      {
        stepNumber: 3,
        title: 'Pass Little Adam’s Peak Trailhead & Eco-Shuttle Station',
        instruction: 'Pass the staffed national park info post. Licensed female trail guides stationed here for safe group buddy walks.',
        distance: '650 m',
        safeHighlight: 'Licensed female guide post & eco-shuttle waiting shelter',
        iconType: 'landmark',
      },
      {
        stepNumber: 4,
        title: 'Arrive at Ella Female Eco Lodge & Yoga Shala',
        instruction: 'Enter through the wooden gate surrounded by purple morning glory flowers. Female host welcome desk and organic herbal tea.',
        distance: '350 m',
        safeHighlight: 'Gated 100% female eco lodge with night guard patrol',
        iconType: 'destination',
      },
    ],
    drivingSteps: [
      {
        stepNumber: 1,
        title: 'Take Passara Road Eastbound',
        instruction: 'Drive along Passara Mountain Road climbing gently up the ridge line.',
        distance: '1.2 km',
        safeHighlight: 'Paved scenic road with low traffic speed limit',
        iconType: 'start',
      },
      {
        stepNumber: 2,
        title: 'Pass Nine Arches Bridge View Turnoff',
        instruction: 'Continue along the main ridge road following the signs to the Eco Lodge & Shala.',
        distance: '600 m',
        safeHighlight: 'Clearly signposted tourist safe corridor',
        iconType: 'turn',
      },
      {
        stepNumber: 3,
        title: 'Arrive at Eco Lodge Mountain Driveway',
        instruction: 'Pull into the eco lodge guest gravel parking forecourt.',
        distance: '400 m',
        safeHighlight: 'Private gated driveway with motion sensor solar lights',
        iconType: 'destination',
      },
    ],
    svgMap: {
      theme: 'ella_ridge',
      viewBox: '0 0 520 360',
      userPoint: { x: 75, y: 240, label: 'You (Ella Station)' },
      hotelPoint: { x: 425, y: 95, label: 'Ella Female Eco Lodge' },
      walkingPathD: 'M 75 240 L 150 240 Q 210 230 250 180 T 350 140 L 425 95',
      drivingPathD: 'M 75 240 C 130 250, 220 220, 270 190 C 330 160, 380 120, 425 95',
      safeCorridors: [
        { d: 'M 40 250 L 220 250 Q 300 210 440 100', label: 'Passara Mountain Road' },
        { d: 'M 250 180 Q 330 220 420 250', label: 'Little Adam’s Peak Path' },
      ],
      landmarks: [
        { x: 145, y: 220, name: 'Ella Town Central Plaza', icon: '☕', tag: 'Cafe District' },
        { x: 265, y: 165, name: 'Little Adam’s Peak Info Post', icon: '🥾', tag: 'Guide Station', isSafetyPost: true },
        { x: 380, y: 200, name: 'Nine Arches Viaduct Bridge', icon: '🌉', tag: 'Famous Viaduct' },
        { x: 440, y: 170, name: 'Misty Pine Ridge Overlook', icon: '🌲', tag: 'Scenic View' },
      ],
      waterFeature: {
        type: 'stream',
        name: 'Ravana Mountain Cascades',
        d: 'M 300 360 Q 320 270 340 190 Q 360 120 370 0',
        labelX: 260,
        labelY: 320,
      },
      contours: [
        { d: 'M 20 180 Q 200 130 500 150', opacity: 0.15 },
        { d: 'M 30 120 Q 220 70 510 90', opacity: 0.22 },
      ],
    },
  },

  // 6. Mirissa Coastal Female Surf Stay & Co-Living - Mirissa Beach Road, Southern Province
  stay_mirissa_surf: {
    stayId: 'stay_mirissa_surf',
    hotelName: 'Mirissa Coastal Female Surf Stay & Co-Living',
    city: 'Mirissa',
    address: 'Mirissa Beach Road, Southern Province',
    environmentDescription: 'Warm golden sandy coastline along the Indian Ocean, turquoise surf waves, swaying coconut palms, and lively beachfront promenade.',
    userLiveLocation: {
      label: 'Mirissa Harbour Gate',
      neighborhood: 'Coast Highway (A2) Crossing',
      city: 'Mirissa',
      coordinates: { lat: 5.945, lng: 80.452 },
    },
    destinationCoordinates: { lat: 5.9472, lng: 80.4582 },
    distanceKm: 0.8,
    walkingMinutes: 10,
    drivingMinutes: 3,
    routeType: 'coastal_beach',
    lightingSafetyIndex: 9.3,
    safeCorridorName: 'Mirissa Coastal Promenade & Beach Access Walkway',
    elevationNote: '0m Sea Level · Paved beach boardwalk & golden sand barefoot access',
    walkingSteps: [
      {
        stepNumber: 1,
        title: 'Depart Mirissa Harbour Main Gate',
        instruction: 'Start at the well-lit harbour entrance with continuous maritime security presence and local fruit stalls.',
        distance: '200 m',
        safeHighlight: 'Maritime security booth · 24/7 tuk-tuk dispatch stand',
        iconType: 'start',
      },
      {
        stepNumber: 2,
        title: 'Follow Coastal Highway (A2) Pedestrian Strip',
        instruction: 'Walk east along the ocean-facing illuminated sidewalk with clear beach access arrows and streetlamps.',
        distance: '350 m',
        safeHighlight: 'Bright streetlights · Active seafood cafes & surf shops',
        iconType: 'turn',
      },
      {
        stepNumber: 3,
        title: 'Turn Right down Mirissa Beach Sandy Avenue',
        instruction: 'Follow the gentle sandy lane straight to the beach promenade. Ambient bistro fairy lights and gentle ocean breeze.',
        distance: '150 m',
        safeHighlight: 'Fairy lights & safe beachfront pedestrian boardwalk',
        iconType: 'landmark',
      },
      {
        stepNumber: 4,
        title: 'Arrive at Mirissa Coastal Female Surf Stay',
        instruction: 'Direct beachfront gate with surfboard racks and security keypad. Female staff reception on the open terrace.',
        distance: '100 m',
        safeHighlight: 'Private gated beach entrance · 100% female dorm floors',
        iconType: 'destination',
      },
    ],
    drivingSteps: [
      {
        stepNumber: 1,
        title: 'Eastbound on Matara Coast Highway (A2)',
        instruction: 'Drive 500m along the main coastal highway.',
        distance: '500 m',
        safeHighlight: 'Smooth coastal highway with illuminated street lamps',
        iconType: 'start',
      },
      {
        stepNumber: 2,
        title: 'Turn Right into Beach Access Lane',
        instruction: 'Follow the lane 300m south towards the beachfront.',
        distance: '300 m',
        safeHighlight: 'Safe well-marked alley with hotel drop-off bay',
        iconType: 'destination',
      },
    ],
    svgMap: {
      theme: 'mirissa_beach',
      viewBox: '0 0 520 360',
      userPoint: { x: 75, y: 130, label: 'You (Mirissa Harbour)' },
      hotelPoint: { x: 420, y: 220, label: 'Mirissa Coastal Surf Stay' },
      walkingPathD: 'M 75 130 L 220 130 Q 300 135 340 180 L 420 220',
      drivingPathD: 'M 75 130 L 280 130 L 360 170 L 420 220',
      safeCorridors: [
        { d: 'M 20 120 L 500 120', label: 'Coast Highway A2' },
        { d: 'M 340 120 L 340 260', label: 'Beach Access Walkway' },
        { d: 'M 40 230 Q 250 210 490 230', label: 'Mirissa Beachfront Boardwalk' },
      ],
      landmarks: [
        { x: 80, y: 100, name: 'Mirissa Harbour Gate', icon: '⛵', tag: 'Harbour Security', isSafetyPost: true },
        { x: 230, y: 95, name: 'Mirissa Tourist Police Post', icon: '👮‍♀️', tag: 'Safe Post', isSafetyPost: true },
        { x: 330, y: 155, name: 'Surf Bay Cafe Hub', icon: '🏄‍♀️', tag: 'Surf District' },
        { x: 470, y: 260, name: 'Coconut Tree Hill', icon: '🌴', tag: 'Iconic Point' },
      ],
      waterFeature: {
        type: 'ocean',
        name: 'Indian Ocean & Mirissa Surf Bay',
        d: 'M 0 250 Q 140 230 260 250 Q 380 270 520 240 L 520 360 L 0 360 Z',
        labelX: 180,
        labelY: 310,
      },
    },
  },

  // 7. Galle Fort Heritage Villa & Suites - Rampart Street, Galle Fort
  stay_galle_fort_villa: {
    stayId: 'stay_galle_fort_villa',
    hotelName: 'Galle Fort Heritage Villa & Suites',
    city: 'Galle',
    address: 'No. 18, Rampart Street, Galle Fort',
    environmentDescription: 'Historic UNESCO World Heritage 400-year-old Dutch fortress walls, cobblestone lanes, iconic Galle Lighthouse, and crashing Indian Ocean waves.',
    userLiveLocation: {
      label: 'Galle Fort Main Gate',
      neighborhood: 'Dutch Hospital Heritage Precinct',
      city: 'Galle',
      coordinates: { lat: 6.033, lng: 80.216 },
    },
    destinationCoordinates: { lat: 6.0272, lng: 80.217 },
    distanceKm: 0.6,
    walkingMinutes: 7,
    drivingMinutes: 2,
    routeType: 'colonial_rampart',
    lightingSafetyIndex: 9.8,
    safeCorridorName: 'Church Street & Rampart Wall Heritage Safe Corridor',
    elevationNote: 'Vehicle-restricted pedestrian fortress · Historic cobblestones with zero through-traffic',
    walkingSteps: [
      {
        stepNumber: 1,
        title: 'Enter through Galle Fort Historic Main Gate',
        instruction: 'Walk beneath the massive 1669 VOC stone archway into the quiet pedestrianized fortress precinct. 24/7 SLTDA police station right inside the gate.',
        distance: '150 m',
        safeHighlight: 'Galle Fort Police Checkpoint · 100% pedestrian-friendly zone',
        iconType: 'start',
      },
      {
        stepNumber: 2,
        title: 'Walk South along Church Street Historic Boulevard',
        instruction: 'Stroll down Church Street flanked by Dutch colonial villas, vintage wrought-iron lamps, and boutique jewelry galleries.',
        distance: '250 m',
        safeHighlight: 'Historic gas-style warm lanterns · Continuous night footfall',
        iconType: 'landmark',
      },
      {
        stepNumber: 3,
        title: 'Turn onto Ocean-Facing Rampart Street',
        instruction: 'Reach the sea wall promenade. Listen to the ocean waves and enjoy panoramic views across the Indian Ocean to the lighthouse.',
        distance: '120 m',
        safeHighlight: 'Open ocean rampart walk with illuminated sea wall',
        iconType: 'turn',
      },
      {
        stepNumber: 4,
        title: 'Arrive at Galle Fort Heritage Villa',
        instruction: 'Destination is on Rampart Street with restored Dutch colonial teak doors, smart keypad entry, and welcoming courtyard.',
        distance: '80 m',
        safeHighlight: 'Pink Shield verified boutique villa with digital keypad',
        iconType: 'destination',
      },
    ],
    drivingSteps: [
      {
        stepNumber: 1,
        title: 'Enter through Main Gate to Drop-Off Point',
        instruction: 'Authorized electric buggies and licensed cabs enter through Main Gate into Church Street.',
        distance: '350 m',
        safeHighlight: 'Speed limited to 15 km/h inside heritage zone',
        iconType: 'start',
      },
      {
        stepNumber: 2,
        title: 'Arrive at Rampart Street Villa Entrance',
        instruction: 'Drop-off right outside the teak courtyard doors.',
        distance: '250 m',
        safeHighlight: 'Paved cobblestone drop-off lane',
        iconType: 'destination',
      },
    ],
    svgMap: {
      theme: 'galle_fort',
      viewBox: '0 0 520 360',
      userPoint: { x: 120, y: 70, label: 'You (Fort Main Gate)' },
      hotelPoint: { x: 380, y: 260, label: 'Galle Fort Heritage Villa' },
      walkingPathD: 'M 120 70 L 190 70 L 260 150 L 320 220 L 380 260',
      drivingPathD: 'M 120 70 L 220 70 L 280 160 L 380 260',
      safeCorridors: [
        { d: 'M 80 70 L 440 70', label: 'Rampart North Wall' },
        { d: 'M 260 50 L 260 300', label: 'Church Street Heritage Walk' },
        { d: 'M 340 50 L 340 310', label: 'Lighthouse Street' },
        { d: 'M 80 280 L 450 280', label: 'Rampart Street Ocean Wall' },
      ],
      landmarks: [
        { x: 140, y: 55, name: 'Galle Fort Main Gate', icon: '🏰', tag: 'VOC 1669', isSafetyPost: true },
        { x: 260, y: 130, name: 'Dutch Reformed Church', icon: '⛪', tag: 'Historic 1755' },
        { x: 220, y: 210, name: 'Fort Police Station', icon: '👮‍♀️', tag: 'Safe Post', isSafetyPost: true },
        { x: 440, y: 275, name: 'Galle Lighthouse & Bastion', icon: '🗼', tag: 'Point Utrecht' },
      ],
      waterFeature: {
        type: 'ocean',
        name: 'Indian Ocean (Ramparts Sea Wall)',
        d: 'M 0 310 Q 200 290 520 310 L 520 360 L 0 360 Z',
        labelX: 200,
        labelY: 340,
      },
      contours: [
        { d: 'M 50 30 L 470 30 L 470 300 L 50 300 Z', opacity: 0.12 },
      ],
    },
  },
};

export const getRouteForStay = (stayId: string): HotelRouteData => {
  if (hotelRoutesMap[stayId]) {
    return hotelRoutesMap[stayId];
  }
  // Default to Sevana City Hotel if not explicitly matched
  return hotelRoutesMap['stay_sevana_city'];
};
