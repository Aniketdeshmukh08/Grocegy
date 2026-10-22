const express = require('express');

const route = express.Router();

const db = require('../db');
const verifyJwtAdmin = require('../verifyadmin');

//http://localhost:4000/vendor/allvendors

route.get('/allvendors',verifyJwtAdmin, async (req, res) => {
  try {
    const query = `SELECT * FROM vendor_details WHERE isactive = 1`;
    const [response] = await db.promise().query(query);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/vendor/vendorbyid/:id
route.get('/vendorbyid/:id',verifyJwtAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const query = `SELECT * FROM vendor_details WHERE vendor_id=? AND isactive = 1`;
    const [response] = await db.promise().query(query, [id]);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/vendor/addvendor
route.post('/addvendor',verifyJwtAdmin, async (req, res) => {
  try {
    // let temporaryNameCounter = 0;
    // temporaryNameCounter++;
    // const vendor_name = `temporaryname${temporaryNameCounter}`;
    const { vendor_description, vendor_name } = req.body;
    const vendor_id = parseInt(Math.random() * 10000000000);
    const query = `INSERT INTO vendor_details (vendor_name, vendor_description, vendor_id, updatedby) VALUES (?,?,?,?)`;
    const response = await db
      .promise()
      .query(query, [vendor_name, vendor_description, vendor_id, 'admin']);
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/vendor/updatevendor/:id
route.put('/updatevendor/:id',verifyJwtAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { vendor_name, vendor_description } = req.body;
    const query = `UPDATE vendor_details SET vendor_name = ?, vendor_description = ?, updatedon = NOW(), updatedby = ? WHERE vendor_id = ? AND isactive = 1`;
    const [response] = await db
      .promise()
      .query(query, [vendor_name, vendor_description,"admin", id]);
      if (response.affectedRows === 0) {
        return res.status(404).json({ message: 'Vendor not found or already inactive.' });
      }
  
      res.status(200).json({ message: 'Vendor updated successfully.', affectedRows: response.affectedRows });
  } catch (error) {
    res.status(400).json(error);
  }
});
//http://localhost:4000/vendor/removevendor/:id
route.put('/removevendor/:id',verifyJwtAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const query = `UPDATE vendor_details SET isactive = 0 WHERE vendor_det_srno = ?`;
    const response = await db.promise().query(query, [id]);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

route.get('/searchItem/:value',verifyJwtAdmin, async (req, res) => {
  const {value} = req.params;
  const queryVal = `%${value}%`;
  try {
    const query = `SELECT * FROM vendor_details WHERE isactive = 1 AND (vendor_id LIKE ? OR vendor_name LIKE ?)`;
    const [response] = await db.promise().query(query, [queryVal, queryVal]);
    res.status(200).json({MESSAGE: "Data fetched successfully", filteredData: response});
  } catch (error) {
    res.status(400).json({message: "Something went wrong while fetching data", error: error});
  }
});

module.exports = route;
