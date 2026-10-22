const express = require('express');
const route = express.Router();
const db = require('../db');
const verifyadmin = require('../verifyadmin'); 

//http://localhost:4000/complains/allcomplains
route.get('/allcomplains', verifyadmin, async (req, res) => {
  try {
    const query = 'SELECT * FROM complains WHERE isactive=1 ORDER BY srno DESC';
    const [response] = await db.promise().query(query);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

// http://localhost:4000/complains/complainbyid/:complainid
route.get('/complainbyid/:complainid', verifyadmin, async (req, res) => {
  try {
    const { complainid } = req.params;
    const query = 'SELECT * FROM complains WHERE complainid=? AND isactive=1';
    const [response] = await db.promise().query(query, [complainid]);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/complains/addcomplain
route.post('/addcomplain', async (req, res) => {
  try {
    // console.log(req.body);
    const {userid, name, email, mobile, address, orderid, subject, complain_desc } = req.body;
    let date_time = new Date();
    let date = ('0' + date_time.getDate()).slice(-2);
    let month = ('0' + (date_time.getMonth() + 1)).slice(-2);
    let year = date_time.getFullYear();
    const resolvestatus = 'Pending';
    const date_raised = year + '-' + month + '-' + date;
    const complainid = parseInt(Math.random() * 10000000000);
    const response = await db
      .promise()
      .query(
        `INSERT INTO complains (complainid,userid,name,email, mobile,address,date_raised,orderid,subject,complain_desc,resolvestatus) VALUES ('${complainid}', '${userid}' ,'${name}','${email}','${mobile}','${address}','${date_raised}','${orderid}','${subject}','${complain_desc}','${resolvestatus}')`
      ); 
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

// http://localhost:4000/complains/removecomplains/:complainid
route.put('/removecomplains/:complainid', verifyadmin, async (req, res) => {
  try {
    const { complainid } = req.params;
    const response = await db
      .promise()
      .query('UPDATE complains SET isactive = 0 WHERE complainid = ? ', [
        complainid,
      ]);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

// http://localhost:4000/complains/updatecomplains/:complainid
route.put('/updatecomplains/:complainid', verifyadmin, async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      address,
      orderid,
      subject,
      complain_desc,
      resolvestatus,
    } = req.body;
    const { complainid } = req.params;
    const response = await db
      .promise()
      .query(
        'UPDATE complains SET name= ?,email= ?,mobile= ?,address= ?,orderid= ?,subject= ?, complain_desc= ?, resolvestatus = ? WHERE complainid = ?',
        [
          name,
          email,
          mobile,
          address,
          orderid,
          subject,
          complain_desc,
          resolvestatus,
          complainid,
        ]
      );
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/complains/complaintcount
route.get('/complaintcount', async (req, res) => {
  try {
    // number of complaints
    const query =
      'select count(*) as complaintCount from complains where resolvestatus = ?';
    const [response] = await db.promise().query(query,["Pending"]);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

route.get('/searchItem/:value', verifyadmin, async (req, res) => {
  const {value} = req.params;
  const paramQuery = `%${value}%`;
  try {
    const query = 'SELECT * FROM complains WHERE isactive=1 AND (complainid LIKE ? OR orderid LIKE ? OR name LIKE ? OR mobile LIKE ?) ORDER BY srno DESC';
    const [response] = await db.promise().query(query, [paramQuery, paramQuery, paramQuery, paramQuery]);
    res.status(200).json({message: "Data fetched successfully", filteredData: response});
  } catch (error) {
    res.status(400).json({message: "Some error occurred while fetchng data", error: error});
  }
});

module.exports = route;
