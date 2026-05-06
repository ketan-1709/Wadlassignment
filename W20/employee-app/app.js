const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

// 1. Database Connection
mongoose.connect('mongodb://127.0.0.1:27017/company')
    .then(() => console.log("Connected to MongoDB: company database"))
    .catch(err => console.error("Connection error", err));

// 2. Define Schema and Model
const employeeSchema = new mongoose.Schema({
    name: String,
    department: String,
    designation: String,
    salary: Number,
    joining_date: String
});

const Employee = mongoose.model('employees', employeeSchema);

// Helper function to generate HTML Table (following W18/W19/W20 style)
const generateTable = (title, employees) => {
    let html = `<h3>${title}</h3><table border="1">
                <tr>
                    <th>Name</th><th>Department</th><th>Designation</th>
                    <th>Salary</th><th>Joining Date</th><th>Actions</th>
                </tr>`;
    employees.forEach(e => {
        html += `<tr>
                    <td>${e.name}</td><td>${e.department}</td><td>${e.designation}</td>
                    <td>${e.salary}</td><td>${e.joining_date}</td>
                    <td>
                        <a href="/delete-employee/${e.name}">Delete</a> | 
                        <a href="/update-salary/${e.name}/75000">Set Salary 75k</a>
                    </td>
                 </tr>`;
    });
    html += `</table><br>
             <a href="/add-employee/John Doe/IT/Developer/60000/2023-01-15">Add Sample Employee</a> | 
             <a href="/display-all">Refresh List</a>`;
    return html;
};

// --- Routes ---

// Task a) Add a new employee (name, department, designation, salary, joining date)
app.get('/add-employee/:name/:dept/:desig/:salary/:date', async (req, res) => {
    try {
        const { name, dept, desig, salary, date } = req.params;
        const newEmp = new Employee({ 
            name, 
            department: dept, 
            designation: desig, 
            salary: Number(salary), 
            joining_date: date 
        });
        await newEmp.save();
        res.send(`Employee "${name}" added successfully! <br> <a href="/display-all">View All Records</a>`);
    } catch (err) { res.status(500).send(err.message); }
});

// Task b) View all employee records
app.get('/display-all', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.send(generateTable("Employee Records Management", employees));
    } catch (err) { res.status(500).send(err.message); }
});

// Task c) Update an existing employee’s details (Example: Update salary by name)
app.get('/update-salary/:name/:salary', async (req, res) => {
    try {
        await Employee.updateOne(
            { name: req.params.name },
            { $set: { salary: Number(req.params.salary) } }
        );
        res.send(`Updated salary for "${req.params.name}" to ${req.params.salary}. <br> <a href="/display-all">View All Records</a>`);
    } catch (err) { res.status(500).send(err.message); }
});

// Task d) Delete an employee record
app.get('/delete-employee/:name', async (req, res) => {
    try {
        await Employee.deleteOne({ name: req.params.name });
        res.send(`Deleted employee: "${req.params.name}". <br> <a href="/display-all">View All Records</a>`);
    } catch (err) { res.status(500).send(err.message); }
});

// Root route
app.get('/', (req, res) => {
    res.redirect('/display-all');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
