const verifyJwtAdmin = require("../verifyadmin");
const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/discount');
  },
  filename: function (req, file, cb) {
    const filename = 'discount' + '-' + Date.now() + '.jpg';
    cb(null, filename);
    req.filePath = `uploads/discount/${filename}`;
  },
});

const maxSize = 1 * 1000 * 1000;

const upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('only .png, .jpg, and .jpeg format allowed!'));
    }
  },
});

//http://localhost:4000/discount/alldiscount
router.get('/alldiscount', async (req, res) => {
  try {
    const query =
      'SELECT discountid, discountname, amount, percentage, maxdiscount, mincartvalue,maxcartvalue, image, count, isoffer, ishidden, description, startdate, enddate FROM discount WHERE isactive = 1';
    const [response] = await db.promise().query(query);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/discount/alloffers
router.get('/alloffers', async (req, res) => {
  try {
    const query =
      `SELECT * FROM discount WHERE isactive = 1 && isoffer = 'YES'`;
    const [response] = await db.promise().query(query);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/discount/discountbyid/:id
router.get('/discountbyid/:discountid', async (req, res) => {
  try {
    const { discountid } = req.params;
    const query = 'SELECT * FROM discount WHERE discountid=? AND isactive=1';
    const [response] = await db.promise().query(query, [discountid]);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/discount/adddiscount

router.post('/adddiscount', upload.single('image'),verifyJwtAdmin, async (req, res) => {
  try {
    const { discountname, amount, percentage, count, startdate, enddate,mincartvalue,maxcartvalue,maxdiscount,isoffer,ishidden,description} =
      req.body;
    const image = req.file.path;

    const discountid = parseInt(Math.random() * 10000000000);

    const response = await db
      .promise()
      .query(
        'INSERT INTO discount (discountid, discountname, amount, percentage, maxdiscount,mincartvalue,maxcartvalue,image, count, isoffer,ishidden,description, startdate, enddate) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?)',
        [
          discountid,
          discountname,
          amount,
          percentage,
          maxdiscount,
          mincartvalue,
          maxcartvalue,
          image,
          count,
          isoffer,
          ishidden,
          description,
          startdate,
          enddate,
        ]
      );

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//http://localhost:4000/discount/removediscount/:discountid
router.put('/removediscount/:discountid',  verifyJwtAdmin,  async (req, res) => {
  try {
    const { discountid } = req.params;
    const response = await db
      .promise()
      .query('UPDATE discount SET isactive = 0 WHERE discountid = ? ', [
        discountid,
      ]);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/discount/updatediscount/:discountid

router.put(
  '/updatediscount/:discountid',
  upload.single('image'),
    verifyJwtAdmin,  
  async (req, res) => {
    try {
      const { discountname, amount, percentage, maxdiscount, count, isoffer, ishidden, startdate, enddate,mincartvalue,maxcartvalue, description } =
        req.body;
      const { discountid } = req.params;

      let image;
      if (req.file && req.file.path) {
        image = req.file.path.replace(/\\/g, '/');
      } else {
        const [rows] = await db
          .promise()
          .query('SELECT image FROM discount WHERE discountid = ?', [
            discountid,
          ]);
        if (rows.length > 0) {
          image = rows[0].image;
        } else {
          return res.status(404).json({ message: 'Discount not found' });
        }
      }
      const response = await db
        .promise()
        .query(
          'UPDATE discount SET discountname = ?, amount = ?, percentage = ?, maxdiscount = ?, image = ?, count = ?, mincartvalue = ?, maxcartvalue = ?, isoffer = ?, ishidden = ?, startdate = ?, enddate = ?, description = ? WHERE discountid = ?',
          [
            discountname,
            amount,
            percentage,
            maxdiscount,
            image,
            count,
            mincartvalue,
            maxcartvalue,
            isoffer,
            ishidden,
            startdate,
            enddate,
            description,
            discountid,
          ]
        );

      res
        .status(200)
        .json({ message: 'Discount updated successfully', response });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

//http://localhost:4000/discount/discountbycc/cc
router.get('/discountbycc/:couponcode', async (req, res) => {
    try {
        const { couponcode } = req.params;
        const query = "SELECT * FROM discount WHERE discountname =? AND isactive=1"
        const [response] = await db.promise().query(query, [couponcode])
        res.status(200).json(response)
    } catch (error) {
        res.status(400).json(error)
    }
})

module.exports = router;
