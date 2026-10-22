const express = require('express');
const route = express.Router();
const db = require('../db');
const router = require('./customProduct');
const verifyJwtAdmin = require('../verifyadmin');

//http://localhost:4000/customProduct/getall
route.get('/getall', verifyJwtAdmin, async (req, res) => {
  try {
    const query = 'SELECT p.requestid ,p.product_name, p.product_desc, p.quantity, p.userid, p.name, p.contact FROM customproductsrequest AS p INNER JOIN users as u on u.userid = p.userid WHERE p.isactive=1 ';
    // const query = 'SELECT p.requestid ,p.product_name, p.product_desc, p.quantity, p.name, p.contact FROM customproductsrequest AS p WHERE p.isactive=1 ';
    const [response] = await db.promise().query(query);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/customProduct/getbyproductid/:requestid
route.get('/getbyproductid/:requestid', verifyJwtAdmin, async (req, res) => {
  try {
    const { requestid } = req.params; 
    const query = `SELECT requestid, name, contact, product_name, product_desc, quantity FROM customproductsrequest WHERE requestid = ?`;
    
    const [rows] = await db.promise().query(query, [requestid]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No requestIds found.' });
    }

    return res.status(200).json(rows);
  } catch (error) {
    res.status(400).json({ error: error.message }); 
  }
});


//http://localhost:4000/customProduct/addCustomProduct
route.post('/addCustomProduct', verifyJwtAdmin, async (req, res) => {
  try {
    const {name,contact,userid,product_name, product_desc, quantity} = req.body
    const today = new Date().toISOString().slice(0, 10);
    const requestid = `req_${parseInt(Math.random() * 10000000000)}`

    const query =
'INSERT INTO customproductsrequest (requestid, product_name, product_desc, quantity, userid, name, contact, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

const values = [ requestid, product_name, product_desc, quantity, userid, name, contact, today ];

  const [response] = await db.promise().query(query, values);

  res.status(200).json(response);


  } catch (error) {
    res.status(400).json(error);
  }
});


// http://localhost:4000/customProduct/updateProduct/:requestid
route.put('/updateProduct/:requestid', verifyJwtAdmin, async (req, res) => {
  try {
    const { requestid } = req.params;

    // Debugging: Check if request is reaching the server
    // console.log("Received PUT request for requestid:", requestid);
    // console.log("Request body:", req.body);

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'Error: Request Body Empty.' });
    }

    const { name, contact, product_name, product_desc, quantity } = req.body;

    if (!name || !contact || !product_name || !product_desc || !quantity) {
      return res.status(400).json({ message: 'Error: Missing required fields.' });
    }

    // Check if the product exists
    const checkQuery = 'SELECT * FROM customproductsrequest WHERE requestid = ?';
    const [rows] = await db.promise().query(checkQuery, [requestid]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Error: Product not found.' });
    }

    // Update the product details
    const query = `
      UPDATE customproductsrequest
      SET name = ?, contact = ?, product_name = ?, product_desc = ?, quantity = ?
      WHERE requestid = ?`;

    const values = [name, contact, product_name, product_desc, quantity, requestid];

    const [result] = await db.promise().query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Error: Product not updated.' });
    }

    res.status(200).json({ message: 'Product updated successfully.' });
  } catch (err) {
    console.error("Error in updateProduct route:", err);
    res.status(500).json({ message: 'Internal Server Error.', error: err });
  }
});


//http://localhost:4000/customProduct/removeproduct/:requestid
route.put('/removeproduct/:requestid', verifyJwtAdmin, async (req, res) => { //put
  try {
    const requestid = req.params.requestid;
    // console.log(requestid); // comment out the console.log
    if (requestid) {
      const response = await db
        .promise()
        .query(`UPDATE customproductsrequest SET isactive = 0 WHERE requestid = '${requestid}'`);
      res.status(200).json(response[0]);
    } else {
      res.status(400).json({ message: 'Request ID not found.' });
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

route.get("/searchItem/:value", async (req, res)=>{
  const {value} = req.params;
  const query = `%${value}%`;
  try{
    const [result] = await db.promise().query("SELECT p.requestid ,p.product_name, p.product_desc, p.quantity, p.userid, p.name, p.contact FROM customproductsrequest AS p INNER JOIN users as u on u.userid = p.userid WHERE p.isactive=1 AND (p.product_name LIKE ? OR p.product_desc LIKE ? OR u.userid LIKE ? OR p.name LIKE ?)", [query, query, query, query]);
    res.status(200).json({essage: "Data fetched successfully", filteredData: result});
  }catch(err){
    res.status(400).json({message: "Some error occurred while fetching data", error: err});
  }
})

module.exports = route;