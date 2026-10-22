const express = require('express');
const db = require('../db.js');
const route = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const sharp = require('sharp');


// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const categoryFolder = `uploads/${req.body.category}`;
    try {
      await fs.ensureDir(categoryFolder);
      cb(null, categoryFolder);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: function (req, file, cb) {
    const { prod_name, productid, category, subcategory, brand } = req.body;
    const datestamp = Date.now();
    const ext = path.extname(file.originalname);
    const str = prod_name.replace(/[^a-zA-Z0-9]/g, '');
    const filename = `${str}_${category}_${subcategory}_${productid}_${datestamp}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

//http://localhost:4000/products_replicate/CategoryByName
route.get('/CategoryByName', async (req, res) => {
  try {
    const { categoryname } = req.query;
    if (!categoryname) {
      return res.status(400).json({ message: 'Category name is required' });
    }
    const query = `SELECT p.productid, 
    p.prod_name,  
    p.subcategory, 
    p.price,  
    p.brand, 
    p.discount, 
    p.stock_quantity, c.categoryname FROM 
    products p
JOIN 
    category c ON p.category = c.category_id
JOIN 
    subcategory s ON p.subcategory = s.subcategory_id
JOIN 
    brands b ON p.brand = b.brand_id
WHERE 
    c.categoryname=? and p.isactive = 1;`;
    const [response] = await db.promise().query(query, [categoryname]);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/products_replicate/allProducts
route.get('/allProducts', async (req, res) => {
  try {
    const [response] = await db.promise().query(`SELECT 
    p.srno, 
    p.productid, 
    p.prod_name, 
    p.subcategory_id, 
    p.category, 
    p.subcategory, 
    p.price, 
    p.image, 
    p.brand, 
    p.discount, 
    p.prod_desc, 
    p.stock_quantity, 
    p.isactive, 
    p.createdon, 
    p.createdby, 
    p.updatedon, 
    p.updatedby, 
    p.category_id,
    c.categoryname, 
    s.subcategoryname, 
    b.brand_name
FROM 
    products p
JOIN 
    category c ON p.category = c.category_id
JOIN 
    subcategory s ON p.subcategory = s.subcategory_id
JOIN 
    brands b ON p.brand = b.brand_id
WHERE 
    p.isactive = 1;
`);
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json(err);
  }
});

//http://localhost:4000/products_replicate/allProductsByCategory
route.get('/allProductsByCategory', async (req, res) => {
  try {
    const { categoryid } = req.query;
    if (!categoryid) {
      return res.status(400).json({ message: 'Category categoryid is required' });
    }
    const simpleQuery = `SELECT productid, prod_name, category, subcategory, price, brand, discount, stock_quantity FROM products WHERE category = ? AND isactive = 1;`;
    const [simpleResponse] = await db.promise().query(simpleQuery, [categoryid]);
    if (simpleResponse.length > 0) {
      const query = `SELECT 
        p.productid, p.prod_name, p.category, p.subcategory, p.price, p.brand, p.discount, p.stock_quantity,
        c.categoryname, s.subcategoryname, b.brand_name
      FROM products p
      LEFT JOIN category c ON p.category = c.category_id
      LEFT JOIN subcategory s ON p.subcategory = s.subcategory_id
      LEFT JOIN brands b ON p.brand = b.brand_id
      WHERE p.category = ? AND p.isactive = 1;`;
      const [response] = await db.promise().query(query, [categoryid]);
      res.status(200).json(response);
    } else {
      res.status(200).json([]);
    }
  } catch (err) {
    console.error('Error in allProductsByCategory:', err);
    res.status(500).json({ error: err.message });
  }
});

//http://localhost:4000/products_replicate/productByPId/:id
route.get('/productByPId/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const [response] = await db.promise().query(
      `SELECT * FROM products WHERE isactive = 1 AND productid = ?`, [id]
    );
    res.status(200).json(response[0]);
  } catch (err) {
    res.status(400).json(err);
  }
});

//http://localhost:4000/products_replicate/productById/:id
route.get('/productById/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const [response] = await db.promise().query(`
      SELECT 
        p.productid, p.prod_name, p.subcategory_id, p.category, p.subcategory, p.price, p.image,
        p.brand, p.discount, p.prod_desc, p.stock_quantity, p.category_id,
        c.categoryname, s.subcategoryname, b.brand_name
      FROM products p
      LEFT JOIN category c ON p.category = c.category_id
      LEFT JOIN subcategory s ON p.subcategory = s.subcategory_id
      LEFT JOIN brands b ON p.brand = b.brand_id
      WHERE p.isactive = 1 AND p.productid = ?
    `, [id]);
    if (response.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(response[0]);
  } catch (err) {
    console.error('Error fetching product by ID:', err);
    res.status(400).json({ error: err.message });
  }
});

//http://localhost:4000/products_replicate/productList
route.get('/productList', async (req, res) => {
  try {
    const [response] = await db.promise().query(`SELECT 
      srno, productid, prod_name, subcategory_id, category, subcategory, price, brand, discount, stock_quantity
      FROM products WHERE isactive = 1;`);
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json(err);
  }
});

//http://localhost:4000/products_replicate/search
route.get('/search', async (req, res) => {
  const searchTerm = req.query.q;
  if (!searchTerm) {
    return res.status(400).json({ error: 'Search term is required' });
  }
  try {
    const query = `SELECT productid, prod_name, category, subcategory, price, image, discount, stock_quantity FROM products
      WHERE (prod_name LIKE ? OR brand LIKE ?) AND isactive = 1 AND stock_quantity != -1 
      ORDER BY CASE WHEN stock_quantity = 0 THEN 1 ELSE 0 END, num_times_ordered DESC, prod_name ASC, price ASC`;
    const values = [`%${searchTerm}%`, `%${searchTerm}%`];
    const [results] = await db.promise().query(query, values);
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while searching for products', details: err });
  }
});

//http://localhost:4000/products_replicate/addProduct
route.post('/addProduct', upload.single('image'), async (req, res) => {
  try {
    const { productid, prod_name, category, subcategory, price, brand, discount, prod_desc, stock_quantity } = req.body;
    let imagePath = req.file ? req.file.path : '';
    if (req.file) {
      try {
        const metadata = await sharp(req.file.path).metadata();
        const { width, height } = metadata;
        const targetWidth = 400;
        const targetHeight = parseInt((targetWidth * height) / width);
        const tempPath = `${req.file.destination}/temp_${req.file.filename}`;
        await sharp(req.file.path).resize(targetWidth, targetHeight).jpeg({ quality: 80 }).toFile(tempPath);
        await fs.move(tempPath, req.file.path, { overwrite: true });
      } catch (error) {
        console.error('Error during image processing:', error.message);
      }
    }
    const active = 1;
    const response = await db.promise().query(
      `INSERT INTO products (prod_name, category, subcategory, price, image, brand, discount, isactive, productid, prod_desc, stock_quantity)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [prod_name, category, subcategory, price, imagePath, brand, discount, active, productid, prod_desc, stock_quantity]
    );
    res.status(200).json({ productid, response });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//http://localhost:4000/products_replicate/removeProduct/:id  ← BUG FIXED
route.put('/removeProduct/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await db.promise().query(
      `UPDATE products SET isactive = -1 WHERE productid = ?`, [id]
    );
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json(err);
  }
});

//http://localhost:4000/products_replicate/updateProduct/:id
route.put('/updateProduct/:id', upload.single('image'), async (req, res) => {
  try {
    const id = req.params.id;
    const myObject = req.body;
    const updateFields = [];
    const values = [];
    if (req.file) {
      updateFields.push('image = ?');
      values.push(req.file.path);
    }
    Object.keys(myObject).forEach(key => {
      const value = myObject[key];
      if (value != null && value !== '' && !(typeof value === 'number' && isNaN(value))) {
        if (key !== 'image') {
          updateFields.push(`${key} = ?`);
          values.push(value);
        }
      }
    });
    if (updateFields.length > 0) {
      values.push(id);
      const updateQuery = `UPDATE products SET ${updateFields.join(', ')} WHERE productid = ?`;
      const [response] = await db.promise().query(updateQuery, values);
      res.status(200).json({ message: 'Product updated successfully', response });
    } else {
      res.status(400).json({ error: 'No valid fields to update' });
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/products_replicate/bySubCategory
route.post('/bySubCategory', async (req, res) => {
  try {
    const { category, subcategory } = req.body;
    const query = `SELECT productid, prod_name, subcategory_id, category, subcategory, price, image, discount, stock_quantity 
      FROM products 
      WHERE isactive = ? AND category = ? AND subcategory = ? AND stock_quantity != -1
      ORDER BY CASE WHEN stock_quantity = 0 THEN 1 ELSE 0 END, prod_name ASC, price ASC, num_times_ordered DESC`;
    const [response] = await db.promise().query(query, [1, category, subcategory]);
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json(err);
  }
});

//http://localhost:4000/products_replicate/bySubCategoryId/:id
route.get('/bySubCategoryId/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [response] = await db.promise().query(
      `SELECT * FROM products WHERE isactive=? AND subcategory =?`, [1, id]
    );
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json(err);
  }
});

//http://localhost:4000/products_replicate/byCategoryId/:id
route.get('/byCategoryId/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [response] = await db.promise().query(
      `SELECT * FROM products WHERE isactive=? AND category =?`, [1, id]
    );
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json(err);
  }
});

//http://localhost:4000/products_replicate/updateProductImage/:productid
route.post('/updateProductImage/:productid', upload.single('image'), async (req, res) => {
  try {
    const { productid } = req.params;
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const imagePath = req.file.path;
    const [response] = await db.promise().query(
      `UPDATE products SET image = ? WHERE productid = ?`, [imagePath, productid]
    );
    res.status(200).json({ productid, response });
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/products_replicate/copyProuduct
route.post('/copyProuduct', upload.single('image'), async (req, res) => {
  try {
    const { productid, prod_name, category, subcategory, price, brand, discount, prod_desc, stock_quantity } = req.body;
    const imagePath = req.file ? req.file.path : '';
    const active = 1;
    const response = await db.promise().query(
      `INSERT INTO products (prod_name, category, subcategory, price, image, brand, discount, isactive, productid, prod_desc, stock_quantity)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [prod_name, category, subcategory, price, imagePath, brand, discount, active, productid, prod_desc, stock_quantity]
    );
    res.status(200).json({ productid, response });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//http://localhost:4000/products_replicate/allBrandsByOrders
route.get("/allBrandsByOrders", async (req, res) => {
  try {
    const [response] = await db.promise().query(`
      SELECT b.brand_id, b.brand_name, SUM(p.num_times_ordered) AS total_orders
      FROM products p
      JOIN brands b ON p.brand = b.brand_id
      WHERE p.isactive = 1
      GROUP BY b.brand_name
      ORDER BY total_orders DESC;
    `);
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json(err);
  }
});

//http://localhost:4000/products_replicate/brand/:brand_id
route.get("/brand/:brand_id", async (req, res) => {
  try {
    const { brand_id } = req.params;
    if (!brand_id) {
      return res.status(400).json({ message: 'Brand ID is required' });
    }
    const query = `SELECT * FROM products WHERE isactive = ? AND brand = ?
      ORDER BY CASE WHEN stock_quantity = 0 THEN 1 ELSE 0 END, num_times_ordered ASC, prod_name ASC, price ASC;`;
    const [response] = await db.promise().query(query, [1, brand_id]);
    if (response.length === 0) {
      return res.status(404).json({ message: 'No products found for the selected brand' });
    }
    res.status(200).json(response);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error', error: err });
  }
});

//http://localhost:4000/products_replicate/updateStockQuantity/:pid/:value
route.put('/updateStockQuantity/:pid/:value', async (req, res) => {
  try {
    const { pid, value } = req.params;
    const response = await db.promise().query(
      `UPDATE products SET stock_quantity = ? WHERE productid = ?`, [value, pid]
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

//http://localhost:4000/products_replicate/similar/:productId
route.get('/similar/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const [productDetails] = await db.promise().query(
      `SELECT category, subcategory FROM products WHERE isactive = 1 AND productid = ?`, [productId]
    );
    if (productDetails.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const { category, subcategory } = productDetails[0];
    const [similarProducts] = await db.promise().query(
      `SELECT productid, prod_name, category, subcategory, price, image, brand, discount, stock_quantity, num_times_ordered 
       FROM products 
       WHERE isactive = 1 AND category = ? AND subcategory = ? AND productid != ?
       ORDER BY num_times_ordered DESC`,
      [category, subcategory, productId]
    );
    res.status(200).json(similarProducts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

//http://localhost:4000/products_replicate/setStockToZero
route.put('/setStockToZero', async (req, res) => {
  try {
    const { productIds } = req.body;
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ error: 'Invalid productIds array provided' });
    }
    const placeholders = productIds.map(() => '?').join(', ');
    const query = `UPDATE products SET stock_quantity = 0 WHERE productid IN (${placeholders})`;
    await db.promise().query(query, productIds);
    res.status(200).json({ message: 'Stock updated successfully for selected products.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update stock quantity.' });
  }
});

//http://localhost:4000/products_replicate/productlistcategorywiseforadmin/:category
route.get('/productlistcategorywiseforadmin/:category', async (req, res) => {
  try {
    const category = req.params.category;
    const response = await db.promise().query(
      `SELECT * FROM products WHERE category = ?`, [category]
    );
    res.status(200).json(response[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching product list' });
  }
});

//http://localhost:4000/products_replicate/allBrandsByNumOrders
route.get("/allBrandsByNumOrders", async (req, res) => {
  try {
    const [response] = await db.promise().query(`
      SELECT b.brand_id, b.brand_name, b.brand_image,
        SUM(p.num_times_ordered) AS total_orders,
        COUNT(p.productid) AS product_count,
        (SUM(p.num_times_ordered) / NULLIF(COUNT(p.productid), 0)) AS orders_per_product
      FROM products p
      JOIN brands b ON p.brand = b.brand_id
      WHERE p.isactive = 1
      GROUP BY b.brand_id, b.brand_name, b.brand_image
      ORDER BY total_orders DESC;
    `);
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ error: err.message, message: 'Failed to fetch brands by number of orders' });
  }
});

module.exports = route;