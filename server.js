/*********************************************************************************
 *  WEB422 – Assignment 2
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 *
 *  Name: ___Yuvraj Singh___ Student ID: __152313219__ Date: __2 June 2023__
 *  Cyclic Link: _______________________________________________________________
 *
 ********************************************************************************/

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

const HTTP_PORT = process.env.PORT || 8080;

const app = express();

app.use(cors());
// parse the JSON provided in the request body for some of our routes
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API Listening" });
});

// create new movie
app.post("/api/movies", function (req, res) {
  const moviesData = req.body;
  db.addNewMovie(moviesData)
    .then((movie) => {
      return res
        .status(200)
        .json({ movie, message: "Movie created successfully" });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ message: `Unable to create new movie. Error: ${err}` });
    });
});
// get all movies
app.get("/api/movies", function (req, res) {
  const { page, perPage, title } = req.query;

  // check for required query params
  if (!page || !perPage) {
    return res
      .status(400)
      .json({ message: 'Provide "page and perPage" query parameters' });
  }
  // check numeric types
  if (+page && +perPage) {
    db.getAllMovies(page, perPage, title)
      .then((movies) => {
        return res.status(200).json(movies);
      })
      .catch((err) => {
        return res
          .status(500)
          .json({ message: `Unable to get movies. Error: ${err}` });
      });
  } else {
    return res
      .status(400)
      .json({ message: "Invalid Page/perPage. Expecting numeric values" });
  }
});

// get single movie by id
app.get("/api/movies/:id", function (req, res) {
  db.getMovieById(req.params.id)
    .then((movie) => {
      if (movie) return res.status(200).json(movie);
      return res.status(404).json({ message: "Not Found" });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ message: `Unable to get movie. Error: ${err}` });
    });
});

// update single movie by id
app.put("/api/movies/:id", function (req, res) {
  db.updateMovieById(req.body, req.params.id)
    .then((movie) => {
      return res.status(200).json(movie);
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ message: `Unable to update movie. Error: ${err}` });
    });
});

// delete single movie by id
app.delete("/api/movies/:id", function (req, res) {
  db.deleteMovieById(req.params.id)
    .then(() => {
      return res.status(204).json({ message: "Movie deleted successfully" });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ message: `Unable to delete movie. Error: ${err} ` });
    });
});

db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`server listening on: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
