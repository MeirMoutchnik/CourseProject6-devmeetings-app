import { Router } from 'express';
import { getGroups } from '../controllers/GroupController';

const router = Router();

router.get('/', getGroups);

export default router;