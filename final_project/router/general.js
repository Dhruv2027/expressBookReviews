const users = require('./auth_users.js').users
const books = require('./booksdb.js')
const express = require('express')

const public_users = express.Router()

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (isValid(username)) {
            users.push({ username, password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(400).json({ message: "User already exists!" });
        }
    } else {
        return res.status(400).json({ message: "Unable to register user." });
    }
});

public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get('https://dhruvviveksh-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/books');
        return res.json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book list" });
    }
});

public_users.get('/', async function (req, res) {
  try {
    const data = await new Promise((resolve, reject) => {
      resolve(JSON.stringify(books))
    })
    return res.status(200).json({ data })
  } catch (error) {
    return res.status(400).json({ message: error })
  }
})

public_users.get('/isbn/:isbn', function (req, res) {
  new Promise((resolve, reject) => {
    const isbn = req.params.isbn
    const book = books[isbn]
    if (!book) {
      reject('Book not found')
    } 
    else {
      resolve(book)
    }
  })
    .then((data) => {
      res.status(200).json(data)
    })
    .catch((error) => {
      res.status(404).json({ message: error })
    })
})

public_users.get('/author/:author', function (req, res) {
  new Promise((resolve, reject) => {
    const author = req.params.author
    const booksByAuthor = Object.values(books).filter(
      (a) => a.author === author
    )
    if (booksByAuthor.length === 0) {
      reject('No books found for this author')
    } else {
      resolve(booksByAuthor)
    }
  })
    .then((data) => {
      res.status(200).json(data)
    })
    .catch((error) => {
      res.status(404).json({ message: error })
    })
})

public_users.get('/title/:title', function (req, res) {
  new Promise((resolve, reject) => {
    const title = req.params.title
    const booksByTitle = Object.values(books).filter((b) =>
      b.title.includes(title)
    )
    if (booksByTitle.length === 0) {
      reject('No books found with this title')
    } else {
      resolve(booksByTitle)
    }
  })
    .then((data) => {
      res.status(200).json(data)
    })
    .catch((error) => {
      res.status(404).json({ message: error })
    })
})

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn
  const book = books[isbn]
  if (!book || !book.reviews) {
    return res.status(404).json({ message: 'Reviews not found for this book' })
  }
  return res.status(200).json(book.reviews)
})

module.exports.general = public_users