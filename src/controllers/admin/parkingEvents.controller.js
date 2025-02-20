const ParkingEvent = require('../../models/ParkingEvent');
const CarPark = require('../../models/CarPark');
const EnforcementAction = require('../../models/EnforcementAction');

class ParkingEventsController {
    static async index(req, res) {
        try {
            const [events, carParks] = await Promise.all([
                ParkingEvent.getAll({
                    status: req.query.status,
                    carParkId: req.query.carParkId,
                    startDate: req.query.startDate,
                    endDate: req.query.endDate
                }),
                CarPark.getAll()
            ]);

            res.render('parking-events/index', {
                title: 'Parking Events',
                events,
                carParks,
                query: req.query,
                moment: require('moment')
            });
        } catch (error) {
            req.flash('error', 'Failed to load parking events');
            res.redirect('/admin');
        }
    }

    static async show(req, res) {
        try {
            const event = await ParkingEvent.getById(req.params.id);
            
            if (!event) {
                req.flash('error', 'Parking event not found');
                return res.redirect('/admin/parking-events');
            }

            const duration = await ParkingEvent.getDuration(req.params.id);
            const actions = await EnforcementAction.getByParkingEventId(req.params.id);

            res.render('parking-events/show', {
                title: 'Event Details',
                event,
                duration,
                actions,
                moment: require('moment')
            });
        } catch (error) {
            req.flash('error', 'Failed to load event details');
            res.redirect('/admin/parking-events');
        }
    }

    static async updateStatus(req, res) {
        try {
            await ParkingEvent.updateStatus(req.params.id, req.body.status);
            req.flash('success', 'Event status updated successfully');
        } catch (error) {
            req.flash('error', 'Failed to update event status');
        }
        res.redirect(`/admin/parking-events/${req.params.id}`);
    }

    static async enforce(req, res) {
        try {
            await EnforcementAction.create({
                parkingEventId: req.params.id,
                actionType: req.body.actionType,
                reason: req.body.reason
            });
            req.flash('success', 'Enforcement action added successfully');
        } catch (error) {
            req.flash('error', 'Failed to add enforcement action');
        }
        res.redirect(`/admin/parking-events/${req.params.id}`);
    }
}

module.exports = ParkingEventsController; 