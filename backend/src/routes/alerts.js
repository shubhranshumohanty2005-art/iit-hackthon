const express = require('express');
const router = express.Router();
const {
  getAlerts,
  markAsRead,
  deleteAlert,
  markAllAsRead,
} = require('../controllers/alertController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getAlerts);
router.put('/read-all', protect, markAllAsRead);
router.put('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteAlert);

module.exports = router;
