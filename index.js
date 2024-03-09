const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());

require("dotenv").config();
let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
const pool = new Pool({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: {
    require: true,
  },
});
async function getPgVersion() {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT version()");
    console.log(result.rows[0]);
  } catch (error) {
    console.error("Error fetching PostgreSQL version:", error);
  } finally {
    client.release();
  }
}
getPgVersion();

// Get all products
app.get("/products", (req, res) => {
  pool.query("SELECT * FROM employees", (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    return res.status(200).json(result.rows);
  });
});

// Get a product by id
app.get("/products/:product_id", (req, res) => {
  const { product_id } = req.params;
  pool.query(
    "SELECT * FROM employees WHERE id=$1",
    [product_id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Internal Server Error" });
      }
      if (result.rows.length > 0) {
        return res.status(200).json(result.rows[0]);
      } else {
        return res.status(404).json({ message: "Product not found" });
      }
    }
  );
});

// Create a new product
app.post("/products", (req, res) => {
  const { name } = req.body;
  pool.query(
    "INSERT INTO employees (name) VALUES ($1)",
    [name],
    (err, res) => {
      if (err) {
        return res.status(500).json({ message: "Internal Server Error" });
      }
      return res.status(201).json({ message: "Product created successfully" });
    }
  );
});

// Update a product
app.put("/products/:product_id", (req, res) => {
  const { product_id } = req.params;
  const { name, category, price } = req.body;
  pool.query(
    "UPDATE Products SET name=$1, category=$2, price=$3 WHERE id=$4",
    [name, category, price, product_id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Internal Server Error" });
      }
      return res.status(200).json({ message: "Product updated successfully" });
    }
  );
});

// Delete a product
app.delete("/products/:product_id", (req, res) => {
  const { product_id } = req.params;
  pool.query(
    "DELETE FROM employees WHERE id=$1",
    [product_id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Internal Server Error" });
      }
      return res.status(200).json({ message: "Product deleted successfully" });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
