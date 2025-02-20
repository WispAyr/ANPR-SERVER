const express = require('express');
const router = express.Router();
const CarParksController = require('../../controllers/admin/carParks.controller');

// List all car parks
router.get('/', CarParksController.index);

// Show create form
router.get('/new', CarParksController.new);

// Create new car park
router.post('/', CarParksController.create);

// Show edit form
router.get('/:id/edit', CarParksController.edit);

// Update car park
router.put('/:id', CarParksController.update);

// Delete car park
router.delete('/:id', CarParksController.delete);

module.exports = router; 