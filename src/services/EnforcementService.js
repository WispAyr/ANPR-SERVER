const db = require('../config/database');
const moment = require('moment');

class EnforcementService {
    static async checkEntryRules(parkingEventId) {
        const event = await this.getParkingEvent(parkingEventId);
        
        // Check blacklist
        const isBlacklisted = await this.isVehicleBlacklisted(
            event.license_plate, 
            event.car_park_id
        );
        
        if (isBlacklisted) {
            await this.createEnforcementAction(parkingEventId, 'blacklist_violation', 
                'Vehicle is blacklisted');
        }
    }

    static async checkExitRules(parkingEventId) {
        const event = await this.getParkingEvent(parkingEventId);
        const rules = await this.getParkingRules(event.car_park_id);
        
        // Check maximum duration
        if (rules.max_duration_minutes) {
            const duration = moment(event.exit_time)
                .diff(moment(event.entry_time), 'minutes');
            
            if (duration > rules.max_duration_minutes) {
                await this.createEnforcementAction(parkingEventId, 'overstay', 
                    `Exceeded maximum duration of ${rules.max_duration_minutes} minutes`);
            }
        }

        // Check overnight parking
        if (!rules.overnight_parking_allowed) {
            const entryHour = moment(event.entry_time).hour();
            const exitHour = moment(event.exit_time).hour();
            
            if (entryHour >= 22 || exitHour <= 6) {
                await this.createEnforcementAction(parkingEventId, 'overnight_violation',
                    'Overnight parking not allowed');
            }
        }
    }

    static async createEnforcementAction(parkingEventId, actionType, reason) {
        const sql = `
            INSERT INTO enforcement_actions 
            (parking_event_id, action_type, reason) 
            VALUES (?, ?, ?)`;

        return new Promise((resolve, reject) => {
            db.run(sql, [parkingEventId, actionType, reason], function(err) {
                if (err) reject(err);
                resolve(this.lastID);
            });
        });
    }

    // Helper methods
    static async isVehicleBlacklisted(licensePlate, carParkId) {
        const sql = `
            SELECT COUNT(*) as count 
            FROM car_park_lists 
            WHERE license_plate = ? 
            AND car_park_id = ? 
            AND list_type = 'blacklist' 
            AND (valid_until IS NULL OR valid_until > datetime('now'))`;

        return new Promise((resolve, reject) => {
            db.get(sql, [licensePlate, carParkId], (err, row) => {
                if (err) reject(err);
                resolve(row.count > 0);
            });
        });
    }

    static async getParkingRules(carParkId) {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM parking_rules WHERE car_park_id = ?',
                [carParkId],
                (err, row) => {
                    if (err) reject(err);
                    resolve(row);
                });
        });
    }

    static async getParkingEvent(parkingEventId) {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM parking_events WHERE id = ?',
                [parkingEventId],
                (err, row) => {
                    if (err) reject(err);
                    resolve(row);
                });
        });
    }
}

module.exports = EnforcementService; 