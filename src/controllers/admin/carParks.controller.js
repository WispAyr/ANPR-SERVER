const CarPark = require('../../models/CarPark');

class CarParksController {
    static async index(req, res) {
        try {
            const carParks = await CarPark.getAll();
            res.render('car-parks/index', {
                title: 'Car Parks',
                carParks
            });
        } catch (error) {
            req.flash('error', 'Failed to load car parks');
            res.redirect('/admin');
        }
    }

    static async new(req, res) {
        res.render('car-parks/form', {
            title: 'Add New Car Park',
            carPark: null
        });
    }

    static async create(req, res) {
        try {
            await CarPark.create({
                name: req.body.name,
                location: req.body.location,
                maxCapacity: parseInt(req.body.maxCapacity)
            });
            
            req.flash('success', 'Car park created successfully');
            res.redirect('/admin/car-parks');
        } catch (error) {
            req.flash('error', 'Failed to create car park');
            res.redirect('/admin/car-parks/new');
        }
    }

    static async edit(req, res) {
        try {
            const carPark = await CarPark.getById(req.params.id);
            
            if (!carPark) {
                req.flash('error', 'Car park not found');
                return res.redirect('/admin/car-parks');
            }
            
            res.render('car-parks/form', {
                title: 'Edit Car Park',
                carPark
            });
        } catch (error) {
            req.flash('error', 'Failed to load car park');
            res.redirect('/admin/car-parks');
        }
    }

    static async update(req, res) {
        try {
            await CarPark.update(req.params.id, {
                name: req.body.name,
                location: req.body.location,
                maxCapacity: parseInt(req.body.maxCapacity)
            });
            
            req.flash('success', 'Car park updated successfully');
            res.redirect('/admin/car-parks');
        } catch (error) {
            req.flash('error', 'Failed to update car park');
            res.redirect(`/admin/car-parks/${req.params.id}/edit`);
        }
    }

    static async delete(req, res) {
        try {
            await CarPark.delete(req.params.id);
            req.flash('success', 'Car park deleted successfully');
        } catch (error) {
            req.flash('error', 'Failed to delete car park');
        }
        res.redirect('/admin/car-parks');
    }
}

module.exports = CarParksController; 