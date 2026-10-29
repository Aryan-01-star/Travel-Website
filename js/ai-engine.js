/**
 * TRIP-STAR AI CONCIERGE KNOWLEDGE ENGINE
 * Dual-compatible: Node.js (CommonJS) and Browser (window.TripStarAi).
 * Full platform coverage: 26 destinations, 6 luxury residences, 42 travel partners,
 * ambassador rewards, booking policies, demo accounts, packing, and seasonal guides.
 * ZERO emoji icons, 100% clean markdown and structured stay recommendations.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.TripStarAi = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  // 1. ALL 6 VERIFIED LUXURY RESIDENCES
  const RESIDENCES = [
    {
      id: "stay-ny",
      title: "Manhattan Sky Residence",
      location: "New York City, United States",
      price: 380,
      badge: "Penthouse",
      category: "urban",
      guests: 4,
      type: "Luxury Penthouse",
      features: ["Skyline View", "Concierge", "Private Terrace"],
      availability: "Instant Booking",
      img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80",
      description: "Duplex penthouse overlooking Central Park and the Manhattan skyline with 24/7 dedicated butler service and private landscaped terrace."
    },
    {
      id: "stay-swiss",
      title: "Zermatt Alpine Chalet",
      location: "Zermatt, Switzerland",
      price: 295,
      badge: "Chalet",
      category: "chalet",
      guests: 6,
      type: "Alpine Chalet",
      features: ["Sauna", "Matterhorn View", "Ski-in Access"],
      availability: "Available Today",
      img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80",
      description: "Authentic timber chalet with panoramic views of the Matterhorn, ski-in/ski-out trail access, wood-burning fireplace, and Finnish sauna."
    },
    {
      id: "stay-santorini",
      title: "Oia Cliffside Sanctuary",
      location: "Santorini, Greece",
      price: 340,
      badge: "Oceanfront",
      category: "villa",
      guests: 2,
      type: "Cliff Villa",
      features: ["Caldera Sunset", "Infinity Plunge Pool", "Private Chef"],
      availability: "Only 2 suites left",
      img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80",
      description: "Whitewashed cliff-edge villa carved into the Santorini volcanic rocks with private heated infinity plunge pool facing the golden sunset."
    },
    {
      id: "stay-kyoto",
      title: "Gion Heritage Machiya",
      location: "Kyoto, Japan",
      price: 210,
      badge: "Historic",
      category: "estate",
      guests: 3,
      type: "Traditional Machiya",
      features: ["Zen Garden", "Hinoki Wood Bath", "Tea Ceremony Room"],
      availability: "Available Today",
      img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=80",
      description: "Restored 100-year-old preserved cedar machiya in historic Gion featuring an authentic Japanese rock garden, tatami tea salon, and aromatic Hinoki tub."
    },
    {
      id: "stay-paris",
      title: "Saint-Germain Haussmann Suite",
      location: "Paris, France",
      price: 260,
      badge: "Suite",
      category: "urban",
      guests: 2,
      type: "Haussmann Suite",
      features: ["Balcony View", "Wine Cellar Access", "Art Deco Interior"],
      availability: "Instant Booking",
      img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80",
      description: "Haussmannian luxury apartment in Saint-Germain-des-Prés with classic wrought-iron balconies, chevron oak floors, and curated private cellar."
    },
    {
      id: "stay-bali",
      title: "Ubud Rainforest Villa",
      location: "Bali, Indonesia",
      price: 180,
      badge: "Villa",
      category: "villa",
      guests: 4,
      type: "Rainforest Villa",
      features: ["Private Infinity Pool", "Jungle Canopy", "Floating Breakfast"],
      availability: "Available this week",
      img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=80",
      description: "Secluded open-plan bamboo sanctuary immersed in the Ubud river valley canopy with private infinity pool and morning floating breakfast service."
    }
  ];

  // 2. ALL 26 CURATED DESTINATIONS (FROM BESTPLACES.HTML)
  const DESTINATIONS = [
    { id: "in", name: "India", continent: "Asia", season: "October to March (Pleasant winter & cultural festivals)", vibe: "Spiritual & Majestic", highlights: ["Taj Mahal, Agra", "Jaipur & Udaipur", "Goa Beaches", "Varanasi", "Kerala Backwaters", "Rishikesh"], desc: "Profound traditions, sacred rivers, timeless palaces, and rich cultural heritage." },
    { id: "fr", name: "France", continent: "Europe", season: "April to October (Spring boulevards & Autumn harvest)", vibe: "Romantic & Historic", highlights: ["Paris & Eiffel Tower", "Provence Fields", "French Riviera", "Loire Valley", "Mont Saint-Michel", "Bordeaux"], desc: "Romantic charm, architectural grandeur, world cuisine, and Mediterranean coastlines.", stayId: "stay-paris" },
    { id: "ch", name: "Switzerland", continent: "Europe", season: "Year-Round (December to April for skiing; July to October for hiking)", vibe: "Alpine Serenity", highlights: ["Zermatt & Matterhorn", "Interlaken", "Lucerne & Lake Geneva", "Zurich", "St. Moritz", "Jungfraujoch"], desc: "Pristine alpine lakes, dramatic Matterhorn peaks, and panoramic railways.", stayId: "stay-swiss" },
    { id: "au", name: "Australia", continent: "Oceania", season: "September to April (Warm summer & coastal sunshine)", vibe: "Coastal & Wilderness", highlights: ["Sydney Opera House", "Great Barrier Reef", "Melbourne Laneways", "Great Ocean Road", "Gold Coast"], desc: "Scenic coastline, ancient rainforests, Great Barrier Reef, and cosmopolitan harbors." },
    { id: "id", name: "Indonesia", continent: "Asia", season: "May to September (Tropical dry season & gentle surf)", vibe: "Tropical Sanctuary", highlights: ["Bali Temples & Beaches", "Raja Ampat Islands", "Komodo National Park", "Bromo Volcano", "Yogyakarta"], desc: "Tropical island sanctuaries, cliffside temples, and clear turquoise waters.", stayId: "stay-bali" },
    { id: "ae", name: "United Arab Emirates", continent: "Middle East & Africa", season: "November to March (Pleasant outdoor weather)", vibe: "Futuristic & Luxury", highlights: ["Burj Khalifa", "Palm Jumeirah", "Desert Safari", "Dubai Marina", "Louvre Abu Dhabi"], desc: "World-record architecture, desert retreats, palm archipelagos, and luxury hospitality." },
    { id: "uk", name: "United Kingdom", continent: "Europe", season: "May to September (Temperate summers & long daylight)", vibe: "Royal & Cultural", highlights: ["London & Westminster", "Edinburgh Castle", "Stonehenge", "Bath", "Oxford & Cambridge", "Lake District"], desc: "Royal heritage, historic cobblestone streets, Scottish highlands, and cultural arts." },
    { id: "nl", name: "Netherlands", continent: "Europe", season: "April to October (Keukenhof spring blooms & cycling)", vibe: "Artistic & Charming", highlights: ["Amsterdam Canals", "Keukenhof Gardens", "Rotterdam", "Giethoorn Village", "The Hague"], desc: "Canal rings, tulip gardens, world-famous cycling culture, and Dutch windmills." },
    { id: "us", name: "United States", continent: "Americas", season: "Year-Round (September to December for NYC autumn & holidays)", vibe: "Dynamic & Monumental", highlights: ["New York City", "San Francisco & Golden Gate", "Grand Canyon", "Hawaii & Maui", "Yellowstone"], desc: "California coasts, Manhattan skyline, the Grand Canyon, and national parks.", stayId: "stay-ny" },
    { id: "jp", name: "Japan", continent: "Asia", season: "March to May (Cherry Blossoms) & October to November (Autumn foliage)", vibe: "Zen & Modern", highlights: ["Tokyo", "Kyoto Temples", "Mount Fuji", "Osaka", "Nara Park", "Hakone Onsen"], desc: "Zen shrines, neon metropolises, cherry blossoms, and culinary mastery.", stayId: "stay-kyoto" },
    { id: "br", name: "Brazil", continent: "Americas", season: "December to March (Carnival & tropical beaches)", vibe: "Tropical & Vibrant", highlights: ["Rio de Janeiro", "Iguazu Falls", "Amazon Rainforest", "Salvador", "Fernando de Noronha"], desc: "Golden Copacabana sands, the Amazon basin, and thunderous Iguazu Falls." },
    { id: "es", name: "Spain", continent: "Europe", season: "May to October (Mediterranean sunshine & tapas)", vibe: "Warm & Historic", highlights: ["Barcelona Sagrada Família", "Madrid Prado", "Seville", "Granada Alhambra", "Ibiza"], desc: "Flamenco, Gaudí architecture, Andalusian palaces, and Mediterranean beaches." },
    { id: "it", name: "Italy", continent: "Europe", season: "April to June & September to October (Harvest & culture)", vibe: "Artistic & Scenic", highlights: ["Rome Colosseum", "Florence Duomo", "Venice Canals", "Amalfi Coast", "Tuscany", "Lake Como"], desc: "Renaissance art, Venice canals, rolling Tuscan vineyards, and the Amalfi Coast." },
    { id: "th", name: "Thailand", continent: "Asia", season: "November to March (Dry tropical winter)", vibe: "Exotic & Coastal", highlights: ["Bangkok Grand Palace", "Phuket & Phi Phi", "Chiang Mai", "Koh Samui", "Krabi"], desc: "Buddhist temples, Andaman sea islands, vibrant night markets, and hospitality." },
    { id: "de", name: "Germany", continent: "Europe", season: "May to September & December (Festivals & Christmas markets)", vibe: "Historic & Alpine", highlights: ["Berlin Wall", "Neuschwanstein Castle", "Munich", "The Black Forest", "Rhine Valley"], desc: "Neuschwanstein castles, Bavarian alpine trails, and the scenic Rhine Valley." },
    { id: "mx", name: "Mexico", continent: "Americas", season: "November to April (Sunny dry season & cenotes)", vibe: "Historic & Warm", highlights: ["Chichen Itza & Tulum", "Mexico City", "Oaxaca", "Cancún & Riviera Maya", "Cabo"], desc: "Ancient Mayan ruins, turquoise cenotes, colonial towns, and renowned cuisine." },
    { id: "kr", name: "South Korea", continent: "Asia", season: "March to May & September to November (Spring blooms & Autumn)", vibe: "Dynamic & Historic", highlights: ["Seoul Palaces", "Busan Coast", "Jeju Island", "Hanok Village", "Gangneung"], desc: "Modern cities, historic Joseon palaces, volcanic Jeju island, and street markets." },
    { id: "eg", name: "Egypt", continent: "Middle East & Africa", season: "October to April (Temperate desert & Nile cruises)", vibe: "Ancient & Iconic", highlights: ["Pyramids & Sphinx", "Luxor Valley of the Kings", "Nile River Cruise", "Abu Simbel"], desc: "Five millennia of monumental history: Pyramids of Giza, Luxor, and the Nile." },
    { id: "tr", name: "Turkey", continent: "Europe", season: "April to May & September to November (Mild weather)", vibe: "Scenic & Historic", highlights: ["Istanbul Hagia Sophia", "Cappadocia", "Pamukkale", "Ephesus", "Antalya Coast"], desc: "Crossroads of continents: Cappadocia hot air balloons, Istanbul, and turquoise coast." },
    { id: "ar", name: "Argentina", continent: "Americas", season: "October to April (Patagonia hiking & wine harvest)", vibe: "Passionate & Wild", highlights: ["Buenos Aires", "Perito Moreno Glacier", "Iguazu Falls", "Mendoza", "Bariloche"], desc: "Tango salons, Mendoza vineyards, Iguazu Falls, and the wild glaciers of Patagonia." },
    { id: "nz", name: "New Zealand", continent: "Oceania", season: "December to March (Warm adventure summer)", vibe: "Dramatic Nature", highlights: ["Milford Sound", "Queenstown", "Rotorua", "Waitomo Caves", "Mount Cook"], desc: "Pristine fjords, geothermal wonders, and dramatic natural landscapes." },
    { id: "gr", name: "Greece", continent: "Europe", season: "April to October (Aegean sunshine & Caldera sunsets)", vibe: "Aegean & Ancient", highlights: ["Santorini Sunsets", "Athens Acropolis", "Mykonos", "Crete", "Meteora"], desc: "White-washed island villages, azure waters, ancient ruins, and olive groves.", stayId: "stay-santorini" },
    { id: "za", name: "South Africa", continent: "Middle East & Africa", season: "May to September (Dry safari season) & November to February", vibe: "Coastal & Wildlife", highlights: ["Cape Town & Table Mountain", "Kruger Safari", "Cape Winelands", "Garden Route"], desc: "Table Mountain, Big Five safari in Kruger, and the scenic Garden Route." },
    { id: "pe", name: "Peru", continent: "Americas", season: "May to October (Dry Andean trekking season)", vibe: "Andean Heritage", highlights: ["Machu Picchu", "Cusco", "Sacred Valley", "Lake Titicaca", "Colca Canyon"], desc: "Inca Citadel of Machu Picchu in Andean cloud forests, Lake Titicaca, and Cusco." },
    { id: "is", name: "Iceland", continent: "Europe", season: "June to August (Midnight sun) & October to March (Northern Lights)", vibe: "Ethereal Landscapes", highlights: ["Blue Lagoon", "Golden Circle", "Glacier Lagoon", "Skógafoss", "Reykjavik"], desc: "Geothermal hot springs, cascading waterfalls, black sand beaches, and Northern Lights." },
    { id: "mv", name: "Maldives", continent: "Asia", season: "November to April (Dry season & calm lagoons)", vibe: "Overwater Luxury", highlights: ["Overwater Villas", "Baa Atoll Biosphere", "Whale Shark Lagoons", "Male Harbor"], desc: "Overwater bungalows, white sand atolls, and crystal clear coral lagoons." }
  ];

  // 3. TRAVEL PORTAL PARTNERS REGISTRY (42 VERIFIED OPERATORS)
  const PARTNERS = {
    airlines: ["Fly Emirates", "Etihad Airways", "Singapore Airlines", "Qatar Airways", "British Airways", "Lufthansa", "Swiss Air Lines", "Air India", "IndiGo", "SpiceJet", "American Airlines", "Air Canada", "Japan Airlines", "China Southern", "Air New Zealand", "Qantas", "EVA Air", "Asiana Airlines", "Virgin Atlantic"],
    railways: ["SBB Swiss Railways", "JR Central Shinkansen", "SNCF TGV France", "Deutsche Bahn ICE Germany", "Rail Europe", "Korail KTX Korea", "Indian Railways", "China High-Speed Rail", "South African Rail", "Australia Trains", "Russian Railways"],
    hotels: ["Trivago", "Airbnb", "Booking.com", "Agoda", "Goibibo", "Yatra", "Hotels.com", "Expedia", "MakeMyTrip", "Vacasa"],
    mobility: ["Uber", "Ola Cabs", "Grab Taxi", "RedBus"]
  };

  // 4. AMBASSADOR REWARDS DETAILS (FROM KNOWMORE.HTML)
  const REWARDS_INFO = {
    overview: "TripStar Ambassador Club rewards you and your friends with $50 stay credits per referral.",
    invitationBenefit: "Every invited friend receives $50 off their inaugural sanctuary reservation, and you receive $50 credit directly deposited into your member wallet.",
    expiration: "TripStar wallet credits never expire and apply seamlessly at checkout across all curated stays.",
    tiers: [
      { name: "Silver Pioneer", requirement: "1 - 2 Referrals", perk: "Complimentary welcome drink & priority check-in" },
      { name: "Gold Voyager", requirement: "3 - 4 Referrals", perk: "Room upgrades when available & $150 wallet credits" },
      { name: "Platinum Explorer", requirement: "5 - 9 Referrals", perk: "Late 2:00 PM check-out & private airport transfers" },
      { name: "Diamond Ambassador", requirement: "10+ Referrals", perk: "Dedicated 24/7 private concierge & exclusive villa rates" }
    ]
  };

  // 5. USER ACCOUNTS & BOOKING POLICIES
  const ACCOUNTS_AND_POLICIES = {
    demoAccounts: [
      { name: "Alex Vance", email: "alex@tripstar.com", password: "password123", tier: "Diamond Ambassador", country: "United States" },
      { name: "Sophia Laurent", email: "sophia@tripstar.com", password: "password123", tier: "Platinum Explorer", country: "France" }
    ],
    checkIn: "3:00 PM local time",
    checkOut: "11:00 AM local time",
    fees: {
      cleaning: "$45 per reservation",
      service: "$25 concierge fee"
    },
    cancellation: "Free cancellation up to 48 hours before check-in. Instant reservation confirmation."
  };

  /**
   * Main AI NLU Query Processor
   * Evaluates questions against all platform domains and returns accurate, helpful responses.
   */
  function answerTravelQuery(userQuery) {
    const raw = (userQuery || '').trim();
    const q = raw.toLowerCase();
    let reply = "";
    let recommendedStays = [];

    // HELPER: match any words
    const has = (...words) => words.some(w => q.includes(w));
    const hasAll = (...words) => words.every(w => q.includes(w));

    // -------------------------------------------------------------
    // DOMAIN 1: PRICING & COMPARISONS (Cheapest, Most Expensive, Price List)
    // -------------------------------------------------------------
    if (has('cheapest', 'lowest price', 'least expensive', 'budget stay', 'affordable stay', 'lowest cost')) {
      const cheapest = RESIDENCES.slice().sort((a, b) => a.price - b.price)[0];
      reply = `The most affordable luxury stay on TripStar is the **${cheapest.title}** in ${cheapest.location} starting at **$${cheapest.price} / night**.\n\nIt accommodates up to ${cheapest.guests} guests and features a private infinity plunge pool nestled in the lush jungle canopy with floating breakfast service.`;
      recommendedStays = [cheapest];
      return { reply, recommendedStays };
    }

    if (has('most expensive', 'highest price', 'luxury penthouse', 'costliest', 'priciest')) {
      const priciest = RESIDENCES.slice().sort((a, b) => b.price - a.price)[0];
      reply = `Our premier ultra-luxury stay is the **${priciest.title}** in ${priciest.location} at **$${priciest.price} / night**.\n\nThis two-story penthouse hosts up to ${priciest.guests} guests, featuring sweeping skyline views of Manhattan, a private rooftop terrace, and 24/7 dedicated concierge service.`;
      recommendedStays = [priciest];
      return { reply, recommendedStays };
    }

    if (has('price list', 'how much are the stays', 'stay prices', 'all prices', 'cost of stays')) {
      reply = `Here is the verified nightly rate for all 6 curated TripStar residences:\n\n` +
        `1. **Ubud Rainforest Villa** (Bali) — $180 / night (Best Value)\n` +
        `2. **Gion Heritage Machiya** (Kyoto) — $210 / night\n` +
        `3. **Saint-Germain Haussmann Suite** (Paris) — $260 / night\n` +
        `4. **Zermatt Alpine Chalet** (Switzerland) — $295 / night\n` +
        `5. **Oia Cliffside Sanctuary** (Santorini) — $340 / night\n` +
        `6. **Manhattan Sky Residence** (New York) — $380 / night\n\n` +
        `Every booking includes instant confirmation, transparent fees ($45 cleaning fee and $25 service fee), and verified luxury amenities.`;
      recommendedStays = [RESIDENCES[5], RESIDENCES[1]];
      return { reply, recommendedStays };
    }

    // -------------------------------------------------------------
    // DOMAIN 2: GUEST CAPACITY & ACCOMMODATION SIZES
    // -------------------------------------------------------------
    if (has('6 guests', 'six guests', '6 people', 'six people', 'large family', 'group of 6')) {
      const match = RESIDENCES.find(r => r.guests >= 6);
      reply = `For groups of up to 6 guests, our **${match.title}** in ${match.location} ($${match.price}/night) is the ideal choice.\n\nIt features 3 spacious master bedrooms, a private Finnish wellness sauna, direct ski-in/ski-out trail access, and a wood-burning fireplace lounge facing the Matterhorn.`;
      recommendedStays = [match];
      return { reply, recommendedStays };
    }

    if (has('4 guests', 'four guests', '4 people', 'four people', 'family of 4')) {
      const matches = RESIDENCES.filter(r => r.guests >= 4);
      reply = `We have two exceptional residences accommodating 4 or more guests:\n\n` +
        `• **Manhattan Sky Residence** (New York City) — $380 / night (4 guests, Skyline Views, Private Terrace)\n` +
        `• **Ubud Rainforest Villa** (Bali) — $180 / night (4 guests, Private Infinity Pool, Jungle Canopy)\n` +
        `• **Zermatt Alpine Chalet** (Switzerland) — $295 / night (Hosts up to 6 guests)`;
      recommendedStays = matches;
      return { reply, recommendedStays };
    }

    if (has('couple', 'couples', 'honeymoon', '2 guests', 'two guests', '2 people', 'romantic stay')) {
      const matches = [RESIDENCES[2], RESIDENCES[4]]; // Santorini & Paris
      reply = `For couples and romantic escapes, our most celebrated residences are:\n\n` +
        `• **Oia Cliffside Sanctuary** (Santorini, Greece) — $340 / night: Carved into volcanic cliffs with private infinity plunge pool and sunset caldera views.\n` +
        `• **Saint-Germain Haussmann Suite** (Paris, France) — $260 / night: Classic Parisian wrought-iron balcony, chevron parquet, and private wine cellar access.`;
      recommendedStays = matches;
      return { reply, recommendedStays };
    }

    // -------------------------------------------------------------
    // DOMAIN 3: SPECIFIC RESIDENCE FEATURES (Pool, Sauna, View, Fireplace)
    // -------------------------------------------------------------
    if (has('infinity pool', 'private pool', 'pool', 'swimming pool')) {
      const poolStays = [RESIDENCES[2], RESIDENCES[5]];
      reply = `Two of our luxury residences feature private pools:\n\n` +
        `1. **Oia Cliffside Sanctuary** (Santorini, Greece) — Heated cliffside infinity plunge pool overlooking the Aegean Sea ($340/night).\n` +
        `2. **Ubud Rainforest Villa** (Bali, Indonesia) — Private jungle canopy infinity pool with floating breakfast service ($180/night).`;
      recommendedStays = poolStays;
      return { reply, recommendedStays };
    }

    if (has('sauna', 'matterhorn', 'ski', 'ski-in', 'chalet', 'fireplace')) {
      const chalet = RESIDENCES[1];
      reply = `Our **${chalet.title}** in ${chalet.location} ($${chalet.price}/night) features a private Finnish cedar sauna, ski-in/ski-out slope access, and direct Matterhorn panoramic views. It accommodates up to 6 guests with a cozy wood-burning fireplace lounge.`;
      recommendedStays = [chalet];
      return { reply, recommendedStays };
    }

    if (has('zen garden', 'hinoki', 'tea ceremony', 'machiya', 'tatami')) {
      const machiya = RESIDENCES[3];
      reply = `Our **${machiya.title}** in ${machiya.location} ($${machiya.price}/night) features a private Zen rock garden, an aromatic Japanese Hinoki cedar wood soaking tub, and a traditional tatami tea ceremony chamber.`;
      recommendedStays = [machiya];
      return { reply, recommendedStays };
    }

    if (has('penthouse', 'skyline', 'manhattan', 'new york stay', 'central park')) {
      const ny = RESIDENCES[0];
      reply = `The **${ny.title}** in New York City ($${ny.price}/night) is a luxury duplex penthouse with 360-degree skyline views, private terrace, and 24/7 concierge service for up to 4 guests.`;
      recommendedStays = [ny];
      return { reply, recommendedStays };
    }

    // -------------------------------------------------------------
    // DOMAIN 4: ALL STAYS & RESIDENCE DIRECTORY
    // -------------------------------------------------------------
    if (has('all stays', 'all residences', 'show stays', 'list stays', 'luxury stays', 'show me stays', 'available residences')) {
      reply = `TripStar features 6 handpicked luxury residences personally vetted for architectural beauty and private amenities:\n\n` +
        `1. **Manhattan Sky Residence** (New York) — $380/night (Penthouse, 4 guests)\n` +
        `2. **Zermatt Alpine Chalet** (Switzerland) — $295/night (Alpine Chalet, 6 guests, Sauna)\n` +
        `3. **Oia Cliffside Sanctuary** (Santorini) — $340/night (Cliff Villa, 2 guests, Pool)\n` +
        `4. **Gion Heritage Machiya** (Kyoto) — $210/night (Traditional Machiya, 3 guests, Zen Garden)\n` +
        `5. **Saint-Germain Haussmann Suite** (Paris) — $260/night (Haussmann Suite, 2 guests)\n` +
        `6. **Ubud Rainforest Villa** (Bali) — $180/night (Rainforest Villa, 4 guests, Pool)\n\n` +
        `You can reserve any stay with instant confirmation by clicking "Book Now" below or visiting the Luxury Stays page.`;
      recommendedStays = RESIDENCES.slice(0, 3);
      return { reply, recommendedStays };
    }

    // -------------------------------------------------------------
    // DOMAIN 5: BOOKING PROCESS, FEES, POLICIES & HOURS
    // -------------------------------------------------------------
    if (has('how to book', 'how do i book', 'reservation process', 'how to make a reservation', 'book a stay')) {
      reply = `Booking a luxury residence on TripStar is seamless:\n\n` +
        `1. Choose your stay on the **Luxury Stays** page (or click "Book Now" on any card here).\n` +
        `2. Select your desired **Check-in** and **Check-out** dates, and number of guests.\n` +
        `3. Review the total pricing, which includes transparent cleaning and concierge fees.\n` +
        `4. Confirm your booking instantly. You can sign in to your TripStar account or complete a fast demo booking.`;
      recommendedStays = [RESIDENCES[1]];
      return { reply, recommendedStays };
    }

    if (has('fee', 'fees', 'cleaning', 'service fee', 'check-in', 'check in', 'check-out', 'check out', 'time', 'hours', 'cancellation', 'cancel', 'policy', 'policies')) {
      reply = `**TripStar Booking Policies & Times**:\n\n` +
        `• **Check-In Time**: ${ACCOUNTS_AND_POLICIES.checkIn}\n` +
        `• **Check-Out Time**: ${ACCOUNTS_AND_POLICIES.checkOut}\n` +
        `• **Cleaning Fee**: ${ACCOUNTS_AND_POLICIES.fees.cleaning}\n` +
        `• **Concierge Service Fee**: ${ACCOUNTS_AND_POLICIES.fees.service}\n` +
        `• **Cancellation Policy**: ${ACCOUNTS_AND_POLICIES.cancellation}\n\n` +
        `Every guest receives verified keyless arrival codes or private in-person greeting upon arrival.`;
      return { reply, recommendedStays };
    }

    // -------------------------------------------------------------
    // DOMAIN 6: TRAVEL PORTAL, AIRLINES, TRAINS & PARTNERS (WEBX.HTML)
    // -------------------------------------------------------------
    if (has('airline', 'airlines', 'flight', 'flights', 'aviation', 'fly')) {
      reply = `TripStar connects travelers with **19 verified international airlines** through our **Travel Portal**:\n\n` +
        `• **Premium Global Carriers**: Fly Emirates, Singapore Airlines, Qatar Airways, Etihad Airways, British Airways, Lufthansa, Swiss Air Lines, Virgin Atlantic\n` +
        `• **Americas & Pacific**: American Airlines, Air Canada, Qantas, Air New Zealand\n` +
        `• **Asia Specialists**: Japan Airlines, ANA, EVA Air, Asiana Airlines, Air India, IndiGo\n\n` +
        `You can connect directly to official booking portals on the **Travel Portal** page.`;
      return { reply, recommendedStays };
    }

    if (has('train', 'trains', 'rail', 'railway', 'railways', 'shinkansen', 'tgv', 'eurostar', 'ice train', 'ice trains', 'high-speed')) {
      reply = `Through the **Travel Portal**, TripStar links to **11 premier high-speed rail operators** worldwide:\n\n` +
        `• **SBB Swiss Railways**: Panoramic alpine rail and glacier express routes through Switzerland.\n` +
        `• **JR Central Shinkansen**: High-speed bullet rail connecting Tokyo, Kyoto, and Osaka in Japan.\n` +
        `• **SNCF TGV France**: High-speed routes across Paris, Provence, and the French Riviera.\n` +
        `• **Deutsche Bahn ICE**: German express passenger network across Central Europe.\n` +
        `• **Rail Europe**: Seamless cross-border passes connecting Eurostar and continental rail.\n` +
        `• **Korail KTX**: South Korea's premier bullet rail connecting Seoul and Busan.`;
      return { reply, recommendedStays };
    }

    if (has('partner', 'partners', 'portal', 'taxi', 'cabs', 'transit', 'uber', 'grab', 'mobility')) {
      reply = `The **TripStar Travel Portal** features **42 verified partners** across four categories:\n\n` +
        `• **19 Global Airlines**: Emirates, Singapore Airlines, Qatar, British Airways, Lufthansa, etc.\n` +
        `• **11 High-Speed Railways**: SBB Swiss, JR Shinkansen, SNCF TGV, Deutsche Bahn, Rail Europe\n` +
        `• **10 Hotel Platforms**: Trivago, Booking.com, Airbnb, Agoda, Expedia, Hotels.com\n` +
        `• **4 Mobility Networks**: Uber (Global), Ola Cabs, Grab Taxi (Southeast Asia), RedBus\n\n` +
        `All partners undergo strict SSL encryption and official verification checks.`;
      return { reply, recommendedStays };
    }

    // -------------------------------------------------------------
    // DOMAIN 7: AMBASSADOR REWARDS & WALLET (KNOWMORE.HTML)
    // -------------------------------------------------------------
    if (has('reward', 'rewards', 'ambassador', 'referral', 'refer', 'referring', 'wallet', 'credits', 'points', 'invite', 'discount')) {
      reply = `**The TripStar Ambassador Rewards Club**:\n\n` +
        `• **How it works**: Share your personal invitation pass (found on the **Rewards** page).\n` +
        `• **Friend Benefit**: Your invited friend receives **$50 off** their inaugural booking.\n` +
        `• **Your Reward**: You receive **$50 in wallet credits** deposited directly into your balance.\n` +
        `• **Zero Expiration**: Credits never expire and apply automatically at checkout toward any luxury stay.\n\n` +
        `**Ambassador Tiers**:\n` +
        `1. **Silver Pioneer** (1 - 2 referrals): Welcome drinks & priority check-in\n` +
        `2. **Gold Voyager** (3 - 4 referrals): Room upgrades & $150 credit balance\n` +
        `3. **Platinum Explorer** (5 - 9 referrals): Late 2:00 PM check-out & private airport transfers\n` +
        `4. **Diamond Ambassador** (10+ referrals): 24/7 dedicated private concierge & exclusive rates`;
      return { reply, recommendedStays };
    }

    // -------------------------------------------------------------
    // DOMAIN 8: USER ACCOUNTS & DEMO SIGN-IN
    // -------------------------------------------------------------
    if (has('sign in', 'log in', 'login', 'account', 'demo account', 'test user', 'password', 'alex vance', 'sophia')) {
      reply = `**TripStar Member Accounts**:\n\n` +
        `You can create a new account on our **Sign In** or **Sign Up** page, or use our instant one-click demo credentials:\n\n` +
        `• **Demo Account 1**: \`alex@tripstar.com\` (Password: \`password123\`) — Diamond Ambassador Tier\n` +
        `• **Demo Account 2**: \`sophia@tripstar.com\` (Password: \`password123\`) — Platinum Explorer Tier\n\n` +
        `Logging in allows you to save favorite sanctuaries to your wishlist, manage reservations, and track your Ambassador credits.`;
      return { reply, recommendedStays };
    }

    // -------------------------------------------------------------
    // DOMAIN 9: WISHLIST & FAVORITES
    // -------------------------------------------------------------
    if (has('wishlist', 'favorite', 'favorites', 'save a stay', 'heart icon', 'heart')) {
      reply = `To save any destination or luxury residence to your favorites, simply tap the **heart icon** on its card.\n\nYour saved favorites persist across your browsing session and can be reviewed anytime. Tap the heart again to remove an item.`;
      return { reply, recommendedStays };
    }

    // -------------------------------------------------------------
    // DOMAIN 10: PACKING & WEATHER ADVICE
    // -------------------------------------------------------------
    if (has('pack', 'packing', 'what to wear', 'luggage', 'clothes')) {
      reply = `**TripStar Packing Recommendations**:\n\n` +
        `• **Alpine Journeys (e.g. Zermatt, Switzerland)**: Pack thermal base-layer tops, insulated outerwear, wool socks, waterproof hiking or ski boots, and polarized UV mountain goggles.\n` +
        `• **Tropical Islands (e.g. Bali, Santorini, Maldives)**: Pack breathable linen clothing, wide-brim sun hat, reef-safe sunscreen (50+ SPF), sunglasses, and quick-dry swimwear.\n` +
        `• **Metropolitan & Cultural (e.g. Paris, Kyoto, New York)**: Comfortable walking shoes for cobblestones, smart-casual dining attire, and a universal travel plug adapter.`;
      return { reply, recommendedStays };
    }

    // -------------------------------------------------------------
    // DOMAIN 11: SPECIFIC DESTINATIONS (ALL 26 COUNTRIES & KEY CITIES)
    // -------------------------------------------------------------
    for (const d of DESTINATIONS) {
      const nameMatch = q.includes(d.name.toLowerCase());
      const highlightMatch = d.highlights.some(h => q.includes(h.toLowerCase().split(',')[0].trim()));
      
      // Special aliases
      const aliasMatch = (d.id === 'us' && has('usa', 'united states', 'america', 'new york', 'california', 'grand canyon')) ||
        (d.id === 'uk' && has('united kingdom', 'britain', 'england', 'scotland', 'london')) ||
        (d.id === 'ae' && has('uae', 'dubai', 'abu dhabi', 'emirates')) ||
        (d.id === 'ch' && has('switzerland', 'swiss', 'zermatt', 'matterhorn', 'alps')) ||
        (d.id === 'fr' && has('france', 'french', 'paris', 'eiffel', 'bordeaux')) ||
        (d.id === 'jp' && has('japan', 'japanese', 'kyoto', 'tokyo', 'osaka', 'fuji', 'cherry blossom', 'cherry blossoms')) ||
        (d.id === 'id' && has('bali', 'indonesia', 'ubud')) ||
        (d.id === 'gr' && has('greece', 'greek', 'santorini', 'athens', 'mykonos')) ||
        (d.id === 'it' && has('italy', 'italian', 'rome', 'florence', 'venice', 'amalfi', 'tuscany')) ||
        (d.id === 'es' && has('spain', 'spanish', 'barcelona', 'madrid', 'seville')) ||
        (d.id === 'eg' && has('egypt', 'egyptian', 'pyramids', 'cairo', 'nile', 'luxor')) ||
        (d.id === 'is' && has('iceland', 'reykjavik', 'aurora', 'northern lights')) ||
        (d.id === 'nl' && has('netherlands', 'holland', 'amsterdam', 'tulip')) ||
        (d.id === 'in' && has('india', 'delhi', 'agra', 'taj mahal', 'kerala', 'jaipur')) ||
        (d.id === 'th' && has('thailand', 'bangkok', 'phuket', 'chiang mai')) ||
        (d.id === 'au' && has('australia', 'sydney', 'melbourne', 'barrier reef')) ||
        (d.id === 'nz' && has('new zealand', 'queenstown', 'milford sound')) ||
        (d.id === 'pe' && has('peru', 'machu picchu', 'cusco', 'inca')) ||
        (d.id === 'mv' && has('maldives', 'overwater bungalow', 'coral lagoon')) ||
        (d.id === 'za' && has('south africa', 'cape town', 'kruger', 'safari'));

      if (nameMatch || highlightMatch || aliasMatch) {
        reply = `**Destination Guide: ${d.name} (${d.continent})**\n\n` +
          `• **Vibe & Atmosphere**: ${d.vibe}\n` +
          `• **Optimal Travel Season**: ${d.season}\n` +
          `• **Signature Highlights**: ${d.highlights.join(' • ')}\n\n` +
          `${d.desc}\n\n` +
          `You can view the full itinerary and insider travel tips on our **Destinations** page.`;

        // Check if there is an exact matched residence in this country
        if (d.stayId) {
          const matchedStay = RESIDENCES.find(r => r.id === d.stayId);
          if (matchedStay) {
            reply += `\n\nWe feature an exclusive verified sanctuary in ${d.name}: **${matchedStay.title}** ($${matchedStay.price}/night).`;
            recommendedStays = [matchedStay];
          }
        }
        return { reply, recommendedStays };
      }
    }

    // -------------------------------------------------------------
    // DOMAIN 12: CONTINENTS & REGIONS
    // -------------------------------------------------------------
    if (has('europe', 'european')) {
      reply = `TripStar curates **9 premier European destinations**:\n\n` +
        `• **France** (Apr - Oct): Romantic avenues, Parisian suites, and Mediterranean shores.\n` +
        `• **Switzerland** (Year-Round): Matterhorn peaks, alpine chalets, and scenic cog railways.\n` +
        `• **Italy** (Apr - Jun & Sep - Oct): Rome, Venice, Tuscany, and the Amalfi Coast.\n` +
        `• **Greece** (May - Oct): Cobalt blue domes, caldera sunsets, and Aegean islands.\n` +
        `• **Spain** (May - Oct): Gaudí architecture, tapas culture, and Andalusian palaces.\n` +
        `• **United Kingdom** (May - Sep): Edinburgh castles, London landmarks, and scenic highlands.\n` +
        `• **Netherlands** (Apr - Oct): Canal rings, Keukenhof tulip blooms, and cycling culture.\n` +
        `• **Germany** (May - Sep & Dec): Fairy-tale Neuschwanstein castles and Bavarian peaks.\n` +
        `• **Iceland** (Jun - Aug & Oct - Mar): Geothermal hot springs, glaciers, and Northern Lights.`;
      recommendedStays = [RESIDENCES[1], RESIDENCES[2], RESIDENCES[4]];
      return { reply, recommendedStays };
    }

    if (has('asia', 'asian')) {
      reply = `We curate **6 extraordinary destinations across Asia**:\n\n` +
        `• **Japan** (Mar - May & Oct - Nov): Zen shrines, cherry blossoms, and Kyoto machiyas.\n` +
        `• **Indonesia & Bali** (May - Sep): Emerald rice terraces, sea temples, and rainforest villas.\n` +
        `• **India** (Oct - Mar): Taj Mahal, royal palaces of Rajasthan, and Kerala backwaters.\n` +
        `• **Thailand** (Nov - Mar): Grand palaces, Andaman limestone islands, and night markets.\n` +
        `• **South Korea** (Mar - May & Sep - Nov): Joseon palaces, neon metropolises, and Jeju island.\n` +
        `• **Maldives** (Nov - Apr): Overwater luxury villas and turquoise coral atolls.`;
      recommendedStays = [RESIDENCES[3], RESIDENCES[5]];
      return { reply, recommendedStays };
    }

    if (has('americas', 'america', 'north america', 'south america')) {
      reply = `In the Americas, TripStar features **5 iconic destinations**:\n\n` +
        `• **United States** (Year-Round): Manhattan skyline, Grand Canyon, California, and Yellowstone.\n` +
        `• **Brazil** (Dec - Mar): Rio de Janeiro, Copacabana sands, and Iguazu Falls.\n` +
        `• **Mexico** (Nov - Apr): Mayan pyramids of Tulum, Oaxaca cuisine, and turquoise cenotes.\n` +
        `• **Argentina** (Oct - Apr): Buenos Aires tango, Mendoza vineyards, and Patagonia glaciers.\n` +
        `• **Peru** (May - Oct): Inca citadel of Machu Picchu, Sacred Valley, and Cusco.`;
      recommendedStays = [RESIDENCES[0]];
      return { reply, recommendedStays };
    }

    if (has('middle east', 'africa', 'safari')) {
      reply = `Across Africa and the Middle East, we feature **3 premier destinations**:\n\n` +
        `• **United Arab Emirates** (Nov - Mar): World-record architecture, Dubai Marina, and desert safaris.\n` +
        `• **Egypt** (Oct - Apr): Giza Pyramids, Sphinx, Luxor Valley of the Kings, and Nile cruises.\n` +
        `• **South Africa** (May - Sep & Nov - Feb): Big Five game safaris in Kruger, Table Mountain, and Cape Winelands.`;
      return { reply, recommendedStays };
    }

    if (has('oceania', 'pacific', 'australia', 'new zealand')) {
      reply = `In Oceania, we feature **2 scenic wonderlands**:\n\n` +
        `• **Australia** (Sep - Apr): Sydney Harbor, Great Barrier Reef, Melbourne laneways, and rainforests.\n` +
        `• **New Zealand** (Dec - Mar): Milford Sound fjords, Queenstown adventure, Rotorua, and Mount Cook.`;
      return { reply, recommendedStays };
    }

    // -------------------------------------------------------------
    // DOMAIN 13: HOW MANY DESTINATIONS? / ALL PLACES OVERVIEW
    // -------------------------------------------------------------
    if (has('how many destinations', 'all destinations', 'list of destinations', 'what places can i visit', 'where can i travel')) {
      reply = `TripStar curates **26 premier global destinations across 6 continents**:\n\n` +
        `• **Europe (9)**: France, Switzerland, Italy, Greece, Spain, United Kingdom, Netherlands, Germany, Iceland\n` +
        `• **Asia (6)**: Japan, Indonesia, India, Thailand, South Korea, Maldives\n` +
        `• **Americas (5)**: United States, Brazil, Mexico, Argentina, Peru\n` +
        `• **Middle East & Africa (3)**: United Arab Emirates, Egypt, South Africa\n` +
        `• **Oceania (2)**: Australia, New Zealand\n` +
        `• **Turkey** (Crossroads of Europe & Asia)\n\n` +
        `You can explore individual country guides, top landmarks, and seasons on the **Destinations** page.`;
      recommendedStays = [RESIDENCES[1], RESIDENCES[2]];
      return { reply, recommendedStays };
    }

    // -------------------------------------------------------------
    // DOMAIN 14: PLATFORM OVERVIEW (WHO ARE YOU? WHAT IS TRIPSTAR?)
    // -------------------------------------------------------------
    if (has('who are you', 'what is tripstar', 'what can you do', 'what do you do', 'about tripstar', 'tell me about tripstar', 'hello', 'hi', 'hey', 'help')) {
      reply = `Welcome to **TripStar**! I am **Atlas**, your AI Travel Concierge.\n\n` +
        `I am designed to assist you across all TripStar platform services:\n\n` +
        `• **Curated Residences**: Inquire about our 6 luxury stays in New York, Switzerland, Santorini, Kyoto, Paris, and Bali.\n` +
        `• **26 Global Destinations**: Get insider advice on landmarks, optimal travel seasons, and culture across 6 continents.\n` +
        `• **Travel Portal**: Discover verified airlines (Emirates, Singapore Airlines), high-speed rail (Shinkansen, TGV, SBB), and hotel partners.\n` +
        `• **Ambassador Rewards**: Learn how to earn $50 stay credits per invited friend.\n` +
        `• **Instant Reservations**: Check pricing, amenities, check-in policies, and book directly.\n\n` +
        `Where would you like to travel, or what questions may I answer for you?`;
      recommendedStays = [RESIDENCES[1], RESIDENCES[2]];
      return { reply, recommendedStays };
    }

    // -------------------------------------------------------------
    // DEFAULT SMART CONCIERGE ASSISTANCE (NEVER BROKEN OR INACCURATE)
    // -------------------------------------------------------------
    reply = `I can help you with that! On TripStar, you can explore **26 curated destinations** (like Switzerland, Greece, Japan, France, and Bali), reserve **6 luxury residences** (penthouses, chalets, and private pool villas), or browse our **42 travel partners**.\n\n` +
      `Could you let me know if you are interested in a specific destination, looking for pricing and stay availability, or need help with bookings and rewards?`;
    recommendedStays = [RESIDENCES[1], RESIDENCES[2]];
    return { reply, recommendedStays };
  }

  return {
    RESIDENCES,
    DESTINATIONS,
    PARTNERS,
    REWARDS_INFO,
    ACCOUNTS_AND_POLICIES,
    answerTravelQuery
  };
});

