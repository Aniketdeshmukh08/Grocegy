const express = require('express');
const route = express.Router();
const db = require('../db');



const formatDateForMySQL = (dateStr) => {
  if (!dateStr) return null;
  
  
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  
  
  const [day, month, year] = dateStr.split('/');
  if (day && month && year) {
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  
  return null;
};


const getDateRangeQuery = (period, startDate, endDate) => {
  const formattedStartDate = formatDateForMySQL(startDate);
  const formattedEndDate = formatDateForMySQL(endDate);

  let dateCondition = '';
  let groupByClause = '';
  let dateFormat = '';

  switch (period) {
    case 'daily':
      dateCondition = formattedStartDate && formattedEndDate 
        ? `AND DATE(o.createdon) BETWEEN '${formattedStartDate}' AND '${formattedEndDate}'`
        : `AND DATE(o.createdon) = CURDATE()`;
      groupByClause = 'DATE(o.createdon)';
      dateFormat = '%d/%m/%Y';
      break;
    case 'weekly':
      dateCondition = formattedStartDate && formattedEndDate 
        ? `AND DATE(o.createdon) BETWEEN '${formattedStartDate}' AND '${formattedEndDate}'`
        : `AND YEARWEEK(DATE(o.createdon), 1) = YEARWEEK(CURDATE(), 1)`;
      groupByClause = 'YEARWEEK(DATE(o.createdon), 1)';
      dateFormat = 'Week %v/%x';
      break;
    case 'monthly':
      dateCondition = formattedStartDate && formattedEndDate 
        ? `AND DATE(o.createdon) BETWEEN '${formattedStartDate}' AND '${formattedEndDate}'`
        : `AND MONTH(o.createdon) = MONTH(CURDATE()) AND YEAR(o.createdon) = YEAR(CURDATE())`;
      groupByClause = 'MONTH(o.createdon), YEAR(o.createdon)';
      dateFormat = '%M %Y';
      break;
    case 'yearly':
      dateCondition = formattedStartDate && formattedEndDate 
        ? `AND DATE(o.createdon) BETWEEN '${formattedStartDate}' AND '${formattedEndDate}'`
        : `AND YEAR(o.createdon) = YEAR(CURDATE())`;
      groupByClause = 'YEAR(o.createdon)';
      dateFormat = '%Y';
      break;
    case 'custom':
      if (!formattedStartDate || !formattedEndDate) {
        throw new Error('Custom range requires both start and end dates');
      }
      dateCondition = `AND DATE(o.createdon) BETWEEN '${formattedStartDate}' AND '${formattedEndDate}'`;
      groupByClause = 'DATE(o.createdon)';
      dateFormat = '%d/%m/%Y';
      break;
    default:
      throw new Error('Invalid period specified');
  }

  return { dateCondition, groupByClause, dateFormat };
};

//http://localhost:4000/orderdetails/salesStatistics

route.get('/debug/dateTest', async (req, res) => {
  try {
    const { period = 'weekly', from, to } = req.query;
    const { dateCondition } = getDateRangeQuery(period, from, to);
    
    const [result] = await db.promise().query(`
      SELECT 
        DATE(o.createdon) as order_date,
        COUNT(*) as order_count,
        SUM(o.paymentamount) as total_amount
      FROM orders o
      WHERE o.isactive = 1
      ${dateCondition}
      GROUP BY DATE(o.createdon)
      ORDER BY order_date
    `);
    
    res.status(200).json({
      period,
      from,
      to,
      dateCondition,
      results: result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Main sales statistics endpoint
route.post('/salesStatistics', async (req, res) => {
  try {
    const { period = 'weekly', from, to } = req.body;

    
    const { dateCondition, groupByClause, dateFormat } = getDateRangeQuery(period, from, to);

    
    
    // 1 summary statistics
    const [summaryResult] = await db.promise().query(`
      SELECT 
        SUM(o.paymentamount) AS totalRevenue,
        COUNT(DISTINCT o.order_id) AS totalOrders,
        IFNULL(SUM(o.paymentamount) / NULLIF(COUNT(DISTINCT o.order_id), 0), 0) AS averageOrderValue
      FROM orders o
      WHERE o.isactive = 1
      AND o.order_status = 'COMPLETED'
      AND o.delivery_status = 'DELIVERED'
      ${dateCondition}
    `);

    // 2 top products
    const [topProducts] = await db.promise().query(`
      SELECT 
        p.prod_name AS name,
        SUM(op.price_final) AS sales
      FROM order_product_details op
      JOIN products p ON op.productid = p.productid
      JOIN orders o ON op.order_id = o.order_id
      WHERE o.isactive = 1
      AND o.order_status = 'COMPLETED'
      AND o.delivery_status = 'DELIVERED'
      ${dateCondition}
      GROUP BY p.prod_name
      ORDER BY sales DESC
      LIMIT 5
    `);

    // 3 Get top categories
    const [topCategories] = await db.promise().query(`
      SELECT 
        c.categoryname AS name,
        SUM(op.price_final) AS sales
      FROM order_product_details op
      JOIN products p ON op.productid = p.productid
      JOIN category c ON p.category_id = c.category_id
      JOIN orders o ON op.order_id = o.order_id
      WHERE o.isactive = 1
      AND o.order_status = 'COMPLETED'
      AND o.delivery_status = 'DELIVERED'
      ${dateCondition}
      GROUP BY c.categoryname
      ORDER BY sales DESC
      LIMIT 5
    `);

    // 4 chart data 
    const [chartData] = await db.promise().query(`
      SELECT 
        DATE_FORMAT(o.createdon, ?) AS name,
        SUM(o.paymentamount) AS revenue,
        COUNT(DISTINCT o.order_id) AS orders
      FROM orders o
      WHERE o.isactive = 1
      AND o.order_status = 'COMPLETED'
      AND o.delivery_status = 'DELIVERED'
      ${dateCondition}
      GROUP BY ${groupByClause}
      ORDER BY MIN(o.createdon) ASC
    `, [dateFormat]);

    // Prepare response
    const response = {
      summary: {
        totalRevenue: summaryResult[0].totalRevenue || 0,
        totalOrders: summaryResult[0].totalOrders || 0,
        averageOrderValue: summaryResult[0].averageOrderValue || 0,
        topProducts: topProducts || [],
        topCategories: topCategories || []
      },
      chartData: chartData || [],
      debug: {
        period,
        dateCondition,
        groupByClause
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error in salesStatistics:', error);
    res.status(500).json({ 
      error: 'Failed to fetch sales statistics',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = route;