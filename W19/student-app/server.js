const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/student")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const studentSchema = new mongoose.Schema({
  Name: String,
  Roll_No: Number,
  WAD_Marks: Number,
  CC_Marks: Number,
  DSBDA_Marks: Number,
  CNS_Marks: Number,
  AI_Marks: Number
});

const Student = mongoose.model("studentmarks", studentSchema);

// Home page
app.get("/", (req, res) => {
  res.send(`
    <h2>Student Marks App</h2>
    <a href="/insert">Insert Students</a><br><br>
    <a href="/students">View All Students</a><br><br>
    <a href="/dsbda">DSBDA Marks > 20</a><br><br>
    <a href="/update/111">Update Roll No 111 by 10</a><br><br>
    <a href="/above25">Marks > 25 in All Subjects</a><br><br>
    <a href="/less40">WAD and CNS Marks < 40</a><br><br>
    <a href="/delete/111">Delete Roll No 111</a><br><br>
    <a href="/table">Display Table</a>
  `);
});

// Insert array of documents
app.get("/insert", async (req, res) => {
  await Student.insertMany([
    { Name: "ABC", Roll_No: 111, WAD_Marks: 25, CC_Marks: 25, DSBDA_Marks: 25, CNS_Marks: 25, AI_Marks: 25 },
    { Name: "PQR", Roll_No: 112, WAD_Marks: 30, CC_Marks: 35, DSBDA_Marks: 18, CNS_Marks: 32, AI_Marks: 40 },
    { Name: "XYZ", Roll_No: 113, WAD_Marks: 45, CC_Marks: 42, DSBDA_Marks: 35, CNS_Marks: 38, AI_Marks: 41 }
  ]);

  res.send("Students inserted successfully");
});

// Display count and all documents
app.get("/students", async (req, res) => {
  const students = await Student.find();
  const count = await Student.countDocuments();

  res.send(`
    <h3>Total Documents: ${count}</h3>
    <pre>${JSON.stringify(students, null, 2)}</pre>
  `);
});

// DSBDA marks greater than 20
app.get("/dsbda", async (req, res) => {
  const students = await Student.find(
    { DSBDA_Marks: { $gt: 20 } },
    { Name: 1, _id: 0 }
  );

  res.send(students);
});

// Update specified student marks by 10
app.get("/update/:roll", async (req, res) => {
  await Student.updateOne(
    { Roll_No: req.params.roll },
    {
      $inc: {
        WAD_Marks: 10,
        CC_Marks: 10,
        DSBDA_Marks: 10,
        CNS_Marks: 10,
        AI_Marks: 10
      }
    }
  );

  res.send("Marks updated by 10");
});

// Names with marks greater than 25 in all subjects
app.get("/above25", async (req, res) => {
  const students = await Student.find(
    {
      WAD_Marks: { $gt: 25 },
      CC_Marks: { $gt: 25 },
      DSBDA_Marks: { $gt: 25 },
      CNS_Marks: { $gt: 25 },
      AI_Marks: { $gt: 25 }
    },
    { Name: 1, _id: 0 }
  );

  res.send(students);
});

// Less than 40 in both subjects
app.get("/less40", async (req, res) => {
  const students = await Student.find(
    {
      WAD_Marks: { $lt: 40 },
      CNS_Marks: { $lt: 40 }
    },
    { Name: 1, _id: 0 }
  );

  res.send(students);
});

// Delete specified student
app.get("/delete/:roll", async (req, res) => {
  await Student.deleteOne({ Roll_No: req.params.roll });
  res.send("Student deleted successfully");
});

// Display table
app.get("/table", async (req, res) => {
  const students = await Student.find();

  let table = `
    <h2>Student Data</h2>
    <table border="1" cellpadding="10">
      <tr>
        <th>Name</th>
        <th>Roll No</th>
        <th>WAD</th>
        <th>DSBDA</th>
        <th>CNS</th>
        <th>CC</th>
        <th>AI</th>
      </tr>
  `;

  students.forEach(s => {
    table += `
      <tr>
        <td>${s.Name}</td>
        <td>${s.Roll_No}</td>
        <td>${s.WAD_Marks}</td>
        <td>${s.DSBDA_Marks}</td>
        <td>${s.CNS_Marks}</td>
        <td>${s.CC_Marks}</td>
        <td>${s.AI_Marks}</td>
      </tr>
    `;
  });

  table += "</table>";
  res.send(table);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});