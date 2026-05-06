const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/company")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const employeeSchema = new mongoose.Schema({
  name: String,
  department: String,
  designation: String,
  salary: Number,
  joiningDate: String
});

const Employee = mongoose.model("Employee", employeeSchema);

// Add employee - POST
app.post("/employees", async (req, res) => {
  const emp = new Employee(req.body);
  await emp.save();
  res.send(emp);
});

// View all employees - GET
app.get("/employees", async (req, res) => {
  const employees = await Employee.find();
  res.send(employees);
});

// Update employee - PUT
app.put("/employees/:id", async (req, res) => {
  const emp = await Employee.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  res.send(emp);
});

// Delete employee - DELETE
app.delete("/employees/:id", async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.send("Employee deleted successfully");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});