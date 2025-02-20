const db = require('../config/database');

class EnforcementAction {
    static async getByParkingEventId(parkingEventId) {
        const sql = `
            SELECT * FROM enforcement_actions 
            WHERE parking_event_id = ?
            ORDER BY created_at DESC`;
            
        return new Promise((resolve, reject) => {
            db.all(sql, [parkingEventId], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }

    static async create({ parkingEventId, actionType, reason }) {
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

    static async getStats() {
        const sql = `
            SELECT action_type, COUNT(*) as count 
            FROM enforcement_actions 
            GROUP BY action_type`;
            
        return new Promise((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }
}

module.exports = EnforcementAction; 