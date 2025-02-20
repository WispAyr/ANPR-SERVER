const db = require('../config/database');

class ParkingRule {
    static async getAll() {
        const sql = `
            SELECT pr.*, cp.name as car_park_name 
            FROM parking_rules pr
            JOIN car_parks cp ON pr.car_park_id = cp.id
            ORDER BY cp.name`;
            
        return new Promise((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }

    static async getById(id) {
        const sql = `
            SELECT pr.*, cp.name as car_park_name 
            FROM parking_rules pr
            JOIN car_parks cp ON pr.car_park_id = cp.id
            WHERE pr.id = ?`;
            
        return new Promise((resolve, reject) => {
            db.get(sql, [id], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });
    }

    static async getByCarParkId(carParkId) {
        const sql = `
            SELECT * FROM parking_rules 
            WHERE car_park_id = ?`;
            
        return new Promise((resolve, reject) => {
            db.get(sql, [carParkId], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });
    }

    static async create({ carParkId, maxDurationMinutes, overnightParkingAllowed, startTime, endTime }) {
        const sql = `
            INSERT INTO parking_rules 
            (car_park_id, max_duration_minutes, overnight_parking_allowed, start_time, end_time) 
            VALUES (?, ?, ?, ?, ?)`;
            
        return new Promise((resolve, reject) => {
            db.run(sql, [
                carParkId,
                maxDurationMinutes,
                overnightParkingAllowed ? 1 : 0,
                startTime || null,
                endTime || null
            ], function(err) {
                if (err) reject(err);
                resolve(this.lastID);
            });
        });
    }

    static async update(id, { maxDurationMinutes, overnightParkingAllowed, startTime, endTime }) {
        const sql = `
            UPDATE parking_rules 
            SET max_duration_minutes = ?,
                overnight_parking_allowed = ?,
                start_time = ?,
                end_time = ?
            WHERE id = ?`;
            
        return new Promise((resolve, reject) => {
            db.run(sql, [
                maxDurationMinutes,
                overnightParkingAllowed ? 1 : 0,
                startTime || null,
                endTime || null,
                id
            ], function(err) {
                if (err) reject(err);
                resolve(this.changes);
            });
        });
    }

    static async delete(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM parking_rules WHERE id = ?', [id], function(err) {
                if (err) reject(err);
                resolve(this.changes);
            });
        });
    }
}

module.exports = ParkingRule; 