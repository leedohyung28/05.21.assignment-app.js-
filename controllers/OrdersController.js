const jwt = require("jsonwebtoken");
const ensureAuthorization = require("../auth");
const mariadb = require("mysql2/promise");

const { StatusCodes } = require("http-status-codes");

const payment = async (req, res) => {
  const conn = await mariadb.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "buybybooks",
    dateStrings: true,
  });

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
    const {
      items,
      delivery,
      total_quantity,
      total_price,
      representiveBookTitle,
    } = req.body;

    let sql = `INSERT INTO delivery (address, receiver, contact)
            VALUES (?, ?, ?)`;
    let values = [delivery.address, delivery.receiver, delivery.contact];

    let [results] = await conn.execute(sql, values);

    let delivery_id = results.insertId;
    sql = `INSERT INTO orders (book_title, total_quantity, total_price, reader_id, delivery_id)
      VALUES(?, ?, ?, ?, ?)`;
    values = [
      representiveBookTitle,
      total_quantity,
      total_price,
      decodedJwt.id,
      delivery_id,
    ];

    [results] = await conn.execute(sql, values);

    let order_id = results.insertId;

    sql = `SELECT book_id, quantity FROM cartItems WHERE id IN (?)`;
    let [orderItems, fields] = await conn.query(sql, [items]);

    sql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?`;
    values = [];
    orderItems.forEach((item) =>
      values.push([order_id, item.book_id, item.quantity])
    );
    results = await conn.query(sql, [values]);

    let result = await deleteCartItems(conn, items);

    res.status(StatusCodes.CREATED).json(result);
  }
};

const deleteCartItems = async (conn, items) => {
  let sql = `DELETE FROM cartItems WHERE id IN (?)`;
  let result = await conn.query(sql, [items]);
  return result;
};

const getAllOrders = async (req, res) => {
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
    const conn = await mariadb.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "buybybooks",
      dateStrings: true,
    });

    let sql = `SELECT orders.id, ordered_at, address, receiver, contact, 
            book_title, total_quantity, total_price
            FROM orders
            LEFT JOIN delivery
            ON orders.delivery_id = delivery.id`;
    let [rows, fields] = await conn.query(sql);
    return res.status(StatusCodes.OK).json(rows);
  }
};

const getDetailOrders = async (req, res) => {
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
    let { orderId } = req.params;
    const conn = await mariadb.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "buybybooks",
      dateStrings: true,
    });

    let sql = `SELECT book_id, title, author, price, quantity
              FROM orderedBook
              LEFT JOIN books
              ON orderedBook.book_id = books.id
              WHERE order_id=?`;
    let [rows, fields] = await conn.query(sql, [orderId]);
    return res.status(StatusCodes.OK).json(rows);
  }
};

module.exports = {
  payment,
  getAllOrders,
  getDetailOrders,
};
