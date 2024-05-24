const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const selectBooks = (req, res) => {
  let { category_id } = req.query;

  if (category_id) {
    category_id = parseInt(category_id);

    let sql = `SELECT * FROM books WHERE category_id = ?`;
    conn.query(sql, category_id, function (err, results) {
      if (err) {
        return res.status(StatusCodes.BAD_REQUEST).end();
      }
      if (results.length) {
        res.status(StatusCodes.OK).json(results);
      } else {
        return res.status(StatusCodes.NOT_FOUND).end();
      }
    });
  } else {
    let sql = "SELECT * FROM books";
    conn.query(sql, function (err, results) {
      if (err) {
        return res.status(StatusCodes.BAD_REQUEST).end();
      }

      res.status(StatusCodes.OK).json(results);
    });
  }
};

const selectSingleBook = (req, res) => {
  let { book_id } = req.params;
  book_id = parseInt(book_id);

  let sql = `SELECT * FROM books WHERE id = ?`;
  conn.query(sql, book_id, function (err, results) {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    if (results[0]) {
      res.status(StatusCodes.OK).json(results);
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  });
};

module.exports = {
  selectBooks,
  selectSingleBook,
};
