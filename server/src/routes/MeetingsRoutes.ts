import { Router } from 'express';
import { getMeetings, getMeetingByCode, createMeeting, updateMeeting, deleteMeeting } from '../controllers/MeetingController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/:group_code', getMeetings);
router.get('/:group_code/:meeting_code', getMeetingByCode);
router.post('/:group_code', authenticateToken, createMeeting);
router.put('/:group_code/:meeting_code', authenticateToken, updateMeeting);
router.delete('/:group_code/:meeting_code', authenticateToken, deleteMeeting);

export default router;
