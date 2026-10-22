const express = require('express');
const route = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../db');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'categoryuploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Upload image for a category
// URL: POST http://localhost:4000/images/upload/:categoryId
route.post('/upload/:categoryId', upload.single('image'), async (req, res) => {
  try {
    const { categoryId } = req.params;
    const imagePath = req.file.path;
    const query = 'UPDATE category SET categoryimage = ? WHERE category_id = ?';
    await db.promise().query(query, [imagePath, categoryId]);
    res.status(200).json({ message: 'Image uploaded successfully', imagePath });
  } catch (error) {
    res.status(400).json(error);
  }
});

// Update image for a category
// URL: PUT http://localhost:4000/images/update/:categoryId
route.put('/update/:categoryId', upload.single('image'), async (req, res) => {
  try {
    const { categoryId } = req.params;
    const imagePath = req.file.path;
    const query = 'UPDATE category SET categoryimage = ? WHERE category_id = ?';
    await db.promise().query(query, [imagePath, categoryId]);
    res.status(200).json({ message: 'Image updated successfully', imagePath });
  } catch (error) {
    res.status(400).json(error);
  }
});

// Delete image for a category
// URL: DELETE http://localhost:4000/images/delete/:categoryId
route.delete('/delete/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const query =
      'UPDATE category SET categoryimage = NULL WHERE category_id = ?';
    await db.promise().query(query, [categoryId]);
    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(400).json(error);
  }
});

// Get image for a category
// URL: GET http://localhost:4000/images/:categoryId
route.get('/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const query = 'SELECT categoryimage FROM category WHERE category_id = ?';
    const [images] = await db.promise().query(query, [categoryId]);
    res.status(200).json(images);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = route;
