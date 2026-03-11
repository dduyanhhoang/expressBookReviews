const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

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

// Task 10: Get the book list available in the shop using Async/Await
public_users.get('/', async function (req, res) {
  try {
    const getBooks = () => {
      return new Promise((resolve) => {
        resolve(books);
      });
    };
    const bookList = await getBooks();
    res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    res.status(500).json({message: "Internal Server Error"});
  }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const getBookByISBN = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({status: 404, message: "Book not found"});
    }
  });

  getBookByISBN
    .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
    .catch((err) => res.status(err.status).json({message: err.message}));
});

// Task 12: Get book details based on author using Async/Await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const getBooksByAuthor = () => {
      return new Promise((resolve) => {
        const bookKeys = Object.keys(books);
        const results = [];
        bookKeys.forEach(key => {
          if (books[key].author === author) {
            results.push({ isbn: key, ...books[key] });
          }
        });
        resolve(results);
      });
    };

    const filteredBooks = await getBooksByAuthor();
    if (filteredBooks.length > 0) {
      res.status(200).send(JSON.stringify(filteredBooks, null, 4));
    } else {
      res.status(404).json({message: "No books found by this author"});
    }
  } catch (error) {
    res.status(500).json({message: "Error retrieving books"});
  }
});

// Task 13: Get all books based on title using Promises
public_users.get('/title/:title', function (req, res) {
  const getByTitle = new Promise((resolve, reject) => {
    const title = req.params.title;
    const bookKeys = Object.keys(books);
    const results = [];
    bookKeys.forEach(key => {
      if (books[key].title === title) {
        results.push({ isbn: key, ...books[key] });
      }
    });

    if (results.length > 0) {
      resolve(results);
    } else {
      reject({status: 404, message: "No books found with this title"});
    }
  });

  getByTitle
    .then((result) => res.status(200).send(JSON.stringify(result, null, 4)))
    .catch((err) => res.status(err.status).json({message: err.message}));
});

// Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;