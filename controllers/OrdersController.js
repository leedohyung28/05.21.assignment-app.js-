const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const payment = (req, res) => {
  const {
    items,
    delivery,
    total_quantity,
    total_price,
    reader_id,
    representiveBookTitle,
  } = req.body;

  let delivery_id;
  let order_id;

  let sql = `INSERT INTO delivery (address, receiver, contact)
            VALUES (?, ?, ?)`;
  let values = [delivery.address, delivery.receiver, delivery.contact];

  //   conn.query(sql, values, function (err, results) {
  //     if (err) {
  //       return res.status(StatusCodes.BAD_REQUEST).end();
  //     }

  //     delivery_id = results.insertId;

  //     sql = `INSERT INTO orders (book_title, total_quantity, total_price, reader_id, delivery_id)
  //     VALUES(?, ?, ?, ?, ?)`;
  //     values = [
  //       representiveBookTitle,
  //       total_quantity,
  //       total_price,
  //       reader_id,
  //       delivery_id,
  //     ];

  //     conn.query(sql, values, function (err, results) {
  //       if (err) {
  //         return res.status(StatusCodes.BAD_REQUEST).end();
  //       }

  //       res.status(StatusCodes.CREATED).json(results);
  //     });

  //     res.status(StatusCodes.CREATED).json(results);
  //   });
  order_id = 1;

  sql = `INSERT INTO orderedBook (order_id, book_id, quantity)
                VALUES ?`;

  values = [];
  items.forEach((item) => values.push([order_id, item.book_id, item.quantity]));

  conn.query(sql, [values], function (err, results) {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    res.status(StatusCodes.CREATED).json(results);
  });
};

const selectAllOrders = (req, res) => {
  let sql = `SELECT ordered_at, book_title, total_price, total_count 
            FROM orders
            LEFT JOIN delivery
            ON orders.delivery_id = delivery.id`;
};

const selectDetailOrders = (req, res) => {
  let sql = `SELECT ordered_at, book_title, total_price, total_count 
              FROM orders
              LEFT JOIN delivery
              ON orders.delivery_id = delivery.id`;
};

module.exports = {
  payment,
  selectAllOrders,
  selectDetailOrders,
};
