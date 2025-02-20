const express = require('express');
const router = express.Router();
const CamerasController = require('../../controllers/admin/cameras.controller');

// List all cameras
router.get('/', CamerasController.index);

// Show create form
router.get('/new', CamerasController.new);

// Create new camera
router.post('/', CamerasController.create);

// Show edit form
router.get('/:id/edit', CamerasController.edit);

// Update camera
router.put('/:id', CamerasController.update);

// Delete camera
router.delete('/:id', CamerasController.delete);

module.exports = router; 