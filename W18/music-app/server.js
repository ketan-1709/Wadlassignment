const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/music")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const songSchema = new mongoose.Schema({
  Songname: String,
  Film: String,
  Music_director: String,
  singer: String,
  Actor: String,
  Actress: String
});

const Song = mongoose.model("songdetails", songSchema);

app.get("/", (req, res) => {
  res.send(`
    <h2>Music App</h2>

    <a href="/insert">Insert 5 Songs</a><br><br>
    <a href="/songs">View All Songs</a><br><br>
    <a href="/director/AR Rahman">Songs by AR Rahman</a><br><br>
    <a href="/director-singer/AR Rahman/Arijit Singh">AR Rahman songs sung by Arijit Singh</a><br><br>
    <a href="/delete/Song3">Delete Song3</a><br><br>
    <a href="/add">Add Favourite Song</a><br><br>
    <a href="/singer-film/Arijit Singh/Rockstar">Songs by Arijit Singh from Rockstar</a><br><br>
    <a href="/update/Song1">Add Actor and Actress to Song1</a><br><br>
    <a href="/table">Display Table</a>
  `);
});

// Insert array of 5 songs
app.get("/insert", async (req, res) => {
  await Song.insertMany([
    { Songname: "Song1", Film: "Rockstar", Music_director: "AR Rahman", singer: "Arijit Singh" },
    { Songname: "Song2", Film: "Dil Se", Music_director: "AR Rahman", singer: "Sukhwinder Singh" },
    { Songname: "Song3", Film: "ABCD", Music_director: "Sachin Jigar", singer: "Vishal Dadlani" },
    { Songname: "Song4", Film: "Kabir Singh", Music_director: "Mithoon", singer: "Arijit Singh" },
    { Songname: "Song5", Film: "Rockstar", Music_director: "AR Rahman", singer: "Mohit Chauhan" }
  ]);

  res.send("5 Songs inserted successfully");
});

// Count and list all songs
app.get("/songs", async (req, res) => {
  const songs = await Song.find();
  const count = await Song.countDocuments();

  res.send(`
    <h3>Total Songs: ${count}</h3>
    <pre>${JSON.stringify(songs, null, 2)}</pre>
  `);
});

// List specified music director songs
app.get("/director/:name", async (req, res) => {
  const songs = await Song.find({ Music_director: req.params.name });
  res.send(songs);
});

// List specified music director songs sung by specified singer
app.get("/director-singer/:director/:singer", async (req, res) => {
  const songs = await Song.find({
    Music_director: req.params.director,
    singer: req.params.singer
  });

  res.send(songs);
});

// Delete song which you don't like
app.get("/delete/:songname", async (req, res) => {
  await Song.deleteOne({ Songname: req.params.songname });
  res.send("Song deleted successfully");
});

// Add new favourite song
app.get("/add", async (req, res) => {
  await Song.create({
    Songname: "Kesariya",
    Film: "Brahmastra",
    Music_director: "Pritam",
    singer: "Arijit Singh"
  });

  res.send("Favourite song added successfully");
});

// List songs sung by specified singer from specified film
app.get("/singer-film/:singer/:film", async (req, res) => {
  const songs = await Song.find({
    singer: req.params.singer,
    Film: req.params.film
  });

  res.send(songs);
});

// Update document by adding Actor and Actress
app.get("/update/:songname", async (req, res) => {
  await Song.updateOne(
    { Songname: req.params.songname },
    {
      $set: {
        Actor: "Ranbir Kapoor",
        Actress: "Nargis Fakhri"
      }
    }
  );

  res.send("Actor and Actress added successfully");
});

// Display data in table format
app.get("/table", async (req, res) => {
  const songs = await Song.find();

  let table = `
    <h2>Song Details Table</h2>
    <table border="1" cellpadding="10">
      <tr>
        <th>Song Name</th>
        <th>Film Name</th>
        <th>Music Director</th>
        <th>Singer</th>
        <th>Actor</th>
        <th>Actress</th>
      </tr>
  `;

  songs.forEach(s => {
    table += `
      <tr>
        <td>${s.Songname || ""}</td>
        <td>${s.Film || ""}</td>
        <td>${s.Music_director || ""}</td>
        <td>${s.singer || ""}</td>
        <td>${s.Actor || ""}</td>
        <td>${s.Actress || ""}</td>
      </tr>
    `;
  });

  table += "</table>";
  res.send(table);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});