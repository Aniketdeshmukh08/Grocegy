const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyJwtAdmin = require('../verifyadmin');

//http://localhost:4000/settings/allsettings
router.get('/allsettings', verifyJwtAdmin, async (req, res) => {
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
          setting_name LIKE ? 
          OR setting_value LIKE ?
        )
      `;
      searchValues = [`%${search}%`, `%${search}%`];
    }

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM settings
      WHERE isactive = 1
      ${searchCondition}
    `;

    const [countResult] = await db
      .promise()
      .query(countQuery, searchValues);

    const totalRecords = countResult[0].total;
    const totalPages = Math.ceil(totalRecords / limit);

    
    const dataQuery = `
      SELECT setting_id, setting_name, setting_value
      FROM settings
      WHERE isactive = 1
      ${searchCondition}
      ORDER BY setting_id DESC
      LIMIT ? OFFSET ?
    `;

    const [settings] = await db
      .promise()
      .query(dataQuery, [...searchValues, limit, offset]);

    res.status(200).json({
      data: settings,
      currentPage: page,
      totalPages,
      totalRecords,
      limit,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to retrieve settings",
    });
  }
});


//http://localhost:4000/settings/settingbyid/marketstatus
router.get('/settingbyid/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM settings WHERE setting_id=? AND isactive=1';
    const [response] = await db.promise().query(query, [id]);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/settings/addsetting
router.post('/addsetting', verifyJwtAdmin, async (req, res) => {
  try {
    const { setting_name, setting_value } = req.body;

    const setting_id = `${setting_name.substring(0, 5)}${Math.floor(
      10000 + Math.random() * 90000
    )}`;
    if (!setting_id || !setting_name || !setting_value) {
      return res.status(400).json({
        error:
          'All fields (setting_id, setting_name, setting_value) are required.',
      });
    }
    const response = await db
      .promise()
      .query(
        `INSERT INTO settings (setting_id, setting_name,setting_value,isactive) VALUES ('${setting_id}','${setting_name}','${setting_value}',"1")`
      );
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/settings/removesetting/12345
router.put('/removesetting/:id',verifyJwtAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const response = await db
      .promise()
      .query('UPDATE settings SET isactive = 0 WHERE setting_id = ? ', [id]);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/settings/updatesetting/123456
router.put('/updatesetting/:id',verifyJwtAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const { setting_name, setting_value } = req.body;

    if (!id || !setting_name || !setting_value) {
      return res.status(400).json({
        error: 'All fields (id, setting_name, setting_value) are required.',
      });
    }

    const response = await db
      .promise()
      .query(
        'UPDATE settings SET setting_name = ?, setting_value = ? WHERE setting_id = ?',
        [setting_name, setting_value, id]
      );

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

// http://localhost:4000/settings/notice
router.get('/notice', async (req, res) => {
  try {
    const query =
      'SELECT setting_id, setting_name, setting_value, isactive FROM settings WHERE isactive = 1 AND setting_id = ? ORDER BY srno DESC';
    const [response] = await db.promise().query(query, ['marketstatus']);

    if (response.length === 0) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    res.status(200).json(response[0]);
  } catch (error) {
    console.error('Error fetching notice:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching the notice.' });
  }
});

module.exports = router;
