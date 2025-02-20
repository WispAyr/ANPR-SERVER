const db = require('../config/database');
const moment = require('moment');

class VehicleDetection {
    static async create({ cameraId, licensePlate, confidence, imagePath, plateImagePath }) {
        const sql = `
            INSERT INTO vehicle_detections 
            (camera_id, license_plate, confidence, image_path, plate_image_path) 
            VALUES (?, ?, ?, ?, ?)`;

        return new Promise((resolve, reject) => {
            db.run(sql, [cameraId, licensePlate, confidence, imagePath, plateImagePath], 
                function(err) {
                    if (err) reject(err);
                    resolve(this.lastID);
                });
        });
    }

    static async findRecentDetection(licensePlate, timeWindowMs) {
        const sql = `
            SELECT * FROM vehicle_detections 
            WHERE license_plate = ? 
            AND detection_time >= datetime('now', ?) 
            ORDER BY detection_time DESC LIMIT 1`;

        const timeWindow = `-${timeWindowMs/1000} seconds`;
        
        return new Promise((resolve, reject) => {
            db.get(sql, [licensePlate, timeWindow], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });
    }
}

module.exports = VehicleDetection; 