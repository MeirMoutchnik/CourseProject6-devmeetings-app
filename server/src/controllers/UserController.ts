import { Request, Response } from 'express';
import sql from '../db';
import { User } from '../types/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const createUser = async (req: Request, res: Response) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.user_password, 10);
        const user = await sql`INSERT INTO users1 (user_name, user_email, user_password, user_role) VALUES (${req.body.user_name}, ${req.body.user_email}, ${hashedPassword}, ${req.body.user_role})`;
        res.status(200).json(user[0] as User);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const user_email = req.body.user_email ?? req.body.email;
        const user_password = req.body.user_password ?? req.body.password;

        if (!user_email || !user_password) {
            return res.status(400).json({ error: 'email and password are required' });
        }

        const result = await sql`SELECT * FROM users1 WHERE user_email = ${user_email}`;
        const user = result[0] as User | undefined;
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const isPasswordValid = await bcrypt.compare(user_password, user.user_password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET || '', { expiresIn: '1h' });
        res.status(200).json({ user, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to login user' });
    }
};
