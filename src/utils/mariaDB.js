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

/**********************************************************************
 * 쿼리 작성시 테이블명 또는 기본 문법의 오류를 줄이기 위한 용도로 사용
 **********************************************************************/
exports.TB = {
  USERS: 'users',
  TRANS: 'trans'
}

exports.SELECT = (fields, table, where = null) => {
  let query = `SELECT ${fields} FROM ${table} `
  if (where) {
    query += ` WHERE ${where}`
  }
  return query
}

exports.INSERT = (fields, table, values) => {
  const query = `INSERT INTO ${table} (${fields}) VALUES (${values})`
  return query
}

exports.UPDATE = (fields, table, where) => {
  let query = `UPDATE ${table} SET ${fields} `
  if (where) {
    query += ` WHERE ${where}`
  }
  return query
}

/**********************************************************************
 * 데이터베이스 쿼리 유틸리티 메소드
 **********************************************************************/
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
  try {
    conn = await pool.getConnection();
    rows = await conn.query(sql);

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