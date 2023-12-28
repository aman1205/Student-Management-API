import jwt from 'jsonwebtoken';

const secretKey = 'your-secret-key'; // Replace with a strong secret key

export function generateToken(payload: object): string {
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}

export function verifyToken(token: string): object | string {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    return 'Invalid token';
  }
}
