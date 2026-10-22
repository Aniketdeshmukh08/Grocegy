const express = require('express');
const router = express.Router();
const app = express()
app.use(express.json());
const db = require('../db');
const verifyadmin = require("../verifyadmin");


// http://localhost:4000/feedback/createFeedback
router.post('/createFeedback', async (req, res) => {
    try {

        const { userid, message, rating } = req.body;

        if (!userid || !message) {
            return res.status(400).json({ error: 'userid and message are required' });
        }

        const sql = `
            INSERT INTO feedbacks (userid, message, rating)
            VALUES (?, ?, ?)
        `;

        const values = [
            userid,
            message,
            rating || 5
        ];

        const [result] = await db.promise().query(sql, values);

        res.status(201).json({
            message: 'Feedback created successfully',
            feedbackId: result.insertId
        });

    } catch (err) {

        console.error('Error inserting feedback:', err);

        res.status(500).json({
            error: 'Failed to create feedback'
        });

    }
});

//http://localhost:4000/feedback/getFeedbacks
router.get('/getfeedbacks', verifyadmin, async (req, res) => {
        try {
                 const query = `
                        SELECT 
                                f.fid AS fId,
                                COALESCE(f.userid,'-') AS userid,
                                COALESCE(f.name, u.name, 'Guest User') AS name,
                                COALESCE(f.email,'-') AS email,
                                COALESCE(f.mobile,'-') AS mobile,
                                f.message,
                                f.createdAt,
                                5 AS rating
                        FROM feedbacks f
                        LEFT JOIN users u
                        ON f.userid = u.userid
                        ORDER BY f.fid DESC
                        `;
                const [rows] = await db.promise().query(query);

                res.status(200).json(rows);
        } catch (err) {
                console.error('Error fetching feedbacks:', err);
                res.status(400).json(err);
        }
});

// http://localhost:4000/feedback/removefeedback/:fId
router.put('/removefeedback/:fId', verifyadmin, async (req, res) => {
    try {

        const { fId } = req.params;

        const query = `
            UPDATE feedbacks
            SET is_active = 0
            WHERE fid = ?
        `;

        const [response] = await db.promise().query(query, [fId]);

        res.status(200).json({
            message: 'Feedback removed successfully',
            response
        });

    } catch (err) {

        console.error('Error removing feedback:', err);

        res.status(400).json({
            error: 'Failed to remove feedback'
        });

    }
});

router.get("/searchItem/:searchParam", verifyadmin, async (req, res) => {

    const { searchParam } = req.params;
    const queryParam = `%${searchParam}%`;

    try {

      const query = `
                SELECT 
                        f.fid AS fId,
                        COALESCE(f.userid,'-') AS userid,
                        COALESCE(f.name, u.name, 'Guest User') AS name,
                        COALESCE(f.email,'-') AS email,
                        COALESCE(f.mobile,'-') AS mobile,
                        f.message,
                        f.createdAt,
                        5 AS rating
                FROM feedbacks f
                LEFT JOIN users u
                ON f.userid = u.userid
                WHERE f.is_active = 1
                AND (
                        COALESCE(f.name, u.name, 'Guest User') LIKE ?
                        OR f.userid LIKE ?
                        OR f.fid LIKE ?
                )
                ORDER BY f.fid DESC
                `;
        const [rows] = await db.promise().query(query, [
            queryParam,
            queryParam,
            queryParam
        ]);

        res.status(200).json({
                filteredData: rows
        });

    } catch (err) {

        console.error("Search error:", err);
        res.status(500).json(err);

    }

});

module.exports = router;