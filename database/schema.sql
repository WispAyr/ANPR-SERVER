-- Car Parks
CREATE TABLE IF NOT EXISTS car_parks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT,
    max_capacity INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Cameras
CREATE TABLE IF NOT EXISTS cameras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT,
    car_park_id INTEGER NOT NULL,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (car_park_id) REFERENCES car_parks(id)
);

-- Vehicle Detections
CREATE TABLE IF NOT EXISTS vehicle_detections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    camera_id INTEGER NOT NULL,
    license_plate TEXT NOT NULL,
    confidence REAL,
    image_path TEXT,
    plate_image_path TEXT,
    detected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (camera_id) REFERENCES cameras(id)
);

-- Parking Events
CREATE TABLE IF NOT EXISTS parking_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    car_park_id INTEGER NOT NULL,
    license_plate TEXT NOT NULL,
    entry_detection_id INTEGER,
    exit_detection_id INTEGER,
    entry_time DATETIME NOT NULL,
    exit_time DATETIME,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (car_park_id) REFERENCES car_parks(id),
    FOREIGN KEY (entry_detection_id) REFERENCES vehicle_detections(id),
    FOREIGN KEY (exit_detection_id) REFERENCES vehicle_detections(id)
);

-- Parking Rules
CREATE TABLE IF NOT EXISTS parking_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    car_park_id INTEGER NOT NULL,
    max_duration_minutes INTEGER,
    overnight_parking_allowed BOOLEAN DEFAULT 0,
    start_time TIME,
    end_time TIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (car_park_id) REFERENCES car_parks(id)
);

-- Car Park Lists (Whitelist/Blacklist)
CREATE TABLE IF NOT EXISTS car_park_lists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    car_park_id INTEGER NOT NULL,
    license_plate TEXT NOT NULL,
    list_type TEXT NOT NULL,
    valid_from DATETIME NOT NULL,
    valid_until DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (car_park_id) REFERENCES car_parks(id)
);

-- Enforcement Actions
CREATE TABLE IF NOT EXISTS enforcement_actions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    parking_event_id INTEGER NOT NULL,
    action_type TEXT NOT NULL,
    reason TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parking_event_id) REFERENCES parking_events(id)
); 