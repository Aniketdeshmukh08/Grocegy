const express = require('express');
const route = express.Router();
const db = require('../db');

//http://localhost:4000/orderdetails/orderDetails
route.get('/orderDetails', async (req, res) => {
  try {
    const query = 'SELECT * FROM order_product_details WHERE isactive=1';

    const [response] = await db.promise().query(query);

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});


route.get('/getCancelledOrders', async (req, res) => {
  try {
    const query = `
      SELECT orders.order_id, orders.order_date, orders.delivery_status, orders.order_time, 
             orders.paymentstatus, orders.paymentmode, orders.billstatus, 
             orders.paymentamount, orders.payment_cash, orders.payment_online, 
             orders.totaldiscount, orders.coupondiscount, orders.additionaldiscount, 
             orders.instructions, address.addressid, address.name, address.line1, 
             address.line2, address.line3, address.landmark, address.city, 
             address.state, address.country, address.pin, address.contact, 
             address.alternatecontact
      FROM orders
      JOIN address ON orders.addressid = address.addressid
      WHERE orders.order_status = 'CANCELLED'
    `;
  
    const [response] = await db.promise().query(query);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});
// http://localhost:4000/orderdetails/getDeletedOrders
route.get('/getDeletedOrders', async (req, res) => {
  try {
    const query = `
      SELECT orders.order_id, orders.order_date, orders.delivery_status, orders.order_time, 
             orders.paymentstatus, orders.paymentmode, orders.billstatus, 
             orders.paymentamount, orders.payment_cash, orders.payment_online, 
             orders.totaldiscount, orders.coupondiscount, orders.additionaldiscount, 
             orders.instructions, address.addressid, address.name, address.line1, 
             address.line2, address.line3, address.landmark, address.city, 
             address.state, address.country, address.pin, address.contact, 
             address.alternatecontact
      FROM orders
      JOIN address ON orders.addressid = address.addressid
      WHERE orders.isactive = 0
    `;
  
    const [response] = await db.promise().query(query);
    console.log(response)
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});


//http://localhost:4000/orderdetails/addToOrderProducts
route.post('/addToOrderProducts', async (req, res) => {
  try {
    const { order_id, productid, quantity } = req.body;

    const response = await db
      .promise()
      .query(
        'INSERT INTO order_product_details (order_id,productid ,isactive,quantity) VALUES ( ?,?,?,?)',
        [order_id, productid, 1, quantity]
      );

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/orderdetails/:orderid
route.get('/:orderid', async (req, res) => {
  try {
    const orderid = req.params.orderid;

    const query =
      'SELECT orders.srno, orders.order_id, orders.order_date, orders.delivery_status, orders.order_time,orders.paymentstatus, orders.paymentmode,orders.billstatus, orders.paymentamount,orders.payment_cash,orders.payment_online,orders.totaldiscount,orders.coupondiscount,orders.additionaldiscount, orders.instructions as customer_note, orders.admin_note, orders.delivery_partner_note, address.addressid, address.name, address.line1, address.line2, address.line3, address.landmark, address.city, address.state, address.country, address.pin, address.contact, address.alternatecontact, order_product_details.productid, order_product_details.quantity, order_product_details.price_final,products.image, products.prod_name, order_product_details.original_mrp, order_product_details.costamount, orders.totaldiscount, products.price, users.name AS delivery_partner_name, users.mobile as delivery_partner_mobile FROM orders JOIN address ON orders.addressid = address.addressid JOIN order_product_details ON orders.order_id = order_product_details.order_id JOIN products ON order_product_details.productid = products.productid LEFT JOIN users ON users.userid = orders.delivery_partner WHERE orders.order_id = ? AND order_product_details.isactive = 1';
    const [response] = await db.promise().query(query, [orderid]);
    let total_original_mrp = 0;
    let total_pricefinal = 0;
    let total_quantity = 0;
    response.forEach(item => {
      total_original_mrp += Number(item.original_mrp || 0);
      total_pricefinal += Number(item.price_final || 0);
      total_quantity += Number(item.quantity || 0);
    });
    const sumoftotaldiscount = response.length > 0 ? Number(response[0].totaldiscount || 0) : 0;
    res.status(200).json({
      orderDetails: response,
      total_original_mrp,
      total_pricefinal,
      sumoftotaldiscount,
      total_quantity
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/orderDetails/completed/{orderid}
route.get('/completed/:orderid', async (req, res) => {
  try {
    const orderid = req.params.orderid;
    // console.log(`Fetching details for order ID: ${orderid}`); // Log order ID

    const query = `
      SELECT orders.srno, orders.order_id, orders.order_date, orders.delivery_status,order_status, orders.order_time, orders.paymentamount, users.name AS delivery_partner_name, users.mobile AS delivery_partner_mobile 
      FROM orders 
      LEFT JOIN users ON users.userid = orders.delivery_partner
      WHERE orders.order_id = ? 
      AND orders.delivery_status = 'DELIVERED' 
      AND orders.order_status = 'COMPLETED'
    `;

    const [response] = await db.promise().query(query, [orderid]);
    // console.log(response); // Log the query response

    if (response.length === 0) {
      return res.status(404).json({ message: "Order not found or not delivered/completed." });
    }

    res.status(200).json(response[0]);
  } catch (error) {
    // console.error('Error fetching order details:', error); // Log the error
    res.status(400).json(error);
  }
});



//http://localhost:4000/orderdetails/removeOrderProduct/id001
route.put('/removeOrderProduct/:oid/:pid', async (req, res) => {
  try {
    const oid = req.params.oid;
    const pid = req.params.pid;
    // console.log("OrderID",id)
    const response = await db
      .promise()
      .query(
        'UPDATE order_product_details SET isactive = 0 WHERE order_id = ? AND productid = ? ',
        [oid, pid]
      );
    // cal total
    const [orderTotal] = await db
      .promise()
      .query(
        `SELECT 
            SUM(price_final) AS total_amount, 
            SUM(discount) AS total_discount 
        FROM order_product_details 
        WHERE order_id = ? AND isactive = 1`,
        [oid]
      );

    const newTotalAmount = orderTotal[0].total_amount || 0;
    const newTotalDiscount = orderTotal[0].total_discount || 0;

    await db
      .promise()
      .query('UPDATE orders SET paymentamount = ?, totaldiscount = ? WHERE order_id = ?', [
        newTotalAmount,
        newTotalDiscount,
        oid,
      ]);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/orderdetails/addIProductInToOrder/oid
route.post('/addProductInToOrder/:oid', async (req, res) => {
  try {
    const oid = req.params.oid;
    let { productid, original_mrp, price_final, quantity, discount } = req.body;

    original_mrp = parseFloat(original_mrp);
    price_final = parseFloat(price_final);
    quantity = parseInt(quantity);
    discount = parseFloat(discount);

    if (!productid || isNaN(original_mrp) || isNaN(price_final) || isNaN(quantity) || isNaN(discount)) {
      return res.status(400).json({ error: "Missing or invalid required fields" });
    }

    const [existing] = await db
      .promise()
      .query(
        'SELECT * FROM order_product_details WHERE order_id = ? AND productid = ? AND isactive = 1',
        [oid, productid]
      );

    if (existing.length > 0) {
      const existingItem = existing[0];
      const newQuantity = existingItem.quantity + quantity;
      const newOriginalMRP = parseFloat(existingItem.original_mrp) + original_mrp;
      const newPriceFinal = parseFloat(existingItem.price_final) + price_final;
      const newDiscount = parseFloat(existingItem.discount) + discount;
      await db
        .promise()
        .query(
          'UPDATE order_product_details SET quantity = ?, original_mrp = ?, price_final = ?, discount = ? WHERE order_id = ? AND productid = ? AND isactive = 1',
          [newQuantity, newOriginalMRP.toFixed(2), newPriceFinal.toFixed(2), newDiscount.toFixed(2), oid, productid]
        );
    } else {
      await db
        .promise()
        .query(
          'INSERT INTO order_product_details (order_id, productid, original_mrp, quantity, price_final, discount, isactive) VALUES (?, ?, ?, ?, ?, ?, 1)',
          [oid, productid, original_mrp.toFixed(2), quantity, price_final.toFixed(2), discount.toFixed(2)]
        );
    }
    // Recalculate total values for the order
    const [orderTotal] = await db
      .promise()
      .query(
        `SELECT 
            SUM(price_final) AS total_amount, 
            SUM(original_mrp) AS total_original_mrp, 
            SUM(discount) AS total_discount 
        FROM order_product_details 
        WHERE order_id = ? AND isactive = 1`,
        [oid]
      );
    const newTotalAmount = parseFloat(orderTotal[0].total_amount || 0).toFixed(2);
    const newTotalDiscount = parseFloat(orderTotal[0].total_discount || 0).toFixed(2);
    await db
      .promise()
      .query(
        'UPDATE orders SET paymentamount = ?, totaldiscount = ? WHERE order_id = ?',
        [newTotalAmount, newTotalDiscount, oid]
      );


    res.status(200).json({
      message: 'Product added or updated successfully',
      newTotalAmount,
      newTotalDiscount
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//http://localhost:4000/orderdetails/updateOrderProductDetails/id001
route.put('/updateOrderProductDetails/:order_id', async (req, res) => {
  try {
    const { order_id } = req.params;
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
      const updateQuery = `UPDATE order_product_details SET ${updateFields.join(
        ', '
      )} WHERE order_id = ?`;
      values.push(order_id);

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

route.get('/searchItem/:value', async (req, res) => {
  const {value} = req.params;
  const paramQuery = `%${value}%`;
  try {
    const query = 'SELECT * FROM order_product_details WHERE isactive=1 AND (order_id LIKE ? OR productid LIKE ?)';

    const [response] = await db.promise().query(query, [paramQuery, paramQuery]);

    res.status(200).json({message: "Fetched all data with success", filteredData: response});
  } catch (error) {
    res.status(400).json({message: "Something went wrong while fetching data", error: error});
  }
});




module.exports = route;
