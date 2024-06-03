const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const addLike = (req, res) => {
  let { book_id } = req.params;

  let decodedJwt = ensureAuthorization(req);

  let sql = `INSERT INTO likes (reader_id, liked_book_id)
    VALUES (?, ?)`;
  const values = [decodedJwt.id, book_id];
  conn.query(sql, values, function (err, results) {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    res.status(StatusCodes.OK).json(results);
  });
};

const removeLike = (req, res) => {
  let { book_id } = req.params;

  let decodedJwt = ensureAuthorization(req);

  let sql = `DELETE from likes WHERE reader_id = ? AND liked_book_id = ?`;
  const values = [decodedJwt.id, book_id];
  conn.query(sql, values, function (err, results) {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    if (results.affectedRows == 0) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    } else {
      res.status(StatusCodes.OK).json(results);
    }
  });
};

function ensureAuthorization(req) {
  let receivedJwt = req.headers["authorization"];
  let decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);

  return decodedJwt;
}

module.exports = { addLike, removeLike };
