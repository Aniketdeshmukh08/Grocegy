const express = require('express');
const router = express.Router();
const verifyAdmin = require('../verifyadmin.js');
const db = require('../db');

// POST https://localhost:4000/customorder/create-custom-order
router.post('/create-custom-order', async (req, res) => {
        const {
                name,
                address,
                contact,
                userid,
                date,
                time,
                paymentamount,
                totaldiscount,
                additionaldiscount,
                paymentmode,
                costamount,
                payment_cash,
                payment_online,
                final_settle,
                remarks
        } = req.body;
        try {

                if (!name || !contact || !address) {
                        return res.status(400).json({
                                message: "Name, contact, address, and userid are required"
                        });
                }

                const [result] = await db.promise().query(
                        `INSERT INTO custom_orders (
        name,
        address,
        contact,
        userid,
        order_date,
        order_time,
        status,
        paymentamount,
        totaldiscount,
        additionaldiscount,
        paymentstatus,
        paymentmode,
        delivery_status,
        costamount,
        payment_cash,
        payment_online,
        final_settle,
        remarks
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                                name,
                                address,
                                contact,
                                userid,
                                date || new Date(),
                                time || new Date(),
                                "placed",
                                paymentamount || 0,
                                totaldiscount || 0,
                                additionaldiscount || 0,
                                "pending",
                                paymentmode || null,
                                "pending",
                                costamount || 0,
                                payment_cash || 0,
                                payment_online || 0,
                                final_settle || 0,
                                remarks || null
                        ]
                );

                res.status(201).json({
                        message: "Custom order created successfully",
                        order_id: result.insertId
                });
        } catch (error) {
                res.status(500).json({ error: error.message });
        }
});
// POST https://localhost:4000/customorder/add-item-custom-order-details
router.post("/add-item-custom-order-details", async (req, res) => {
        try {
                const {
                        order_id,
                        item_name,
                        price,
                        quantity,
                        final_price
                } = req.body;

                if (!order_id || !item_name || !price || !quantity) {
                        return res.status(400).json({
                                message: "order_id, item_name, price, and quantity are required"
                        });
                }

                if (price <= 0 || quantity <= 0) {
                        return res.status(400).json({
                                message: "Price and quantity must be greater than zero"
                        });
                }
                const [orderRows] = await db.promise().query(
                        `SELECT order_id ,paymentamount ,totaldiscount FROM custom_orders WHERE order_id = ?`,
                        [order_id]
                );
                console.log("Order rows", orderRows[0].totaldiscount);
                if (orderRows.length === 0) {
                        return res.status(404).json({ message: "Order not found" });
                }
                const currentPaymentAmount = orderRows[0].paymentamount || 0;
                const totalDiscount = orderRows[0].totaldiscount || 0;

                const [result] = await db.promise().query(
                        `INSERT INTO custom_order_details
            (order_id, item_name, price, quantity, final_price)
            VALUES (?, ?, ?, ?, ?)`,
                        [
                                order_id,
                                item_name,
                                price,
                                quantity,
                                final_price
                        ]
                );
                const newDiscount = totalDiscount + (price - final_price) * quantity;
                console.log("new discount", newDiscount);
                const newPaymentAmount = currentPaymentAmount + final_price * quantity;
                console.log("new payment amount", newPaymentAmount);
                await db.promise().query(
                        `UPDATE custom_orders
             SET paymentamount = ?,
                 totaldiscount = ?
             WHERE order_id = ?`,
                        [
                                newPaymentAmount,
                                newDiscount,
                                order_id
                        ]
                );
                res.status(201).json({
                        message: "Order item added successfully",
                        order_details_id: result.insertId,
                        order_id,
                        item_name,
                        price,
                        quantity,
                        final_price
                });

        } catch (error) {
                console.error(error);
                res.status(500).json({
                        message: "Failed to add order item",
                        error: error.message
                });
        }
});

// GET https://localhost:4000/customorder/get-custom-order
router.get('/get-custom-order/:order_id', async (req, res) => {
        const { order_id } = req.params;
        try {
                const [orderRows] = await db.promise().query(
                        `SELECT * FROM custom_orders WHERE order_id = ?`,
                        [order_id]
                );
                if (orderRows.length === 0) {
                        return res.status(404).json({ message: "Order details not found" });
                }
                const [itemRows] = await db.promise().query(
                        `SELECT * FROM custom_order_details WHERE order_id = ?`,
                        [order_id]
                );
                res.status(201).json({
                        message: "Order item added successfully",
                        orderDetails: orderRows[0],
                        itemDetails: itemRows
                });
        } catch (error) {
                res.status(500).json({
                        message: "Failed to get order item",
                        error: error.message
                });
        }
});


// GET https://localhost:4000/customorder/get-all-custom-order
router.get('/get-all-custom-orders', async (req, res) => {
        try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const search = req.query.search || '';
                const offset = (page - 1) * limit;

                let queryParams = [];
                let searchCondition = '';

                if (search) {
                        searchCondition = `WHERE order_id LIKE ? OR name LIKE ?`;
                        queryParams.push(`%${search}%`, `%${search}%`);
                }

                // Get total count for pagination
                const [countResult] = await db.promise().query(
                        `SELECT COUNT(*) as total FROM custom_orders ${searchCondition}`,
                        queryParams
                );
                const totalItems = countResult[0].total;
                const totalPages = Math.ceil(totalItems / limit);

                // Get paginated data
                const [rows] = await db.promise().query(
                        `SELECT * FROM custom_orders ${searchCondition} ORDER BY order_id DESC LIMIT ? OFFSET ?`,
                        [...queryParams, limit, offset]
                );

                res.status(200).json({
                        message: "All custom orders retrieved successfully",
                        data: rows,
                        totalPages: totalPages,
                        currentPage: page,
                        totalItems: totalItems
                });
        } catch (error) {
                res.status(500).json({
                        message: "Failed to get all custom orders",
                        error: error.message
                });
        }
});


// DELETE https://localhost:4000/customorder/remove-item/:order_details_id
router.delete('/remove-item/:order_details_id', async (req, res) => {
        const { order_details_id } = req.params;
        try {
                const [itemRows] = await db.promise().query(
                        `SELECT order_id, price, final_price,quantity
             FROM custom_order_details
             WHERE order_details_id = ?`,
                        [order_details_id]
                );

                if (itemRows.length === 0) {
                        return res.status(404).json({
                                message: "Order item not found"
                        });
                }
                const { order_id, price, final_price, quantity } = itemRows[0];

                const [orderRows] = await db.promise().query(
                        `SELECT paymentamount, totaldiscount
             FROM custom_orders
             WHERE order_id = ?`,
                        [order_id]
                );
                if (orderRows.length === 0) {
                        return res.status(404).json({
                                message: "Order not found"
                        });
                }
                const currentPaymentAmount = orderRows[0].paymentamount || 0;
                const currentTotalDiscount = orderRows[0].totaldiscount || 0;


                const updatedPaymentAmount = Math.max(
                        currentPaymentAmount - final_price * quantity,
                        0
                );

                const updatedtotalDiscount = Math.max(
                        currentTotalDiscount - (price - final_price) * quantity,
                        0
                );
                const [result] = await db.promise().query(
                        `DELETE FROM custom_order_details WHERE order_details_id = ?`,
                        [order_details_id]
                );

                await db.promise().query(
                        `UPDATE custom_orders SET paymentamount = ?, totaldiscount = ? WHERE order_id = ?`,
                        [
                                updatedPaymentAmount,
                                updatedtotalDiscount,
                                order_id
                        ]
                );
                res.status(200).json({
                        message: "Order item removed successfully"
                });
        } catch (error) {
                console.log(error);
                res.status(500).json({
                        message: "Failed to remove order item",
                        error: error.message
                });
        }
});

// DELETE https://localhost:4000/customorder/delete-order/:order_id
router.delete('/delete-order/:order_id', async (req, res) => {
        const { order_id } = req.params;
        try {
                await db.promise().query(
                        `DELETE FROM custom_orders WHERE order_id = ?`,
                        [order_id]
                );
                res.status(200).json({
                        message: "Order deleted successfully"
                });

        } catch (error) {
                res.status(500).json({
                        message: "Failed to delete order",
                        error: error.message
                });
        }
});

module.exports = router;