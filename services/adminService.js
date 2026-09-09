import User from '../models/User.js';
import Property from '../models/Property.js';
import Inquiry from '../models/Inquiry.js';
import Review from '../models/Review.js';
import Report from '../models/Report.js';
import Notification from '../models/Notification.js';
import { ApiError } from '../utils/apiError.js';
import { isDbConnected } from '../config/db.js';

// In-Memory store for complete local testing and demonstration
export const memoryStore = {
  users: new Map(),
  properties: new Map(),
  inquiries: new Map(),
  reviews: new Map(),
  reports: new Map(),
  notifications: new Map(),
  settings: {
    general: {
      platformName: 'TRUSTY Real Estate',
      logoUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=200&q=80',
      contactEmail: 'support@trustyestate.com',
      contactPhone: '+1 (800) 555-8787',
      currency: 'USD',
      supportHours: '24/7 Concierge Support',
    },
    properties: {
      allowedPropertyTypes: ['villa', 'penthouse', 'apartment', 'residential', 'commercial'],
      allowedListingTypes: ['sale', 'rent', 'lease'],
      requireNotarizedDeed: true,
      autoModerateFlaggedThreshold: 3,
      maxImagesPerListing: 20,
      featuredListingExpiryDays: 30,
    },
    users: {
      allowPublicRegistration: true,
      defaultUserRole: 'buyer',
      requireIdentityDocumentsForAgents: true,
      requireEmailVerification: true,
      autoSuspendSpamThreshold: 5,
    },
    notifications: {
      enablePlatformBroadcasts: true,
      enableEmailAlerts: true,
      sendWeeklyAgentDigest: true,
      notifyAdminOnNewReport: true,
      notifyOnViewingBooking: true,
    },
    security: {
      sessionTimeoutMinutes: 60,
      jwtExpiryDays: 7,
      enforceTwoFactorAuth: false,
      maxLoginAttempts: 5,
      lockoutDurationMinutes: 15,
    },
  },
};

// Seed realistic production-quality data across all domains
export const seedAdminData = () => {
  if (memoryStore.users.size > 0 && memoryStore.reports.size > 0) return;

  console.log('[Admin Seed] Seeding complete real estate administrative records...');

  // 1. USERS
  const sampleUsers = [
    {
      _id: 'usr_admin_1',
      id: 'usr_admin_1',
      firstName: 'Alexander',
      lastName: 'Sterling',
      email: 'admin@trustyestate.com',
      role: 'admin',
      phone: '+1 (555) 019-9000',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      location: { city: 'New York', state: 'NY', country: 'United States' },
      bio: 'TRUSTY Real Estate Chief Platform Administrator & Compliance Officer.',
      verificationStatus: 'verified',
      accountStatus: 'active',
      createdAt: new Date('2025-01-10').toISOString(),
    },
    {
      _id: 'usr_agency_1',
      id: 'usr_agency_1',
      firstName: 'Sotheby’s',
      lastName: 'International Realty',
      email: 'contact@sothebys-trusty.com',
      role: 'agency',
      phone: '+1 (212) 606-7000',
      profileImage: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=300&q=80',
      location: { address: '1334 York Avenue', city: 'New York', state: 'NY', country: 'United States', zipCode: '10021' },
      bio: 'Global leaders in luxury residential brokerage and verified portfolio management.',
      verificationStatus: 'verified',
      accountStatus: 'active',
      createdAt: new Date('2025-02-01').toISOString(),
    },
    {
      _id: 'usr_agency_2',
      id: 'usr_agency_2',
      firstName: 'The Agency',
      lastName: 'Beverly Hills',
      email: 'info@theagency-trusty.com',
      role: 'agency',
      phone: '+1 (424) 230-3700',
      profileImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=300&q=80',
      location: { address: '331 Foothill Rd', city: 'Beverly Hills', state: 'CA', country: 'United States', zipCode: '90210' },
      bio: 'Boutique luxury real estate brokerage representing world-class estates.',
      verificationStatus: 'pending',
      accountStatus: 'active',
      createdAt: new Date('2025-03-15').toISOString(),
    },
    {
      _id: 'usr_agent_1',
      id: 'usr_agent_1',
      firstName: 'Marcus',
      lastName: 'Vance',
      email: 'marcus.vance@trustyagents.com',
      role: 'agent',
      phone: '+1 (310) 555-0182',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      location: { city: 'Los Angeles', state: 'CA', country: 'United States' },
      bio: 'Top 1% luxury residential agent in Bel Air & Hollywood Hills with $400M+ career volume.',
      agencyId: 'usr_agency_2',
      verificationStatus: 'verified',
      accountStatus: 'active',
      createdAt: new Date('2025-02-10').toISOString(),
    },
    {
      _id: 'usr_agent_2',
      id: 'usr_agent_2',
      firstName: 'Elena',
      lastName: 'Rostova',
      email: 'elena.rostova@trustyagents.com',
      role: 'agent',
      phone: '+1 (305) 555-0199',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      location: { city: 'Miami', state: 'FL', country: 'United States' },
      bio: 'Specialist in Miami Beach waterfront villas, branded residences, and international buyers.',
      agencyId: 'usr_agency_1',
      verificationStatus: 'pending',
      accountStatus: 'active',
      createdAt: new Date('2025-04-05').toISOString(),
    },
    {
      _id: 'usr_owner_1',
      id: 'usr_owner_1',
      firstName: 'Harrison',
      lastName: 'Blackwood',
      email: 'harrison.blackwood@estateowners.com',
      role: 'owner',
      phone: '+1 (415) 555-0144',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
      location: { city: 'San Francisco', state: 'CA', country: 'United States' },
      bio: 'Private real estate investor with residential holdings in Miami, Manhattan, and Aspen.',
      verificationStatus: 'verified',
      accountStatus: 'active',
      createdAt: new Date('2025-01-20').toISOString(),
    },
    {
      _id: 'usr_buyer_1',
      id: 'usr_buyer_1',
      firstName: 'Sophia',
      lastName: 'Laurent',
      email: 'sophia.laurent@luxurybuyer.com',
      role: 'buyer',
      phone: '+1 (646) 555-0192',
      profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
      location: { city: 'New York', state: 'NY', country: 'United States' },
      bio: 'High-net-worth investor seeking luxury penthouses and coastal estates.',
      verificationStatus: 'verified',
      accountStatus: 'active',
      createdAt: new Date('2025-03-01').toISOString(),
    },
    {
      _id: 'usr_renter_1',
      id: 'usr_renter_1',
      firstName: 'Julian',
      lastName: 'Morales',
      email: 'julian.morales@techrenter.io',
      role: 'renter',
      phone: '+1 (786) 555-0133',
      profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
      location: { city: 'Austin', state: 'TX', country: 'United States' },
      bio: 'Executive looking for luxury high-rise rentals in major metropolitan tech hubs.',
      verificationStatus: 'unverified',
      accountStatus: 'active',
      createdAt: new Date('2025-04-12').toISOString(),
    },
  ];
  sampleUsers.forEach((u) => memoryStore.users.set(u._id, u));

  // 2. PROPERTIES
  const sampleProperties = [
    {
      _id: 'prop_1',
      id: 'prop_1',
      title: 'The Skyview TriBeCa Penthouse & Private Rooftop',
      description:
        'A magnificent duplex penthouse offering 360-degree skyline views over Manhattan and Hudson River. Features 4 private terraces, Italian marble fireplace, private key elevator, and bespoke temperature-controlled wine cellar.',
      price: 4850000,
      currency: 'USD',
      propertyType: 'penthouse',
      listingType: 'sale',
      location: {
        address: '142 Franklin Street, PH-A',
        city: 'New York',
        state: 'NY',
        country: 'United States',
        zipCode: '10013',
      },
      features: { bedrooms: 4, bathrooms: 4.5, areaSqFt: 4200, yearBuilt: 2021 },
      images: [
        { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', caption: 'Front Terrace View' },
        { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', caption: 'Great Room' },
      ],
      owner: 'usr_owner_1',
      agent: 'usr_agent_1',
      agency: 'usr_agency_1',
      status: 'available',
      verificationStatus: 'approved',
      rejectionReason: '',
      views: 1420,
      savedCount: 340,
      inquiriesCount: 18,
      viewingsCount: 6,
      reports: [],
      createdAt: new Date('2025-02-15').toISOString(),
    },
    {
      _id: 'prop_2',
      id: 'prop_2',
      title: 'Coconut Grove Waterfront Sanctuary with Private Dock',
      description:
        'Architectural masterpiece located in prime Coconut Grove with 120ft of water frontage, deep water yacht slip, infinity pool, custom Boffi kitchen, and seamless indoor-outdoor tropical entertaining terraces.',
      price: 3400000,
      currency: 'USD',
      propertyType: 'villa',
      listingType: 'sale',
      location: {
        address: '3840 Vista Lane',
        city: 'Miami',
        state: 'FL',
        country: 'United States',
        zipCode: '33133',
      },
      features: { bedrooms: 5, bathrooms: 6, areaSqFt: 5600, yearBuilt: 2023 },
      images: [
        { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80', caption: 'Pool & Waterway' },
      ],
      owner: 'usr_owner_1',
      agent: 'usr_agent_2',
      agency: 'usr_agency_1',
      status: 'available',
      verificationStatus: 'pending',
      rejectionReason: '',
      views: 890,
      savedCount: 215,
      inquiriesCount: 12,
      viewingsCount: 4,
      reports: [],
      createdAt: new Date('2025-03-28').toISOString(),
    },
    {
      _id: 'prop_3',
      id: 'prop_3',
      title: 'Modern Sunset Strip Luxury Villa with Panoramic Views',
      description:
        'Nestled high above Sunset Plaza, this cantilevered glass villa commands explosive vistas from Downtown Los Angeles to Catalina Island. Features automated smart home, zero-edge pool, and private cinema.',
      price: 6200000,
      currency: 'USD',
      propertyType: 'villa',
      listingType: 'sale',
      location: {
        address: '1842 Sunset Plaza Dr',
        city: 'Los Angeles',
        state: 'CA',
        country: 'United States',
        zipCode: '90069',
      },
      features: { bedrooms: 6, bathrooms: 7, areaSqFt: 7100, yearBuilt: 2022 },
      images: [
        { url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80', caption: 'Sunset Pool Deck' },
      ],
      owner: 'usr_owner_1',
      agent: 'usr_agent_1',
      agency: 'usr_agency_2',
      status: 'available',
      verificationStatus: 'approved',
      views: 2300,
      savedCount: 680,
      inquiriesCount: 29,
      viewingsCount: 11,
      reports: [],
      createdAt: new Date('2025-01-18').toISOString(),
    },
  ];
  sampleProperties.forEach((p) => memoryStore.properties.set(p._id, p));

  // 3. REPORTS
  const sampleReports = [
    {
      _id: 'rep_1',
      id: 'rep_1',
      reporter: 'usr_buyer_1',
      reporterName: 'Sophia Laurent',
      reporterEmail: 'sophia.laurent@luxurybuyer.com',
      property: 'prop_2',
      propertyTitle: 'Coconut Grove Waterfront Sanctuary with Private Dock',
      reportedUser: 'usr_owner_1',
      reportedUserName: 'Harrison Blackwood',
      reason: 'Incorrect information',
      details: 'The listed square footage states 5,600 sq ft, but county public records indicate 4,800 interior sq ft plus patio.',
      status: 'Investigating',
      resolutionNotes: 'Compliance team requested architect certified floor plans from listing agent.',
      actionTaken: 'none',
      createdAt: new Date('2025-04-10T14:20:00Z').toISOString(),
    },
    {
      _id: 'rep_2',
      id: 'rep_2',
      reporter: 'usr_renter_1',
      reporterName: 'Julian Morales',
      reporterEmail: 'julian.morales@techrenter.io',
      property: 'prop_1',
      propertyTitle: 'The Skyview TriBeCa Penthouse & Private Rooftop',
      reportedUser: 'usr_agent_1',
      reportedUserName: 'Marcus Vance',
      reason: 'Duplicate',
      details: 'Identical penthouse photography was syndicated on an external unauthorized classifieds website at a lower fake price.',
      status: 'Pending',
      resolutionNotes: '',
      actionTaken: 'none',
      createdAt: new Date('2025-04-18T09:15:00Z').toISOString(),
    },
    {
      _id: 'rep_3',
      id: 'rep_3',
      reporter: 'usr_buyer_1',
      reporterName: 'Sophia Laurent',
      reporterEmail: 'sophia.laurent@luxurybuyer.com',
      property: 'prop_3',
      propertyTitle: 'Modern Sunset Strip Luxury Villa with Panoramic Views',
      reportedUser: 'usr_owner_1',
      reportedUserName: 'Harrison Blackwood',
      reason: 'Fake listing',
      details: 'Inquired about escrow wire details and received an unverified offshore banking instruction.',
      status: 'Resolved',
      resolutionNotes: 'Escrow wiring instructions verified and authenticated with First American Title.',
      actionTaken: 'resolved',
      createdAt: new Date('2025-03-25T11:40:00Z').toISOString(),
    },
    {
      _id: 'rep_4',
      id: 'rep_4',
      reporter: 'usr_buyer_1',
      reporterName: 'Sophia Laurent',
      reporterEmail: 'sophia.laurent@luxurybuyer.com',
      property: 'prop_1',
      propertyTitle: 'The Skyview TriBeCa Penthouse & Private Rooftop',
      reportedUser: 'usr_agent_1',
      reportedUserName: 'Marcus Vance',
      reason: 'Inappropriate content',
      details: 'Unsolicited promotional marketing text was sent after viewing without prior opt-in consent.',
      status: 'Dismissed',
      resolutionNotes: 'User had checked notification consent box during tour booking.',
      actionTaken: 'dismissed',
      createdAt: new Date('2025-03-12T16:05:00Z').toISOString(),
    },
    {
      _id: 'rep_5',
      id: 'rep_5',
      reporter: 'usr_renter_1',
      reporterName: 'Julian Morales',
      reporterEmail: 'julian.morales@techrenter.io',
      property: 'prop_2',
      propertyTitle: 'Coconut Grove Waterfront Sanctuary with Private Dock',
      reportedUser: 'usr_owner_1',
      reportedUserName: 'Harrison Blackwood',
      reason: 'Scam',
      details: 'Claimed to be direct owner but title deed requires secondary family trust signatory.',
      status: 'Pending',
      resolutionNotes: '',
      actionTaken: 'none',
      createdAt: new Date('2025-04-22T08:30:00Z').toISOString(),
    },
  ];
  sampleReports.forEach((r) => memoryStore.reports.set(r._id, r));

  // 4. REVIEWS
  const sampleReviews = [
    {
      _id: 'rev_1',
      id: 'rev_1',
      targetUser: 'usr_agent_1',
      targetName: 'Marcus Vance (Agent)',
      author: 'usr_buyer_1',
      authorName: 'Sophia Laurent',
      authorEmail: 'sophia.laurent@luxurybuyer.com',
      rating: 5,
      comment: 'Marcus was exceptional! Negotiated our purchase in Bel Air with utmost discretion and verified title safety.',
      verifiedTransaction: true,
      isHidden: false,
      createdAt: new Date('2025-03-10').toISOString(),
    },
    {
      _id: 'rev_2',
      id: 'rev_2',
      targetUser: 'usr_agency_1',
      targetName: 'Sotheby’s International Realty (Agency)',
      author: 'usr_owner_1',
      authorName: 'Harrison Blackwood',
      authorEmail: 'harrison.blackwood@estateowners.com',
      rating: 5,
      comment: 'World-class marketing syndication. Our penthouse was presented to vetted European family offices in 72 hours.',
      verifiedTransaction: true,
      isHidden: false,
      createdAt: new Date('2025-03-22').toISOString(),
    },
    {
      _id: 'rev_3',
      id: 'rev_3',
      targetUser: 'usr_agent_2',
      targetName: 'Elena Rostova (Agent)',
      author: 'usr_renter_1',
      authorName: 'Julian Morales',
      authorEmail: 'julian.morales@techrenter.io',
      rating: 4,
      comment: 'Very knowledgeable about Miami waterfront zoning and dock permits. Highly recommended for international clients.',
      verifiedTransaction: true,
      isHidden: false,
      createdAt: new Date('2025-04-01').toISOString(),
    },
    {
      _id: 'rev_4',
      id: 'rev_4',
      targetUser: 'usr_agent_1',
      targetName: 'Marcus Vance (Agent)',
      author: 'usr_buyer_1',
      authorName: 'Anonymous Client',
      authorEmail: 'client@luxuryholding.com',
      rating: 2,
      comment: 'Closing took 10 days longer than original timeline due to third-party survey backlog.',
      verifiedTransaction: false,
      isHidden: true,
      createdAt: new Date('2025-02-18').toISOString(),
    },
    {
      _id: 'rev_5',
      id: 'rev_5',
      targetUser: 'usr_agency_2',
      targetName: 'The Agency Beverly Hills',
      author: 'usr_buyer_1',
      authorName: 'Sophia Laurent',
      authorEmail: 'sophia.laurent@luxurybuyer.com',
      rating: 5,
      comment: 'Top tier luxury experience from private chauffeur viewing to digital closing escrow.',
      verifiedTransaction: true,
      isHidden: false,
      createdAt: new Date('2025-04-15').toISOString(),
    },
  ];
  sampleReviews.forEach((r) => memoryStore.reviews.set(r._id, r));

  // 5. INQUIRIES & VIEWINGS
  const sampleInquiries = [
    {
      _id: 'inq_1',
      id: 'inq_1',
      property: 'prop_1',
      propertyTitle: 'The Skyview TriBeCa Penthouse & Private Rooftop',
      sender: 'usr_buyer_1',
      senderName: 'Sophia Laurent',
      senderEmail: 'sophia.laurent@luxurybuyer.com',
      senderPhone: '+1 (646) 555-0192',
      recipient: 'usr_agent_1',
      recipientName: 'Marcus Vance (Agent)',
      type: 'inquiry',
      status: 'New',
      message: 'Inquiring regarding property tax abatement history and private storage allocation for the TriBeCa duplex.',
      createdAt: new Date('2025-04-26T10:30:00Z').toISOString(),
    },
    {
      _id: 'inq_2',
      id: 'inq_2',
      property: 'prop_2',
      propertyTitle: 'Coconut Grove Waterfront Sanctuary with Private Dock',
      sender: 'usr_buyer_1',
      senderName: 'Sophia Laurent',
      senderEmail: 'sophia.laurent@luxurybuyer.com',
      senderPhone: '+1 (646) 555-0192',
      recipient: 'usr_agent_2',
      recipientName: 'Elena Rostova (Agent)',
      type: 'inquiry',
      status: 'Contacted',
      message: 'Can the private dock accommodate a 90ft motor yacht at low tide? Requesting coastal bathymetry map.',
      createdAt: new Date('2025-04-20T16:00:00Z').toISOString(),
    },
    {
      _id: 'inq_3',
      id: 'inq_3',
      property: 'prop_3',
      propertyTitle: 'Modern Sunset Strip Luxury Villa with Panoramic Views',
      sender: 'usr_buyer_1',
      senderName: 'Sophia Laurent',
      senderEmail: 'sophia.laurent@luxurybuyer.com',
      senderPhone: '+1 (646) 555-0192',
      recipient: 'usr_agent_1',
      recipientName: 'Marcus Vance (Agent)',
      type: 'viewing_request',
      status: 'Viewing Scheduled',
      message: 'Confirmed VIP sunset walkthrough with principal buyer this upcoming Saturday.',
      createdAt: new Date('2025-04-15T12:00:00Z').toISOString(),
    },
    {
      _id: 'inq_4',
      id: 'inq_4',
      property: 'prop_1',
      propertyTitle: 'The Skyview TriBeCa Penthouse & Private Rooftop',
      sender: 'usr_buyer_1',
      senderName: 'Sophia Laurent',
      senderEmail: 'sophia.laurent@luxurybuyer.com',
      senderPhone: '+1 (646) 555-0192',
      recipient: 'usr_agent_1',
      recipientName: 'Marcus Vance (Agent)',
      type: 'inquiry',
      status: 'Interested',
      message: 'Buyer attorney is reviewing preliminary offering plan and building house rules.',
      createdAt: new Date('2025-04-05T14:45:00Z').toISOString(),
    },
    {
      _id: 'inq_5',
      id: 'inq_5',
      property: 'prop_2',
      propertyTitle: 'Coconut Grove Waterfront Sanctuary with Private Dock',
      sender: 'usr_renter_1',
      senderName: 'Julian Morales',
      senderEmail: 'julian.morales@techrenter.io',
      senderPhone: '+1 (786) 555-0133',
      recipient: 'usr_agent_2',
      recipientName: 'Elena Rostova (Agent)',
      type: 'inquiry',
      status: 'Closed',
      message: 'Completed seasonal lease contract agreement. Escrow deposit received and confirmed.',
      createdAt: new Date('2025-03-10T11:15:00Z').toISOString(),
    },
  ];
  sampleInquiries.forEach((i) => memoryStore.inquiries.set(i._id, i));

  // Viewings
  const sampleViewings = [
    {
      _id: 'view_1',
      id: 'view_1',
      property: 'prop_1',
      propertyTitle: 'The Skyview TriBeCa Penthouse & Private Rooftop',
      customer: 'usr_buyer_1',
      customerName: 'Sophia Laurent',
      customerEmail: 'sophia.laurent@luxurybuyer.com',
      customerPhone: '+1 (646) 555-0192',
      agent: 'usr_agent_1',
      agentName: 'Marcus Vance',
      agentEmail: 'marcus.vance@trustyagents.com',
      date: '2025-05-10',
      time: '03:00 PM',
      status: 'Scheduled',
      notes: 'VIP client arriving via private car. Please have rooftop terrace unlocked.',
      createdAt: new Date('2025-04-20').toISOString(),
    },
    {
      _id: 'view_2',
      id: 'view_2',
      property: 'prop_2',
      propertyTitle: 'Coconut Grove Waterfront Sanctuary with Private Dock',
      customer: 'usr_renter_1',
      customerName: 'Julian Morales',
      customerEmail: 'julian.morales@techrenter.io',
      customerPhone: '+1 (786) 555-0133',
      agent: 'usr_agent_2',
      agentName: 'Elena Rostova',
      agentEmail: 'elena.rostova@trustyagents.com',
      date: '2025-05-14',
      time: '11:30 AM',
      status: 'Scheduled',
      notes: 'Dock and boat lift inspection requested during tour.',
      createdAt: new Date('2025-04-22').toISOString(),
    },
    {
      _id: 'view_3',
      id: 'view_3',
      property: 'prop_3',
      propertyTitle: 'Modern Sunset Strip Luxury Villa with Panoramic Views',
      customer: 'usr_buyer_1',
      customerName: 'Sophia Laurent',
      customerEmail: 'sophia.laurent@luxurybuyer.com',
      customerPhone: '+1 (646) 555-0192',
      agent: 'usr_agent_1',
      agentName: 'Marcus Vance',
      agentEmail: 'marcus.vance@trustyagents.com',
      date: '2025-04-28',
      time: '05:30 PM',
      status: 'Completed',
      notes: 'Sunset viewing completed. Formal LOI anticipated.',
      createdAt: new Date('2025-04-12').toISOString(),
    },
    {
      _id: 'view_4',
      id: 'view_4',
      property: 'prop_1',
      propertyTitle: 'The Skyview TriBeCa Penthouse & Private Rooftop',
      customer: 'usr_renter_1',
      customerName: 'Julian Morales',
      customerEmail: 'julian.morales@techrenter.io',
      customerPhone: '+1 (786) 555-0133',
      agent: 'usr_agent_1',
      agentName: 'Marcus Vance',
      agentEmail: 'marcus.vance@trustyagents.com',
      date: '2025-04-02',
      time: '01:00 PM',
      status: 'Cancelled',
      notes: 'Customer rescheduled flight to New York due to weather.',
      createdAt: new Date('2025-03-28').toISOString(),
    },
  ];
  sampleViewings.forEach((v) => memoryStore.inquiries.set(v._id, v));

  // Notifications
  const sampleNotifications = [
    {
      _id: 'notif_1',
      id: 'notif_1',
      title: 'Platform AML & Title Verification Standards Update',
      message: 'All licensed agents and brokerage agencies must complete updated annual AML verification by June 1st.',
      type: 'compliance',
      targetAudience: 'all',
      isRead: false,
      priority: 'high',
      createdBy: 'Chief Compliance Officer',
      createdAt: new Date('2025-04-24T09:00:00Z').toISOString(),
    },
    {
      _id: 'notif_2',
      id: 'notif_2',
      title: 'New MLS Syndication Portal Launched',
      message: 'Direct API syndication with international European portals is now active for all verified brokerages.',
      type: 'announcement',
      targetAudience: 'agencies',
      isRead: false,
      priority: 'normal',
      createdBy: 'TRUSTY Product Engineering',
      createdAt: new Date('2025-04-20T14:30:00Z').toISOString(),
    },
    {
      _id: 'notif_3',
      id: 'notif_3',
      title: 'High-Intent Client Lead Routing Active',
      message: 'Agents in Beverly Hills and Manhattan will now receive pre-screened crypto and cash buyer matches.',
      type: 'alert',
      targetAudience: 'agents',
      isRead: true,
      priority: 'normal',
      createdBy: 'TRUSTY Agent Network',
      createdAt: new Date('2025-04-15T11:00:00Z').toISOString(),
    },
  ];
  sampleNotifications.forEach((n) => memoryStore.notifications.set(n._id, n));

  console.log('✅ [Admin Seed] Full dataset seeded successfully.');
};

// Seed on module load
seedAdminData();

export class AdminService {
  // ==================== USER MANAGEMENT ====================
  static async getUsers({ page = 1, limit = 10, search = '', role = '', status = '', sortBy = 'createdAt', sortOrder = 'desc' }) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    let users = Array.from(memoryStore.users.values());

    if (search) {
      const q = search.toLowerCase();
      users = users.filter(
        (u) =>
          u.firstName.toLowerCase().includes(q) ||
          u.lastName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.phone && u.phone.toLowerCase().includes(q))
      );
    }

    if (role && role !== 'all') {
      users = users.filter((u) => u.role.toLowerCase() === role.toLowerCase());
    }

    if (status && status !== 'all') {
      users = users.filter((u) => u.accountStatus.toLowerCase() === status.toLowerCase());
    }

    users.sort((a, b) => {
      if (sortOrder === 'asc') return (a[sortBy] || '') > (b[sortBy] || '') ? 1 : -1;
      return (a[sortBy] || '') < (b[sortBy] || '') ? 1 : -1;
    });

    const total = users.length;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = users.slice(startIndex, startIndex + limitNum);

    return {
      users: paginated,
      pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) || 1 },
    };
  }

  static async getUserById(userId) {
    const user = memoryStore.users.get(userId);
    if (!user) throw ApiError.notFound(`User with ID ${userId} not found`);

    const userProperties = Array.from(memoryStore.properties.values()).filter(
      (p) => p.owner === userId || p.agent === userId || p.agency === userId
    );
    const userInquiries = Array.from(memoryStore.inquiries.values()).filter(
      (i) => i.sender === userId || i.user === userId || i.recipient === userId || i.agent === userId
    );
    const userViewings = userInquiries.filter((i) => i.date || i.type === 'viewing_request');

    return { user, properties: userProperties, inquiries: userInquiries, viewings: userViewings };
  }

  static async updateUserStatus(userId, status) {
    const user = memoryStore.users.get(userId);
    if (!user) throw ApiError.notFound(`User with ID ${userId} not found`);

    if (!['active', 'suspended', 'deactivated'].includes(status)) {
      throw ApiError.badRequest('Invalid status. Allowed: active, suspended, deactivated');
    }

    user.accountStatus = status;
    user.updatedAt = new Date().toISOString();
    memoryStore.users.set(userId, user);
    return user;
  }

  static async deleteUser(userId) {
    const user = memoryStore.users.get(userId);
    if (!user) throw ApiError.notFound(`User with ID ${userId} not found`);

    memoryStore.users.delete(userId);
    return { success: true, message: `User ${user.email} has been deleted successfully` };
  }

  // ==================== PROPERTY MANAGEMENT & MODERATION ====================
  static async getProperties({ page = 1, limit = 10, search = '', status = '', verificationStatus = '', propertyType = '' }) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    let properties = Array.from(memoryStore.properties.values());

    if (search) {
      const q = search.toLowerCase();
      properties = properties.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.city.toLowerCase().includes(q) ||
          p.location.address.toLowerCase().includes(q)
      );
    }

    if (status && status !== 'all') {
      properties = properties.filter((p) => p.status.toLowerCase() === status.toLowerCase());
    }

    if (verificationStatus && verificationStatus !== 'all') {
      properties = properties.filter((p) => p.verificationStatus.toLowerCase() === verificationStatus.toLowerCase());
    }

    if (propertyType && propertyType !== 'all') {
      properties = properties.filter((p) => p.propertyType.toLowerCase() === propertyType.toLowerCase());
    }

    const enriched = properties.map((p) => {
      const ownerObj = memoryStore.users.get(p.owner);
      const agentObj = memoryStore.users.get(p.agent);
      const agencyObj = memoryStore.users.get(p.agency);
      return {
        ...p,
        ownerDetails: ownerObj ? { name: `${ownerObj.firstName} ${ownerObj.lastName}`, email: ownerObj.email } : null,
        agentDetails: agentObj ? { name: `${agentObj.firstName} ${agentObj.lastName}`, email: agentObj.email } : null,
        agencyDetails: agencyObj ? { name: `${agencyObj.firstName} ${agencyObj.lastName}`, email: agencyObj.email } : null,
      };
    });

    const total = enriched.length;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = enriched.slice(startIndex, startIndex + limitNum);

    return {
      properties: paginated,
      pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) || 1 },
    };
  }

  static async getPropertyById(propertyId) {
    const property = memoryStore.properties.get(propertyId);
    if (!property) throw ApiError.notFound(`Property with ID ${propertyId} not found`);

    const ownerObj = memoryStore.users.get(property.owner);
    const agentObj = memoryStore.users.get(property.agent);
    const agencyObj = memoryStore.users.get(property.agency);

    return {
      ...property,
      ownerDetails: ownerObj || null,
      agentDetails: agentObj || null,
      agencyDetails: agencyObj || null,
    };
  }

  static async updatePropertyVerification(propertyId, { verificationStatus, rejectionReason = '' }) {
    const property = memoryStore.properties.get(propertyId);
    if (!property) throw ApiError.notFound(`Property with ID ${propertyId} not found`);

    if (!['approved', 'rejected', 'pending', 'unverified'].includes(verificationStatus)) {
      throw ApiError.badRequest('Invalid verificationStatus. Allowed: approved, rejected, pending, unverified');
    }

    if (verificationStatus === 'rejected' && (!rejectionReason || !rejectionReason.trim())) {
      throw ApiError.badRequest('When rejecting a property, a valid rejection reason is required.');
    }

    property.verificationStatus = verificationStatus;
    property.rejectionReason = verificationStatus === 'rejected' ? rejectionReason : '';
    property.updatedAt = new Date().toISOString();
    memoryStore.properties.set(propertyId, property);

    return property;
  }

  static async updatePropertyStatus(propertyId, status) {
    const property = memoryStore.properties.get(propertyId);
    if (!property) throw ApiError.notFound(`Property with ID ${propertyId} not found`);

    if (!['available', 'pending', 'sold', 'rented', 'suspended'].includes(status)) {
      throw ApiError.badRequest('Invalid property status. Allowed: available, pending, sold, rented, suspended');
    }

    property.status = status;
    property.updatedAt = new Date().toISOString();
    memoryStore.properties.set(propertyId, property);
    return property;
  }

  static async deleteProperty(propertyId) {
    const property = memoryStore.properties.get(propertyId);
    if (!property) throw ApiError.notFound(`Property with ID ${propertyId} not found`);

    memoryStore.properties.delete(propertyId);
    return { success: true, message: `Property '${property.title}' has been deleted successfully.` };
  }

  // ==================== AGENTS & AGENCIES ====================
  static async getAgents({ page = 1, limit = 10, search = '', verificationStatus = '', accountStatus = '' }) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    let agents = Array.from(memoryStore.users.values()).filter((u) => u.role === 'agent');

    if (search) {
      const q = search.toLowerCase();
      agents = agents.filter((a) => a.firstName.toLowerCase().includes(q) || a.lastName.toLowerCase().includes(q) || a.email.toLowerCase().includes(q));
    }

    if (verificationStatus && verificationStatus !== 'all') {
      agents = agents.filter((a) => a.verificationStatus.toLowerCase() === verificationStatus.toLowerCase());
    }

    if (accountStatus && accountStatus !== 'all') {
      agents = agents.filter((a) => a.accountStatus.toLowerCase() === accountStatus.toLowerCase());
    }

    const enriched = agents.map((a) => {
      const properties = Array.from(memoryStore.properties.values()).filter((p) => p.agent === a._id);
      const reviews = Array.from(memoryStore.reviews.values()).filter((r) => r.targetUser === a._id);
      const agencyObj = a.agencyId ? memoryStore.users.get(a.agencyId) : null;
      return {
        ...a,
        propertiesCount: properties.length,
        reviewsCount: reviews.length,
        averageRating: reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '5.0',
        agencyName: agencyObj ? `${agencyObj.firstName} ${agencyObj.lastName}` : 'Independent Agent',
      };
    });

    const total = enriched.length;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = enriched.slice(startIndex, startIndex + limitNum);

    return {
      agents: paginated,
      pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) || 1 },
    };
  }

  static async getAgentById(agentId) {
    const agent = memoryStore.users.get(agentId);
    if (!agent || agent.role !== 'agent') throw ApiError.notFound(`Agent with ID ${agentId} not found`);

    const properties = Array.from(memoryStore.properties.values()).filter((p) => p.agent === agentId);
    const reviews = Array.from(memoryStore.reviews.values()).filter((r) => r.targetUser === agentId);
    const inquiries = Array.from(memoryStore.inquiries.values()).filter((i) => i.recipient === agentId || i.agent === agentId);
    const agencyObj = agent.agencyId ? memoryStore.users.get(agent.agencyId) : null;

    return { agent, agency: agencyObj || null, properties, reviews, inquiries };
  }

  static async updateAgentVerification(agentId, verificationStatus) {
    const agent = memoryStore.users.get(agentId);
    if (!agent || agent.role !== 'agent') throw ApiError.notFound(`Agent with ID ${agentId} not found`);

    agent.verificationStatus = verificationStatus;
    agent.updatedAt = new Date().toISOString();
    memoryStore.users.set(agentId, agent);
    return agent;
  }

  static async updateAgentStatus(agentId, status) {
    const agent = memoryStore.users.get(agentId);
    if (!agent || agent.role !== 'agent') throw ApiError.notFound(`Agent with ID ${agentId} not found`);

    agent.accountStatus = status;
    agent.updatedAt = new Date().toISOString();
    memoryStore.users.set(agentId, agent);
    return agent;
  }

  static async getAgencies({ page = 1, limit = 10, search = '', verificationStatus = '', accountStatus = '' }) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    let agencies = Array.from(memoryStore.users.values()).filter((u) => u.role === 'agency');

    if (search) {
      const q = search.toLowerCase();
      agencies = agencies.filter((a) => a.firstName.toLowerCase().includes(q) || a.lastName.toLowerCase().includes(q) || a.email.toLowerCase().includes(q));
    }

    if (verificationStatus && verificationStatus !== 'all') {
      agencies = agencies.filter((a) => a.verificationStatus.toLowerCase() === verificationStatus.toLowerCase());
    }

    if (accountStatus && accountStatus !== 'all') {
      agencies = agencies.filter((a) => a.accountStatus.toLowerCase() === accountStatus.toLowerCase());
    }

    const enriched = agencies.map((ag) => {
      const agents = Array.from(memoryStore.users.values()).filter((u) => u.agencyId === ag._id);
      const properties = Array.from(memoryStore.properties.values()).filter((p) => p.agency === ag._id);
      const reviews = Array.from(memoryStore.reviews.values()).filter((r) => r.targetUser === ag._id);
      return {
        ...ag,
        agentsCount: agents.length,
        propertiesCount: properties.length,
        reviewsCount: reviews.length,
        averageRating: reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '5.0',
      };
    });

    const total = enriched.length;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = enriched.slice(startIndex, startIndex + limitNum);

    return {
      agencies: paginated,
      pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) || 1 },
    };
  }

  static async getAgencyById(agencyId) {
    const agency = memoryStore.users.get(agencyId);
    if (!agency || agency.role !== 'agency') throw ApiError.notFound(`Agency with ID ${agencyId} not found`);

    const agents = Array.from(memoryStore.users.values()).filter((u) => u.agencyId === agencyId);
    const properties = Array.from(memoryStore.properties.values()).filter((p) => p.agency === agencyId);
    const reviews = Array.from(memoryStore.reviews.values()).filter((r) => r.targetUser === agencyId);

    return { agency, agents, properties, reviews };
  }

  static async updateAgencyVerification(agencyId, verificationStatus) {
    const agency = memoryStore.users.get(agencyId);
    if (!agency || agency.role !== 'agency') throw ApiError.notFound(`Agency with ID ${agencyId} not found`);

    agency.verificationStatus = verificationStatus;
    agency.updatedAt = new Date().toISOString();
    memoryStore.users.set(agencyId, agency);
    return agency;
  }

  static async updateAgencyStatus(agencyId, status) {
    const agency = memoryStore.users.get(agencyId);
    if (!agency || agency.role !== 'agency') throw ApiError.notFound(`Agency with ID ${agencyId} not found`);

    agency.accountStatus = status;
    agency.updatedAt = new Date().toISOString();
    memoryStore.users.set(agencyId, agency);
    return agency;
  }

  // ==================== REPORTS & COMPLIANCE ====================
  static async getReports({ page = 1, limit = 10, status = '', reason = '', search = '' }) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    let reports = Array.from(memoryStore.reports.values());

    if (search) {
      const q = search.toLowerCase();
      reports = reports.filter(
        (r) =>
          r.reporterName.toLowerCase().includes(q) ||
          r.reporterEmail.toLowerCase().includes(q) ||
          r.propertyTitle.toLowerCase().includes(q) ||
          r.reportedUserName.toLowerCase().includes(q) ||
          r.details.toLowerCase().includes(q)
      );
    }

    if (status && status !== 'all') {
      reports = reports.filter((r) => r.status.toLowerCase() === status.toLowerCase());
    }

    if (reason && reason !== 'all') {
      reports = reports.filter((r) => r.reason.toLowerCase() === reason.toLowerCase());
    }

    reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = reports.length;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = reports.slice(startIndex, startIndex + limitNum);

    return {
      reports: paginated,
      pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) || 1 },
    };
  }

  static async updateReportStatus(reportId, { status, resolutionNotes = '' }) {
    const report = memoryStore.reports.get(reportId);
    if (!report) throw ApiError.notFound(`Report with ID ${reportId} not found`);

    if (!['Pending', 'Investigating', 'Resolved', 'Dismissed'].includes(status)) {
      throw ApiError.badRequest('Invalid status. Allowed: Pending, Investigating, Resolved, Dismissed');
    }

    report.status = status;
    if (resolutionNotes) report.resolutionNotes = resolutionNotes;
    report.updatedAt = new Date().toISOString();
    memoryStore.reports.set(reportId, report);

    return report;
  }

  static async resolveReportAction(reportId, { action, reason = '' }) {
    const report = memoryStore.reports.get(reportId);
    if (!report) throw ApiError.notFound(`Report with ID ${reportId} not found`);

    switch (action) {
      case 'investigate':
        report.status = 'Investigating';
        report.actionTaken = 'investigating';
        break;
      case 'resolve':
        report.status = 'Resolved';
        report.actionTaken = 'resolved';
        break;
      case 'dismiss':
        report.status = 'Dismissed';
        report.actionTaken = 'dismissed';
        break;
      case 'remove_property':
        if (report.property && memoryStore.properties.has(report.property)) {
          memoryStore.properties.delete(report.property);
        }
        report.status = 'Resolved';
        report.actionTaken = 'property_removed';
        report.resolutionNotes = reason || 'Property removed from marketplace due to verified compliance violation.';
        break;
      case 'suspend_user':
        if (report.reportedUser && memoryStore.users.has(report.reportedUser)) {
          const user = memoryStore.users.get(report.reportedUser);
          user.accountStatus = 'suspended';
          memoryStore.users.set(report.reportedUser, user);
        }
        report.status = 'Resolved';
        report.actionTaken = 'user_suspended';
        report.resolutionNotes = reason || 'Reported user account suspended after compliance review.';
        break;
      default:
        throw ApiError.badRequest('Invalid action specified');
    }

    report.updatedAt = new Date().toISOString();
    memoryStore.reports.set(reportId, report);
    return report;
  }

  // ==================== REVIEWS MODERATION ====================
  static async getReviews({ page = 1, limit = 10, rating = '', isHidden = '', search = '' }) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    let reviews = Array.from(memoryStore.reviews.values());

    if (search) {
      const q = search.toLowerCase();
      reviews = reviews.filter(
        (r) =>
          r.authorName.toLowerCase().includes(q) ||
          r.authorEmail.toLowerCase().includes(q) ||
          r.targetName.toLowerCase().includes(q) ||
          r.comment.toLowerCase().includes(q)
      );
    }

    if (rating && rating !== 'all') {
      reviews = reviews.filter((r) => r.rating === parseInt(rating, 10));
    }

    if (isHidden && isHidden !== 'all') {
      const hiddenBool = isHidden === 'true';
      reviews = reviews.filter((r) => r.isHidden === hiddenBool);
    }

    reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = reviews.length;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = reviews.slice(startIndex, startIndex + limitNum);

    return {
      reviews: paginated,
      pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) || 1 },
    };
  }

  static async updateReviewVisibility(reviewId, isHidden) {
    const review = memoryStore.reviews.get(reviewId);
    if (!review) throw ApiError.notFound(`Review with ID ${reviewId} not found`);

    review.isHidden = Boolean(isHidden);
    review.updatedAt = new Date().toISOString();
    memoryStore.reviews.set(reviewId, review);

    return review;
  }

  static async deleteReview(reviewId) {
    const review = memoryStore.reviews.get(reviewId);
    if (!review) throw ApiError.notFound(`Review with ID ${reviewId} not found`);

    memoryStore.reviews.delete(reviewId);
    return { success: true, message: 'Review has been permanently deleted.' };
  }

  // ==================== CUSTOMER INQUIRIES ====================
  static async getInquiries({ page = 1, limit = 10, status = '', search = '' }) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    let inquiries = Array.from(memoryStore.inquiries.values()).filter((i) => !i.date || i.status);

    if (search) {
      const q = search.toLowerCase();
      inquiries = inquiries.filter(
        (i) =>
          (i.propertyTitle && i.propertyTitle.toLowerCase().includes(q)) ||
          (i.senderName && i.senderName.toLowerCase().includes(q)) ||
          (i.customerName && i.customerName.toLowerCase().includes(q)) ||
          (i.recipientName && i.recipientName.toLowerCase().includes(q)) ||
          (i.message && i.message.toLowerCase().includes(q))
      );
    }

    if (status && status !== 'all') {
      inquiries = inquiries.filter((i) => i.status?.toLowerCase() === status.toLowerCase());
    }

    inquiries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = inquiries.length;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = inquiries.slice(startIndex, startIndex + limitNum);

    return {
      inquiries: paginated,
      pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) || 1 },
    };
  }

  static async updateInquiryStatus(inquiryId, status) {
    const inq = memoryStore.inquiries.get(inquiryId);
    if (!inq) throw ApiError.notFound(`Inquiry with ID ${inquiryId} not found`);

    if (!['New', 'Contacted', 'Viewing Scheduled', 'Interested', 'Closed', 'pending', 'scheduled', 'completed', 'cancelled'].includes(status)) {
      throw ApiError.badRequest('Invalid inquiry status');
    }

    inq.status = status;
    inq.updatedAt = new Date().toISOString();
    memoryStore.inquiries.set(inquiryId, inq);

    return inq;
  }

  // ==================== VIEWING REQUESTS ====================
  static async getViewings({ page = 1, limit = 10, status = '', search = '' }) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    let viewings = Array.from(memoryStore.inquiries.values()).filter((i) => i.date || i.customerName || i.type === 'viewing_request');

    if (search) {
      const q = search.toLowerCase();
      viewings = viewings.filter(
        (v) =>
          (v.propertyTitle && v.propertyTitle.toLowerCase().includes(q)) ||
          (v.customerName && v.customerName.toLowerCase().includes(q)) ||
          (v.agentName && v.agentName.toLowerCase().includes(q)) ||
          (v.notes && v.notes.toLowerCase().includes(q))
      );
    }

    if (status && status !== 'all') {
      viewings = viewings.filter((v) => v.status?.toLowerCase() === status.toLowerCase());
    }

    viewings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = viewings.length;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = viewings.slice(startIndex, startIndex + limitNum);

    return {
      viewings: paginated,
      pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) || 1 },
    };
  }

  static async updateViewingStatus(viewingId, status) {
    const viewing = memoryStore.inquiries.get(viewingId);
    if (!viewing) throw ApiError.notFound(`Viewing with ID ${viewingId} not found`);

    if (!['Scheduled', 'Completed', 'Cancelled', 'Rescheduled'].includes(status)) {
      throw ApiError.badRequest('Invalid viewing status. Allowed: Scheduled, Completed, Cancelled, Rescheduled');
    }

    viewing.status = status;
    viewing.updatedAt = new Date().toISOString();
    memoryStore.inquiries.set(viewingId, viewing);

    return viewing;
  }

  static async rescheduleViewing(viewingId, { date, time, notes = '' }) {
    const viewing = memoryStore.inquiries.get(viewingId);
    if (!viewing) throw ApiError.notFound(`Viewing with ID ${viewingId} not found`);

    if (!date) throw ApiError.badRequest('New appointment date is required');

    viewing.date = date;
    if (time) viewing.time = time;
    if (notes) viewing.notes = notes;
    viewing.status = 'Scheduled';
    viewing.updatedAt = new Date().toISOString();
    memoryStore.inquiries.set(viewingId, viewing);

    return viewing;
  }

  // ==================== ADMIN NOTIFICATIONS ====================
  static async getNotifications({ page = 1, limit = 10, targetAudience = '', type = '' }) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    let notifications = Array.from(memoryStore.notifications.values());

    if (targetAudience && targetAudience !== 'all') {
      notifications = notifications.filter((n) => n.targetAudience === targetAudience);
    }

    if (type && type !== 'all') {
      notifications = notifications.filter((n) => n.type === type);
    }

    notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = notifications.length;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = notifications.slice(startIndex, startIndex + limitNum);

    return {
      notifications: paginated,
      pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) || 1 },
    };
  }

  static async sendAnnouncement({ title, message, targetAudience = 'all', type = 'announcement', priority = 'normal', recipientId = null, recipientName = '' }) {
    if (!title || !message) {
      throw ApiError.badRequest('Notification title and message are required');
    }

    const notifId = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newNotification = {
      _id: notifId,
      id: notifId,
      title,
      message,
      targetAudience,
      type,
      priority,
      recipient: recipientId || null,
      recipientName: recipientName || (targetAudience === 'all' ? 'All Platform Users' : targetAudience.toUpperCase()),
      isRead: false,
      createdBy: 'TRUSTY Administrator',
      createdAt: new Date().toISOString(),
    };

    memoryStore.notifications.set(notifId, newNotification);
    return newNotification;
  }

  static async markNotificationRead(notificationId) {
    const notif = memoryStore.notifications.get(notificationId);
    if (!notif) throw ApiError.notFound(`Notification with ID ${notificationId} not found`);

    notif.isRead = true;
    memoryStore.notifications.set(notificationId, notif);
    return notif;
  }

  // ==================== 1. ANALYTICS METRICS AGGREGATION ====================
  static async getAnalyticsSummary() {
    const allUsers = Array.from(memoryStore.users.values());
    const allProperties = Array.from(memoryStore.properties.values());
    const allInquiries = Array.from(memoryStore.inquiries.values());
    const allReviews = Array.from(memoryStore.reviews.values());
    const allViewings = allInquiries.filter((i) => i.date || i.type === 'viewing_request');

    // 1. User Analytics
    const totalUsers = allUsers.length;
    const activeUsers = allUsers.filter((u) => u.accountStatus === 'active').length;
    const newUsers = allUsers.filter((u) => {
      const created = new Date(u.createdAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 60);
      return created >= thirtyDaysAgo;
    }).length;

    const usersByRole = {
      buyer: allUsers.filter((u) => u.role === 'buyer').length,
      renter: allUsers.filter((u) => u.role === 'renter').length,
      owner: allUsers.filter((u) => u.role === 'owner').length,
      agent: allUsers.filter((u) => u.role === 'agent').length,
      agency: allUsers.filter((u) => u.role === 'agency').length,
      admin: allUsers.filter((u) => u.role === 'admin').length,
    };

    const userGrowth = [
      { month: 'Jan', count: 12 },
      { month: 'Feb', count: 28 },
      { month: 'Mar', count: 45 },
      { month: 'Apr', count: 68 },
      { month: 'May', count: 94 },
      { month: 'Jun', count: 130 },
    ];

    // 2. Property Analytics
    const totalProperties = allProperties.length;
    const newProperties = allProperties.filter((p) => p.status === 'available').length;
    const propertiesByType = {
      villa: allProperties.filter((p) => p.propertyType === 'villa').length,
      penthouse: allProperties.filter((p) => p.propertyType === 'penthouse').length,
      apartment: allProperties.filter((p) => p.propertyType === 'apartment').length,
      residential: allProperties.filter((p) => p.propertyType === 'residential').length,
    };

    const propertiesByListingType = {
      sale: allProperties.filter((p) => p.listingType === 'sale').length,
      rent: allProperties.filter((p) => p.listingType === 'rent').length,
      lease: allProperties.filter((p) => p.listingType === 'lease').length,
    };

    const propertiesByLocation = {
      'New York': allProperties.filter((p) => p.location?.city === 'New York').length,
      'Miami': allProperties.filter((p) => p.location?.city === 'Miami').length,
      'Los Angeles': allProperties.filter((p) => p.location?.city === 'Los Angeles').length,
      'Other': allProperties.filter((p) => !['New York', 'Miami', 'Los Angeles'].includes(p.location?.city)).length,
    };

    const avgPropertyPrice = allProperties.length
      ? Math.round(allProperties.reduce((acc, p) => acc + (p.price || 0), 0) / allProperties.length)
      : 4800000;

    const mostViewedProperties = [...allProperties]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5)
      .map((p) => ({
        id: p._id,
        title: p.title,
        price: p.price,
        views: p.views || 0,
        city: p.location?.city,
        image: p.images?.[0]?.url,
      }));

    const mostSavedProperties = [...allProperties]
      .sort((a, b) => (b.savedCount || 0) - (a.savedCount || 0))
      .slice(0, 5)
      .map((p) => ({
        id: p._id,
        title: p.title,
        price: p.price,
        savedCount: p.savedCount || 120,
        city: p.location?.city,
        image: p.images?.[0]?.url,
      }));

    // 3. Lead & Inquiry Analytics
    const totalInquiries = allInquiries.length;
    const closedInquiries = allInquiries.filter((i) => i.status === 'Closed' || i.status === 'Interested').length;
    const inquiryConversionRate = totalInquiries ? Math.round((closedInquiries / totalInquiries) * 100) : 38;
    const totalViewings = allViewings.length;
    const completedViewings = allViewings.filter((v) => v.status === 'Completed').length;
    const cancelledViewings = allViewings.filter((v) => v.status === 'Cancelled').length;

    // 4. Agent Analytics
    const allAgents = allUsers.filter((u) => u.role === 'agent');
    const mostActiveAgents = allAgents.map((ag) => {
      const agentProps = allProperties.filter((p) => p.agent === ag._id);
      const agentInqs = allInquiries.filter((i) => i.recipient === ag._id || i.agent === ag._id);
      const agentRevs = allReviews.filter((r) => r.targetUser === ag._id);
      const avgRating = agentRevs.length ? (agentRevs.reduce((s, r) => s + r.rating, 0) / agentRevs.length).toFixed(1) : '5.0';
      return {
        id: ag._id,
        name: `${ag.firstName} ${ag.lastName}`,
        email: ag.email,
        profileImage: ag.profileImage,
        listingsCount: agentProps.length,
        inquiriesCount: agentInqs.length,
        rating: avgRating,
        verificationStatus: ag.verificationStatus,
      };
    });

    return {
      userAnalytics: {
        totalUsers,
        newUsers,
        activeUsers,
        usersByRole,
        userGrowth,
      },
      propertyAnalytics: {
        totalProperties,
        newProperties,
        propertiesByType,
        propertiesByListingType,
        propertiesByLocation,
        avgPropertyPrice,
        mostViewedProperties,
        mostSavedProperties,
      },
      leadAnalytics: {
        totalInquiries,
        inquiryConversionRate,
        viewingRequests: totalViewings,
        completedViewings,
        cancelledViewings,
      },
      agentAnalytics: {
        mostActiveAgents,
      },
    };
  }

  // ==================== 2. PLATFORM SETTINGS ====================
  static async getSettings() {
    return memoryStore.settings;
  }

  static async updateSettings(section, payload) {
    if (!section || !memoryStore.settings[section]) {
      throw ApiError.badRequest(`Invalid settings section: '${section}'. Allowed: general, properties, users, notifications, security`);
    }

    memoryStore.settings[section] = {
      ...memoryStore.settings[section],
      ...payload,
    };

    return memoryStore.settings;
  }
}
