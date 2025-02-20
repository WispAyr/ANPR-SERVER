const db = require('../config/database');

class CarPark {
    static async getAll() {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM car_parks ORDER BY name', [], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }

    static async getById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM car_parks WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });
    }

    static async create({ name, location, maxCapacity }) {
        const sql = `INSERT INTO car_parks (name, location, max_capacity) 
                     VALUES (?, ?, ?)`;
        
        return new Promise((resolve, reject) => {
            db.run(sql, [name, location, maxCapacity], function(err) {
                if (err) reject(err);
                resolve(this.lastID);
            });
        });
    }

    static async update(id, { name, location, maxCapacity }) {
        const sql = `UPDATE car_parks 
                     SET name = ?, location = ?, max_capacity = ? 
                     WHERE id = ?`;
                     
        return new Promise((resolve, reject) => {
            db.run(sql, [name, location, maxCapacity, id], function(err) {
                if (err) reject(err);
                resolve(this.changes);
            });
        });
    }

    static async delete(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM car_parks WHERE id = ?', [id], function(err) {
                if (err) reject(err);
                resolve(this.changes);
            });
        });
    }

    static async getCurrentOccupancy(carParkId) {
        const sql = `
            SELECT COUNT(*) as count 
            FROM parking_events 
            WHERE car_park_id = ? 
            AND status = 'active'`;
            
        return new Promise((resolve, reject) => {
            db.get(sql, [carParkId], (err, row) => {
                if (err) reject(err);
                resolve(row ? row.count : 0);
            });
        });
    }
}

module.exports = CarPark; 