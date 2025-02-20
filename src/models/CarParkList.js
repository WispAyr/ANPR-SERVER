const db = require('../config/database');

class CarParkList {
    static async getAll(filters = {}) {
        let sql = `
            SELECT cpl.*, cp.name as car_park_name 
            FROM car_park_lists cpl
            JOIN car_parks cp ON cpl.car_park_id = cp.id
            WHERE 1=1
        `;
        
        const params = [];
        
        if (filters.listType) {
            sql += ' AND cpl.list_type = ?';
            params.push(filters.listType);
        }
        
        if (filters.licensePlate) {
            sql += ' AND cpl.license_plate LIKE ?';
            params.push(`%${filters.licensePlate}%`);
        }
        
        if (filters.carParkId) {
            sql += ' AND cpl.car_park_id = ?';
            params.push(filters.carParkId);
        }
        
        sql += ' ORDER BY cpl.created_at DESC';
        
        return new Promise((resolve, reject) => {
            db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }

    static async getById(id) {
        const sql = `
            SELECT cpl.*, cp.name as car_park_name 
            FROM car_park_lists cpl
            JOIN car_parks cp ON cpl.car_park_id = cp.id
            WHERE cpl.id = ?`;
            
        return new Promise((resolve, reject) => {
            db.get(sql, [id], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });
    }

    static async create({ carParkId, licensePlate, listType, validFrom, validUntil }) {
        const sql = `
            INSERT INTO car_park_lists 
            (car_park_id, license_plate, list_type, valid_from, valid_until) 
            VALUES (?, ?, ?, ?, ?)`;
            
        return new Promise((resolve, reject) => {
            db.run(sql, [
                carParkId,
                licensePlate,
                listType,
                validFrom,
                validUntil
            ], function(err) {
                if (err) reject(err);
                resolve(this.lastID);
            });
        });
    }

    static async update(id, { validFrom, validUntil }) {
        const sql = `
            UPDATE car_park_lists 
            SET valid_from = ?,
                valid_until = ?
            WHERE id = ?`;
            
        return new Promise((resolve, reject) => {
            db.run(sql, [validFrom, validUntil, id], function(err) {
                if (err) reject(err);
                resolve(this.changes);
            });
        });
    }

    static async delete(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM car_park_lists WHERE id = ?', [id], function(err) {
                if (err) reject(err);
                resolve(this.changes);
            });
        });
    }

    static async checkVehicleStatus(licensePlate, carParkId) {
        const sql = `
            SELECT list_type, valid_until 
            FROM car_park_lists 
            WHERE license_plate = ? 
            AND car_park_id = ? 
            AND (valid_until IS NULL OR valid_until > datetime('now'))
            AND valid_from <= datetime('now')`;
            
        return new Promise((resolve, reject) => {
            db.get(sql, [licensePlate, carParkId], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });
    }
}

module.exports = CarParkList; 