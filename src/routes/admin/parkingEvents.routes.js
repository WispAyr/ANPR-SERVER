const express = require('express');
const router = express.Router();
const ParkingEventsController = require('../../controllers/admin/parkingEvents.controller');

// List all parking events
router.get('/', ParkingEventsController.index);

// Show event details
router.get('/:id', ParkingEventsController.show);

// Update event status
router.put('/:id/status', ParkingEventsController.updateStatus);

// Add enforcement action
router.post('/:id/enforce', ParkingEventsController.enforce);

module.exports = router; 