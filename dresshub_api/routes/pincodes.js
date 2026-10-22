const express = require('express');
const route = express.Router();
const db = require('../db');
const verifyAdmin = require('../verifyadmin');

// http://localhost:4000/pincodes/add
route.post('/add', verifyAdmin, (req, res) => {
    const { pincode, area_name, city, district, state, country, latitude, longitude, is_active } = req.body;

    // Basic validation for NOT NULL fields
    if (!pincode || !city || !state) {
        return res.status(400).json({ message: "Pincode, City, and State are required fields." });
    }

    const query = `
            INSERT INTO pincodes
            (pincode, area_name, city, district, state, country, latitude, longitude, is_active)
            VALUES (?, ?, ?, ?, ?, COALESCE(?, 'India'), ?, ?, COALESCE(?, 1))
        `;
    const values = [pincode, area_name, city, district, state, country, latitude, longitude, is_active];

    db.query(query, values, (err, response) => {
        if (err) {
            // Handle unique constraint error specifically if needed
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: "This pincode already exists." });
            }
            return res.status(500).json({ message: "Error adding pincode", error: err });
        }
        res.status(201).json({ message: "Pincode added successfully", data: response });
    });
});

// http://localhost:4000/pincodes/all
route.get('/all', (req, res) => {
    const query = 'SELECT * FROM pincodes ORDER BY created_at DESC';
    db.query(query, (err, response) => {
        if (err) {
            return res.status(500).json({ message: "Error fetching pincodes", error: err });
        }
        res.status(200).json(response);
    });
});

// http://localhost:4000/pincodes/getById/:id
route.get('/getById/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM pincodes WHERE pincode_id = ?';
    db.query(query, [id], (err, response) => {
        if (err) {
            return res.status(500).json({ message: "Error fetching pincode details", error: err });
        }

        if (response.length === 0) {
            return res.status(404).json({ message: "Pincode not found" });
        }

        res.status(200).json(response[0]);
    });
});

// http://localhost:4000/pincodes/check/:pincode
route.get('/check/:pincode', (req, res) => {
    const { pincode } = req.params;
    const query = 'SELECT city, state, country FROM pincodes WHERE pincode = ? AND is_active = 1';

    db.query(query, [pincode], (err, response) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Error verifying pincode", error: err });
        }

        if (response.length === 0) {
            return res.status(404).json({ success: false, message: "Sorry! We do not serve in this area." });
        }

        res.status(200).json({ success: true, data: response[0] });
    });
});

// http://localhost:4000/pincodes/update/:id
route.put('/update/:id', verifyAdmin, (req, res) => {
    const { id } = req.params;
    const { pincode, area_name, city, district, state, country, latitude, longitude, is_active } = req.body;

    if (!pincode || !city || !state) {
        return res.status(400).json({ message: "Pincode, City, and State are required." });
    }

    const query = `
            UPDATE pincodes
            SET pincode=?, area_name=?, city=?, district=?, state=?, country=?, latitude=?, longitude=?, is_active=?
            WHERE pincode_id=?
        `;
    const values = [pincode, area_name, city, district, state, country, latitude, longitude, is_active, id];

    db.query(query, values, (err, response) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: "This pincode already exists." });
            }
            return res.status(500).json({ message: "Error updating pincode", error: err });
        }
        res.status(200).json({ message: "Pincode updated successfully", data: response });
    });
});

// http://localhost:4000/pincodes/updatestatus/:id
route.put('/updatestatus/:id', verifyAdmin, (req, res) => {
    const { id } = req.params;
    const { stat } = req.body; // Expecting 1 or 0

    if (stat === undefined) {
        return res.status(400).json({ message: "Status value is required." });
    }

    const query = 'UPDATE pincodes SET is_active = ? WHERE pincode_id = ?';
    db.query(query, [stat, id], (err, response) => {
        if (err) {
            return res.status(500).json({ message: "Error updating status", error: err });
        }
        res.status(200).json({ message: "Status updated successfully", data: response });
    });
});

// http://localhost:4000/pincodes/remove/:id
route.delete('/remove/:id', verifyAdmin, (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM pincodes WHERE pincode_id = ?';
    db.query(query, [id], (err, response) => {
        if (err) {
            return res.status(500).json({ message: "Error deleting pincode", error: err });
        }
        res.status(200).json({ message: "Pincode deleted successfully", data: response });
    });
});

module.exports = route;
