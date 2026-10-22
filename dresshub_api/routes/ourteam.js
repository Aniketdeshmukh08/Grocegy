const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const verifyJwtAdmin = require('../verifyadmin');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/team');
  },
  filename: function (req, file, cb) {
    const filename = 'ourteam' + '-' + Date.now() + '.jpg';
    cb(null, filename);
    req.filePath = `uploads/team/${filename}`;
  },
});

const maxSize = 15 * 1024 * 1024; // 15MB limit

const upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('only .png, .jpg, and .jpeg format allowed!'));
    }
  },
});

//http://localhost:4000/ourteam
router.get('/', async (req, res) => {
  try {
    const query =
      'SELECT id, name, designation, department, image, description, sequence FROM team WHERE isactive = 1 ORDER BY sequence ASC';

    const [response] = await db.promise().query(query);

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

/*http://localhost:4000/ourteam/allourteam
router.get('/allourteam', verifyJwtAdmin, async (req, res) => {
  try {
    // srno, id, name, designation, department, image, description, sequence, isactive, sequence
    const query =
      'SELECT id, name, designation, department, image, description, sequence FROM team WHERE isactive = 1 ORDER BY sequence';
    const [response] = await db.promise().query(query);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});*/

//http://localhost:4000/ourteam/allourteam
router.get('/allourteam', verifyJwtAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const offset = (page - 1) * limit;
     //search
    const searchQuery = `
      WHERE isactive = 1 AND (
        name LIKE ? OR
        designation LIKE ? OR
        department LIKE ? OR
        description LIKE ?
      )
    `;

    const searchValue = `%${search}%`;

    const [countResult] = await db.promise().query(
      `SELECT COUNT(*) as total FROM team ${searchQuery}`,
      [searchValue, searchValue, searchValue, searchValue]
    );

    const total = countResult[0].total;

    const [response] = await db.promise().query(
      `
      SELECT id, name, designation, department, image, description, sequence
      FROM team
      ${searchQuery}
      ORDER BY sequence
      LIMIT ? OFFSET ?
      `,
      [searchValue, searchValue, searchValue, searchValue, limit, offset]
    );

    res.status(200).json({
      data: response,
      total,
      page,
      limit
    });

  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

//http://localhost:4000/ourteam/ourteambyid/:id
router.get('/ourteambyid/:id', verifyJwtAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM team WHERE id=? AND isactive=1 ORDER BY id ASC';
    const [response] = await db.promise().query(query, [id]);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/ourteam/addourteam

router.post('/addourteam', verifyJwtAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, designation, department, description, sequence } = req.body;
    let image = req.file ? req.file.path : null;

    if (image) {
      image = image.replace(/\\/g, '/');
    }

    const id = parseInt(Math.random() * 10000000000);

    const response = await db
      .promise()
      .query(
        'INSERT INTO team (id, name, designation, department, image, description, sequence) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, name, designation, department, image, description, sequence]
      );

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

//http://localhost:4000/ourteam/removeourteam/:id

router.put('/removeourteam/:id', verifyJwtAdmin, async (req, res) => {
  try {
    const id = req.params.id;

    // Execute the query
    const [result] = await db
      .promise()
      .query('UPDATE team SET isactive = 0 WHERE id = ?', [id]);

    // Check if any row was affected (meaning the id existed and was updated)
    if (result.affectedRows > 0) {
      res
        .status(200)
        .json({ message: 'Team member deactivated successfully.' });
    } else {
      res.status(404).json({ message: 'Team member not found.' });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//http://localhost:4000/ourteam/updateourteam/:id

router.put('/updateourteam/:id', verifyJwtAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, designation, department, description, sequence } = req.body;
    const { id } = req.params;

    let image = req.file ? req.file.path.replace(/\\/g, '/') : req.body.image;

    const query = `
      UPDATE team 
      SET name = ?, designation = ?, department = ?, image = ?, description = ?, sequence = ?
      WHERE id = ? AND isactive = 1
    `;

    const response = await db
      .promise()
      .query(query, [
        name,
        designation,
        department,
        image,
        description,
        sequence,
        id,
      ]);

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
