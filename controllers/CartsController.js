const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const addCartItems = (req, res) => {
  let { book_id, quantity } = req.body;

  let decodedJwt = ensureAuthorization(req, res);

  let sql = `INSERT INTO cartItems (book_id, quantity, reader_id)
      VALUES(?, ?, ?)`;
  let values = [book_id, quantity, decodedJwt.id];
  conn.query(sql, values, function (err, results) {
    if (err) return res.status(StatusCodes.BAD_REQUEST).end();

    res.status(StatusCodes.CREATED).json(results);
  });
};

const selectCartItems = (req, res) => {
  let decodedJwt = ensureAuthorization(req, res);

  if (decodedJwt instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "로그인 세션이 만료되었습니다. 다시 로그인 하세요.",
    });
  } else if (decodedJwt instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "잘못된 토큰입니다.",
    });
  } else {
    let sql = `SELECT cartItems.id, book_id, title, summary, quantity, price
  FROM cartItems
  LEFT JOIN books 
  ON cartItems.book_id = books.id
  WHERE reader_id = ?`;
    conn.query(sql, decodedJwt.id, function (err, results) {
      if (err) return res.status(StatusCodes.BAD_REQUEST).end();

      res.status(StatusCodes.OK).json(results);
    });
  }
};

const deleteCartItems = (req, res) => {
  let { id } = req.params;
  id = parseInt(id);

  let sql = `DELETE FROM cartItems WHERE id = ?`;
  conn.query(sql, id, function (err, results) {
    if (err) return res.status(StatusCodes.BAD_REQUEST).end();

    res.status(StatusCodes.OK).json(results);
  });
};

const checkedCartItems = (req, res) => {
  let { checked_items } = req.body;
  let decodedJwt = ensureAuthorization(req, res);

  if (decodedJwt instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "로그인 세션이 만료되었습니다. 다시 로그인 하세요.",
    });
  } else if (decodedJwt instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "잘못된 토큰입니다.",
    });
  } else {
    let sql = `SELECT cartItems.id, book_id, title, summary, quantity, price
      FROM cartItems
      LEFT JOIN books 
      ON cartItems.book_id = books.id
      WHERE reader_id = ?
      AND id IN (?)`;
    const values = [decodedJwt.id, checked_items];
    conn.query(sql, values, function (err, results) {
      if (err) {
        console.log(err);

        return res.status(StatusCodes.BAD_REQUEST).end();
      }

      res.status(StatusCodes.OK).json(results);
    });
  }
};

function ensureAuthorization(req, res) {
  try {
    let receivedJwt = req.headers["authorization"];
    let decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);

    return decodedJwt;
  } catch (err) {
    console.log(err.name);
    console.log(err.message);

    return err;
  }
}

module.exports = {
  addCartItems,
  selectCartItems,
  deleteCartItems,
  checkedCartItems,
};
