import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';

export const adminAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - Admin token missing' });
  }

  const decoded:any = verifyToken(token);

  if (typeof decoded === 'string' || !decoded.isAdmin) {
    return res.status(403).json({ message: 'Forbidden - Admin access required' });
  }

  next();
};
// export const adminAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');

//   if (!token) {
//     return res.status(401).json({ message: 'Unauthorized - Admin token missing' });
//   }

//   const decoded = verifyToken(token);

//   if (typeof decoded === 'string') {
//     return res.status(401).json({ message: 'Unauthorized - Invalid token' });
//   }

//   const isAdmin = (decoded as any).isAdmin;

//   if (!isAdmin) {
//     return res.status(403).json({ message: 'Forbidden - Admin access required' });
//   }

//   // Attach admin email to request for use in the route handler
//   req.body.adminEmail = (decoded as any).email;

//   next();
// };