import mongoose, { Schema, Document } from 'mongoose';

export type NotificationType =
  | 'BUG_ASSIGNED'
  | 'MENTION'
  | 'COMMENT'
  | 'STATUS_CHANGE'
  | 'BUG_RESOLVED'
  | 'BUG_REOPENED';

export interface INotification extends Document {
  _id: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  actor: mongoose.Types.ObjectId;
  type: NotificationType;
  bug: mongoose.Types.ObjectId;
  read: boolean;
  message?: string;
  createdAt: Date;
}

const notificationSchema: Schema = new Schema(
  {
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    actor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['BUG_ASSIGNED', 'MENTION', 'COMMENT', 'STATUS_CHANGE', 'BUG_RESOLVED', 'BUG_REOPENED'],
      required: true,
    },
    bug: { type: Schema.Types.ObjectId, ref: 'Bug', required: true },
    read: { type: Boolean, default: false, index: true },
    message: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model<INotification>('Notification', notificationSchema);
