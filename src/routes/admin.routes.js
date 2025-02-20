const express = require('express');
const router = express.Router();
const CarParksController = require('../controllers/admin/carParks.controller');
const CarParkListsController = require('../controllers/admin/carParkLists.controller');

// Admin dashboard
router.get('/', (req, res) => {
    res.render('admin/dashboard', { 
        title: 'Admin Dashboard',
        messages: {}
    });
});

// Car Parks routes
router.get('/car-parks', (req, res) => {
    res.render('car-parks/index', { 
        title: 'Car Parks',
        carParks: []
    });
});

// Car Park Lists routes
router.get('/car-park-lists', CarParkListsController.index);
router.get('/car-park-lists/new', CarParkListsController.new);
router.post('/car-park-lists', CarParkListsController.create);
router.get('/car-park-lists/:id/edit', CarParkListsController.edit);
router.put('/car-park-lists/:id', CarParkListsController.update);
router.delete('/car-park-lists/:id', CarParkListsController.delete);

module.exports = router; 