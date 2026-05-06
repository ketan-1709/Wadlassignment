const express = require("express");
const products = require("./products.json");

const app = express();

// serve frontend
app.use(express.static("public"));

// API
app.get("/api/products", (req, res) => {
  res.json(products);
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});