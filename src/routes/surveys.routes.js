import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Placeholder para rutas de encuestas
// Las implementaremos en la siguiente fase

router.get('/', authenticate, authorize(['view_survey']), (req, res) => {
  res.json({ message: 'List surveys route - to be implemented' });
});

router.post('/', authenticate, authorize(['create_survey']), (req, res) => {
  res.json({ message: 'Create survey route - to be implemented' });
});

router.get('/:id', authenticate, authorize(['view_survey']), (req, res) => {
  res.json({ message: 'Get survey route - to be implemented' });
});

router.get('/:id/results', authenticate, authorize(['view_results']), (req, res) => {
  res.json({ message: 'Get survey results route - to be implemented' });
});

export default router;