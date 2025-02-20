-- Initial Car Parks
INSERT INTO car_parks (name, location, max_capacity) VALUES 
('Main Parking', 'North Entrance', 100),
('Visitor Parking', 'East Wing', 50),
('Staff Parking', 'West Wing', 75);

-- Initial Cameras
INSERT INTO cameras (name, location, car_park_id, status) VALUES 
('CAM-001', 'Main Entrance', 1, 'active'),
('CAM-002', 'Main Exit', 1, 'active'),
('CAM-003', 'Visitor Entry', 2, 'active'),
('CAM-004', 'Staff Entry', 3, 'active');

-- Initial Vehicle Detections
INSERT INTO vehicle_detections (camera_id, license_plate, confidence, detected_at) VALUES
(1, 'ABC123', 95.5, datetime('now', '-2 hours')),
(1, 'XYZ789', 98.2, datetime('now', '-1 hour')),
(2, 'ABC123', 97.1, datetime('now', '-30 minutes'));

-- Initial Parking Events
INSERT INTO parking_events (
    car_park_id, 
    license_plate, 
    entry_detection_id,
    exit_detection_id,
    entry_time,
    exit_time,
    status
) VALUES 
(1, 'ABC123', 1, 3, datetime('now', '-2 hours'), datetime('now', '-30 minutes'), 'completed'),
(1, 'XYZ789', 2, NULL, datetime('now', '-1 hour'), NULL, 'active');

-- Initial Enforcement Actions
INSERT INTO enforcement_actions (
    parking_event_id,
    action_type,
    reason,
    created_at
) VALUES 
(1, 'warning', 'Parked in reserved spot', datetime('now', '-1 hour')),
(2, 'fine', 'Exceeded maximum parking duration', datetime('now', '-30 minutes'));

-- Initial Parking Rules
INSERT INTO parking_rules (
    car_park_id,
    max_duration_minutes,
    overnight_parking_allowed,
    start_time,
    end_time
) VALUES 
(1, 480, 0, '08:00', '20:00'),
(2, 120, 0, '09:00', '18:00'),
(3, 720, 1, NULL, NULL); 