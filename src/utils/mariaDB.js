const mariadb = require('mariadb');
const utils = require('./utils');
const config = require('../config/config');
const lang = require('../config/lang');


const pool = mariadb.createPool({
  host: config.database.hostname,
  port: config.database.port,
  user: config.database.username,
  password: config.database.password,
  database: config.database.database,
  connectionLimit: config.database.limit,
});

exports.insert = async (sql) => {
  let conn;
  let returnData = utils.dataSet;
  try {
    conn = await pool.getConnection();
    await conn.query(sql);

    returnData.code = '0';
    returnData.message = lang.SUCCESS;
  } catch (err) {
    returnData.code = '1';
    returnData.message = lang.FAIL;
  } finally {
    if (conn) conn.end();
  }
  return returnData;
};

exports.select = async (sql) => {
  let conn, rows;
  let returnData = utils.dataSet;
  try {
    conn = await pool.getConnection();
    rows = await conn.query(sql);
    returnData.value = rows[0];
    returnData.code = '0';
    returnData.message = lang.SUCCESS;
  } catch (err) {
    returnData.code = '1';
    returnData.message = lang.FAIL;
  } finally {
    if (conn) conn.end();
  }
  return returnData;
};

exports.selectList = async (sql) => {
  let conn, rows;
  let returnData = utils.dataSet;

  console.log(sql);
  try {
    conn = await pool.getConnection();
    rows = await conn.query(sql);

    console.dir(rows);

    // 데이터 변환?
    returnData.value = new Array(rows)[0];
    returnData.code = '0';
    returnData.message = lang.SUCCESS;
  } catch (err) {
    console.log(err)
    returnData.code = '1';
    returnData.message = lang.FAIL;
  } finally {
    if (conn) conn.end();
  }
  return returnData;
};

exports.update = async (sql) => {
  let conn;
  let returnData = utils.dataSet;
  try {
    conn = await pool.getConnection();
    await conn.query(sql);

    returnData.code = '0';
    returnData.message = lang.SUCCESS;
  } catch (err) {
    returnData.code = '1';
    returnData.message = lang.FAIL;
  } finally {
    if (conn) conn.end();
  }
  return returnData;
};