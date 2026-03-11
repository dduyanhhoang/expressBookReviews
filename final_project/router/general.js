const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    const exists = users.filter((user) => user.username === username);
    if (exists.length === 0) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

public_users.get('/',function (req, res) {
  res.status(200).json(books);
});

public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404).json({message: "Book not found"});
  }
});
  
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const bookKeys = Object.keys(books);
  const results = [];

  bookKeys.forEach(key => {
    if (books[key].author === author) {
      results.push({
        isbn: key,
        title: books[key].title,
        reviews: books[key].reviews
      });
    }
  });

  if (results.length > 0) {
    res.status(200).json(results);
  } else {
    res.status(404).json({message: "No books found by this author"});
  }
});

public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const bookKeys = Object.keys(books);
  const results = [];
  bookKeys.forEach(key => {
    if (books[key].title === title) {
      results.push({ isbn: key, ...books[key] });
    }
  });
  if (results.length > 0) {
    res.status(200).json(results);
  } else {
    res.status(404).json({message: "No books found with this title"});
  }
});

public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.status(200).json(books[isbn].reviews);
  } else {
    res.status(404).json({message: "Book not found"});
  }
});

// Task 10: Get all books
const getAllBooks = async () => {
    try {
        const response = await axios.get('http://localhost:5000/');
        console.log(response.data);
    } catch (error) {
        console.error("Error fetching books:", error);
    }
};

// Task 11: Search by ISBN
const getBookByISBN = (isbn) => {
    axios.get(`http://localhost:5000/isbn/${isbn}`)
        .then(response => console.log(response.data))
        .catch(error => console.error("Error fetching book by ISBN:", error));
};

// Task 12: Search by Author
const getBookByAuthor = async (author) => {
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        console.log(response.data);
    } catch (error) {
        console.error("Error fetching book by author:", error);
    }
};

// Task 13: Search by Title
const getBookByTitle = async (title) => {
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        console.log(response.data);
    } catch (error) {
        console.error("Error fetching book by title:", error);
    }
};

module.exports.general = public_users;
