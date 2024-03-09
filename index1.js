const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());

const db = new sqlite3.Database("products.db");

// Get all products
app.get("/products", (req, res) => {
  db.all("SELECT * FROM Products", (err, products) => {
    if (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    if (products.length > 0) {
      return res.status(200).json(products);
    } else {
      return res.status(404).json({ message: "No products found" });
    }
  });
});

// Get a product by id
app.get("/products/:product_id", (req, res) => {
  const { product_id } = req.params;
  db.get("SELECT * FROM Products WHERE id=?", [product_id], (err, product) => {
    if (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    if (product) {
      return res.status(200).json(product);
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  });
});

// Create a new product
app.post("/products", (req, res) => {
  const { name, category, price } = req.body;
  db.run("INSERT INTO Products (name, category, price) VALUES (?, ?, ?)", [name, category, price], (err) => {
    if (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    return res.status(201).json({ message: "Product created successfully" });
  });
});

// Update a product
app.put("/products/:product_id", (req, res) => {
  const { product_id } = req.params;
  const { name, category, price } = req.body;
  db.run("UPDATE Products SET name=?, category=?, price=? WHERE id=?", [name, category, price, product_id], (err) => {
    if (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    return res.status(200).json({ message: "Product updated successfully" });
  });
});

// Delete a product
app.delete("/products/:product_id", (req, res) => {
  const { product_id } = req.params;
  db.run("DELETE FROM Products WHERE id=?", [product_id], (err) => {
    if (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    return res.status(200).json({ message: "Product deleted successfully" });
  });
});

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


// Export the Express API
module.exports = app;