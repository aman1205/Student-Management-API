import mongoose, { Schema, Document, CallbackError } from 'mongoose';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export enum TaskStatus {
  Pending = 'pending',
  Overdue = 'overdue',
  Completed = 'completed',
}

export interface Task {
  _id: string;
  description: string;
  dueTime: Date;
  status: TaskStatus;
}

export interface StudentInterface extends Document {
  name: string;
  email: string;
  department: string;
  password: string;
  tasks: Task[];
}

const StudentSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  password: { type: String, required: true },
  tasks: [
    {
      _id: { type: String, default: uuidv4   },
      description: { type: String, required: true },
      dueTime: { type: Date, required: true },
      status: { type: String, enum: ['pending', 'completed', 'overdue'], default: 'pending' },
    },
  ],
});

StudentSchema.pre<StudentInterface>('save', async function (next) {
  try {
    const student = this;

    if (student.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(student.password, salt);
      student.password = hash;
    }

    next();
  } catch (error:any) {
    next(error as CallbackError)
  }
});

const Student = mongoose.model<StudentInterface>('Student', StudentSchema);

export default Student;
