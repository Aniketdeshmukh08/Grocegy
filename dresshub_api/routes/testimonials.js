const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../db");
const router = express.Router();
const verifyJwtAdmin = require("../verifyadmin");

// Ensure upload directory exists
const uploadDir = "./uploads/testimonials";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// Helper: Build full image URL
function buildImageUrl(req, filename) {
  if (!filename) return null;
  const name = path.basename(filename);
  return `${req.protocol}://${req.get("host")}/uploads/testimonials/${name}`;
}

// GET testimonials list with pagination + search
router.get("/", verifyJwtAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const offset = (page - 1) * limit;

    let searchCondition = "";
    let searchValues = [];

    if (search) {
      searchCondition = `
        AND (
          author_name LIKE ?
          OR author_designation LIKE ?
          OR testimonial_text LIKE ?
        )
      `;
      searchValues = [`%${search}%`, `%${search}%`, `%${search}%`];
    }

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM testimonials
      WHERE is_active = 1
      ${searchCondition}
    `;

    const [countResult] = await db.promise().query(countQuery, searchValues);
    const totalRecords = countResult[0].total;
    const totalPages = Math.ceil(totalRecords / limit);

    const dataQuery = `
      SELECT *
      FROM testimonials
      WHERE is_active = 1
      ${searchCondition}
      ORDER BY testimonial_Id DESC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await db
      .promise()
      .query(dataQuery, [...searchValues, limit, offset]);

    const data = rows.map((row) => ({
      ...row,
      author_image: row.author_image ? buildImageUrl(req, row.author_image) : null,
    }));

    res.status(200).json({
      data,
      currentPage: page,
      totalPages,
      totalRecords,
      limit,
    });
  } catch (err) {
    console.error("GET testimonials error:", err.message || err);
    res.status(500).json({ message: "Failed to fetch testimonials" });
  }
});

// GET single testimonial
router.get("/:testimonial_Id", verifyJwtAdmin, async (req, res) => {
  try {
    const { testimonial_Id } = req.params;

    const [rows] = await db.promise().query(
      "SELECT * FROM testimonials WHERE testimonial_Id = ? AND is_active = 1",
      [testimonial_Id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    const data = {
      ...rows[0],
      author_image: rows[0].author_image ? buildImageUrl(req, rows[0].author_image) : null,
    };

    res.status(200).json(data);
  } catch (err) {
    console.error("GET single testimonial error:", err.message || err);
    res.status(500).json({ message: "Error fetching testimonial" });
  }
});

// ADD testimonial
router.post("/add", verifyJwtAdmin, upload.single("author_image"), async (req, res) => {
  try {
    const { author_name, author_designation, testimonial_text, rating } = req.body;

    if (!author_name || !author_designation || !testimonial_text || !rating) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const parsedRating = parseInt(rating, 10);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const file = req.file ? req.file.filename : null;

    await db.promise().query(
      `INSERT INTO testimonials
      (author_name, author_designation, testimonial_text, rating, author_image, is_active)
      VALUES (?, ?, ?, ?, ?, 1)`,
      [author_name, author_designation, testimonial_text, parsedRating, file]
    );

    res.status(201).json({ message: "Added successfully" });
  } catch (err) {
    console.error("ADD testimonial error:", err.message || err);
    res.status(500).json({ message: "Add failed" });
  }
});

// UPDATE testimonial
router.put("/:testimonial_Id", verifyJwtAdmin, upload.single("author_image"), async (req, res) => {
  try {
    const { testimonial_Id } = req.params;
    const { author_name, author_designation, testimonial_text, rating } = req.body;

    const [existing] = await db.promise().query(
      "SELECT * FROM testimonials WHERE testimonial_Id = ? AND is_active = 1",
      [testimonial_Id]
    );

    if (!existing.length) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    const parsedRating = parseInt(rating, 10);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const file = req.file ? req.file.filename : existing[0].author_image;

    await db.promise().query(
      `UPDATE testimonials
       SET author_name = ?, author_designation = ?, testimonial_text = ?, rating = ?, author_image = ?
       WHERE testimonial_Id = ? AND is_active = 1`,
      [author_name, author_designation, testimonial_text, parsedRating, file, testimonial_Id]
    );

    res.status(200).json({ message: "Updated successfully" });
  } catch (err) {
    console.error("UPDATE testimonial error:", err.message || err);
    res.status(500).json({ message: "Update failed" });
  }
});

// SOFT DELETE testimonial
router.put("/remove/:testimonial_Id", verifyJwtAdmin, async (req, res) => {
  try {
    const { testimonial_Id } = req.params;

    await db.promise().query(
      "UPDATE testimonials SET is_active = 0 WHERE testimonial_Id = ?",
      [testimonial_Id]
    );

    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE testimonial error:", err.message || err);
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;