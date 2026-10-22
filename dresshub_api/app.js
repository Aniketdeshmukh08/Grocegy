
const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./db.js");
const bodyParser = require("body-parser");
const path = require("path");

require("dotenv").config({ path: ".env" });


// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

app.use(cors({ origin: "*" }));

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Static folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Ignore TLS errors (not recommended for prod but okay for now)
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

// Routes
app.use("/customorder", require("./routes/customOrder.js"));
app.use("/customer", require("./routes/customer.js"));
app.use("/category", require("./routes/category.js"));
app.use("/contact", require("./routes/contact.js"));
app.use("/subCategory", require("./routes/subCategory.js"));
app.use("/products", require("./routes/products.js"));
app.use("/products_replicate", require("./routes/products_replicate.js"));
app.use("/users", require("./routes/users.js"));
app.use("/orders", require("./routes/orders.js"));
app.use("/wishlist", require("./routes/wishList.js"));
app.use("/address", require("./routes/address.js"));
app.use("/cart", require("./routes/cart.js"));
app.use("/orderdetails", require("./routes/orderDetail.js"));
app.use("/brand", require("./routes/brand.js"));
app.use("/vendor", require("./routes/vendor.js"));
app.use("/complains", require("./routes/complains.js"));
app.use("/images", require("./routes/images"));
app.use("/categoryimage", require("./routes/categoryimage"));
app.use("/customProduct", require("./routes/customProduct.js"));
app.use("/settings", require("./routes/settings.js"));
app.use("/ourteam", require("./routes/ourteam.js"));
app.use("/feedback", require("./routes/feedbacks.js"));
app.use("/faq", require("./routes/faq.js"));
app.use("/discount", require("./routes/discount.js"));
app.use("/checkout", require("./routes/checkout.js"));
app.use("/sendemail", require("./routes/sendemail.js"));
app.use("/popular", require("./routes/popularProducts.js"));
app.use("/testimonials", require("./routes/testimonials"));
app.use("/pincodes", require("./routes/pincodes"));

// ⚠️ Duplicate route fixed (you had orderdetails twice)
app.use("/sales", require("./routes/salesStatistics"));

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);

  // Test DB connection (POOL version)
  db.getConnection((err, connection) => {
    if (err) {
      console.log("DB connection failed:", err);
    } else {
      console.log("DB connected");
      connection.release();
    }
  });
});