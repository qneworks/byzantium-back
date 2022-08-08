const mariadb = require("mariadb");
const config = require("../config/config");

const pool = mariadb.createPool({
  host: config.database.hostname,
  port: config.database.port,
  user: config.database.username,
  password: config.database.password,
  database: config.database.database,
  connectionLimit: config.database.limit,
});

exports.query = async (sql) => {
  let conn, rows;
  try {
    conn = await pool.getConnection();
    rows = await conn.query(sql);
    return rows[0];
  } catch (err) {
    throw { code: "400", msg: "FAIL" };
  } finally {
    if (conn) conn.end();
  }
};

exports.sendMail = async (mailer, option) => {
  return new Promise((resolve, reject) => {
    mailer.sendMail(option, function (error, info) {
      if (error) {
        reject({ code: "201", msg: "FAIL - Mail Transfer failed" });
      } else {
        resolve({ code: "200", msg: "SUCCESS - " + info.response });
      }
      mailer.close();
    });
  });
};
