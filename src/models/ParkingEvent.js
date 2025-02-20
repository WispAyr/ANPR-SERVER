const db = require('../config/database');

class ParkingEvent {
    static async getAll({ status, carParkId, startDate, endDate } = {}) {
        let sql = `
            SELECT pe.*, 
                   cp.name as car_park_name,
                   ed.image_path as entry_image,
                   xd.image_path as exit_image
            FROM parking_events pe
            JOIN car_parks cp ON pe.car_park_id = cp.id
            LEFT JOIN vehicle_detections ed ON pe.entry_detection_id = ed.id
            LEFT JOIN vehicle_detections xd ON pe.exit_detection_id = xd.id
            WHERE 1=1
        `;
        const params = [];

        if (status) {
            sql += ' AND pe.status = ?';
            params.push(status);
        }

        if (carParkId) {
            sql += ' AND pe.car_park_id = ?';
            params.push(carParkId);
        }

        if (startDate) {
            sql += ' AND pe.entry_time >= ?';
            params.push(startDate);
        }

        if (endDate) {
            sql += ' AND pe.entry_time <= ?';
            params.push(endDate);
        }

        sql += ' ORDER BY pe.entry_time DESC';

        return new Promise((resolve, reject) => {
            db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }

    static async getById(id) {
        const sql = `
            SELECT pe.*, 
                   cp.name as car_park_name,
                   ed.image_path as entry_image,
                   ed.plate_image_path as entry_plate_image,
                   ed.confidence as entry_confidence,
                   xd.image_path as exit_image,
                   xd.plate_image_path as exit_plate_image,
                   xd.confidence as exit_confidence
            FROM parking_events pe
            JOIN car_parks cp ON pe.car_park_id = cp.id
            LEFT JOIN vehicle_detections ed ON pe.entry_detection_id = ed.id
            LEFT JOIN vehicle_detections xd ON pe.exit_detection_id = xd.id
            WHERE pe.id = ?
        `;

        return new Promise((resolve, reject) => {
            db.get(sql, [id], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });
    }

    static async updateStatus(id, status) {
        const sql = `
            UPDATE parking_events 
            SET status = ?,
                exit_time = CASE 
                    WHEN ? = 'completed' THEN datetime('now')
                    ELSE exit_time
                END
            WHERE id = ?
        `;

        return new Promise((resolve, reject) => {
            db.run(sql, [status, status, id], function(err) {
                if (err) reject(err);
                resolve(this.changes);
            });
        });
    }

    static async getActive() {
        return this.getAll({ status: 'active' });
    }

    static async getDuration(id) {
        const event = await this.getById(id);
        if (!event) return null;

        const start = new Date(event.entry_time);
        const end = event.exit_time ? new Date(event.exit_time) : new Date();
        return Math.round((end - start) / 1000 / 60); // Duration in minutes
    }
}

module.exports = ParkingEvent; 