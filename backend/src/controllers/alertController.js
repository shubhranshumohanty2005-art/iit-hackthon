const Alert = require('../models/Alert');

/**
 * Get user's alerts
 * GET /api/alerts
 */
const getAlerts = async (req, res) => {
  try {
    const { unread } = req.query;
    
    const query = { userId: req.user._id };
    if (unread === 'true') {
      query.isRead = false;
    }
    
    const alerts = await Alert.find(query)
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json(alerts);
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ message: 'Failed to fetch alerts' });
  }
};

/**
 * Mark alert as read
 * PUT /api/alerts/:id/read
 */
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    const alert = await Alert.findOne({
      _id: id,
      userId: req.user._id,
    });
    
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    
    alert.isRead = true;
    await alert.save();
    
    res.json(alert);
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Failed to mark alert as read' });
  }
};

/**
 * Delete alert
 * DELETE /api/alerts/:id
 */
const deleteAlert = async (req, res) => {
  try {
    const { id } = req.params;
    
    const alert = await Alert.findOne({
      _id: id,
      userId: req.user._id,
    });
    
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    
    await Alert.deleteOne({ _id: id });
    
    res.json({ message: 'Alert deleted' });
  } catch (error) {
    console.error('Delete alert error:', error);
    res.status(500).json({ message: 'Failed to delete alert' });
  }
};

/**
 * Mark all alerts as read
 * PUT /api/alerts/read-all
 */
const markAllAsRead = async (req, res) => {
  try {
    await Alert.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true }
    );
    
    res.json({ message: 'All alerts marked as read' });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ message: 'Failed to mark all alerts as read' });
  }
};

module.exports = {
  getAlerts,
  markAsRead,
  deleteAlert,
  markAllAsRead,
};
