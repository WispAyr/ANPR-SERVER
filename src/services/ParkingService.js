const moment = require('moment');
const db = require('../config/database');
const EnforcementService = require('./EnforcementService');

class ParkingService {
    static async handleDetection(detectionId) {
        const detection = await this.getDetectionDetails(detectionId);
        const cameraMapping = await this.getCameraLaneMapping(detection.camera_id);

        if (cameraMapping.direction === 'entry') {
            await this.handleEntry(detection);
        } else {
            await this.handleExit(detection);
        }
    }

    static async handleEntry(detection) {
        const sql = `
            INSERT INTO parking_events 
            (license_plate, car_park_id, entry_detection_id, entry_time, status) 
            VALUES (?, ?, ?, datetime('now'), 'active')`;

        return new Promise((resolve, reject) => {
            db.run(sql, 
                [detection.license_plate, detection.car_park_id, detection.id], 
                async function(err) {
                    if (err) reject(err);
                    
                    // Check parking rules after entry
                    await EnforcementService.checkEntryRules(this.lastID);
                    resolve(this.lastID);
                });
        });
    }

    static async handleExit(detection) {
        const sql = `
            UPDATE parking_events 
            SET exit_detection_id = ?, 
                exit_time = datetime('now'), 
                status = 'completed' 
            WHERE license_plate = ? 
            AND status = 'active'`;

        return new Promise((resolve, reject) => {
            db.run(sql, [detection.id, detection.license_plate], 
                async function(err) {
                    if (err) reject(err);
                    
                    // Check parking rules after exit
                    await EnforcementService.checkExitRules(this.lastID);
                    resolve(this.changes);
                });
        });
    }

    // Helper methods
    static async getDetectionDetails(detectionId) {
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT vd.*, c.car_park_id 
                 FROM vehicle_detections vd 
                 JOIN cameras c ON vd.camera_id = c.id 
                 WHERE vd.id = ?`, 
                [detectionId], 
                (err, row) => {
                    if (err) reject(err);
                    resolve(row);
                });
        });
    }

    static async getCameraLaneMapping(cameraId) {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM camera_lane_mappings WHERE camera_id = ?',
                [cameraId],
                (err, row) => {
                    if (err) reject(err);
                    resolve(row);
                });
        });
    }
}

module.exports = ParkingService; 