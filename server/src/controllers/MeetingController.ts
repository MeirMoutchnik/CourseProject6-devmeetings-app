import { Request, Response } from "express";
import sql from "../db";
import { Meeting } from "../types/Meeting";

export const getMeetings = async (req: Request, res: Response) => {
  try {
    const meetings =
      await sql`SELECT * FROM meetings WHERE group_code = ${req.params.group_code} ORDER BY meeting_start`;
    res.status(200).json(meetings as Meeting[]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get meetings" });
  }
};

export const getMeetingByCode = async (req: Request, res: Response) => {
  try {
    const meeting =
      await sql`SELECT * FROM meetings WHERE group_code = ${req.params.group_code} AND meeting_code = ${req.params.meeting_code}`;
    res.status(200).json(meeting[0] as Meeting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get meeting" });
  }
};

export const createMeeting = async (req: Request, res: Response) => {
  try {
    const group_code = req.params.group_code;
    const meeting = await sql`
      INSERT INTO meetings (
        group_code,
        meeting_name,
        meeting_start,
        meeting_end,
        meeting_description,
        meeting_room
      ) VALUES (
        ${group_code},
        ${req.body.meeting_name},
        ${req.body.meeting_start},
        ${req.body.meeting_end},
        ${req.body.meeting_description},
        ${req.body.meeting_room}
      )
      RETURNING *
    `;
    res.status(201).json(meeting[0] as Meeting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create meeting" });
  }
};

export const updateMeeting = async (req: Request, res: Response) => {
  try {
    const meeting = await sql`
      UPDATE meetings SET
        group_code = ${req.body.group_code},
        meeting_name = ${req.body.meeting_name},
        meeting_start = ${req.body.meeting_start},
        meeting_end = ${req.body.meeting_end},
        meeting_description = ${req.body.meeting_description},
        meeting_room = ${req.body.meeting_room}
      WHERE group_code = ${req.params.group_code}
        AND meeting_code = ${req.params.meeting_code}
      RETURNING *
    `;
    res.status(200).json(meeting[0] as Meeting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update meeting" });
  }
};

export const deleteMeeting = async (req: Request, res: Response) => {
  try {
    const meeting =
      await sql`DELETE FROM meetings WHERE group_code = ${req.params.group_code} AND meeting_code = ${req.params.meeting_code} RETURNING *`;
    res.status(200).json(meeting[0] as Meeting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete meeting" });
  }
};
