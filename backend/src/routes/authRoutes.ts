import { Router } from 'express';
import { login } from '../controllers/authController';
import { validateBody } from '../middleware/validate';
import { loginSchema } from '../validators/authValidators';

const router = Router();

router.post('/login', validateBody(loginSchema), login);

export default router;
