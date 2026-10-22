const express = require('express');
const route = express.Router();
const db = require('../db');

// GET http://localhost:4000/address/allAddress?page=1&limit=10&search=keyword
route.get('/allAddress', async (req, res) => {
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
          userid LIKE ? 
          OR name LIKE ? 
          OR city LIKE ?
          OR contact LIKE ?
        )
      `;
      searchValues = [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`];
    }

    const countQuery = `SELECT COUNT(*) AS total FROM address WHERE isactive = 1 ${searchCondition}`;
    const [countResult] = await db.promise().query(countQuery, searchValues);
    const totalRecords = countResult[0].total;
    const totalPages = Math.ceil(totalRecords / limit);

    const dataQuery = `SELECT * FROM address WHERE isactive = 1 ${searchCondition} ORDER BY addressid DESC LIMIT ${limit} OFFSET ${offset}`;
    const [addresses] = await db.promise().query(dataQuery, searchValues);

    res.status(200).json({
      data: addresses,
      currentPage: page,
      totalPages,
      totalRecords,
      limit,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve Addresses", error });
  }
});

//http://localhost:4000/address/addAddress

route.post('/addAddress', async (req, res) => {
  try {
    const {
      userid,
      name,
      line1,
      line2,
      line3,
      city,
      state,
      country,
      pin,
      contact,
      alternatecontact,
      landmark,
    } = req.body;

    const addressid = parseInt(Math.random() * 100000000);

    const response = await db
      .promise()
      .query(
        'INSERT INTO address (userid,addressid,name,line1,line2,line3,city,state,country,pin,contact,alternatecontact,landmark) VALUES ( ?,?, ?, ?, ?, ?,?,?, ?, ?, ?, ?, ?)',
        [
          userid,
          addressid,
          name,
          line1,
          line2,
          line3,
          city,
          state,
          country,
          pin,
          contact,
          alternatecontact,
          landmark,
        ]
      );

    res.status(200).json({ ...response, addressid });
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/address/addressById/:addressId
route.get('/addressById/:addressId', async (req, res) => {
  try {
    const { addressId } = req.params;
    const query = 'SELECT * FROM address WHERE addressid =? AND isactive=1';
    const [response] = await db.promise().query(query, [addressId]);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/address/getByuserId/:userId
route.get('/getByuserId/:userid', async (req, res) => {
  try {
    const { userid } = req.params;
    const query = 'SELECT * FROM address WHERE userid =? AND isactive=1';
    const [response] = await db.promise().query(query, [userid]);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});


//http://localhost:4000/address/setDefault/:addressId
route.put('/setDefault/:addressId', async (req, res) => {
  const { userid } = req.body;
  const { addressId } = req.params;

  try {
    // Reset all user's addresses
    await db.promise().query(
      'UPDATE address SET is_default = 0 WHERE userid = ?',
      [userid]
    );

    // Set selected one to default
    await db.promise().query(
      'UPDATE address SET is_default = 1 WHERE addressid = ?',
      [addressId]
    );

    res.status(200).json({ message: 'Default address updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error setting default address' });
  }
});


//http://localhost:4000/address/deleteAddress/:addressId
route.put('/deleteAddress/:addressId', async (req, res) => {
  try {
    const { addressId } = req.params;
    const response = await db
      .promise()
      .query('UPDATE address SET isactive = 0 WHERE  addressid = ? ', [
        addressId,
      ]);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/address/updateAddress/:addressId
route.put('/updateAddress/:addressId', async (req, res) => {
  try {
    const { addressId } = req.params;
    const myObject = req.body;

    const updateFields = [];
    const values = [];

    Object.keys(myObject).forEach(key => {
      const value = myObject[key];

      if (
        value != null &&
        value !== '' &&
        !(typeof value === 'number' && isNaN(value))
      ) {
        // Use parameterized queries to prevent SQL injection
        updateFields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (updateFields.length > 0) {
      // Assuming cust_det_srno is a key in myObject
      const updateQuery = `UPDATE address SET ${updateFields.join(', ')} WHERE addressid = ?`;
      values.push(addressId);

      // Execute the update query
      const [response] = await db.promise().query(updateQuery, values);

      res.status(200).json(response);
    } else {
      res
        .status(400)
        .json({ message: 'Error: No valid fields provided for update.' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = route;
