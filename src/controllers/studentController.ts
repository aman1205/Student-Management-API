import { Request, Response } from 'express';
import Student, { Task, TaskStatus } from '../models/studentModel';
import { generateToken, verifyToken } from '../utils/auth';
import bcrypt from 'bcrypt';



export const studentLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find student by email
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, student.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate token
    const token = generateToken({ email: student.email, isAdmin: false });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getStudentTasks = async (req: Request, res: Response) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = verifyToken(token);

    if (typeof decoded === 'string') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const studentEmail = (decoded as any).email;

    // Get student tasks based on the email
    const student = await Student.findOne({ email: studentEmail });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Return student tasks
    res.status(200).json({ tasks: student.tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


export const updateTaskStatus = async (req: Request, res: Response) => {
  try {
    // Get student email from the decoded token
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = verifyToken(token);

    if (typeof decoded === 'string') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const studentEmail = (decoded as any).email;
    const { taskId, status } = req.body;

    // Find student by email
    const student = await Student.findOne({ email: studentEmail });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    console.log()
    // Find the task by ID
    const taskIndex = student.tasks.findIndex((task: Task) => task._id == taskId);

    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update task status
    student.tasks[taskIndex].status = status as TaskStatus;

    // Save the updated student to the database
    await student.save();

    res.status(200).json({ message: 'Task status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Other student controller functions (change task status, etc.) go here
