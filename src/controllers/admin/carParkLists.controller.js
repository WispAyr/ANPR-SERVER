const CarParkList = require('../../models/CarParkList');
const CarPark = require('../../models/CarPark');
const moment = require('moment');

class CarParkListsController {
    static async index(req, res) {
        try {
            const [lists, carParks] = await Promise.all([
                CarParkList.getAll({
                    listType: req.query.listType,
                    licensePlate: req.query.licensePlate,
                    carParkId: req.query.carParkId
                }),
                CarPark.getAll()
            ]);
            
            res.render('car-park-lists/index', { 
                title: 'Vehicle Lists',
                lists,
                carParks,
                query: req.query,
                moment
            });
        } catch (error) {
            req.flash('error', 'Failed to load vehicle lists');
            res.redirect('/admin');
        }
    }

    static async new(req, res) {
        try {
            const carParks = await CarPark.getAll();
            res.render('car-park-lists/form', { 
                title: 'Add New Vehicle',
                list: null,
                carParks,
                moment
            });
        } catch (error) {
            req.flash('error', 'Failed to load form');
            res.redirect('/admin/car-park-lists');
        }
    }

    static async create(req, res) {
        try {
            await CarParkList.create({
                carParkId: req.body.carParkId,
                licensePlate: req.body.licensePlate.toUpperCase(),
                listType: req.body.listType,
                validFrom: req.body.validFrom,
                validUntil: req.body.validUntil || null
            });
            
            req.flash('success', 'Vehicle added to list successfully');
            res.redirect('/admin/car-park-lists');
        } catch (error) {
            req.flash('error', 'Failed to add vehicle to list');
            res.redirect('/admin/car-park-lists/new');
        }
    }

    static async edit(req, res) {
        try {
            const [list, carParks] = await Promise.all([
                CarParkList.getById(req.params.id),
                CarPark.getAll()
            ]);
            
            if (!list) {
                req.flash('error', 'List entry not found');
                return res.redirect('/admin/car-park-lists');
            }
            
            res.render('car-park-lists/form', { 
                title: 'Edit Vehicle Entry',
                list,
                carParks,
                moment
            });
        } catch (error) {
            req.flash('error', 'Failed to load list entry');
            res.redirect('/admin/car-park-lists');
        }
    }

    static async update(req, res) {
        try {
            await CarParkList.update(req.params.id, {
                validFrom: req.body.validFrom,
                validUntil: req.body.validUntil || null
            });
            
            req.flash('success', 'List entry updated successfully');
            res.redirect('/admin/car-park-lists');
        } catch (error) {
            req.flash('error', 'Failed to update list entry');
            res.redirect(`/admin/car-park-lists/${req.params.id}/edit`);
        }
    }

    static async delete(req, res) {
        try {
            await CarParkList.delete(req.params.id);
            req.flash('success', 'List entry deleted successfully');
        } catch (error) {
            req.flash('error', 'Failed to delete list entry');
        }
        res.redirect('/admin/car-park-lists');
    }
}

module.exports = CarParkListsController; 