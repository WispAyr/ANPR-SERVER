const db = require('../config/database');

class Camera {
    static async getAll() {
        const sql = `
            SELECT c.*, cp.name as car_park_name 
            FROM cameras c
            JOIN car_parks cp ON c.car_park_id = cp.id
            ORDER BY c.name`;
            
        return new Promise((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }

    static async getById(id) {
        const sql = `
            SELECT c.*, cp.name as car_park_name 
            FROM cameras c
            JOIN car_parks cp ON c.car_park_id = cp.id
            WHERE c.id = ?`;
            
        return new Promise((resolve, reject) => {
            db.get(sql, [id], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });
    }

    static async create({ name, location, carParkId, status = 'active' }) {
        const sql = `
            INSERT INTO cameras (name, location, car_park_id, status) 
            VALUES (?, ?, ?, ?)`;
            
        return new Promise((resolve, reject) => {
            db.run(sql, [name, location, carParkId, status], function(err) {
                if (err) reject(err);
                resolve(this.lastID);
            });
        });
    }

    static async update(id, { name, location, carParkId, status }) {
        const sql = `
            UPDATE cameras 
            SET name = ?, 
                location = ?, 
                car_park_id = ?, 
                status = ?
            WHERE id = ?`;
            
        return new Promise((resolve, reject) => {
            db.run(sql, [name, location, carParkId, status, id], function(err) {
                if (err) reject(err);
                resolve(this.changes);
            });
        });
    }

    static async delete(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM cameras WHERE id = ?', [id], function(err) {
                if (err) reject(err);
                resolve(this.changes);
            });
        });
    }
}

module.exports = Camera; 