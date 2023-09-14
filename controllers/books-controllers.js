const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require('uuid');
const mysql = require("../db/db");

const addBookController = (req, res, next) => {
  const { title, author, isbn } = req.body;
  var id = uuidv4();
  const query = `INSERT INTO books VALUE (?,?,?,?,?)`;
  mysql.query(query, [id, title, author, isbn, true], (err, result) => {
    if (err) {
      console.error("Error adding book:", err);
      return res.status(500).json({ error: "Error adding book" });
    }

    res.status(201).json({ message: "Book added successfully" });
  });
};

const searchBookController = (req, res, next) => {
  const { title } = req.query;

  const query = "SELECT * FROM books WHERE title LIKE ?";
  mysql.query(query, [`%${title}%`], (err, results) => {
    if (err) {
      console.error("Error searching for books:", err);
      return res.status(500).json({ error: "Error searching for books" });
    }

    res.status(200).json(results);
  });
};
const checkAvailabilityController = (req, res, next) => {
  const { book_id } = req.params;
  console.log(req.params);

  const query = "SELECT id,title,author,is_available FROM books WHERE id = ?";
  const ret = "SELECT return_time FROM bookings WHERE book_id = ?";
  mysql.query(query, book_id, (err, results) => {
    if (err) {
      console.error("Error getting book availability:", err);
      return res.status(500).json({ error: "Error getting book availability" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    const isAvailable = results[0].is_available;
    if (isAvailable) {
      res.status(200).json({
        book_id: results[0].id,
        title: results[0].title,
        author: results[0].author,
        available: true,
      });
    } else {
      mysql.query(ret, book_id, (err, results) => {
        if (err) {
          console.error("Error searching for books:", err);
          return res.status(500).json({ error: "Error searching for books" });
        }

        res.status(200).json({
          book_id: results[0].id,
          title: results[0].title,
          author: results[0].author,
          available: false,
          next_available_at: results[0].return_time,
        });
      });
    }
  });
};
const borrowBookController = (req, res, next) => {
    var { book_id, user_id, issue_time, return_time } = req.body;
    issue_time = new Date(issue_time);
    return_time = new Date(return_time);
  // Check if the book is available
  const checkAvailabilityQuery = 'SELECT is_available FROM books WHERE id = ?';
  mysql.query(checkAvailabilityQuery, [book_id], (err, results) => {
    if (err) {
      console.error('Error checking book availability:', err);
      return res.status(500).json({ error: 'Error checking book availability' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const isAvailable = results[0].is_available;

    if (!isAvailable) {
      return res.status(400).json({ status: 'Book is not available at this moment', status_code: 400 });
    }

    // Book the book (update availability and insert a booking record)
    const borrowBookQuery = 'UPDATE books SET is_available = 0 WHERE id = ?';
    mysql.query(borrowBookQuery, [book_id], (err, updateResult) => {
      if (err) {
        console.error('Error updating book availability:', err);
        return res.status(500).json({ error: 'Error updating book availability' });
      }

      // Insert a booking record
      const booking = {
        user_id,
        book_id,
        issue_time,
        return_time,
      };

      const insertBookingQuery = 'INSERT INTO bookings SET ?';
      mysql.query(insertBookingQuery, booking, (err, insertResult) => {
        if (err) {
          console.error('Error inserting booking record:', err);
          return res.status(500).json({ error: 'Error inserting booking record' });
        }

        const booking_id = insertResult.insertId;
        res.status(200).json({ status: 'Book booked successfully', status_code: 200, booking_id });
      });
    });
  });
};

module.exports = {
  addBookController,
  searchBookController,
  checkAvailabilityController,
  borrowBookController,
};
