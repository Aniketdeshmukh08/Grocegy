const express = require('express');
const route = express.Router();
const db = require('../db');
const verify= require('../verify');
const verifyAdmin= require('../verifyadmin');
const multer = require('multer');
const path = require('path');

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/categories/'); // folder to store uploaded images
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  }
});

//File filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

//Initialize multer
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 5MB max
  fileFilter: fileFilter
});

//http://localhost:4000/category/allCategory
route.get('/allCategory', async (req, res) => {
  try {
    const query =
      'SELECT category_id, categoryname, categoryimage FROM category WHERE isactive = 1';
    const [response] = await db.promise().query(query);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/category/allCategoryadmin
route.get('/allCategoryadmin', async (req, res) => {
  try {
    const query =
      'SELECT category_id, categoryname, categoryimage, isactive FROM category WHERE isactive IN (1, 2) ';
    const [response] = await db.promise().query(query);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/category/getByName
route.post('/getByName', async (req, res) => {
  try {
    const { categoryname } = req.body;
    const query =
      'SELECT * FROM category WHERE categoryname=? AND isactive = 1 ';
    const [response] = await db.promise().query(query, [categoryname]);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/category/getById/id001
route.get('/getById/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM category WHERE category_id=? AND isactive=1';
    const [response] = await db.promise().query(query, [id]);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/category/addCategory
route.post('/addCategory', verifyAdmin, upload.single('categoryimage'), async (req, res) => {
  try {
    const { categoryname } = req.body;
    const category_id =
      categoryname.toLowerCase().split(' ').join('').slice(0, 5) +
      parseInt(Math.random() * 100000);
    const image = req.file ? req.file.filename : "";
    const [response] = await db.promise().query(
  `INSERT INTO category (category_id, categoryname, categoryimage) VALUES (?, ?, ?)`,
  [category_id, categoryname, image]
);

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/category/removeCategory/id001
route.delete('/removeCategory/:id', verifyAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const response = await db
      .promise()
      .query('UPDATE category SET isactive = 0 WHERE category_id = ? ', [id]);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/category/updatestatus/id001
// o - for delete , 1 - active , 2 - not-active
route.put('/updatestatus/:id', verifyAdmin, async (req, res) => {
  
  try {
    const id = req.params.id;
    const stat= req.body.stat;
    const response = await db
      .promise()
      .query('UPDATE category SET isactive = ? WHERE category_id = ? ', [stat,id]);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

// This API is used by frontend CategoryDetails
route.get('/categories', verifyAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;   
    const limit = parseInt(req.query.limit) || 10; 
    const search = req.query.search || "";        

    const offset = (page - 1) * limit; 

    let searchQuery = "";
    let values = [];

    if (search) {
      searchQuery = `AND categoryname LIKE ?`;
      values.push(`%${search}%`);
    }

    const [countResult] = await db.promise().query(
      `SELECT COUNT(*) AS total 
       FROM category 
       WHERE isactive IN (1,2) 
       ${searchQuery}`,
      values
    );

    const totalRecords = countResult[0].total;
    const totalPages = Math.ceil(totalRecords / limit);

    const [data] = await db.promise().query(
      `SELECT category_id, categoryname, categoryimage, isactive 
       FROM category 
       WHERE isactive IN (1,2)
       ${searchQuery}
       ORDER BY category_id DESC
       LIMIT ? OFFSET ?`,
      [...values, limit, offset]
    );

    res.status(200).json({
      data,             
      currentPage: page,
      totalPages,      
      totalRecords,     
      limit
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch categories"
    });
  }
});

//http://localhost:4000/category/updateCategory/id001
route.put('/updateCategory/:id', verifyAdmin, upload.single('categoryimage'), async (req, res) => {
  try {
    const name = req.body.categoryname;
    const id = req.params.id;
    const image = req.file ? req.file.filename : "";

    let values = [name];
    let query = `UPDATE category SET categoryname = ?`;
    if (image) {
      query += `, categoryimage = ?`;
      values.push(image);
    }
    query += ` WHERE category_id = ?`;
    values.push(id);
    const response = await db.promise().query(query, values);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

route.get("/searchItem/:searchParam", async (req, res)=>{
  const { searchParam } = req.params;
  const searchQuery = `%${searchParam}%`;
  try{
    const [response] = await db.promise().query("SELECT * FROM category WHERE category_id LIKE ? OR categoryname LIKE ?", [searchQuery, searchQuery]);
    res.status(200).json({message: "Data has been fetched with success", filteredData: response});
  }catch(err){
    res.status(400).json({message: "Some error occurred", error: err});
  }
})

module.exports = route;
