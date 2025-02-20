const VehicleDetection = require('../models/VehicleDetection');
const ParkingService = require('./ParkingService');
const { processImage, savePlateImage } = require('../utils/imageProcessor');
const config = require('../config/config');

class DetectionService {
    static async processDetection(detectionData) {
        try {
            // Check for duplicate detection
            const recentDetection = await VehicleDetection.findRecentDetection(
                detectionData.licensePlate,
                config.MAX_DETECTION_WINDOW_MS
            );

            if (recentDetection) {
                console.log('Duplicate detection ignored:', detectionData.licensePlate);
                return null;
            }

            // Process and save images
            const imagePath = await processImage(detectionData.vehicleImage);
            const plateImagePath = await savePlateImage(detectionData.plateImage);

            // Create detection record
            const detectionId = await VehicleDetection.create({
                cameraId: detectionData.cameraId,
                licensePlate: detectionData.licensePlate,
                confidence: detectionData.confidence,
                imagePath,
                plateImagePath
            });

            // Process parking event
            await ParkingService.handleDetection(detectionId);

            return detectionId;
        } catch (error) {
            console.error('Error processing detection:', error);
            throw error;
        }
    }
}

module.exports = DetectionService; 