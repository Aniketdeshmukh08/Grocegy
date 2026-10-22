const express = require('express');
const route = express.Router();
const db = require('../db');
const verifyJwtAdmin = require('../verifyadmin')

// http://localhost:4000/contact/allContacts
route.get('/allContacts', verifyJwtAdmin, async (req, res) => {
  try {
    const query = 'SELECT * FROM contact WHERE isactive = 1 ORDER BY srno DESC';
    const [response] = await db.promise().query(query);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

// http://localhost:4000/contact/updateResolveStatus
route.put('/updateResolveStatus/:id', verifyJwtAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { resolvestatus } = req.body;

    const result = await db.promise().query(
      'UPDATE contact SET resolvestatus = ? WHERE contactid = ?',
      [resolvestatus, id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update resolve status' });
  }
});

// http://localhost:4000/contact/getById/id001
route.get('/getById/:contactid', verifyJwtAdmin, async (req, res) => {
  try {
    const { contactid } = req.params;
    const query = 'SELECT * FROM contact WHERE contactid = ? AND isactive = 1';
    const [response] = await db.promise().query(query, [contactid]);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

// // http://localhost:4000/contact/addContact

route.post('/addContact', async (req, res) => {
  try {
    const { name, email, mobile, address, subject, message, userid, contactDate } = req.body;

    const resolvestatus = 'Pending';

    const contactid = parseInt(Math.random() * 10000000000);
    const response = await db
      .promise()
      .query(
        `INSERT INTO contact (contactid,name,email, mobile,address,subject,message,contactdate,userid,resolvestatus) VALUES ('${contactid}','${name}','${email}','${mobile}','${address}','${subject}','${message}','${contactDate}','${userid}','${resolvestatus}')`
      );
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

// http://localhost:4000/contact/updateContact/id001

route.put('/updateContact/:contactid', verifyJwtAdmin, async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      address,
      subject,
      message,
      resolvestatus,
      contactDate,
    } = req.body;
    const { contactid } = req.params;

    // Build dynamic query to only update provided fields
    const updateFields = [];
    const values = [];

    if (name !== undefined) {
      updateFields.push('name = ?');
      values.push(name);
    }
    if (email !== undefined) {
      updateFields.push('email = ?');
      values.push(email);
    }
    if (mobile !== undefined) {
      updateFields.push('mobile = ?');
      values.push(mobile);
    }
    if (address !== undefined) {
      updateFields.push('address = ?');
      values.push(address);
    }
    if (subject !== undefined) {
      updateFields.push('subject = ?');
      values.push(subject);
    }
    if (message !== undefined) {
      updateFields.push('message = ?');
      values.push(message);
    }
    if (contactDate !== undefined) {
      updateFields.push('contactdate = ?');
        values.push(contactDate);
    }
    if (resolvestatus !== undefined) {
      updateFields.push('resolvestatus = ?');
      values.push(resolvestatus);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(contactid);

    const query = `UPDATE contact SET ${updateFields.join(', ')} WHERE contactid = ?`;
    const response = await db.promise().query(query, values);

    res.status(200).json({ success: true, message: 'Contact updated successfully' });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Failed to update contact', details: error.message });
  }
});

// http://localhost:4000/contact/removeContact/id001

route.put('/removeContact/:contactid', verifyJwtAdmin, async (req, res) => {
  try {
    const { contactid } = req.params;
    const response = await db
      .promise()
      .query('UPDATE contact SET isactive = 0 WHERE contactid = ? ', [
        contactid,
      ]);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

route.get('/searchItem/:value', verifyJwtAdmin, async (req, res) => {
  const { value } = req.params;
  const paramQuery = `%${value}%`;
  try {
    const query = 'SELECT * FROM contact WHERE isactive = 1 AND (contactid LIKE ? OR name LIKE ? OR email LIKE ? OR mobile LIKE ?) ORDER BY srno DESC';
    const [response] = await db.promise().query(query, [paramQuery, paramQuery, paramQuery, paramQuery]);
    res.status(200).json({ message: "Data fetched successfully", filteredData: response });
  } catch (error) {
    res.status(400).json({ message: "Some error occurred while fetching", error: error });
  }
});

// http://localhost:4000/contact/allContacts
route.get('/allContacts', async (req, res) => {
  try {
    const query = 'SELECT * FROM contact WHERE isactive = 1';
    const [response] = await db.promise().query(query);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

// http://localhost:4000/contact/getById/id001
route.get('/getById/:contactid', async (req, res) => {
  try {
    const { contactid } = req.params;
    const query = 'SELECT * FROM contact WHERE contactid = ? AND isactive = 1';
    const [response] = await db.promise().query(query, [contactid]);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

// // http://localhost:4000/contact/addContact


route.post('/addContact', async (req, res) => {
  try {

    const { name, email, mobile, address, subject, message, userid } = req.body

    const resolvestatus = 'Pending';

    const contactid = parseInt(Math.random() * 10000000000);
    const response = await db.promise().query(`INSERT INTO contact (contactid,name,email, mobile,address,subject,message,userid,resolvestatus) VALUES ('${contactid}','${name}','${email}','${mobile}','${address}','${subject}','${message}','${userid}','${resolvestatus}')`);
    res.status(200).json(response)
  } catch (error) {
    res.status(400).json(error)
  }
})



// http://localhost:4000/contact/updateContact/id001


route.put('/updateContact/:contactid', async (req, res) => {
  try {
    const { name, email, mobile, address, subject, message, userid, resolvestatus } = req.body;
    const { contactid } = req.params
    const response = await db.promise().query('UPDATE contact SET name= ?,email= ?,mobile= ?,address= ?,subject= ?, message= ?,userid= ?, resolvestatus = ? WHERE contactid = ?', [name, email, mobile, address, subject, message, userid, resolvestatus, contactid]);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
})

// http://localhost:4000/contact/removeContact/id001

route.put('/removeContact/:contactid', async (req, res) => {
  try {
    const { contactid } = req.params;
    const response = await db.promise().query('UPDATE contact SET isactive = 0 WHERE contactid = ? ', [contactid])
    res.status(200).json(response)
  } catch (error) {
    res.status(400).json(error)
  }
})

module.exports = route;
