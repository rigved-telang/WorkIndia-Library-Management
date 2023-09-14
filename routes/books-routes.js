const express = require("express");
const booksController = require("../controllers/books-controllers");
const adminAuthMiddleware = require("../middlewares/admin-auth");

const router = express.Router();

router.get("", booksController.searchBookController)
router.post("/create",adminAuthMiddleware,booksController.addBookController);
router.get("/:book_id/availability", booksController.checkAvailabilityController)
router.post("/borrow", booksController.borrowBookController);

module.exports = router;