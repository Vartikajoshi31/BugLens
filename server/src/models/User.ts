import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'Admin' | 'Developer' | 'QA Tester';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  avatar: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true },
    avatar: { type: String, default: '' },
    role: {
      type: String,
      enum: ['Admin', 'Developer', 'QA Tester'],
      default: 'QA Tester',
    },
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model<IUser>('User', userSchema);
