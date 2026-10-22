const express = require('express');

const route = express.Router();

const db = require('../db');

//http://localhost:4000/wishlist/allWishlistItems

route.get('/allWishlistItems', async (req, res) => {
  try {
    const query = 'SELECT * FROM wishlist WHERE isactive = 1';

    const [response] = await db.promise().query(query);

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/wishlist/usersWishlist/:userid
route.get('/usersWishlist/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query =
      'SELECT w.productid, p.prod_name, p.price, p.discount, p.image FROM wishlist w JOIN products p ON w.productid = p.productid WHERE w.isactive = 1 AND w.userid = ?';

    const [response] = await db.promise().query(query, [id]);

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/wishlist/addToWishlist
route.post('/addToWishlist', async (req, res) => {
  try {
    const { userid, productid } = req.body;

    const today = new Date().toISOString().slice(0, 10);

    const response = await db
      .promise()
      .query(
        'INSERT INTO wishlist (userid,productid ,isactive,wishlist_date) VALUES ( ?,?,?,?)',
        [userid, productid, 1, today]
      );

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/wishlist/emptyWishList/:userid     --empty the cart of user

route.put('/emptyWishList/:userid', async (req, res) => {
  try {
    const id = req.params.userid;

    const response = await db
      .promise()
      .query('UPDATE wishlist SET isactive = 0 WHERE userid = ? ', [id]);

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});


//http://localhost:4000/wishlist/hardemptyWishList/:userid     --empty the cart of user with hard delete

route.delete('/hardemptyWishList/:userid', async (req, res) => {
  try {
    const id = req.params.userid;
    const query = 'DELETE FROM wishlist WHERE userid = ?';
    const response = await db.promise().query(query, [id]);

    res.status(200).json({ message: 'Wishlist permanently cleared', response });
  } catch (error) {
    res.status(400).json(error);
  }
});

// http://localhost:4000/wishlist/updateWishlist/:userid
route.put('/updateWishlist/:userid', async (req, res) => {
  try {
    const { userid } = req.params;
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
      const updateQuery = `UPDATE wishlist SET ${updateFields.join(
        ', '
      )} WHERE userid = ?`;
      values.push(userid);

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

//remove items from withlist 
route.put('/removeFromWishlist/:userid/:productid', async (req, res) => {
  let { userid, productid } = req.params;
  let query = `UPDATE withlist SET isactive=0 where productid= +${productid} AND userid= ${userid}`;
  try {
    const resp = await db.promise().query(query);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

// Hard Delete items from withlist 
route.delete('/hardremoveFromWishlist/:userid/:productid', async (req, res) => {
  try {
    const { userid, productid } = req.params;
    const query = 'DELETE FROM wishlist WHERE productid = ? AND userid = ?';
    const response = await db.promise().query(query, [productid, userid]);
    res.status(200).json({ message: 'Item permanently removed from wishlist', response });
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = route;
