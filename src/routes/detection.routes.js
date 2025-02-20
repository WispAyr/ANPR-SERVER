const express = require('express');
const router = express.Router();
const multer = require('multer');
const DetectionService = require('../services/DetectionService');

const upload = multer({ dest: 'uploads/' });

router.post('/detection', upload.fields([
    { name: 'vehicleImage', maxCount: 1 },
    { name: 'plateImage', maxCount: 1 }
]), async (req, res) => {
    try {
        const detectionData = {
            cameraId: req.body.cameraId,
            licensePlate: req.body.licensePlate,
            confidence: parseFloat(req.body.confidence),
            vehicleImage: req.files.vehicleImage[0],
            plateImage: req.files.plateImage[0]
        };

        const detectionId = await DetectionService.processDetection(detectionData);
        res.json({ success: true, detectionId });
    } catch (error) {
        console.error('Error processing detection:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router; 