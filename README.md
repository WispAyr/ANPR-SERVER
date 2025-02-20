# ANPR Parking System

## Overview
The ANPR (Automatic Number Plate Recognition) Parking System is a software solution designed to manage vehicle entry, exit, and parking events within monitored car parks. The system uses ANPR cameras to detect vehicle license plates, process detection events, and enforce parking rules automatically.

---

## Key Features
- **Vehicle Detection Management:** Supports multi-camera setups, deduplication, and image handling.
- **Parking Event Processing:** Automates entry/exit event handling and parking duration calculation.
- **Enforcement Engine:** Applies parking rules, manages whitelists/blacklists, and triggers enforcement actions.
- **Data Management:** Real-time reporting, historical data storage, and API integration.

---

## System Architecture
- **ANPR Cameras:** Provide vehicle detection data.
- **Node.js Backend:** Manages data processing and enforcement logic.
- **SQLite Database:** Stores data on detections, parking events, and enforcement actions.
- **Enforcement Engine:** Evaluates rules and triggers actions.

### Data Flow
1. **Detection:** Cameras send detection events to the backend.
2. **Processing:** Backend handles deduplication and parking event management.
3. **Enforcement:** The engine applies rules and manages violations.
4. **Reporting:** Provides API and dashboard outputs.

---

## Installation
```sh
git clone https://github.com/yourusername/anpr-parking-system.git
cd anpr-parking-system
npm install
node server.js
```

### Database Setup
Ensure the SQLite database file `anpr_parking_system.db` is initialized using the provided schema.

---

## Usage
- Add vehicle detection events using `addVehicleDetection()`.
- Retrieve active parking events with `getActiveParkingEvents()`.
- Automatically handle entry and exit detections via the enforcement engine.

---

## Example Use Case
1. **Vehicle Entry:** Detection event triggers a new parking event.
2. **Rule Application:** Evaluates whitelists, blacklists, and duration rules.
3. **Vehicle Exit:** Completes the parking event and triggers enforcement if needed.

---

## Future Enhancements
- Predictive analytics for parking trends.
- Web-based dashboard for management.
- API integration with external systems.

---

## License
This project is licensed under the MIT License.
