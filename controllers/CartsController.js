const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const ensureAuthorization = require("../auth");

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
  let { checked_items } = req.body;

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

    let values = [decodedJwt.id];

    if (checked_items) {
      // 선택한 장바구니 목록 조회

      sql += ` AND cartItems.id IN (?)`;
      values.push(checked_items);
    }

    conn.query(sql, values, function (err, results) {
      console.log(err);
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

module.exports = {
  addCartItems,
  selectCartItems,
  deleteCartItems,
};
