const express = require('express');
const route = express.Router();
const db = require('../db');

//http://localhost:4000/orders/allOrders
route.get('/allOrders', async (req, res) => {
  try {
    const query = `
  SELECT 
    orders.order_id,
    orders.costamount,
    orders.delivery_status,
    orders.addressid,
    orders.paymentmode,
    orders.paymentstatus,
    orders.totaldiscount,
    orders.additionaldiscount,
    orders.coupondiscount,
    orders.paymentamount,
    orders.payment_online,
    orders.payment_cash,
    orders.userid,
    orders.order_status,
    orders.order_time,
    orders.order_date,
    orders.delivery_partner,
    orders.tracking_id,
    orders.instructions,
    orders.srno,
    orders.remarks,
    orders.final_settle,
    orders.createdby,
    users.name,
    users.mobile 
  FROM orders 
  JOIN users ON orders.userid = users.userid 
  WHERE orders.isactive = 1 
  AND orders.order_status != 'CANCELLED'
  ORDER BY orders.srno DESC;
`;

    const [response] = await db.promise().query(query);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

// http://localhost:4000/orders/paginated-orders
route.get('/paginated-orders', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const offset = (page - 1) * limit;

    // Get total count
    const [countResult] = await db.promise().query(
      "SELECT COUNT(*) as total FROM orders WHERE isactive = 1"
    );
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);


    const [orders] = await db.promise().query(`
            SELECT 
                orders.*,
                users.name,
                users.mobile
            FROM orders 
            JOIN users ON orders.userid = users.userid 
            WHERE orders.isactive = 1 
            ORDER BY orders.srno DESC
            LIMIT ? OFFSET ?
        `, [limit, offset]);

    res.status(200).json({
      success: true,
      orders,
      currentPage: page,
      totalPages,
      totalOrders: total,
      pageSize: limit
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});



// http://localhost:4000/orders/sumofallOrders
route.get('/sumofallOrders', async (req, res) => {
  try {
    const query = `
      SELECT 
        SUM(orders.paymentamount) AS totalPaymentAmount,
        SUM(CAST(SUBSTRING_INDEX(orders.payment_online, ' ', 1) AS SIGNED)) AS totalPaymentOnline,
        SUM(orders.payment_cash) AS totalPaymentCash,
        SUM(orders.costamount) AS totalCostAmount
      FROM orders
      WHERE isactive=1
      AND delivery_status != 'CANCELLED'
      AND final_settle = 1;
    `;

    const [response] = await db.promise().query(query);

    res.status(200).json({ totals: response[0] });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// http://localhost:4000/orders/count
route.get('/count', async (req, res) => {
  try {
    const query = `
      SELECT COUNT(*) AS total_orders
      FROM orders
      WHERE isactive = 1;
    `;

    const [result] = await db.promise().query(query);
    res.status(200).json(result[0]); // send only the object, not array
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order count', details: error });
  }
});


//http://localhost:4000/orders/allorderIDs
route.get('/allorderIDs', async (req, res) => {
  try {
    const query =
      "SELECT srno, order_id FROM orders WHERE order_status = 'Placed' AND delivery_status = 'Pending' ORDER BY srno DESC";
    const [response] = await db.promise().query(query);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//http://localhost:4000/orders/addOrder

route.post('/addOrder', async (req, res) => {
  try {
    // console.log(req.body);
    const {
      order_status,
      userid,
      paymentamount,
      paymentstatus,
      paymentmode,
      addressid,
      delivery_status,
      delivery_partner,
      costamount,
      instructions
    } = req.body;

    const orderId = parseInt(Math.random() * 100000000);
    const trackingId = parseInt(Math.random() * 100000000);

    // Create date in IST timezone
    const now = new Date();
    const istDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

    // Format date as dd/mm/yyyy
    const day = istDate.getDate();
    const month = istDate.getMonth() + 1;
    const year = istDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    // Format time as hh:mm:ss
    const hours = istDate.getHours().toString().padStart(2, '0');
    const minutes = istDate.getMinutes().toString().padStart(2, '0');
    const seconds = istDate.getSeconds().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    const response = await db
      .promise()
      .query(
        'INSERT INTO orders (order_id, order_date, order_time, order_status, userid, isactive, paymentamount, paymentstatus, paymentmode, addressid, delivery_status, tracking_id, delivery_partner, costamount, instructions) VALUES (?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?,?)',
        [
          orderId,
          formattedDate,
          formattedTime,
          order_status,
          userid,
          1,
          paymentamount,
          paymentstatus,
          paymentmode,
          addressid,
          delivery_status,
          trackingId,
          delivery_partner,
          costamount,
          instructions
        ]
      );

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});


//http://localhost:4000/order/getById/id001
route.get('/getById/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM orders WHERE order_id =? AND isactive=1';
    const [response] = await db.promise().query(query, [id]);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/order/removeOrder/id001
route.put('/romoveOrder/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await db
      .promise()
      .query('UPDATE orders SET isactive = 0 WHERE  order_id = ? ', [id]);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/order/updateOrder/id001
route.put('/updateOrder/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
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
      const updateQuery = `UPDATE orders SET ${updateFields.join(
        ', '
      )} WHERE order_id = ?`;
      values.push(orderId);

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

//http://localhost:4000/orders/getByuserId/:userid
route.get('/getByuserId/:userid', async (req, res) => {
  try {
    const { userid } = req.params;
    const query =
      `SELECT orders.*, users.name 
      FROM orders 
      JOIN users ON orders.userid = users.userid 
      WHERE orders.userid = ? AND orders.isactive=1 
      ORDER BY orders.srno DESC`;
    const [response] = await db.promise().query(query, [userid]);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});


// http://localhost:4000/orders/getUserOrders/:userid?page=1&limit=50
route.get('/getUserOrders/:userid', async (req, res) => {
  try {
    const { userid } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);
    const offset = (page - 1) * limit;


    let countQuery = `
      SELECT COUNT(*) AS totalOrders
      FROM orders
      WHERE isactive = 1 AND userid = ?
    `;


    const [[countRow]] = await db.promise().query(countQuery, userid);
    const totalOrders = countRow ? countRow.totalOrders : 0;
    const totalPages = Math.ceil(totalOrders / limit) || 1;

    const [orders] = await db.promise().query(`
      SELECT 
        orders.order_id,
        orders.costamount,
        orders.delivery_status,
        orders.addressid,
        orders.paymentmode,
        orders.payment_cash,
        orders.payment_online,
        orders.paymentstatus,
        orders.totaldiscount,
        orders.paymentamount,
        orders.userid,
        orders.order_status,
        orders.order_time,
        orders.order_date,
        orders.delivery_partner,
        orders.tracking_id,
        orders.srno,
        orders.billstatus,
        users.name,
        users.mobile 
      FROM orders 
      JOIN users ON orders.userid = users.userid 
      WHERE orders.isactive = 1 AND orders.userid = ?
      ORDER BY orders.srno DESC 
      LIMIT ? 
      OFFSET ?
    `, [userid, limit, offset]);

    res.status(200).json({
      success: true,
      orders,
      currentPage: page,
      pageSize: limit,
      totalOrders,
      totalPages
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
//http://localhost:4000/orders/soldproductcount
route.post('/soldproductcount/', async (req, res) => {
  try {
    const cartItems = req.body;
    for (const item of cartItems) {
      const { quantity, productid } = item;
      const resonse = await db
        .promise()
        .query(
          'UPDATE products SET num_times_ordered = num_times_ordered + ? WHERE productid = ?',
          [quantity, productid]
        );
    }
    res.status(200).json('success');
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/orders/markdelivered/7484593613
route.put('/markdelivered/:orderid', async (req, res) => {
  try {
    const orderid = req.params.orderid;
    const [response] = await db
      .promise()
      .query('UPDATE orders SET delivery_status = ? WHERE order_id = ?', [
        'DELIVERED',
        orderid,
      ]);
    res.status(200).json({ message: 'Order Delivered' });
  } catch (error) {
    res.status(400).json(error);
  }
});
//http://localhost:4000/orders/markdeliverycancelled/7484593613
route.put('/markdeliverycancelled/:orderid', async (req, res) => {
  try {
    const orderid = req.params.orderid;
    const [response] = await db
      .promise()
      .query('UPDATE orders SET delivery_status = ? WHERE order_id = ?', [
        'CANCELLED',
        orderid,
      ]);
    res.status(200).json({ message: 'Order Delivery Cancelled' });
  } catch (error) {
    res.status(400).json(error);
  }
});
//http://localhost:4000/orders/markascompleted/7484593613
route.put('/markascompleted/:orderid', async (req, res) => {
  try {
    const orderid = req.params.orderid;
    const [response] = await db
      .promise()
      .query('UPDATE orders SET order_status = ? WHERE order_id = ?', [
        'COMPLETED',
        orderid,
      ]);
    res.status(200).json({ message: 'Order Completed' });
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/orders/markascancelled/7484593613
route.put('/markascancelled/:orderid', async (req, res) => {
  try {
    const orderid = req.params.orderid;
    const [response] = await db
      .promise()
      .query('UPDATE orders SET order_status = ? WHERE order_id = ?', [
        'CANCELLED',
        orderid,
      ]);
    res.status(200).json({ message: 'Order Cancelled' });
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/orders//updatePaymentMode/7484593613
route.put('/updatePaymentMode/:orderid', async (req, res) => {
  try {
    const orderid = req.params.orderid;
    const { paymentmode } = req.body;
    const [response] = await db
      .promise()
      .query('UPDATE orders SET paymentmode = ? WHERE order_id = ?', [
        paymentmode,
        orderid,
      ]);
    res.status(200).json({ message: 'Payment mode success' });

  } catch (error) {
    res.status(400).json(error);
    // console.log(error)
  }
});

//http://localhost:4000/orders/getTotalExpenseByUserId/:userid
route.get('/getTotalExpenseByUserId/:userid', async (req, res) => {
  try {
    const { userid } = req.params;
    const query = `
      SELECT SUM(paymentamount) AS totalExpense 
      FROM orders 
      WHERE userid = ? 
      AND isactive = 1 
      AND order_status = 'COMPLETED'
      AND delivery_status = 'DELIVERED'
    `;
    const [response] = await db.promise().query(query, [userid]);
    const totalExpense = response[0].totalExpense || 0;
    res.status(200).json({ totalExpense });
  } catch (error) {
    res.status(400).json(error);
  }
});
//http://localhost:4000/orders/getCurrentMonthExpenseByUserId/:userid
route.get('/getCurrentMonthExpenseByUserId/:userid', async (req, res) => {
  try {
    const { userid } = req.params;
    const query = `
      SELECT SUM(paymentamount) AS currentMonthSpendings
      FROM orders 
      WHERE userid = ? 
      AND isactive = 1 
      AND order_status = 'COMPLETED'
      AND delivery_status = 'DELIVERED'
      AND MONTH(updatedon) = MONTH(CURRENT_DATE()) 
      AND YEAR(updatedon) = YEAR(CURRENT_DATE())
    `;
    const [response] = await db.promise().query(query, [userid]);
    const currentMonthSpendings = response[0].currentMonthSpendings || 0;;
    res.status(200).json({ currentMonthSpendings });
  } catch (error) {
    res.status(400).json(error);
  }
});

// http://localhost:4000/orders/highSpendingUsers
route.get('/highSpendingUsers', async (req, res) => {
  try {
    const query = `
      SELECT users.userid, users.name, users.mobile, COALESCE(SUM(orders.paymentamount), 0) AS currentMonthSpendings
      FROM users
      LEFT JOIN orders ON users.userid = orders.userid
      AND orders.isactive = 1
      AND orders.order_status = 'COMPLETED'
      AND MONTH(orders.updatedon) = MONTH(CURRENT_DATE())
      AND YEAR(orders.updatedon) = YEAR(CURRENT_DATE())
      GROUP BY users.userid
      HAVING currentMonthSpendings > 5000;
    `;

    const [response] = await db.promise().query(query);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// http://localhost:4000/orders/lessSpendingUsers
route.get('/lessSpendingUsers', async (req, res) => {
  try {
    const query = `
      SELECT users.userid, users.name, users.mobile, COALESCE(SUM(orders.paymentamount), 0) AS currentMonthSpendings
      FROM users
      LEFT JOIN orders ON users.userid = orders.userid
      AND orders.isactive = 1
      AND orders.order_status = 'COMPLETED'
      AND MONTH(orders.updatedon) = MONTH(CURRENT_DATE())
      AND YEAR(orders.updatedon) = YEAR(CURRENT_DATE())
      GROUP BY users.userid
      HAVING currentMonthSpendings < 5000;
    `;

    const [response] = await db.promise().query(query);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//http://localhost:4000/orders/getOrderCountByUserId/:userid
route.get('/getOrderCountByUserId/:userid', async (req, res) => {
  try {
    const { userid } = req.params;
    const query = `
      SELECT COUNT(*) AS totalOrders 
      FROM orders 
      WHERE userid = ? 
      AND order_status = 'COMPLETED'
      AND delivery_status = 'DELIVERED'
      AND isactive = 1
    `;
    const [response] = await db.promise().query(query, [userid]);
    const totalOrders = response[0].totalOrders || 0;
    res.status(200).json({ totalOrders });
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/orders/getOrderIdsByName/:name
route.get('/getOrderIdsByName/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const query = `
      SELECT order_id FROM orders 
      WHERE userid IN (SELECT userid FROM users WHERE name = ?)
      AND isactive = 1 
      ORDER BY order_date DESC;
    `;
    const [response] = await db.promise().query(query, [name]);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/orders/updatedeliverypartner/:order_id
route.put('/updatedeliverypartner/:orderid/:userid', async (req, res) => {
  try {
    const { orderid } = req.params;
    const { userid } = req.params;
    const response = await db.promise()
      .query(`UPDATE orders SET delivery_partner = ? WHERE order_id = ?`, [userid, orderid]);
    res.status(200).json({ message: 'Delivery partner updated' });
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/orders/addcostamount/:order_id
route.put('/addcostamount/:orderid', async (req, res) => {
  try {
    const { orderid } = req.params;
    const { costamount } = req.body
    const [result] = await db.promise()
      .query(`UPDATE orders SET costamount = ? WHERE order_id = ?`, [costamount, orderid]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order ID not found' });
    }
    res.status(200).json({ message: 'Cost Amount Added ' });
  } catch (error) {
    res.status(400).json(error);
  }
});

// http://localhost:4000/orders/getcostamount/:orderid
route.get('/getcostamount/:orderid', async (req, res) => {
  try {
    const { orderid } = req.params;
    const [rows] = await db.promise()
      .query(`SELECT costamount FROM orders WHERE order_id = ?`, [orderid]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Order ID not found' });
    }

    const costAmount = rows[0].costamount;
    res.status(200).json({ order_id: orderid, costamount: costAmount });
  } catch (error) {
    res.status(400).json(error);
  }
});


// http://localhost:4000/orders/getTotalDiscountByUserId/${userid}
route.get('/getTotalDiscountByUserId/:userid', async (req, res) => {
  try {
    const { userid } = req.params;
    const query = `
      SELECT 
        SUM(
          COALESCE(totaldiscount, 0) + 
          COALESCE(additionaldiscount, 0) + 
          COALESCE(coupondiscount, 0)
        ) AS totalDiscount 
      FROM orders 
      WHERE userid = ? 
      AND order_status = 'COMPLETED' 
      AND delivery_status = 'DELIVERED'
      AND isactive = 1
    `;
    const [response] = await db.promise().query(query, [userid]);
    const totalDiscount = response[0].totalDiscount || 0;
    res.status(200).json({ totalDiscount });
  } catch (error) {
    res.status(400).json(error);
  }
});

// http://localhost:4000/orders/updateDiscount/:orderid

route.put('/updateDiscount/:orderid', async (req, res) => {
  try {
    const { orderid } = req.params;
    const { additionaldiscount } = req.body;

    const [rows] = await db.promise().query(`
      SELECT     
        orders.order_id,
        orders.coupondiscount AS coupon_discount, 
        SUM(order_product_details.price_final) AS total_final_price
      FROM orders 
      JOIN order_product_details 
      ON orders.order_id = order_product_details.order_id
      WHERE orders.order_id = ?  AND orders.isactive = 1;
    `, [orderid]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const totalFinalPrice = parseFloat(rows[0].total_final_price || 0);
    const couponDiscount = parseFloat(rows[0].coupon_discount || 0);

    // Calculate payment amount
    const updatedPaymentAmount = totalFinalPrice - (couponDiscount + additionaldiscount);

    // Ensure that payment amount never goes negative
    if (updatedPaymentAmount < 0) {
      return res.status(400).json({ message: 'Total discount cannot exceed cost amount' });
    }

    // Ensure that discount never goes negative
    if (additionaldiscount < 0) {
      return res.status(400).json({ message: 'Total discount cannot be negative' });
    }

    await db.promise().query(`
      UPDATE orders 
      SET additionaldiscount = ?, paymentamount = ? 
      WHERE order_id = ?;
    `, [additionaldiscount, updatedPaymentAmount, orderid]);

    res.status(200).json({
      message: 'Discount updated successfully',
      order: {
        order_id: orderid,
        additionaldiscount,
        paymentamount: updatedPaymentAmount,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong, please try again' });
  }
});

// http://localhost:4000/orders/updateBillStatus/:orderid

route.put('/updateBillStatus/:orderid', async (req, res) => {
  try {
    const { orderid } = req.params;
    const { billStatus } = req.body;

    let newStatus = 0;
    if (billStatus === 'Approved') newStatus = 1;
    else if (billStatus === 'Cancelled') newStatus = 0;

    const [rows] = await db.promise().query(`
      SELECT order_id, billstatus FROM orders 
      WHERE order_id = ? AND isactive = 1;
    `, [orderid]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update billstatus
    await db.promise().query(`
      UPDATE orders 
      SET billstatus = ? 
      WHERE order_id = ?;
    `, [newStatus, orderid]);

    res.status(200).json({
      message: 'Bill status updated successfully',
      order: {
        order_id: orderid,
        newBillStatus: newStatus,
      },
    });

  } catch (error) {
    console.error('Error updating bill status:', error);
    res.status(500).json({ message: 'Something went wrong, please try again' });
  }
});






//http://localhost:4000/orders/addreceivedamount/:order_id
route.put('/addreceivedamount/:orderid', async (req, res) => {
  try {
    const { orderid } = req.params;
    const { cashPayment, onlinePayment, paymentMethod } = req.body
    let query = "UPDATE orders SET ";
    let values = [];
    if (paymentMethod === "cash") {
      query += "payment_cash = ? ";
      values.push(cashPayment);
    } else
      if (paymentMethod === "online") {
        query += "payment_online= ? ";
        values.push(onlinePayment);
      } else
        if (paymentMethod === "both") {
          query += "payment_cash = ?, payment_online = ? ";
          values.push(cashPayment, onlinePayment);
        }

    query += "WHERE order_id = ?";
    values.push(orderid)
    const [result] = await db.promise()
      .query(query, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order ID not found' });
    }
    res.status(200).json({ message: 'Payment Amount Added ' });
  } catch (error) {
    res.status(400).json(error);
  }
});



//http://localhost:4000/orders/addreceivedamounttemp/:order_id
route.put('/addreceivedamounttemp/:orderid', async (req, res) => {
  try {
    const { orderid } = req.params;
    let { cashPayment, onlinePayment } = req.body;


    if ((cashPayment === undefined || cashPayment === null) &&
      (onlinePayment === undefined || onlinePayment === null)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide either cashPayment or onlinePayment amount'
      });
    }


    const [orderResponse] = await db.promise().query(
      'SELECT paymentamount, payment_cash, payment_online, paymentstatus, paymentmode FROM orders WHERE order_id = ?',
      [orderid]
    );

    if (!orderResponse.length) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orderResponse[0];
    const orderTotal = parseFloat(order.paymentamount);


    const newCash = cashPayment !== undefined && !isNaN(cashPayment) ? parseFloat(cashPayment) : 0;
    const newOnline = onlinePayment !== undefined && !isNaN(onlinePayment) ? parseFloat(onlinePayment) : 0;
    const newPaymentTotal = newCash + newOnline;


    const updatedCash = newCash;
    const updatedOnline = newOnline;
    const newTotalPaid = updatedCash + updatedOnline;


    if (newTotalPaid > orderTotal) {
      return res.status(400).json({
        success: false,
        message: 'Payment would exceed order total',
        maximumAllowed: orderTotal,
        attemptedPayment: newPaymentTotal
      });
    }


    const paymentstatus = newTotalPaid >= orderTotal ? 'Paid' : 'Due';


    let paymentMethod = order.paymentmode || '';
    if (newCash > 0 && newOnline > 0) {
      paymentMethod = 'Both';
    } else if (newCash > 0) {
      paymentMethod = 'cash';
    } else if (newOnline > 0) {
      paymentMethod = 'online';
    }


    const totalOnlineToStore = updatedOnline + ' temp';


    const updateQuery = `
      UPDATE orders 
      SET 
        payment_cash = ?,
        payment_online = ?,
        paymentstatus = ?,
        paymentmode = ?,
        updatedon = NOW()
      WHERE order_id = ?
    `;

    const [result] = await db.promise().query(updateQuery, [
      updatedCash,
      totalOnlineToStore,
      paymentstatus,
      paymentMethod,
      orderid
    ]);

    if (result.affectedRows === 0) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update payment records'
      });
    }


    res.status(200).json({
      success: true,
      message: 'Payment records updated successfully',
      paymentDetails: {
        newPayments: {
          cash: updatedCash,
          online: updatedOnline,
          total: newTotalPaid
        },
        orderTotal: orderTotal,
        remainingBalance: orderTotal - newTotalPaid,
        paymentstatus: paymentstatus,
        paymentMethod: paymentMethod
      }
    });

  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during payment processing',
      error: error.message
    });
  }
});

// Assuming the user type is part of the JWT token
// API Endpoint to get total orders count
route.get('/getTotalOrders', async (req, res) => {
  try {
    const query = `
      SELECT COUNT(*) AS totalOrders
      FROM orders;
    `;
    const [response] = await db.promise().query(query);
    const totalOrders = response[0].totalOrders || 0;
    res.status(200).json({ totalOrders });
  } catch (error) {
    // console.error('Error fetching total orders:', error);
    res.status(400).json(error);
  }
});

//http://localhost:4000/orders/Orders
route.get('/Orders', async (req, res) => {
  try {
    const query = `
      SELECT 
        orders.userid,
        users.name,
        users.mobile,
        COUNT(orders.order_id) AS total_orders,
        SUM(orders.paymentamount) AS total_price,
        AVG(orders.paymentamount) AS average_price,
        DATE_FORMAT(MAX(STR_TO_DATE(orders.order_date, '%d/%m/%Y')), '%d/%m/%Y') AS last_order_date
      FROM orders
      JOIN users ON orders.userid = users.userid
      WHERE orders.isactive = 1
      GROUP BY orders.userid
      ORDER BY total_price DESC;
    `;

    const [response] = await db.promise().query(query);
    // const enrichedResponse = response.map(order => ({
    //   ...order,
    //   whatsapp_link: `https://wa.me/${order.mobile}?text=Hello%20${encodeURIComponent(order.name)},%20we%20noticed%20your%20order%20activity!`
    // }));

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/orders/ordersbyDate
route.post('/ordersbyDate', async (req, res) => {
  const { startDate, endDate } = req.body;
  try {
    // Convert dd/mm/yyyy to yyyy-mm-dd for proper date comparison
    const convertDate = (dateStr) => {
      const [day, month, year] = dateStr.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };

    const formattedStartDate = convertDate(startDate);
    const formattedEndDate = convertDate(endDate);

    const query = `
      SELECT 
        orders.userid,
        users.name,
        users.mobile,
        COUNT(orders.order_id) AS total_orders,
        SUM(orders.paymentamount) AS total_price,
        SUM(orders.costamount) AS total_cost,
        SUM(orders.paymentamount - orders.costamount) AS total_profit,
        AVG(orders.paymentamount) AS average_price,
        DATE_FORMAT(MAX(orders.order_date), '%Y-%m-%d') AS date
      FROM orders
      JOIN users ON orders.userid = users.userid
      WHERE orders.isactive = 1 
      AND DATE_FORMAT(orders.order_date, '%Y-%m-%d') BETWEEN ? AND ?
      GROUP BY orders.userid, users.name, users.mobile
      ORDER BY total_price DESC;
    `;

    const [response] = await db.promise().query(query, [formattedStartDate, formattedEndDate]);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/orders/get_orders
route.get('/get_orders', async (req, res) => {
  try {
    const { page = 1, limit = 50, order_status = null } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        orders.order_id,
        orders.costamount,
        orders.delivery_status,
        orders.addressid,
        orders.paymentmode,
        orders.payment_cash,
        orders.payment_online,
        orders.paymentstatus,
        orders.totaldiscount,
        orders.paymentamount,
        orders.userid,
        orders.order_status,
        orders.order_time,
        orders.order_date,
        orders.delivery_partner,
        orders.tracking_id,
        orders.srno,
        orders.billstatus,
        users.name,
        users.mobile 
      FROM orders 
      JOIN users ON orders.userid = users.userid 
      WHERE orders.isactive = 1
    `;

    if (order_status) {
      query += ` AND orders.order_status = ?`;
    }
    query += ` ORDER BY orders.srno DESC LIMIT ? OFFSET ?`;
    let countQuery = `
    SELECT COUNT(*) AS totalOrders 
    FROM orders 
    WHERE orders.isactive = 1
  `;
    if (order_status) {
      countQuery += ` AND orders.order_status = ?`;
    }
    const countParams = order_status ? [order_status] : [];

    const queryParams = [];
    if (order_status) queryParams.push(order_status);
    queryParams.push(parseInt(limit), parseInt(offset));
    const [orders] = await db.promise().query(query, queryParams);
    const [countResult] = await db.promise().query(countQuery, countParams);
    const totalOrders = countResult[0].totalOrders || 0;
    res.status(200).json({ orders, totalOrders });
  } catch (error) {
    // console.error('Error fetching orders:', error);
    res.status(400).json({ message: 'Error fetching orders', error });
  }
});

//http://localhost:4000/orders/instructions
route.get('/instructions', async (req, res) => {
  try {
    const query = `
  SELECT 
    orders.order_id,
    orders.instructions
  FROM orders 
  JOIN users ON orders.userid = users.userid 
  WHERE orders.isactive = 1 
  ORDER BY orders.srno DESC;
`;

    const [response] = await db.promise().query(query);
    res.status(200).json(response);
  } catch (error) {
    // console.error('Error fetching instructions:', error);
    res.status(400).json({ message: 'Error fetching instructions', error });
  }
});

// http://localhost:4000/orders/addremark/
route.put('/addremark', async (req, res) => {
  try {
    const { srno, remarks } = req.body;
    // if (!remarks) {
    //   return res.status(400).json({ message: 'Remarks field is required' });
    // }

    const [result] = await db.promise().query(
      `UPDATE orders SET remarks = ? WHERE srno = ?;`,
      [remarks, srno]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order ID not found' });
    }

    res.status(200).json({ message: 'Remark updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// http://localhost:4000/orders/settleOrders
route.put('/settleOrders', async (req, res) => {
  const { orders, final_settle } = req.body;

  if (!Array.isArray(orders) || orders.length === 0) {
    return res.status(400).json({ message: "No orders provided." });
  }

  try {
    const srnos = orders.map(order => order.srno);
    const placeholders = srnos.map(() => '?').join(',');

    const query = `UPDATE orders SET final_settle = ? WHERE srno IN (${placeholders})`;
    const values = [final_settle, ...srnos];

    await db.promise().query(query, values);

    res.status(200).json({ message: 'Orders settled successfully.' });
  } catch (error) {
    console.error("Error settling orders:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// http://localhost:4000/orders/unsettleOrders
route.put('/unsettleOrders', async (req, res) => {
  const { orders, final_settle } = req.body;

  if (!Array.isArray(orders) || orders.length === 0) {
    return res.status(400).json({ message: "No orders provided." });
  }

  try {
    const srnos = orders.map(order => order.srno);
    const placeholders = srnos.map(() => '?').join(',');

    const query = `UPDATE orders SET final_settle = ? WHERE srno IN (${placeholders})`;
    const values = [final_settle, ...srnos];

    await db.promise().query(query, values);

    res.status(200).json({ message: 'Orders unsettled successfully.' });
  } catch (error) {
    console.error("Error unsetting orders:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});




route.put('/approveOnlinePayment', async (req, res) => {
  const { srno } = req.body;

  if (!srno) {
    return res.status(400).json({ message: "srno is required" });
  }

  try {
    const [rows] = await db.promise().query(`SELECT payment_online FROM orders WHERE srno = ?`, [srno]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const rawAmount = rows[0].payment_online;
    const cleanAmount = parseFloat(rawAmount.toString().replace(/[^0-9.]/g, ''));

    if (isNaN(cleanAmount)) {
      return res.status(400).json({ message: "Invalid payment format" });
    }
    await db.promise().query(`UPDATE orders SET payment_online = ? WHERE srno = ?`, [cleanAmount, srno]);

    res.status(200).json({ message: "Online payment approved" });
  } catch (error) {
    console.error("Error in approveOnlinePayment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// http://localhost:4000/orders/update-notes/:order_id
route.put('/update-notes/:order_id', async (req, res) => {
  const { customer_note, delivery_partner_note, admin_note } = req.body;
  const { order_id } = req.params;
  if (!order_id) {
    return res.status(400).json({ message: 'Order ID is required' });
  }
  try {
    let query = "UPDATE orders SET ";
    let values = [];
    if (customer_note) {
      query += "customer_note = ? ";
      values.push(customer_note);
    }
    if (delivery_partner_note) {
      query += "delivery_partner_note = ? ";
      values.push(delivery_partner_note);
    }
    if (admin_note) {
      query += "admin_note = ? ";
      values.push(admin_note);
    }
    query += "WHERE order_id = ?";
    values.push(order_id);
    await db.promise().query(query, values);

    res.status(200).json({ message: 'Notes updated successfully' });
  } catch (error) {
    console.error('Error in update-notes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

route.get("/searchItem/:value", async (req, res) => {
  const { value } = req.params;
  const query = `%${value}%`;
  try {
    const [result] = await db.promise().query(
      `
      SELECT 
    orders.order_id,
    orders.costamount,
    orders.delivery_status,
    orders.addressid,
    orders.paymentmode,
    orders.paymentstatus,
    orders.totaldiscount,
    orders.additionaldiscount,
    orders.coupondiscount,
    orders.paymentamount,
    orders.payment_online,
    orders.payment_cash,
    orders.userid,
    orders.order_status,
    orders.order_time,
    orders.order_date,
    orders.delivery_partner,
    orders.tracking_id,
    orders.instructions,
    orders.srno,
    orders.remarks,
    orders.final_settle,
    orders.createdby,
    users.name,
    users.mobile 
  FROM orders 
  JOIN users ON orders.userid = users.userid 
  WHERE orders.isactive = 1 
  AND orders.order_status != 'CANCELLED'
  AND orders.srno LIKE ?
  ORDER BY orders.srno DESC;
      `,
      [query]
    );

    res.status(200).json({ message: "Data fetched successfully", filteredData: result });
  } catch (err) {
    res.status(400).json({ message: "Some error occurred while fetching data", error: err });
  }
});

route.get('/searchReportItem/:value', async (req, res) => {
  const { value } = req.params;
  const paramValue = `%${value}%`;
  try {
    const query = `
      SELECT 
        orders.userid,
        users.name,
        users.mobile,
        COUNT(orders.order_id) AS total_orders,
        SUM(orders.paymentamount) AS total_price,
        AVG(orders.paymentamount) AS average_price,
        DATE_FORMAT(MAX(STR_TO_DATE(orders.order_date, '%d/%m/%Y')), '%d/%m/%Y') AS last_order_date
      FROM orders
      JOIN users ON orders.userid = users.userid
      WHERE orders.isactive = 1
      AND (
      orders.userid LIKE ? OR
      users.name LIKE ? OR
      users.mobile LIKE ?
      )
      GROUP BY orders.userid
      ORDER BY total_price DESC;
    `;

    const [response] = await db.promise().query(query, [paramValue, paramValue, paramValue]);
    res.status(200).json({ message: "Data fetched with success", filteredData: response });
  } catch (err) {
    res.status(400).json({ message: "Some error occurred while fetching data", error: err });
  }
});

route.get('/searchDailyReportItem/:startDate/:endDate/:value', async (req, res) => {
  const { startDate, endDate, value } = req.params;
  const paramVal = `%${value}%`;
  try {
    // Convert dd/mm/yyyy to yyyy-mm-dd for proper date comparison
    const convertDate = (dateStr) => {
      const [day, month, year] = dateStr.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };

    const formattedStartDate = convertDate(startDate);
    const formattedEndDate = convertDate(endDate);

    const query = `
      SELECT 
        orders.userid,
        users.name,
        users.mobile,
        COUNT(orders.order_id) AS total_orders,
        SUM(orders.paymentamount) AS total_price,
        SUM(orders.costamount) AS total_cost,
        SUM(orders.paymentamount - orders.costamount) AS total_profit,
        AVG(orders.paymentamount) AS average_price,
        DATE_FORMAT(MAX(orders.order_date), '%Y-%m-%d') AS date
      FROM orders
      JOIN users ON orders.userid = users.userid
      WHERE orders.isactive = 1 
      AND DATE_FORMAT(orders.order_date, '%Y-%m-%d') BETWEEN ? AND ?
      AND (orders.userid LIKE ? OR users.name LIKE ? OR users.mobile LIKE ?) 
      GROUP BY orders.userid, users.name, users.mobile
      ORDER BY total_price DESC;
    `;

    const [response] = await db.promise().query(query, [formattedStartDate, formattedEndDate, paramVal, paramVal, paramVal]);
    res.status(200).json({ message: "Value fetched successfully", filteredData: response });
  } catch (err) {
    res.status(400).json({ message: "Some error occurred while fetching data", error: err });
  }
});

route.get('/searchOrderInOrderList/:value', async (req, res) => {
  const { value } = req.params;
  const paramQuery = `%${value}%`;
  try {
    const query = `
  SELECT 
    orders.order_id,
    orders.costamount,
    orders.delivery_status,
    orders.addressid,
    orders.paymentmode,
    orders.paymentstatus,
    orders.totaldiscount,
    orders.additionaldiscount,
    orders.coupondiscount,
    orders.paymentamount,
    orders.payment_online,
    orders.payment_cash,
    orders.userid,
    orders.order_status,
    orders.order_time,
    orders.order_date,
    orders.delivery_partner,
    orders.tracking_id,
    orders.instructions,
    orders.srno,
    orders.remarks,
    orders.final_settle,
    orders.createdby,
    users.name,
    users.mobile 
  FROM orders 
  JOIN users ON orders.userid = users.userid 
  WHERE orders.isactive = 1 
  AND orders.order_status != 'CANCELLED'
  AND (
    orders.order_id LIKE ? OR 
    orders.userid LIKE ? OR 
    orders.delivery_partner LIKE ? 
    OR orders.tracking_id LIKE ? OR 
    orders.order_status LIKE ? OR 
    orders.delivery_status LIKE ?
    )
  ORDER BY orders.srno DESC;
`;

    const [response] = await db.promise().query(query, [paramQuery, paramQuery, paramQuery, paramQuery, paramQuery, paramQuery]);
    res.status(200).json({ message: "Data fetched successfully", filteredData: response });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong while fetching data", error: err });
  }
});

// http://localhost:4000/orders/completedOrders
route.get('/completedOrders', async (req, res) => {
  try {
    const query = `
      SELECT 
        orders.order_id,
        orders.costamount,
        orders.delivery_status,
        orders.addressid,
        orders.paymentmode,
        orders.paymentstatus,
        orders.totaldiscount,
        orders.additionaldiscount,
        orders.coupondiscount,
        orders.paymentamount,
        orders.payment_online,
        orders.payment_cash,
        orders.userid,
        orders.order_status,
        orders.order_time,
        orders.order_date,
        orders.delivery_partner,
        orders.tracking_id,
        orders.instructions,
        orders.srno,
        orders.remarks,
        orders.final_settle,
        orders.createdby,
        users.name,
        users.mobile 
      FROM orders 
      JOIN users ON orders.userid = users.userid 
      WHERE orders.isactive = 1 
      AND orders.order_status = 'COMPLETED'
      ORDER BY orders.srno DESC;
    `;
    const [response] = await db.promise().query(query);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = route;