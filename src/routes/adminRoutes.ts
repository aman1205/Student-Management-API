import express from 'express';
import { addStudent, adminLogin, adminRegister, assignTask } from '../controllers/adminController';
import { adminAuthMiddleware } from '../middleware/adminAuthMiddleware';

const router = express.Router();

/**
 * @swagger
 * /admin/login:
 *   post:
 *     description: Endpoint to authenticate an admin and generate a token.
 *     tags:
 *       - Admin
 *     requestBody:
 *       description: Admin's login credentials
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *           required:
 *             -email
 *             -password
 *     responses:
 *       200:
 *         description: Login successful
 * 
 */
router.post('/login', adminLogin);

/**
 * @swagger
 * /admin/register:
 *   post:
 *     description: Endpoint to Register  admin .
 *     tags:
 *       - Admin
 *     requestBody:
 *       description: Admin's Register credentials
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *           required:
 *             -email
 *             -password
 *     responses:
 *       200:
 *         description: Admin registered successfully
 * 
 */
router.post('/register', adminRegister);

/**
 * @swagger
 * /admin/addStudent:
 *   post:
 *     description: Endpoint to AddStudent.
 *     tags:
 *       - Admin
 *     requestBody:
 *       description: Admin's Register credentials
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               name:
 *                 type: string
 *                 format: name
 *               department:
 *                 type: string
 *                 format: department
 *           required:
 *             -email
 *             -password
 *             -name
 *             -department
 *     responses:
 *       200:
 *         description: Student added successfully
 * 
 */
router.post('/addStudent', adminAuthMiddleware, addStudent);

/**
 * @swagger
 * /admin/assignTask:
 *   post:
 *     description: Endpoint to AddTask.
 *     tags:
 *       - Admin
 *     requestBody:
 *       description: Admin's Assign task to Student
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentEmail:
 *                 type: string
 *                 format: email
 *               description:
 *                 type: string
 *                 format: description
 *               dueTime:
 *                 type: string
 *                 format: dueTime
 *           required:
 *             -studentEmail
 *             -description
 *             -dueTime
 *     responses:
 *       200:
 *         description: Task assigned successfully
 * 
 */
router.post('/assignTask', adminAuthMiddleware, assignTask);

export default router;
