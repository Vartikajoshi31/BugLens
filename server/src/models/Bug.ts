import mongoose, { Schema, Document } from 'mongoose';

export type BugSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type BugPriority = 'URGENT' | 'HIGH' | 'NORMAL' | 'LOW';
export type BugStatus = 'OPEN' | 'IN PROGRESS' | 'IN REVIEW' | 'TESTING' | 'RESOLVED' | 'CLOSED';

export interface IEnvironment {
  browser: string;
  os: string;
  device: string;
  resolution: string;
  url: string;
}

export interface IReproduction {
  steps: string;
  expected: string;
  actual: string;
}

export interface IAttachment {
  name: string;
  url: string;
  size?: number;
}

export interface IBug extends Document {
  _id: mongoose.Types.ObjectId;
  bugId: string;
  title: string;
  description: string;
  severity: BugSeverity;
  priority: BugPriority;
  status: BugStatus;
  reporter: mongoose.Types.ObjectId;
  assignee?: mongoose.Types.ObjectId;
  project: mongoose.Types.ObjectId;
  labels: string[];
  environment: IEnvironment;
  reproduction: IReproduction;
  screenshotUrl: string;
  attachments: IAttachment[];
  createdAt: Date;
  updatedAt: Date;
}

const bugSchema: Schema = new Schema(
  {
    bugId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true, index: true },
    description: { type: String, default: '' },
    severity: {
      type: String,
      enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
      default: 'MEDIUM',
      index: true,
    },
    priority: {
      type: String,
      enum: ['URGENT', 'HIGH', 'NORMAL', 'LOW'],
      default: 'NORMAL',
    },
    status: {
      type: String,
      enum: ['OPEN', 'IN PROGRESS', 'IN REVIEW', 'TESTING', 'RESOLVED', 'CLOSED'],
      default: 'OPEN',
      index: true,
    },
    reporter: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    assignee: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    labels: [{ type: String, trim: true }],
    environment: {
      browser: { type: String, default: 'Chrome 128.0' },
      os: { type: String, default: 'macOS Sonoma 14.5' },
      device: { type: String, default: 'MacBook Pro' },
      resolution: { type: String, default: '1920x1080' },
      url: { type: String, default: '' },
    },
    reproduction: {
      steps: { type: String, default: '' },
      expected: { type: String, default: '' },
      actual: { type: String, default: '' },
    },
    screenshotUrl: { type: String, default: '' },
    attachments: [
      {
        name: String,
        url: String,
        size: Number,
      },
    ],
  },
  { timestamps: true }
);

bugSchema.index({ title: 'text', description: 'text', bugId: 'text' });

export default mongoose.model<IBug>('Bug', bugSchema);
