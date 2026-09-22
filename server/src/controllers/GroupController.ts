import { Request, Response } from 'express';
import sql from '../db';
import { Group } from '../types/Group';

export const getGroups = async (req: Request, res: Response) => {
    try {
        const groups = await sql`SELECT * FROM devgroups`;
        res.status(200).json(groups as Group[]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get groups' });
    }
};

