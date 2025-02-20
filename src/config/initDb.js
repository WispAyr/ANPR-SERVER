const fs = require('fs');
const path = require('path');
const db = require('./database');

class DatabaseInitializer {
    constructor() {
        this.dbPath = path.join(__dirname, '../../database/anpr.db');
        this.schemaPath = path.join(__dirname, '../../database/schema.sql');
        this.seedPath = path.join(__dirname, '../../database/seed.sql');
    }

    async init() {
        try {
            // Create database directory if it doesn't exist
            const dbDir = path.dirname(this.dbPath);
            if (!fs.existsSync(dbDir)) {
                fs.mkdirSync(dbDir, { recursive: true });
            }

            // Always run schema and seed on initialization
            console.log('Initializing database...');
            await this.runSchema();
            await this.runSeed();
            console.log('Database initialization complete');

            return db;
        } catch (error) {
            console.error('Database initialization failed:', error);
            throw error;
        }
    }

    runSchema() {
        return new Promise((resolve, reject) => {
            try {
                const schema = fs.readFileSync(this.schemaPath, 'utf8');
                db.exec(schema, (err) => {
                    if (err) {
                        console.error('Schema execution failed:', err);
                        reject(err);
                    } else {
                        console.log('Schema executed successfully');
                        resolve();
                    }
                });
            } catch (error) {
                console.error('Failed to read schema file:', error);
                reject(error);
            }
        });
    }

    runSeed() {
        return new Promise((resolve, reject) => {
            try {
                const seed = fs.readFileSync(this.seedPath, 'utf8');
                db.exec(seed, (err) => {
                    if (err) {
                        console.error('Seed execution failed:', err);
                        reject(err);
                    } else {
                        console.log('Seed data inserted successfully');
                        resolve();
                    }
                });
            } catch (error) {
                console.error('Failed to read seed file:', error);
                reject(error);
            }
        });
    }
}

module.exports = DatabaseInitializer; 