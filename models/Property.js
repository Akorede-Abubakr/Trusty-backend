import mongoose from 'mongoose';

export const PROPERTY_TYPES = [
  'residential',
  'apartment',
  'villa',
  'penthouse',
  'condo',
  'commercial',
  'land',
];

export const LISTING_TYPES = ['sale', 'rent', 'lease'];
export const PROPERTY_STATUSES = ['available', 'pending', 'sold', 'rented', 'suspended'];
export const PROPERTY_VERIFICATION_STATUSES = ['unverified', 'pending', 'approved', 'rejected'];

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Property description is required'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Property price is required'],
      min: [0, 'Price cannot be negative'],
      index: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    propertyType: {
      type: String,
      enum: PROPERTY_TYPES,
      default: 'residential',
      index: true,
    },
    listingType: {
      type: String,
      enum: LISTING_TYPES,
      default: 'sale',
      index: true,
    },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true, index: true },
      state: { type: String, required: true, index: true },
      country: { type: String, default: 'United States' },
      zipCode: { type: String, required: true },
      coordinates: {
        lat: { type: Number, default: 25.7617 },
        lng: { type: Number, default: -80.1918 },
      },
    },
    features: {
      bedrooms: { type: Number, default: 3 },
      bathrooms: { type: Number, default: 2 },
      areaSqFt: { type: Number, default: 2500 },
      yearBuilt: { type: Number, default: 2022 },
      parkingSpaces: { type: Number, default: 2 },
      hasPool: { type: Boolean, default: false },
      hasGarden: { type: Boolean, default: true },
      isFurnished: { type: Boolean, default: false },
    },
    images: [
      {
        url: { type: String, required: true },
        caption: { type: String, default: '' },
        isFeatured: { type: Boolean, default: false },
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    agency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    status: {
      type: String,
      enum: PROPERTY_STATUSES,
      default: 'available',
      index: true,
    },
    verificationStatus: {
      type: String,
      enum: PROPERTY_VERIFICATION_STATUSES,
      default: 'pending',
      index: true,
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    views: {
      type: Number,
      default: 0,
    },
    inquiriesCount: {
      type: Number,
      default: 0,
    },
    viewingsCount: {
      type: Number,
      default: 0,
    },
    reports: [
      {
        reason: { type: String, required: true },
        reportedBy: { type: String, default: 'Anonymous User' },
        reporterEmail: { type: String, default: '' },
        createdAt: { type: Date, default: Date.now },
        resolved: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Property = mongoose.model('Property', propertySchema);
export default Property;
