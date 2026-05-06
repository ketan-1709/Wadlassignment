const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

app.use(express.json());

// 1. Database Connection
mongoose.connect('mongodb://127.0.0.1:27017/Student')
    .then(() => console.log("Connected to MongoDB: Student database"))
    .catch(err => console.error("Connection error", err));

// 2. Schema + Model
const studentSchema = new mongoose.Schema({
    Name: String,
    Roll_No: Number,
    WAD_Marks: Number,
    CC_Marks: Number,
    DSBDA_Marks: Number,
    CNS_Marks: Number,
    AI_marks: Number
});

const Student = mongoose.model('studentmarks', studentSchema);

// 3. Seed Data (AUTO insert like song project)
const seedData = async () => {
    const count = await Student.countDocuments();
    if (count === 0) {
        const students = [
            { Name: "ABC", Roll_No: 111, WAD_Marks: 25, CC_Marks: 25, DSBDA_Marks: 25, CNS_Marks: 25, AI_marks: 25 },
            { Name: "John", Roll_No: 112, WAD_Marks: 30, CC_Marks: 28, DSBDA_Marks: 22, CNS_Marks: 15, AI_marks: 20 },
            { Name: "Jane", Roll_No: 113, WAD_Marks: 45, CC_Marks: 42, DSBDA_Marks: 40, CNS_Marks: 48, AI_marks: 41 },
            { Name: "Kevin", Roll_No: 114, WAD_Marks: 10, CC_Marks: 12, DSBDA_Marks: 25, CNS_Marks: 18, AI_marks: 15 }
        ];

        await Student.insertMany(students);
        console.log("Initial students inserted.");
    }
};
seedData();

// 4. Reusable Table Generator (LIKE SONG APP)
const generateTable = (title, students) => {
    let html = `<h3>${title}</h3>
    <table border="1">
    <tr>
        <th>Name</th><th>Roll No</th><th>WAD</th><th>CC</th>
        <th>DSBDA</th><th>CNS</th><th>AI</th>
    </tr>`;

    students.forEach(s => {
        html += `<tr>
            <td>${s.Name}</td>
            <td>${s.Roll_No}</td>
            <td>${s.WAD_Marks}</td>
            <td>${s.CC_Marks}</td>
            <td>${s.DSBDA_Marks}</td>
            <td>${s.CNS_Marks}</td>
            <td>${s.AI_marks}</td>
        </tr>`;
    });

    html += `</table>`;
    return html;
};

// ---------------- ROUTES ---------------- //

// d) Display all + count
app.get('/display-all', async (req, res) => {
    try {
        const students = await Student.find();
        const count = await Student.countDocuments();
        res.send(generateTable(`Total Students: ${count}`, students));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// e) DSBDA > 20
app.get('/dsbda-above-20', async (req, res) => {
    try {
        const students = await Student.find({ DSBDA_Marks: { $gt: 20 } });
        res.send(generateTable("DSBDA > 20", students));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// f) Update marks (+10)
app.get('/update-marks/:roll', async (req, res) => {
    try {
        await Student.updateOne(
            { Roll_No: req.params.roll },
            { $inc: { WAD_Marks: 10, CC_Marks: 10, DSBDA_Marks: 10, CNS_Marks: 10, AI_marks: 10 } }
        );
        res.send(`Updated marks for Roll No: ${req.params.roll}`);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// g) >25 in all subjects
app.get('/above-25-all', async (req, res) => {
    try {
        const students = await Student.find({
            WAD_Marks: { $gt: 25 },
            CC_Marks: { $gt: 25 },
            DSBDA_Marks: { $gt: 25 },
            CNS_Marks: { $gt: 25 },
            AI_marks: { $gt: 25 }
        });

        res.send(generateTable("Above 25 in All Subjects", students));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// h) <40 in WAD & CC
app.get('/below-40', async (req, res) => {
    try {
        const students = await Student.find({
            WAD_Marks: { $lt: 40 },
            CC_Marks: { $lt: 40 }
        });

        res.send(generateTable("Below 40 in WAD & CC", students));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// i) Delete student
app.get('/delete/:name', async (req, res) => {
    try {
        await Student.deleteOne({ Name: req.params.name });
        res.send(`Deleted student: ${req.params.name}`);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// j) Add new student (optional like favourite)
app.get('/add-student', async (req, res) => {
    try {
        const student = new Student({
            Name: "New Student",
            Roll_No: 999,
            WAD_Marks: 50,
            CC_Marks: 50,
            DSBDA_Marks: 50,
            CNS_Marks: 50,
            AI_marks: 50
        });

        await student.save();
        res.send("New student added!");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/display-all`);
});