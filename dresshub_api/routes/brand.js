const express = require('express');
const verifyAdmin = require('../verifyadmin.js');

const route = express.Router();

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/brands/');
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.').pop();
    const filename = Date.now() + '_' + file.originalname.replace(/[^a-zA-Z0-9]/g, '') + '.' + ext;
    cb(null, filename);
  }
});
const upload = multer({ storage: storage });

// AddBrand route:
route.post('/addbrand', verifyAdmin, upload.single('brand_image'), async (req, res) => {
  try {
    const { brand_name, vendor_id } = req.body;
    const brand_image = req.file ? req.file.path : '';

    const brand_id = parseInt(Math.random() * 10000000000);
    const response = await db
      .promise()
      .query(
        `INSERT INTO brands (brand_id,brand_name,brand_image,vendor_id) VALUES (?, ?, ?, ?)`,
        [brand_id, brand_name, brand_image, vendor_id]
      );
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

const db = require('../db');
//http://localhost:4000/brand/allbrands
route.get('/allbrands', async (req, res) => {
  try {
    const query = 'SELECT * FROM brands WHERE isactive = 1';
    const [response] = await db.promise().query(query);
    console.log(response)
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

// http://localhost:4000/brand/brandbyid/:id
route.get('/brandbyid/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM brands WHERE brand_id=? AND isactive=1';
    const [response] = await db.promise().query(query, [id]);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/brand/brandbycategoryid/:categoryid
route.get('/brandbycategoryid/:categoryid', async (req, res) => {
  try {
    const { categoryid } = req.params;
    const query = 'SELECT * FROM brands WHERE isactive=1';
    const [response] = await db.promise().query(query);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});


//http://localhost:4000/brand/getVendorIds
route.get('/getVendorIds', async (req, res) => {
  try {
    const query = 'SELECT DISTINCT vendor_id FROM brands';

    db.query(query, function (error, results) {
      if (error) {
        console.error('Error retrieving vendor IDs:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      const vendorIds = results.map(row => row.vendor_id);
      // console.log("ids = ",vendorIds);

      res.status(200).json(vendorIds);
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

// http://localhost:4000/brand/removebrand/:id
route.put('/removebrand/:id', verifyAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    // delete the brand
    await db.promise().query('UPDATE brands SET isactive = 0 WHERE brand_id = ? ', [id]);
    //  delete all products related to brand
    await db.promise().query('UPDATE products SET isactive = 0 WHERE brand = ? ', [id]);
    res.status(200).json({ message: 'Brand and related products set to inactive' });
  } catch (error) {
    res.status(400).json(error);
  }
});

// http://localhost:4000/brand/updatebrand/:id
route.put('/updatebrand/:id', verifyAdmin, async (req, res) => {
  try {
    const { brand_name } = req.body;
    const id = req.params.id;
    const response = await db
      .promise()
      .query('UPDATE brands SET brand_name = ? WHERE brand_id = ?', [
        brand_name,
        id,
      ]);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});
// http://localhost:4000/brand/activeBrandsWithOrders
route.get('/activeBrandsWithOrders', async (req, res) => {
  try {
    const query = `
      SELECT 
        b.*, 
        COALESCE(SUM(p.num_times_ordered), 0) AS total_orders
      FROM 
        brands b
      LEFT JOIN 
        products p ON b.brand_id = p.brand
      WHERE 
        b.isactive = 1
      GROUP BY 
        b.brand_id
      ORDER BY 
        total_orders DESC
    `;

    const [response] = await db.promise().query(query);

    // console.log("Brand", response)
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

// http://localhost:4000/brand/searchItem/:searchQuery
route.get('/searchItem/:searchQuery', async (req, res) => {
  const { searchQuery } = req.params;
  try {
    // Add wildcards (%) around the value, not inside the SQL string
    const likeQuery = `%${searchQuery}%`;

    const query = `
      SELECT * 
      FROM brands 
      WHERE brand_id LIKE ? 
         OR brand_name LIKE ?
    `;

    const [response] = await db.promise().query(query, [likeQuery, likeQuery]);

    res.status(200).json({
      message: 'Data fetched with success',
      filteredData: response,
    });
  } catch (err) {
    res.status(400).json({
      message: 'Some error occurred',
      error: err,
    });
  }
});

module.exports = route;
