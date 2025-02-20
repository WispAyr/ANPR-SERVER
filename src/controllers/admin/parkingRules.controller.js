const ParkingRule = require('../../models/ParkingRule');
const CarPark = require('../../models/CarPark');

class ParkingRulesController {
    static async index(req, res) {
        try {
            const rules = await ParkingRule.getAll();
            res.render('parking-rules/index', {
                title: 'Parking Rules',
                rules
            });
        } catch (error) {
            req.flash('error', 'Failed to load parking rules');
            res.redirect('/admin');
        }
    }

    static async new(req, res) {
        try {
            const carParks = await CarPark.getAll();
            res.render('parking-rules/form', {
                title: 'Add New Rule',
                rule: null,
                carParks
            });
        } catch (error) {
            req.flash('error', 'Failed to load form');
            res.redirect('/admin/parking-rules');
        }
    }

    static async create(req, res) {
        try {
            await ParkingRule.create({
                carParkId: req.body.carParkId,
                maxDurationMinutes: parseInt(req.body.maxDurationMinutes),
                overnightParkingAllowed: req.body.overnightParkingAllowed === 'true',
                startTime: req.body.startTime || null,
                endTime: req.body.endTime || null
            });
            
            req.flash('success', 'Parking rule created successfully');
            res.redirect('/admin/parking-rules');
        } catch (error) {
            req.flash('error', 'Failed to create parking rule');
            res.redirect('/admin/parking-rules/new');
        }
    }

    static async edit(req, res) {
        try {
            const [rule, carParks] = await Promise.all([
                ParkingRule.getById(req.params.id),
                CarPark.getAll()
            ]);
            
            if (!rule) {
                req.flash('error', 'Parking rule not found');
                return res.redirect('/admin/parking-rules');
            }
            
            res.render('parking-rules/form', {
                title: 'Edit Parking Rule',
                rule,
                carParks
            });
        } catch (error) {
            req.flash('error', 'Failed to load parking rule');
            res.redirect('/admin/parking-rules');
        }
    }

    static async update(req, res) {
        try {
            await ParkingRule.update(req.params.id, {
                maxDurationMinutes: parseInt(req.body.maxDurationMinutes),
                overnightParkingAllowed: req.body.overnightParkingAllowed === 'true',
                startTime: req.body.startTime || null,
                endTime: req.body.endTime || null
            });
            
            req.flash('success', 'Parking rule updated successfully');
            res.redirect('/admin/parking-rules');
        } catch (error) {
            req.flash('error', 'Failed to update parking rule');
            res.redirect(`/admin/parking-rules/${req.params.id}/edit`);
        }
    }

    static async delete(req, res) {
        try {
            await ParkingRule.delete(req.params.id);
            req.flash('success', 'Parking rule deleted successfully');
        } catch (error) {
            req.flash('error', 'Failed to delete parking rule');
        }
        res.redirect('/admin/parking-rules');
    }
}

module.exports = ParkingRulesController; 