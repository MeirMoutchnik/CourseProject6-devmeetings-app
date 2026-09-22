import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export type AuthRequest = Request & {
    user?: { userId?: number; user_id?: number };
};

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    const token = header?.toLowerCase().startsWith('bearer ')
        ? header.slice(7).trim()
        : header?.trim();

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as { userId?: number; user_id?: number };
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ error: 'Unauthorized' });
    }
};
