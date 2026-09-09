import mongoose from 'mongoose';

export const NOTIFICATION_AUDIENCES = ['all', 'agents', 'agencies', 'user'];
export const NOTIFICATION_TYPES = ['system', 'announcement', 'alert', 'compliance'];

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
      maxlength: 150,
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      maxlength: 3000,
    },
    type: {
      type: String,
      enum: NOTIFICATION_TYPES,
      default: 'system',
    },
    targetAudience: {
      type: String,
      enum: NOTIFICATION_AUDIENCES,
      default: 'all',
      index: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    recipientName: {
      type: String,
      default: '',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: String,
      default: 'TRUSTY System Administrator',
    },
    priority: {
      type: String,
      enum: ['normal', 'high', 'urgent'],
      default: 'normal',
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
