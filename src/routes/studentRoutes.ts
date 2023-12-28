import express from 'express';
import { getStudentTasks, studentLogin, updateTaskStatus } from '../controllers/studentController';

const router = express.Router();

// Student tasks route


/**
 * @swagger
 * /student/login:
 *   post:
 *     description: Student login.
 *     tags:
 *       - Student
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
router.post('/login' , studentLogin)



/**
 * @swagger
 * /student/tasks:
 *   get:
 *     description: Get Task by Student 
 *     tags:
 *       - Student
 *     
 *     responses:
 *       200:
 *         description: All Task 
 * 
 */
router.get('/tasks', getStudentTasks);

/**
 * @swagger
 * /student/tasks:
 *   patch:
 *     description: Student Update Task Status.
 *     tags:
 *       - Student
 *     requestBody:
 *       description: Admin's login credentials
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskId:
 *                 type: string
 *                 format: taskId
 *               status:
 *                 type: string
 *                 format: status
 *           required:
 *             -taskId
 *             -taskId
 *     responses:
 *       200:
 *         description: Task status updated successfully
 * 
 */
router.patch('/tasks' ,  updateTaskStatus )
// Other student routes (change task status, etc.) go here

export default router;
