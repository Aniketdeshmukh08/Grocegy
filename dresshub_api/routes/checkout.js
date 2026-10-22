const express = require('express')
const route = express.Router()
const db = require("../db")
const sendemail = require("./sendemail")

//http://localhost:4000/checkout/checkout
route.post('/checkout', async (req, res) => {
  const { cartData, userid, addressId, paymentMode, totalDiscount, productdiscount, createdby } = req.body
  const orderid = parseInt(Math.random() * 10000000000);

  // Create date in IST timezone
  const now = new Date();
  const istDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

  // Format date as dd/mm/yyyy
  const day = istDate.getDate();
  const month = istDate.getMonth() + 1;
  const year = istDate.getFullYear();
  const orderDate = `${day}/${month}/${year}`;

  // Format time as hh:mm:ss am/pm
  const orderTime = istDate.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const calculatingAmount = (cartData, totalDiscount) => {
    const amount = cartData.reduce((total, item) => {
      return total + item.price_final;
    }, 0);
    const finalAmount = amount - totalDiscount;
    return finalAmount > 0 ? finalAmount : 0;
  };
  const instructions = cartData.length > 0 ? cartData[0].instructions : '';
  const paymentamount = calculatingAmount(cartData, totalDiscount)
  try {
    if (!cartData || !userid || !addressId || !paymentMode) {
      return res.status(400).json({ status: 'error', message: 'Missing required fields.' });
    }

    // Insert into Orders Table
    const orderInsertQuery = `INSERT INTO orders (order_id,userid, addressid,paymentamount, paymentmode, createdby, order_date, order_time,coupondiscount,totaldiscount,instructions)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const [orderResult] = await db.promise().query(orderInsertQuery, [orderid, userid, addressId, paymentamount, paymentMode, createdby, orderDate, orderTime, totalDiscount, productdiscount, instructions]);


    // Prepare data for Order Details Table
    const orderDetailsData = cartData.map(item => {
      const discount = (item.original_mrp || 0) - (item.price_final || 0);
      return [
        orderid,
        item.productid,
        item.quantity,
        item.price_final,
        item.original_mrp,
        discount.toFixed(2),
      ];
    });


    // Insert into Order Details Table
    const orderProductDetailsInsertQuery = `INSERT INTO order_product_details (order_id, productid, quantity,price_final,original_mrp,discount) VALUES ?`;
    await db.promise().query(orderProductDetailsInsertQuery, [orderDetailsData]);

    // Update Cart
    const productIds = cartData.map(item => item.productid);
    const cartDeleteQuery = 'DELETE FROM cart WHERE userid = ?';
    await db.promise().query(cartDeleteQuery, [userid]);

    // Retrieve email and username
    const [userResult] = await db.promise().query('SELECT email, name FROM users WHERE userid = ?', [userid]);
    const emailid = userResult[0].email || "";
    const username = userResult[0].name;
    const [orderSrnoResult] = await db.promise().query('SELECT srno FROM orders WHERE order_id = ?', [orderid]);
    const srno = orderSrnoResult[0].srno;

    console.log(`Sending email to: ${emailid}`);
    console.log(`From: ${process.env.USER}`);

    const emailSubject = 'Grocji Order - ' + srno;
    const emailText = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
        <p><b>Hello ${username},</b></p>
        
        <p>Thank you for your order!</p>

        <p>
        <b>Order Number - ${srno}</b><br>
        Order ID- <b>${orderid}</b><br>
        Payment Amount- <b>${paymentamount}</b><br>
        Date - <b>${orderDate} </b> <br>
        Time - <b> ${orderTime} </b>.
        </p>

        <p>If you have any questions or need further assistance, please feel free to contact us at any time. Thanks for choosing <b>Grocji</b>!</p>
        
        <p>Best Regards,<br>
        <b>Grocji Team</b><br>
        Contact: 8757499344, 8757499345<br>
        Email: grocji@gmail.com<br>
        Website: <a href="https://www.grocji.com/" style="color: #1a73e8;">https://www.grocji.com/</a><br>
        </p>

    </div>`;


    if (emailid) {
      sendemail(emailid, emailSubject, emailText);
    }
    else {
      console.log('No Email id configured for the user.');
    }
    sendemail('vittesh01@gmail.com', emailSubject, emailText);
    sendemail('hashedbitinnovations@gmail.com', emailSubject, emailText);
    sendemail('pinkesh.rsra@gmail.com', emailSubject, emailText);

    res.json({
      status: 'success',
      orderid: orderid,
      message: 'Order placed and mail sent successfully!'
    });

  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
})

module.exports = route;
