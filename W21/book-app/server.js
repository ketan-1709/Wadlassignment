const express = require("express");
const mongoose = require("mongoose");


const app = express();

app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/bookstore")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  price: Number,
  genre: String
});

const Book = mongoose.model("Book", bookSchema);


// Add book - POST
app.post("/books", async (req, res) => {
  const book = new Book(req.body);
  await book.save();
  res.send(book);
});

// Retrieve all books - GET
app.get("/books", async (req, res) => {
  const books = await Book.find();
  res.send(books);
});

// Update book - PUT
app.put("/books/:id", async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  res.send(book);
});

// Delete book - DELETE
app.delete("/books/:id", async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.send("Book deleted successfully");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});