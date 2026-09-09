import mongoose from 'mongoose';

export const REPORT_REASONS = [
  'Scam',
  'Fake listing',
  'Duplicate',
  'Incorrect information',
  'Inappropriate content',
  'Other',
];

export const REPORT_STATUSES = ['Pending', 'Investigating', 'Resolved', 'Dismissed'];

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reporterName: {
      type: String,
      required: true,
      default: 'Verified Platform User',
    },
    reporterEmail: {
      type: String,
      default: '',
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
    },
    propertyTitle: {
      type: String,
      default: '',
    },
    reportedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reportedUserName: {
      type: String,
      default: '',
    },
    reason: {
      type: String,
      enum: REPORT_REASONS,
      required: true,
    },
    details: {
      type: String,
      maxlength: 2000,
      default: '',
    },
    status: {
      type: String,
      enum: REPORT_STATUSES,
      default: 'Pending',
      index: true,
    },
    resolutionNotes: {
      type: String,
      default: '',
    },
    actionTaken: {
      type: String,
      default: 'none', // 'none', 'property_removed', 'user_suspended', 'dismissed', 'resolved'
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model('Report', reportSchema);
export default Report;
