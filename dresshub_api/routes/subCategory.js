const express = require('express');
const fs = require('fs-extra');
const route = express.Router();
const multer = require('multer');
const db = require('../db');

// Configure multer for file uploads

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const SubcategoryFolder = `uploads/Subcategory/${req.body.subcategoryname}`;
    try {
      await fs.ensureDir(SubcategoryFolder); // Ensure category folder exists
      cb(null, SubcategoryFolder);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Set the filename
  },
});

//http://localhost:4000/subCategory/allSubCategory
route.get('/allSubCategory', async (req, res) => {
  try {
    const query =
      'SELECT subcategory_id, subcategoryname, category_id, subcategoryimage,sequence,isactive FROM subcategory WHERE isactive = 1  ORDER BY category_id ASC';

    const [response] = await db.promise().query(query);

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/subCategory/allSubCategoryadmin
route.get('/allSubCategoryadmin', async (req, res) => {
  try {
    const query =
      'SELECT subcategory_id, subcategoryname, category_id, subcategoryimage, sequence, isactive FROM subcategory WHERE isactive IN (1, 2) ORDER BY category_id ASC';

    const [response] = await db.promise().query(query);

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/subCategory/subCategoryName
route.post('/subCategoryName', async (req, res) => {
  try {
    const { subcategoryname, category_id } = req.body;

    const query =
      'SELECT * FROM subcategory WHERE subcategoryname=? AND category_id=? AND  isactive = 1 ORDER BY sequence ASC';

    const [response] = await db
      .promise()
      .query(query, [subcategoryname, category_id]);

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/subCategory/subCategoryById/id001

route.get('/subCategoryById/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query =
      'SELECT * FROM subcategory WHERE subcategory_id=? AND  isactive = 1';

    const [response] = await db.promise().query(query, [id]);

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/subCategory/addSubCategory
route.post('/addSubCategory', async (req, res) => {
  try {
    const { subcategoryname, category_id, sequence } = req.body;
    //const  subcategory_id = parseInt(Math.random() * 10000000000);
    const subcategory_id =
      subcategoryname.toLowerCase().split(' ').join('').slice(0, 5) +
      parseInt(Math.random() * 100000);
    const response = await db
      .promise()
      .query(
        'INSERT INTO subcategory (subcategoryname,category_id ,isactive,subcategory_id,sequence) VALUES (?, ?,?,?,?)',
        [subcategoryname, category_id, 1, subcategory_id, sequence]
      );
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/subCategory/removeSubCategory/id001

route.put('/romoveSubCategory/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await db
      .promise()
      .query('UPDATE subcategory SET isactive = 0 WHERE subcategory_id = ? ', [
        id,
      ]);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/subCategory/updatestatus/id001
// o - for delete , 1 - active , 2 - not-active
route.put('/updatestatus/:id', async (req, res) => {
  
  
  try {
    const id = req.params.id;
    const stat = req.body.stat; 
    const response = await db
      .promise()
      .query('UPDATE subcategory SET isactive = ? WHERE subcategory_id = ? ', [
        stat,
        id,
      ]);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/subCategory/categoryid/:id

route.get('/categoryid/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const response = await db
      .promise()
      .query(
        'select subcategory_id,subcategoryname,category_id,subcategoryimage, sequence from subcategory where isactive = 1 and category_id = ? ORDER BY sequence ASC',
        [id]
      );

    res.status(200).json(response[0]);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/subCategory/updateSubCategory/id001
const upload = multer({ storage: storage });

route.put(
  '/updateSubCategory/:id',
  upload.single('image'),
  async (req, res) => {
    try {
      const sr_no = req.params.id;
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

      // Handle image file if it exists
      if (req.file) {
        updateFields.push('subcategoryimage = ?');
        values.push(req.file.filename);
      }

      if (updateFields.length > 0) {
        const updateQuery = `UPDATE subcategory SET ${updateFields.join(
          ', '
        )} WHERE subcategory_id = ?`;
        values.push(sr_no);

        // Execute the update query
        const [response] = await db.promise().query(updateQuery, values);

        res.status(200).json(response);
      } else {
        res
          .status(400)
          .json({ message: 'Error: No valid fields provided for update.' });
      }
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

route.get("/searchItem/:searchParam", async (req, res)=>{
  const {searchParam} = req.params;
  const searchQuery = `%${searchParam}%`;
  try{
    const [response] = await db.promise().query("SELECT * FROM subcategory WHERE subcategory_id LIke ? OR subcategoryname LIKE ? OR category_id LIKE ?", [searchQuery, searchQuery, searchQuery]);
    res.status(200).json({message: "Data fetched with success", filteredData: response});
  }catch(err){
    res.status(400).json({message: "Something went wrong while fetching", error: err});
  }
});

module.exports = route;
