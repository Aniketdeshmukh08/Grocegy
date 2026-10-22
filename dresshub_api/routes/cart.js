const express = require('express');
const route = express.Router();
const db = require('../db');

//http://localhost:4000/cart/allCartItems
route.get('/allCartItems', async (req, res) => {
  try {
    const query = 'SELECT * FROM cart WHERE isactive = 1';
    const [response] = await db.promise().query(query);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/cart/userCart/:userid   ---get cart of particular user
route.get('/userCart/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query =
      'SELECT p.*, c.quantity FROM products p JOIN cart c ON p.productid = c.productid WHERE c.userid = ? AND c.isactive = 1';
    const [response] = await db.promise().query(query, [id]);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/cart/addToCart     --add items to cart
// route.post('/addToCart',async(req,res)=>{
//     try{
//         const {userid,productid,quantity} = req.body
//         const today = new Date().toISOString().slice(0, 10);
//      const response = await db.promise().query( 'INSERT INTO cart (userid,productid ,isactive,cart_status,cart_date,quantity) VALUES (?, ?,?,?,?,?)',
//     [userid,productid, 1,1,today,quantity])
//    res.status(200).json(response)
//     }catch(error){
//     res.status(400).json(error)
//     }
//     })

//http://localhost:4000/cart/emptyCart/:userid     --empty the cart of user
route.put('/emptyCart/:userid', async (req, res) => {
  try {
    const id = req.params.userid;
    const response = await db
      .promise()
      .query('DELETE FROM cart WHERE userid = ?', [id]);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/cart/removeProduct/:userid/:productid    --remove product from cart of user
route.put('/removeProduct/:userid/:productid', async (req, res) => {
  try {
    const { userid, productid } = req.params;
    await db
      .promise()
      .query('DELETE FROM cart WHERE userid = ? AND productid = ?', [
        userid,
        productid,
      ]);
    res.status(200).json({ message: 'Product removed from cart' });
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/cart/updateCart/:userid/:productid    ---update cartitem of user
route.put('/updateCart/:userid/:productid', async (req, res) => {
  try {
    const { userid, productid } = req.params;
    const { cart_status, quantity } = req.body;
    const response = await db
      .promise()
      .query(
        'UPDATE cart SET cart_status = ?,quantity=?  WHERE userid = ? AND productid=?',
        [cart_status, quantity, userid, productid]
      );
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/cart/cartDetails/:userid    --gets join data of userCart  and product table

route.get('/cartDetails/:userid', async (req, res) => {
  const { userid } = req.params;
  try {
    const [response] = await db
      .promise()
      .query(
        'SELECT c.userid, c.productid, c.cart_date, c.cart_status, c.isactive, ' +
          'p.prod_name, p.category, p.subcategory, p.price, p.image, p.brand, p.discount, p.prod_desc ' +
          'FROM cart c ' +
          'JOIN products p ON c.productid = p.productid AND c.isactive = 1 AND c.userid=?',
        [userid]
      );
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

//http://localhost:4000/cart/handleQuantity/:userid/:productid
route.put('/handleQuantity/:userid/:productid', async (req, res) => {
  try {
    const { userid, productid } = req.params;
    const { quantity } = req.body;

    if (quantity == 0) {
      const response = await db
        .promise()
        .query(
          'UPDATE cart SET isactive = 0  WHERE userid = ? AND productid=?',
          [userid, productid]
        );
    } else {
      const response = await db
        .promise()
        .query(
          'UPDATE cart SET quantity = ? ,isactive=1  WHERE userid = ? AND productid=?',
          [quantity, userid, productid]
        );
      res.status(200).json(response);
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/cart/addToCart     --add items to cart
route.post('/addToCart', async (req, res) => {
  try {
    const { userid, productid, quantity } = req.body;
    const today = new Date().toISOString().slice(0, 10);
    // Check if the combination of userid and productid exists in the cart table
    const [existingRows] = await db
      .promise()
      .query('SELECT * FROM cart WHERE userid = ? AND productid = ?', [
        userid,
        productid,
      ]);

    if (existingRows.length > 0) {
      // Combination found in the table
      if (existingRows[0].isactive === 0) {
        // Product is inactive, set isactive to 1 and update quantity
        await db
          .promise()
          .query(
            'UPDATE cart SET isactive = 1, quantity = ? WHERE userid = ? AND productid = ?',
            [quantity, userid, productid]
          );
        res.status(200).json({ message: 'Product re-added to cart' });
      } else {
        // Product is already active, update the quantity
        await db
          .promise()
          .query(
            'UPDATE cart SET quantity = quantity + ? WHERE userid = ? AND productid = ?',
            [quantity, userid, productid]
          );
        res.status(200).json({ message: 'Quantity updated' });
      }
    } else {
      // Combination not found in the table, insert a new row
      await db
        .promise()
        .query(
          'INSERT INTO cart (userid, productid, isactive, cart_status, cart_date, quantity) VALUES (?, ?, ?, ?, ?, ?)',
          [userid, productid, 1, 1, today, quantity]
        );
      res.status(200).json({ message: 'Added to cart' });
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = route;
