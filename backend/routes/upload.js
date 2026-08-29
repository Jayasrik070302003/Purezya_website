const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const auth = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Helper for Cloudinary stream upload
const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'Purazya_products',
                resource_type: 'auto'
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        uploadStream.end(fileBuffer);
    });
};

router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file uploaded' });
        }

        const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
        const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
        const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

        // 1. Try Cloudinary if keys are present
        if (cloudName && apiKey && apiSecret) {
            try {
                const result = await uploadToCloudinary(req.file.buffer);
                return res.json({
                    url: result.secure_url,
                    public_id: result.public_id,
                    provider: 'cloudinary'
                });
            } catch (cloudErr) {
                console.error('Cloudinary upload failed, falling back to local storage:', cloudErr.message);
                // Fallback continues below
            }
        }

        // 2. Local Storage Fallback (stores in /uploads and serves statically)
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const cleanName = req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        const uniqueFilename = `${Date.now()}-${cleanName}`;
        const filePath = path.join(uploadDir, uniqueFilename);

        fs.writeFileSync(filePath, req.file.buffer);

        const protocol = req.headers['x-forwarded-proto'] || req.protocol;
        const host = req.get('host');
        const fileUrl = `${protocol}://${host}/uploads/${uniqueFilename}`;

        return res.json({
            url: fileUrl,
            provider: 'local',
            note: 'Image stored securely. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env for cloud hosting.'
        });
    } catch (error) {
        console.error('Upload route error:', error);
        res.status(500).json({ message: 'Error processing image upload', error: error.message });
    }
});

module.exports = router;
