const express = require('express');
const router = express.Router();
const AdminController = require('../../controllers/admin/index.controller');

// Admin dashboard
router.get('/', AdminController.dashboard);

module.exports = router; 