const CarPark = require('../../models/CarPark');
const Camera = require('../../models/Camera');
const ParkingEvent = require('../../models/ParkingEvent');

class AdminController {
    static async dashboard(req, res) {
        try {
            let stats = {
                carParks: 0,
                cameras: 0,
                activeEvents: 0
            };

            try {
                const [carParks, cameras, activeEvents] = await Promise.all([
                    CarPark.getAll(),
                    Camera.getAll(),
                    ParkingEvent.getActive()
                ]);

                stats = {
                    carParks: carParks ? carParks.length : 0,
                    cameras: cameras ? cameras.length : 0,
                    activeEvents: activeEvents ? activeEvents.length : 0
                };
            } catch (error) {
                console.error('Error fetching stats:', error);
            }

            res.render('admin/dashboard', {
                title: 'Admin Dashboard',
                stats
            });
        } catch (error) {
            console.error('Dashboard error:', error);
            res.render('admin/dashboard', {
                title: 'Admin Dashboard',
                stats: {
                    carParks: 0,
                    cameras: 0,
                    activeEvents: 0
                },
                error: 'Failed to load some dashboard components'
            });
        }
    }
}

module.exports = AdminController; 