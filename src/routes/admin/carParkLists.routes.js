const express = require('express');
const router = express.Router();
const CarParkListsController = require('../../controllers/admin/carParkLists.controller');

// List all entries
router.get('/', CarParkListsController.index);

// Show create form
router.get('/new', CarParkListsController.new);

// Create new entry
router.post('/', CarParkListsController.create);

// Show edit form
router.get('/:id/edit', CarParkListsController.edit);

// Update entry
router.put('/:id', CarParkListsController.update);

// Delete entry
router.delete('/:id', CarParkListsController.delete);

module.exports = router; 