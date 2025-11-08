import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Placeholder para rutas de administración
// Las implementaremos en la siguiente fase

router.get('/users', authenticate, authorize(['manage_users', 'view_users']), (req, res) => {
  res.json({ message: 'Admin users route - to be implemented' });
});

router.post('/users', authenticate, authorize(['manage_users']), (req, res) => {
  res.json({ message: 'Create user route - to be implemented' });
});

router.get('/roles', authenticate, authorize(['manage_roles']), (req, res) => {
  res.json({ message: 'Admin roles route - to be implemented' });
});

export default router;