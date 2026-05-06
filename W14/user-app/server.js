const express = require("express");
const users = require("./users.json");

const app = express();

// serve frontend
app.use(express.static("public"));

// API
app.get("/api/users", (req, res) => {
  res.json(users);
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});