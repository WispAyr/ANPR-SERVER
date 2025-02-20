const express = require('express');
const router = express.Router();
const ParkingRulesController = require('../../controllers/admin/parkingRules.controller');

// List all rules
router.get('/', ParkingRulesController.index);

// Show create form
router.get('/new', ParkingRulesController.new);

// Create new rule
router.post('/', ParkingRulesController.create);

// Show edit form
router.get('/:id/edit', ParkingRulesController.edit);

// Update rule
router.put('/:id', ParkingRulesController.update);

// Delete rule
router.delete('/:id', ParkingRulesController.delete);

module.exports = router; 