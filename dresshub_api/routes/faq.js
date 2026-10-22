const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyJwtAdmin = require('../verifyadmin');

router.get('/get-public-faqs', async (req, res) => {
  const normalizedType = String(req.query.type || 'user')
    .trim()
    .toLowerCase();

  try {
    const [rows] = await db.promise().query(
      `SELECT faq_id, question, answer
       FROM faqs
       WHERE isactive = 1
         AND (LOWER(TRIM(type)) = ? OR LOWER(TRIM(type)) = 'all')
       ORDER BY created_on DESC`,
      [normalizedType]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch FAQs' });
  }
});


// GET http://localhost:4000/faq/faqs?page=1&limit=10&search=keyword
router.get("/faqs", verifyJwtAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const offset = (page - 1) * limit;

    let searchCondition = "";
    let searchValues = [];

    if (search) {
      searchCondition = `
        AND (
          question LIKE ? 
          OR answer LIKE ? 
          OR type LIKE ?
        )
      `;
      searchValues = [`%${search}%`, `%${search}%`, `%${search}%`];
    }

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM faqs
      WHERE isactive = 1
      ${searchCondition}
    `;

    const [countResult] = await db
      .promise()
      .query(countQuery, searchValues);

    const totalRecords = countResult[0].total;
    const totalPages = Math.ceil(totalRecords / limit);

    const dataQuery = `
      SELECT faq_id, question, answer, type
      FROM faqs
      WHERE isactive = 1
      ${searchCondition}
      ORDER BY faq_id DESC
      LIMIT ? OFFSET ?
    `;

    const [faqs] = await db
      .promise()
      .query(dataQuery, [...searchValues, limit, offset]);

    res.status(200).json({
      data: faqs,
      currentPage: page,
      totalPages,
      totalRecords,
      limit,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to retrieve FAQs",
    });
  }
});

router.get('/public', async (req, res) => {
  const { type } = req.query;
  try {
    if (!type) {
      return res.status(400).json({ error: 'Type query parameter is required' });
    }
    const [rows] = await db.promise().query(
      `SELECT faq_id, question, answer 
       FROM faqs 
       WHERE isactive = 1 
         AND (type = ? OR type = 'all')
       ORDER BY created_on`, 
      [type]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch FAQs' });
  }
});

// Get single FAQ
router.get('/:faq_id',verifyJwtAdmin, async (req, res) => {
  try {
    const { faq_id } = req.params;
    const query = 'SELECT * FROM faqs WHERE faq_id = ? AND isactive = 1';
    const [faq] = await db.promise().query(query, [faq_id]);
    if (faq.length === 0) return res.status(404).json({ message: 'FAQ not found' });
    res.status(200).json(faq[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve FAQ' });
  }
});

// Add FAQ
router.post('/add',verifyJwtAdmin, async (req, res) => {
  try {
    const { question, answer, type } = req.body;
    if (!question || !answer || !type)
      return res.status(400).json({ error: 'All fields are required' });

    const query = 'INSERT INTO faqs (question, answer, type, created_on, updated_on) VALUES (?, ?, ?, NOW(), NOW())';
    const [result] = await db.promise().query(query, [question, answer, type]);
    res.status(201).json({ message: 'FAQ added successfully', faq_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add FAQ' });
  }
});

// Update FAQ
router.put('/:faq_id',verifyJwtAdmin, async (req, res) => {
  try {
    const { faq_id } = req.params;
    const { question, answer, type } = req.body;
    const query = 'UPDATE faqs SET question = ?, answer = ?, type = ?, updated_on = NOW() WHERE faq_id = ? AND isactive = 1';
    const [result] = await db.promise().query(query, [question, answer, type, faq_id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'FAQ not found or inactive' });
    res.status(200).json({ message: 'FAQ updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update FAQ' });
  }
});

//  Soft delete using PUT
router.put('/remove/:faq_id',verifyJwtAdmin, async (req, res) => {
  try {
    const { faq_id } = req.params;

    const query = 'UPDATE faqs SET isactive = 0, updated_on = NOW() WHERE faq_id = ?';
    const [result] = await db.promise().query(query, [faq_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'FAQ not found or already inactive' });
    }

    res.status(200).json({ message: 'FAQ soft-deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete FAQ' });
  }
});


module.exports = router;
