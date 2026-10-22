const express = require('express');
const route = express.Router();
const db = require('../db');


//http://localhost:4000/popular/topProducts
route.get("/topProducts", async(req,res)=>{
    try{
        const query=` SELECT 
                p.productid, 
                p.prod_name,
                p.category,
                p.subcategory, 
                c.categoryname AS categoryName, 
                s.subcategoryname AS subcategoryName, 
                SUM(opd.quantity) AS total_orders
            FROM order_product_details opd
            JOIN products p ON p.productid = opd.productid
            JOIN category c ON p.category = c.category_id
            JOIN subcategory s ON p.subcategory = s.subcategory_id
            GROUP BY p.productid, p.prod_name, p.category, p.subcategory , c.categoryname, s.subcategoryname
            ORDER BY total_orders DESC 
            LIMIT 10`;

        const [response]=await db.promise().query(query)
        res.status(200).json(response);
    }
    catch(err){
        res.status(500).json(err);
    }
})

module.exports=route;