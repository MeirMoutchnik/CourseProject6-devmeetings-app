import { Router } from 'express';
import { createUser, loginUser } from '../controllers/UserController';

const router = Router();

router.post('/create', createUser);
router.post('/login', loginUser);

export default router;