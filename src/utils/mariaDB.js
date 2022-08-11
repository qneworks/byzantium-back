const mariadb = require('mariadb');
const config = require('../config/config');
const utils = require('./utils');

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
    returnData.msg = 'INSERT SUCCESS';
  } catch (err) {
    returnData.code = '1';
    returnData.msg = 'INSERT FAIL';
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
    returnData.data = rows[0];
    returnData.code = '0';
    returnData.msg = 'SELECT SUCCESS';
  } catch (err) {
    returnData.code = '1';
    returnData.msg = 'SELECT FAIL';
  } finally {
    if (conn) conn.end();
  }
  return returnData;
};

exports.selectList = async (sql) => {
  let conn, rows;
  let returnData = utils.dataSet;
  try {
    conn = await pool.getConnection();
    rows = await conn.query(sql);

    // 데이터 변환?
    returnData.data = new Array(rows)[0];
    returnData.code = '0';
    returnData.msg = 'SELECT_LIST SUCCESS';
  } catch (err) {
    //throw { code: '400', msg: 'FAIL' };
    returnData.code = '1';
    returnData.msg = 'SELECT_LIST FAIL';
  } finally {
    if (conn) conn.end();
  }
  return returnData;
};