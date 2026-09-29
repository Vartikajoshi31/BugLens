import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
  _id: mongoose.Types.ObjectId;
  bug: mongoose.Types.ObjectId;
  project?: mongoose.Types.ObjectId;
  actor: mongoose.Types.ObjectId;
  action: string;
  details?: any;
  createdAt: Date;
}

const activitySchema: Schema = new Schema(
  {
    bug: { type: Schema.Types.ObjectId, ref: 'Bug', required: true, index: true },
    project: { type: Schema.Types.ObjectId, ref: 'Project' },
    actor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    details: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default mongoose.model<IActivity>('Activity', activitySchema);
