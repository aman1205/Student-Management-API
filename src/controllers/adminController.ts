import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { generateToken, verifyToken } from '../utils/auth';
import Admin from '../models/adminModel';
import { data } from 'autoprefixer';
import Student, { Task, TaskStatus } from '../models/studentModel';
import { v4 as uuidv4 } from 'uuid';




export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    // Find admin by email
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate token
    const token = generateToken({ email: admin.email, isAdmin: true });

    res.status(200).json({ token });
  } catch (error: any) {
    console.error(error)
    if (error.name === 'ValidationError') {
      // Handle Mongoose validation error (e.g., missing required fields)
      return res.status(400).json({ message: 'Validation error', details: error.message });
    }

    // Handle other database errors
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const adminRegister = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email && !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    // Check if admin with the same email already exists
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }
    // Create a new admin
    const newAdmin = new Admin({
      email,
      password
    });
    // Save the admin to the database
    await newAdmin.save();
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      // Handle Mongoose validation error (e.g., missing required fields)
      return res.status(400).json({ message: 'Validation error', details: error.message });
    }

    // Handle other database errors
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const addStudent = async (req: Request, res: Response,) => {
  try {
    const token: any = req.header('Authorization')?.replace('Bearer ', '');
    const decodedToken: any = verifyToken(token);
    if (typeof decodedToken === 'string' || !decodedToken || !decodedToken.isAdmin) {
      return res.status(403).json({ message: 'Forbidden - Admin access required' });
    }




    const { name, email, department, password } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !department || !password) {
      return res.status(400).json({ message: 'Name, email, department, and password are required' });
    }

    // Check if a student with the same email already exists
    const existingStudent = await Student.findOne({ email });

    if (existingStudent) {
      return res.status(400).json({ message: 'Student with this email already exists' });
    }

    // Create a new student
    const newStudent = new Student({
      name,
      email,
      department,
      password,
    });

    // Save the student to the database
    await newStudent.save();

    res.status(201).json({ message: 'Student added successfully' });
  } catch (error: any) {
    console.error(error);

    if (error.name === 'ValidationError') {
      // Handle Mongoose validation error (e.g., missing required fields)
      return res.status(400).json({ message: 'Validation error', details: error.message });
    }

    // Handle other database errors
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const assignTask = async (req: Request, res: Response) => {
  try {
    const token: any = req.header('Authorization')?.replace('Bearer ', '');
    const decodedToken: any = verifyToken(token);
    if (typeof decodedToken === 'string' || !decodedToken || !decodedToken.isAdmin) {
      return res.status(403).json({ message: 'Forbidden - Admin access required' });
    }


    const { studentEmail, description, dueTime } = req.body;

    // Check if all required fields are provided
    if (!studentEmail || !description || !dueTime) {
      return res.status(400).json({ message: 'Student email, task description, and due time are required' });
    }

    // Check if the student exists
    const student = await Student.findOne({ email: studentEmail });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    const [day, month, year] = dueTime.split('/');
    const parsedDueTime = new Date(`${year}-${month}-${day}`);

    // Check if the parsed date is valid
    if (isNaN(parsedDueTime.getTime())) {
      return res.status(400).json({ message: 'Invalid dueTime value' });
    }
    // Create a new task
    const newTask: Task = {
      _id: uuidv4(),
      description,
      dueTime: parsedDueTime,
      status: TaskStatus.Pending
    };

    // Add the task to the student's tasks array
    student.tasks.push(newTask);

    // Save the updated student to the database
    await student.save();

    res.status(201).json({ message: 'Task assigned successfully' });
  } catch (error: any) {
    console.error(error);

    if (error.name === 'ValidationError') {
      // Handle Mongoose validation error (e.g., missing required fields)
      return res.status(400).json({ message: 'Validation error', details: error.message });
    }

    // Handle other database errors
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Other admin controller functions (add student, assign tasks, etc.) go here
