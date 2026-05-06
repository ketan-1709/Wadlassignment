const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

// 1. Database Connection
mongoose.connect('mongodb://127.0.0.1:27017/bookstore')
    .then(() => console.log("Connected to MongoDB: bookstore database"))
    .catch(err => console.error("Connection error", err));

// 2. Define Schema and Model
const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    price: Number,
    genre: String
});

const Book = mongoose.model('books', bookSchema);

// Helper function to generate HTML Table (following W18/W19 style)
const generateTable = (title, books) => {
    let html = `<h3>${title}</h3><table border="1">
                <tr><th>Title</th><th>Author</th><th>Price</th><th>Genre</th><th>Actions</th></tr>`;
    books.forEach(b => {
        html += `<tr>
                    <td>${b.title}</td><td>${b.author}</td><td>${b.price}</td><td>${b.genre}</td>
                    <td>
                        <a href="/delete-book/${b.title}">Delete</a> | 
                        <a href="/update-book/${b.title}/500">Set Price 500</a>
                    </td>
                 </tr>`;
    });
    html += `</table><br><a href="/add-book/SampleTitle/AuthorName/299/Fiction">Add Sample Book</a>`;
    return html;
};

// --- Routes ---

// Task a) Add a new book (title, author, price, genre)
app.get('/add-book/:title/:author/:price/:genre', async (req, res) => {
    try {
        const { title, author, price, genre } = req.params;
        const newBook = new Book({ title, author, price: Number(price), genre });
        await newBook.save();
        res.send(`Book "${title}" added successfully! <br> <a href="/display-all">View All Books</a>`);
    } catch (err) { res.status(500).send(err.message); }
});

// Task b) Retrieve a list of all books
app.get('/display-all', async (req, res) => {
    try {
        const books = await Book.find();
        res.send(generateTable("Online Bookstore - All Books", books));
    } catch (err) { res.status(500).send(err.message); }
});

// Task c) Update book details (Example: Update price by title)
app.get('/update-book/:title/:price', async (req, res) => {
    try {
        await Book.updateOne(
            { title: req.params.title },
            { $set: { price: Number(req.params.price) } }
        );
        res.send(`Updated price for "${req.params.title}" to ${req.params.price}. <br> <a href="/display-all">View All Books</a>`);
    } catch (err) { res.status(500).send(err.message); }
});

// Task d) Delete a book from the collection
app.get('/delete-book/:title', async (req, res) => {
    try {
        await Book.deleteOne({ title: req.params.title });
        res.send(`Deleted book: "${req.params.title}". <br> <a href="/display-all">View All Books</a>`);
    } catch (err) { res.status(500).send(err.message); }
});

// Root route
app.get('/', (req, res) => {
    res.redirect('/display-all');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
