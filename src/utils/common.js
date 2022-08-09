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

function dataSet() {
  (this.list = []), (this.data = {}), (this.code = ""), (this.msg = "");
}

exports.query = async (sql) => {
  let conn, rows;
  try {
    conn = await pool.getConnection();
    rows = await conn.query(sql);
    return rows;
  } catch (err) {
    throw { code: "400", msg: "FAIL" };
  } finally {
    if (conn) conn.end();
  }
};

exports.insert = async (sql) => {
  let conn;
  let returnData = new dataSet();
  try {
    conn = await pool.getConnection();
    await conn.query(sql);

    returnData.code = "0000";
    returnData.msg = "INSERT SUCCESS";
  } catch (err) {
    //throw { code: "400", msg: "FAIL" };
    returnData.code = "9999";
    returnData.msg = "INSERT FAIL";
  } finally {
    if (conn) conn.end();
  }
  return returnData;
};

exports.select = async (sql) => {
  let conn, rows;
  let returnData = new dataSet();
  try {
    conn = await pool.getConnection();
    rows = await conn.query(sql);

    returnData.data = rows[0];
    returnData.code = "0000";
    returnData.msg = "SELECT SUCCESS";
  } catch (err) {
    //throw { code: "400", msg: "FAIL" };
    returnData.code = "9999";
    returnData.msg = "SELECT FAIL";
  } finally {
    if (conn) conn.end();
  }
  return returnData;
};

exports.selectList = async (sql) => {
  let conn, rows;
  let returnData = new dataSet();
  try {
    conn = await pool.getConnection();
    rows = await conn.query(sql);

    // 데이터 변환?
    let toArray = new Array(rows)[0];
    toArray.forEach((element) => {
      returnData.list.push(element);
    });

    returnData.code = "0000";
    returnData.msg = "SELECT_LIST SUCCESS";
  } catch (err) {
    //throw { code: "400", msg: "FAIL" };
    returnData.code = "9999";
    returnData.msg = "SELECT_LIST FAIL";
  } finally {
    if (conn) conn.end();
  }
  return returnData;
};

exports.sendMail = async (mailer, option) => {
  return new Promise((resolve, reject) => {
    mailer.sendMail(option, function (error, info) {
      let returnData = new dataSet();
      if (error) {
        returnData.msg = "Mail Transfer failed";
        reject(returnData);
      } else {
        returnData.msg = "Mail Transfer success" + info.response;
        resolve(returnData);
      }
      mailer.close();
    });
  });
};
