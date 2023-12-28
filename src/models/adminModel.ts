import mongoose, { Schema, Document, CallbackError } from 'mongoose';
import bcrypt from 'bcrypt';

export interface AdminInterface extends Document {
  email: string;
  password: string;
}

const AdminSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Hash the password before saving to the database
AdminSchema.pre<AdminInterface>('save', async function (next) {
  try {
    const admin = this;

    if (admin.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(admin.password, salt);
      admin.password = hash;
    }

    next();
  } catch (error:any) {
    next(error as CallbackError)
  }
});

const Admin = mongoose.model<AdminInterface>('Admin', AdminSchema);

export default Admin;
