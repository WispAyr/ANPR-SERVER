const Camera = require('../../models/Camera');
const CarPark = require('../../models/CarPark');

class CamerasController {
    static async index(req, res) {
        try {
            const cameras = await Camera.getAll();
            res.render('cameras/index', {
                title: 'Cameras',
                cameras
            });
        } catch (error) {
            req.flash('error', 'Failed to load cameras');
            res.redirect('/admin');
        }
    }

    static async new(req, res) {
        try {
            const carParks = await CarPark.getAll();
            res.render('cameras/form', {
                title: 'Add New Camera',
                camera: null,
                carParks
            });
        } catch (error) {
            req.flash('error', 'Failed to load form');
            res.redirect('/admin/cameras');
        }
    }

    static async create(req, res) {
        try {
            await Camera.create({
                name: req.body.name,
                location: req.body.location,
                carParkId: req.body.carParkId,
                status: req.body.status
            });
            
            req.flash('success', 'Camera created successfully');
            res.redirect('/admin/cameras');
        } catch (error) {
            req.flash('error', 'Failed to create camera');
            res.redirect('/admin/cameras/new');
        }
    }

    static async edit(req, res) {
        try {
            const [camera, carParks] = await Promise.all([
                Camera.getById(req.params.id),
                CarPark.getAll()
            ]);
            
            if (!camera) {
                req.flash('error', 'Camera not found');
                return res.redirect('/admin/cameras');
            }
            
            res.render('cameras/form', {
                title: 'Edit Camera',
                camera,
                carParks
            });
        } catch (error) {
            req.flash('error', 'Failed to load camera');
            res.redirect('/admin/cameras');
        }
    }

    static async update(req, res) {
        try {
            await Camera.update(req.params.id, {
                name: req.body.name,
                location: req.body.location,
                carParkId: req.body.carParkId,
                status: req.body.status
            });
            
            req.flash('success', 'Camera updated successfully');
            res.redirect('/admin/cameras');
        } catch (error) {
            req.flash('error', 'Failed to update camera');
            res.redirect(`/admin/cameras/${req.params.id}/edit`);
        }
    }

    static async delete(req, res) {
        try {
            await Camera.delete(req.params.id);
            req.flash('success', 'Camera deleted successfully');
        } catch (error) {
            req.flash('error', 'Failed to delete camera');
        }
        res.redirect('/admin/cameras');
    }
}

module.exports = CamerasController; 