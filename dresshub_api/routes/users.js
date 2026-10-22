const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();

const db = require('../db');
const sendemail = require('./sendemail');

//http://localhost:4000/users/allusers
router.get('/allusers', async (req, res) => {
  try {
    const userId = req.params.userId;
    const response = await db.promise()
      .query(`SELECT userid,username,name,email,gender,mobile,password, usertype, created_on, isactive as status FROM users
        ORDER BY srno DESC`);
    res.status(200).json(response[0]);
  } catch (err) {
    res.status(400).json(err);
  }
});


router.get('/getusername&mobile/:userid', async (req, res) => {
  try {
    const userid = req.params.userid;
    const response = await db.promise().query(
      `SELECT name,mobile FROM users WHERE userid = ?`, [userid]
    );

    if (response[0].length > 0) {
      res.status(200).json({ name: response[0][0].name, mobile: response[0][0].mobile });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//http://localhost:4000/users/deliverypartners
router.get('/deliverypartners', async (req, res) => {

  try {
    const response = await db.promise().query(`SELECT userid, username, name FROM users where usertype = 'deliverypartner' AND isactive = 1`);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});


//http://localhost:4000/users/searchuser/:id

router.get('/searchuser/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const response = await db
      .promise()
      .query(
        `SELECT userid, name, email, mobile, password FROM users WHERE userid = '${userId}'`
      );
    res.status(200).json(response[0]);
  } catch (err) {
    res.status(400).json(err);
  }
});

// http://localhost:4000/users/finduser?id=id001
router.get('/finduser/', async (req, res) => {
  try {
    const userId = req.query.id;
    const response = await db
      .promise()
      .query(`SELECT * FROM users WHERE userid = '${userId}'`);
    res.status(200).json(response[0]);
  } catch (err) {
    res.status(400).json(err);
  }
});

// http://localhost:4000/users/removeuser/:userid
router.delete('/removeuser/:userid', async (req, res) => {
  try {
    const userid = req.params.userid;

    if (req.params.userid) {
      const response = await db
        .promise()
        .query(`update users set isactive = 0 WHERE userid = '${userid}'`);
      res.status(200).json(response[0]);
    } else {
      res.status(400).json({ message: 'Request UserId not Found.' });
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

// http://localhost:4000/users/adduser
router.post('/adduser', async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;
    const [existingUser] = await db.promise().query(
      `SELECT * FROM users WHERE email = '${email}' OR mobile = '${mobile}'`
    );

    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const userid = parseInt(Math.random() * 10000000000);
    const username =
      name.toLowerCase().split(' ').join('').slice(0, 5) +
      parseInt(Math.random() * 100000);

    const userEmail = email ? email : `user${name}@grocji.com`;
    const response = await db.promise()
      .query(`INSERT INTO users (userid,username,name,email,mobile,password,isactive)
          VALUES ('${userid}','${username}',' ${name}','${userEmail}','${mobile}','${password}',1)`);

    const emailSubject = 'Welcome to Grocji - Your Account is Now Active';
    const emailText = `
   <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    <p><b>Hi ${name}!</b></p>
    
    <p>A warm welcome to Grocji!</p>

    <p>We are thrilled to have you on board! Your account has been successfully created, and you are now ready to explore our wide range of products and exclusive deals.</p>

    <p><b>Here are your account details:</b></p>

    <p>Username: <b>${username}</b></p>
    <p>Password: <b>${password}</b></p>
    <p>Email: <b>${email}</b></p>
    <p>Contact: <b>${mobile}</b></p>

    <p>To get started, simply visit <a href="https://www.grocji.com/" style="color: #1a73e8;">Grocji</a> and enjoy a happy, healthy shopping experience.</p>

    <p><b>Best Regards,</b><br>
    The Grocji Family</p>

    <p>If you have any queries, feel free to contact us using the details below:</p>

    <p>Contact: <b>8757499344, 8757499345</b><br>
    Email: <a href="mailto:grocji@gmail.com" style="color: #1a73e8;">grocji@gmail.com</a><br>
    Website: <a href="https://www.grocji.com/" style="color: #1a73e8;">www.grocji.com</a></p>
</div>`;

    sendemail(email, emailSubject, emailText);

    res.status(201).json(response[0]);
  } catch (err) {
    res.status(400).json({ err, message: 'Something went wrong.Please try again later.' });
  }
});
// http://localhost:4000/users/addguestuser
router.post('/addguestuser', async (req, res) => {
  const {
    name,
    line1,
    line2,
    line3,
    city,
    state,
    country,
    pin,
    contact,
    alternatecontact,
    landmark,
  } = req.body;

  try {
    const user = await db
      .promise()
      .query('SELECT userid FROM users WHERE mobile = ? AND isactive=1', [
        contact,
      ]);

    let userid;

    if (user[0].length > 0) {
      // console.log("user",user[0][0])
      userid = user[0][0].userid;
    } else {
      userid = parseInt(Math.random() * 10000000000);
      const username =
        name.toLowerCase().split(' ').join('').slice(0, 5) +
        parseInt(Math.random() * 100000);
      let password = 'password123';
      const newUser = await db
        .promise()
        .query(
          'INSERT INTO users (name, userid, username, mobile, password, isactive) VALUES (?, ?, ?, ?, ?, ?)',
          [name, userid, username, contact, password, 1]
        );
      // console.log("newuser",newUser[0])
    }

    // Add the address to the address table
    const addressid = parseInt(Math.random() * 100000000);
    await db.promise().query(
      `INSERT INTO address (addressid, name, userid, line1, line2, line3, city, state, country, pin, contact, alternatecontact, landmark) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        addressid,
        name,
        userid,
        line1,
        line2,
        line3,
        city,
        state,
        country,
        pin,
        contact,
        alternatecontact,
        landmark,
      ]
    );

    res.status(200).json({
      message: 'User and address added/updated successfully',
      userid: userid,
      addressid: addressid,
    });
  } catch (err) {
    // console.log(err);
    res.status(400).json(err);
  }
});

// http://localhost:4000/users/Database/fetchPassword
router.get('/fetchPassword', async (req, res) => {
  const { username, email, mobile } = req.body;

  try {
    const response = await db.promise().query(`
      SELECT password FROM users 
      WHERE (username = '${username}' OR email = '${email}' OR mobile = '${mobile}')
    `);

    if (response[0].length > 0) {
      // Password found
      const password = response[0][0].password;
      res.status(200).json({ password });
    } else {
      // User not found
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    // Database error
    // console.error("Error fetching password:", err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// http://localhost:4000/users/activateuser/:id
router.put('/activateuser/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const response = await db
      .promise()
      .query(`UPDATE users SET isactive = 1 WHERE userid = '${id}'`);
    res.status(200).json(response[0]);
  } catch (err) {
    // console.log(err);
    res.status(400).json(err);
  }
});

// http://localhost:4000/users/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const response = await db.promise()
      .query(`SELECT password, userid, username,usertype FROM users where isactive = 1 and 
        ( username = '${username}' or email = '${username}' or mobile = '${username}')`);
    // user found in db
    if (response[0].length > 0) {
      //password matched
      //  console.log(response[0][0].password, req.body.password);
      //  if (response[0][0].password == req.body.password) {

      if (
        bcrypt.compareSync(password, response[0][0].password) ||
        password === response[0][0].password
      ) {
        //password matched
        let obj = {};
        obj.token = jwt.sign({
          username: response[0][0].userid,
          usertype: response[0][0].usertype
        }, 'hashedbit', {
          expiresIn: '30d',
        });

        obj.userType = response[0][0].usertype;
        obj.userId = response[0][0].userid;
        res.status(202).json(obj);
        //res.status(202).json({message: 'Successfully logged in'});
      }
      //password not matched
      else {
        res
          .status(401)
          .json({ message: 'Incorrect Password', loginStatus: false });
      }
    }
    // user not found
    else {
      res.status(422).json({ message: 'User Not Found', loginStatus: false });
    }
  } catch (err) {
    // console.log(err);
    res.status(400).json(err);
  }
});

// http://localhost:4000/users/updateuserpassword
router.put('/updateuserpassword', async (req, res) => {
  try {
    const { userid, oldPassword, newPassword } = req.body;

    const fetchResponse = await db.promise().query(`
      SELECT password FROM users WHERE userid = '${userid}'
    `);

    if (fetchResponse[0].length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentPassword = fetchResponse[0][0].password;

    if (oldPassword !== currentPassword) {
      return res.status(401).json({ message: 'Old password is incorrect' });
    }

    const updateResponse = await db
      .promise()
      .query(
        `UPDATE users SET password = '${newPassword}' WHERE userid = '${userid}'`
      );

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error updating password:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// http://localhost:4000/users/updateusers
router.put('/updateusers', async (req, res) => {
  try {
    if (req.body) {
      const { name, email, mobile, password, userid } = req.body;
      const response = await db.promise().query(`update users set name = '${name}', email = '${email}', mobile = '${mobile}', password = '${password}' where userid = "${userid}"`);
      //console.log(response[0]);
      res.status(200).json(response[0]);
    } else {
      res.status(400).json({ message: 'Error : Request Body Empty.' });
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

// http://localhost:4000/users/forget-username
router.post("/forget-username", async (req, res) => {
  try {
    const { input } = req.body;

    // Validate input
    if (!input) {
      return res.status(400).json({ error: "Email or Mobile Number is required." });
    }

    // Query to fetch user details
    const query = `
      SELECT name,username,email,mobile
      FROM users
      WHERE (email = ? OR mobile = ?) AND isactive = 1
    `;

    // Execute query
    const [response] = await db.promise().query(query, [input, input]);

    // Check if user exists
    if (response.length === 0) {
      return res.status(404).json({ error: "Invalid email or mobile number !!" });
    }
    const userData = response[0];
    const emailSubject = "Your Username Retrieval Request";
    const emailText = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <p><b>Hi ${userData.name}!</b></p>
      
      <p>A warm welcome back to Grocji!</p>

      <p>You recently requested to retrieve your username.  Below you'll find the username associated with your account, which you can use to log in and explore our wide range of products and exclusive deals.</p>

      <p><b>Here are your account details:</b></p>

      <p>Username: <b>${userData.username}</b></p>
      <p>Email: <b>${userData.email}</b></p>
      <p>Contact: <b>${userData.mobile}</b></p>

      <p>To get started, simply visit <a href="https://www.grocji.com/" style="color: #1a73e8;">Grocji</a> and enjoy a happy, healthy shopping experience.</p>

      <p><b>Best Regards,</b><br>
      The Grocji Family</p>

      <p>If you have any queries, feel free to contact us using the details below:</p>

      <p>Contact: <b>8757499344, 8757499345</b><br>
      Email: <a href="mailto:grocji@gmail.com" style="color: #1a73e8;">grocji@gmail.com</a><br>
      Website: <a href="https://www.grocji.com/" style="color: #1a73e8;">www.grocji.com</a></p>
    </div>`;

    sendemail(userData.email, emailSubject, emailText);

    res.status(200).json({ success: true, msg: "username has been sent to your email" });

  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// http://localhost:4000/users/forget-password
router.post("/forget-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({ success: false, msg: "Email is required" });
  }

  try {
    const [user] = await db.promise().query(
      "SELECT userid, name, username, mobile, email FROM users WHERE email = ?",
      [email]
    );

    if (user.length === 0) {
      return res.status(404).send({ success: false, msg: "This email is not registered with us." });
    }
    const userData = user[0];
    const password = parseInt(Math.random() * 10000000000);
    await db.promise().query(`UPDATE users SET password = ? WHERE userid = ?`,
      [password, userData.userid]);

    const emailSubject = "Your password has changed";
    const emailText = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <p><b>Hi ${userData.name}!</b></p>
      
      <p>A warm welcome back to Grocji!</p>

      <p>Your password has been successfully reset. Below is your new password, which you can use to log in and explore our wide range of products and exclusive deals.</p>

      <p><b>Here are your updated account details:</b></p>

      <p>Username: <b>${userData.username}</b></p>
      <p>New Password: <b>${password}</b></p>
      <p>Email: <b>${userData.email}</b></p>
      <p>Contact: <b>${userData.mobile}</b></p>

      <p>To get started, simply visit <a href="https://www.grocji.com/" style="color: #1a73e8;">Grocji</a> and enjoy a happy, healthy shopping experience.</p>

      <p><b>Best Regards,</b><br>
      The Grocji Family</p>

      <p>If you have any queries, feel free to contact us using the details below:</p>

      <p>Contact: <b>8757499344, 8757499345</b><br>
      Email: <a href="mailto:grocji@gmail.com" style="color: #1a73e8;">grocji@gmail.com</a><br>
      Website: <a href="https://www.grocji.com/" style="color: #1a73e8;">www.grocji.com</a></p>
    </div>`;

    sendemail(userData.email, emailSubject, emailText);

    return res.status(200).send({
      success: true,
      msg: "Password has been sent to your email"
    });

  } catch (err) {
    console.error("Forget Password Error:", err);
    return res.status(500).send({ success: false, msg: "Internal Server Error" });
  }
});


// http://localhost:4000/users/updateusersdashboard/:userid
router.put('/updateusersdashboard/:userid', async (req, res) => {
  try {
    console.log('updatwing.........')
    const id = req.params.userid
    const { name, email, mobile, } = req.body;
    const response = await db.promise().query(`update users set name = '${name}', email = '${email}', mobile = '${mobile}' where userid = "${id}"`);
    //console.log(response[0]);
    res.status(200).json(response[0]);
  }
  catch (err) {
    res.status(400).json(err);
  }
});

//http://localhost:4000/users/getdeliverypartnername
router.get('/getdeliverypartnername', async (req, res) => {
  try {
    const [response] = await db.promise()
      .query('SELECT userid, name FROM users WHERE usertype = "deliverypartner"');
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

// http://localhost:4000/users/deactivateaccount
router.post('/deleteaccount', async (req, res) => {
  try {
    const { username, password } = req.body;
    const query = `
      SELECT userid,username,password FROM users 
      WHERE (email = ? OR mobile = ? OR username = ?) 
      AND isactive = 1
    `;
    const [user] = await db.promise().query(query, [username, username, username]);

    if (user.length === 0) {
      return res.status(400).json({ message: 'User not found or already deleted' });
    }
    const userData = user[0];
    // const passwordMatch = await bcrypt.compare(password, userData.password); 
    const passwordMatch = userData.password === password ? true : false;
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect credentials' });
    }
    const updateQuery = `UPDATE users SET isactive = 0 WHERE userid = ?`;
    await db.promise().query(updateQuery, [userData.userid]);

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'An error occurred', error: err });
  }
});

// http://localhost:4000/users/allusersdetails
router.get('/allusersdetails', async (req, res) => {
  try {
    const response = await db.promise().query(`
      SELECT 
        u.userid, 
        u.username, 
        u.name, 
        u.email, 
        u.mobile, 
        COALESCE(SUM(o.paymentamount), 0) AS total_paymentamount,
        COALESCE(SUM(o.costamount), 0) AS total_costamount
      FROM users u
      LEFT JOIN orders o ON u.userid = o.userid
      WHERE u.isactive = 1
      GROUP BY u.userid, u.username, u.name, u.email, u.mobile
      ORDER BY u.srno DESC
      LIMIT 100
    `);

    res.status(200).json(response[0]);
  } catch (err) {
    console.error("Error fetching user details:", err);
    res.status(400).json(err);
  }
});




router.get('/searchbyvalue/:searchTerm', async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm.trim().toLowerCase();

    const query = `
SELECT 
  u.userid, u.name, u.email, u.mobile, u.username,
  a.sr_no, a.addressid, a.line1, a.line2, a.line3,
  a.city, a.state, a.country, a.pin, a.contact,
  a.alternatecontact, a.landmark, a.isactive AS address_isactive,
  a.createdon, a.createdby, a.updatedon, a.updatedby, a.is_default
FROM users u
LEFT JOIN address a ON u.userid = a.userid AND a.isactive = 1 AND a.is_default = 1
WHERE u.isactive = 1 AND (
  LOWER(CAST(u.userid AS CHAR)) = ? OR
  LOWER(u.mobile) = ? OR
  LOWER(u.email) = ? OR
  LOWER(u.username) = ? OR
  LOWER(u.name) LIKE ?
)
LIMIT 1;
`;

    const [results] = await db.promise().query(query, [
      searchTerm,
      searchTerm,
      searchTerm,
      searchTerm,
      `%${searchTerm}%`
    ]);

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Separate user and address data
    const user = {
      userid: results[0].userid,
      name: results[0].name,
      email: results[0].email,
      mobile: results[0].mobile,
      username: results[0].username
    };

    const address = results[0].addressid
      ? {
        sr_no: results[0].sr_no,
        addressid: results[0].addressid,
        line1: results[0].line1,
        line2: results[0].line2,
        line3: results[0].line3,
        city: results[0].city,
        state: results[0].state,
        country: results[0].country,
        pin: results[0].pin,
        contact: results[0].contact,
        alternatecontact: results[0].alternatecontact,
        landmark: results[0].landmark,
        is_default: results[0].is_default,
        createdon: results[0].createdon,
        createdby: results[0].createdby,
        updatedon: results[0].updatedon,
        updatedby: results[0].updatedby
      }
      : null;

    res.status(200).json({ success: true, user, address });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ success: false, message: 'Server error during search' });
  }
});

router.get("/searchItem/:searchParam", async (req, res) => {
  const { searchParam } = req.params;
  const parameter = `%${searchParam}%`
  const query = "SELECT * FROM users WHERE userid LIKE ? OR name LIKE ? OR email LIKE ? OR username LIKE ? OR mobile LIKE ?";

  try {
    const [results] = await db.promise().query(query, [parameter, parameter, parameter, parameter, parameter]);
    res.status(200).json({ message: "Data fetched successfully", filteredData: results });
  } catch (err) {
    res.status(400).json({ message: "Error occurred while fetching data", error: err });
  }
})

router.get("/searchDetailsItem/:searchParam", async (req, res) => {
  const { searchParam } = req.params;
  const parameter = `%${searchParam}%`;
  try {
    const [result] = await db.promise().query(`
      SELECT 
    u.userid, 
    u.username, 
    u.name, 
    u.email, 
    u.mobile, 
    COALESCE(SUM(o.paymentamount), 0) AS total_paymentamount,
    COALESCE(SUM(o.costamount), 0) AS total_costamount
FROM users u
LEFT JOIN orders o 
    ON u.userid = o.userid
WHERE (u.userid LIKE ? 
    OR u.username LIKE ? 
    OR u.name LIKE ? 
    OR u.email LIKE ? 
    OR u.mobile LIKE ?)
GROUP BY 
    u.userid, 
    u.username, 
    u.name, 
    u.email, 
    u.mobile;

      `,
      [parameter, parameter, parameter, parameter, parameter]);
    res.status(200).json({ message: "Data fetched successfully", filteredData: result });
  } catch (err) {
    res.status(400).json({ message: "Some error occurred while fetching", error: err });
  }
})


module.exports = router;
