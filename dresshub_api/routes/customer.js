const express = require('express');
const db = require('../db.js');
const route = express.Router();
const verifyJwtAdmin = require('../verifyadmin');

//http://localhost:4000/customer/showallcustomer

route.get('/showallcustomer', async (req, res) => {
  try {
    const userId = req.params.userId;
    const [rows] = await db
      .promise()
      .query('SELECT * FROM customer_details WHERE isactive = 1');

    res.status(200).json(rows);
  } catch (err) {
    res.status(400).json(err);
  }
});

//http://localhost:4000/customer/customerById/id001

route.get('/customerById/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await db
      .promise()
      .query(
        `SELECT * FROM customer_details WHERE isactive = 1 AND cust_det_srno = ${id}`
      );

    res.status(200).json(rows);
  } catch (err) {
    res.status(400).json(err);
  }
});

//http://localhost:4000/customer/customer/addCustomer

route.post('/customer/addCustomer',verifyJwtAdmin, async (req, res) => {
  try {
    const { userid, city, address, alternatecontact, pincode, profile_photo } = req.body;
    
    // First check if user exists but is inactive
    const [existing] = await db.promise().query(
      'SELECT * FROM customer_details WHERE userid = ?', 
      [userid]
    );

    if (existing.length > 0) {
      // Reactivate existing customer
      await db.promise().query(
        'UPDATE customer_details SET isactive=1, city=?, address=?, alternatecontact=?, pincode=?, profile_photo=? WHERE userid=?',
        [city, address, alternatecontact, pincode, profile_photo, userid]
      );
      
      // Reactivate user
      await db.promise().query(
        'UPDATE users SET isactive=1 WHERE userid=?',
        [userid]
      );
    } else {
      // Create new customer
      await db.promise().query(
        'INSERT INTO customer_details (city, address, alternatecontact, pincode, profile_photo, isactive, userid) VALUES (?, ?, ?, ?, ?, 1, ?)',
        [city, address, alternatecontact, pincode, profile_photo, userid]
      );
    }

    res.status(201).json({ message: 'Customer processed successfully' });
  } catch (err) {
    res.status(400).json(err);
  }
});

//http://localhost:4000/customer/customer/updateCustomer/id001

route.put('/customer/updateCustomer/:id',verifyJwtAdmin, async (req, res) => {
  try {
    const sr_no = req.params.id;
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
      const updateQuery = `UPDATE customer_details SET ${updateFields.join(
        ', '
      )} WHERE cust_det_srno = ?`;
      values.push(sr_no);

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

//http://localhost:4000/customer/customer/removecustomer/id001

route.put('/customer/removeCustomer/:id',verifyJwtAdmin, async (req, res) => {
  try {
    const sr_no = req.params.id;
    const status = 0;

    const updateQuery = `UPDATE customer_details SET isactive = ${status} WHERE cust_det_srno = ${sr_no}`;

    // Execute the update query
    const [response] = await db.promise().query(updateQuery);

    res.status(200).json(response);
  } catch (err) {
    res.status(400).json(err);
  }
});

//http://localhost:4000/customer/customer/customerDetails    --gets join data of users and custommer table

route.get('/customer/customerDetails', async (req, res) => {
  try {
    const [response] = await db
      .promise()
      .query(
        'SELECT u.userid, u.username, u.name, u.email, u.mobile, u.password,u.isactive,  ' +
          'c.cust_det_srno, c.city, c.address, c.alternatecontact, c.pincode, c.profile_photo' +
          ' FROM users u ' +
          ' JOIN customer_details c ON u.userid = c.userid AND u.isactive=1'
      );

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

//http://localhost:4000/customer/customer/customerDetails/id001
route.get('/customer/customerById/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [response] = await db
      .promise()
      .query(
        'SELECT u.userid, u.username, u.name, u.email, u.mobile, u.password, u.isactive, ' +
          'c.cust_det_srno, c.city, c.address, c.alternatecontact, c.pincode, c.profile_photo ' +
          'FROM users u ' +
          'JOIN customer_details c ON u.userid = c.userid ' +
          'WHERE u.userid = ? AND u.isactive = 1',
        [id]
      );

    if (response.length === 0) {
      res.status(404).json({ error: 'Customer not found' });
    } else {
      res.status(200).json(response);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//http://localhost:4000/customer/updateCustomerDetails/:id   ---updated the data of joined table of users and customer_details
route.put('/updateCustomerDetails/:id',verifyJwtAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;

    const query1 =
      'UPDATE customer_details SET city=?, address=?, alternatecontact=?, pincode=?, profile_photo=? WHERE userid=?';
    const val1 = [
      data.city,
      data.address,
      data.alternatecontact,
      data.pincode,
      data.profile_photo,
      userId,
    ];

    const query2 =
      'UPDATE users SET username=?, name=?, email=?, mobile=?, password=? WHERE userid=?';
    const val2 = [
      data.username,
      data.name,
      data.email,
      data.mobile,
      data.password,
      userId,
    ];

    const [response] = await db.promise().query(query1, val1);
    const [response2] = await db.promise().query(query2, val2);

    res
      .status(200)
      .json(response, 'update customer_details', response2, 'updated users');
  } catch (err) {
    console.error('Error updating customer details:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//http://localhost:4000/customer/customer/removeCustomerAndUser/:userid

route.put('/customer/removeCustomerAndUser/:userid',verifyJwtAdmin, async (req, res) => {
  try {
    const sr_no = req.params.userid;
    const status = 0;

    // Update query for customer_details table
    const updateCustomerQuery = `UPDATE customer_details SET isactive = ${status} WHERE userid = ${sr_no}`;

    // Execute the update query for customer_details table
    await db.promise().query(updateCustomerQuery);

    // Update query for users table
    const updateUserQuery = `UPDATE users SET isactive = ${status} WHERE userid = ${sr_no}`;

    // Execute the update query for users table
    await db.promise().query(updateUserQuery);

    res.status(200).json({ message: 'Customer removed successfully.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

route.get("/searchItem/:searchParam", async (req, res)=>{
  const {searchParam} = req.params;
  const query = `%${searchParam}%`;
  try{
    const [result] = await db.promise().query(`SELECT u.userid, u.username, u.name, u.email, u.mobile, u.password,u.isactive,  
          c.cust_det_srno, c.city, c.address, c.alternatecontact, c.pincode, c.profile_photo
          FROM users u 
          JOIN customer_details c ON u.userid = c.userid AND u.isactive=1 AND (u.userid LIKE ? OR u.username LIKE ? OR u.name LIKE ? OR u.email LIKE ? OR u.mobile LIKE ?)`, [query, query, query, query, query]);
    res.status(200).json({message: "Data fetched with success", filteredData: result});
  }catch(err){
    res.status(400).json({message: "Some error occurred while fetching data", error: err});
  }
})

module.exports = route;
