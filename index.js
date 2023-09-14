const express = require("express");
const mysql = require("./db/db");
const usersRouter = require("./routes/users-routes");
const booksRouter = require("./routes/books-routes");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use("/api", usersRouter);
app.use("/api/books", booksRouter);

app.listen(5000);