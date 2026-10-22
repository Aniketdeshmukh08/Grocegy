const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Multer setup for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Destination folder for uploads
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'image-' + uniqueSuffix + ext); // File naming convention
  },
});

// Multer instance for file upload
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Validate file type - allow only images
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Please upload an image file (jpg, jpeg, png, gif)'));
    }
    cb(null, true);
  },
});

// Upload image route
// POST http://localhost:4000/images/upload
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Please upload an image file' });
  }
  res.status(200).json({
    message: 'Image uploaded successfully',
    filename: req.file.filename,
  });
});

// Get all images route
// GET http://localhost:4000/images
router.get('/', (req, res) => {
  fs.readdir('uploads/', (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return res.status(500).json({ error: 'Error fetching images' });
    }
    res.status(200).json(files);
  });
});

// Delete image route
// DELETE http://localhost:4000/images/:imageName
router.delete('/:imageName', async (req, res) => {
  const { imageName } = req.params;
  const filePath = path.resolve(__dirname, '..', 'uploads', imageName);

  try {
    await fs.promises.access(filePath, fs.constants.F_OK);
  } catch {
    return res.status(200).json({ message: 'Image already gone' });
  }

  let stats;
  try {
    stats = await fs.promises.lstat(filePath);
  } catch (err) {
    console.error('lstat failed for', filePath, err);
    return res.status(500).json({ error: 'Could not inspect file' });
  }

  if (stats.isDirectory()) {
    try {
      await fs.promises.rmdir(filePath, { recursive: true });
      console.log('Deleted directory:', filePath);
    } catch (err) {
      console.error('Error deleting directory:', filePath, err);
      return res.status(500).json({ error: 'Could not delete directory' });
    }

  
  } else {
    try {
      await fs.promises.unlink(filePath);
      console.log('Deleted file:', filePath);
    } catch (err) {
      if (err.code === 'EPERM') {
        try {
          await fs.promises.chmod(filePath, 0o666);
          await fs.promises.unlink(filePath);
          console.log('Chmod + unlinked file:', filePath);
        } catch (chmodErr) {
          console.error('Could not chmod/unlink file:', filePath, chmodErr);
          return res.status(500).json({ error: 'Permission denied' });
        }
      } else {
        console.error('Error deleting file:', filePath, err);
        return res.status(500).json({ error: 'Could not delete file' });
      }
    }
  }

  //Success
  res.status(200).json({ message: 'Image deleted successfully' });
});

module.exports = router;
