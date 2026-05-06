const express = require("express");
const employees = require("./employees.json");

const app = express();

app.use(express.static("public"));

app.get("/api/employees", (req, res) => {
  res.json(employees);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});