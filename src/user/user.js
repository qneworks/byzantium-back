const mariadb = require('mariadb');
const datasource = require('../config/datasource.js');
const crypto = require("crypto-js");

const pool = mariadb.createPool({
    host: datasource.hostname,
    port: datasource.port,
    user: datasource.username,
    password: datasource.password,
    database: datasource.database,
    connectionLimit: datasource.limit
});

// 비밀번호 암호화
const mkPwd = (pw) => {
    return pw;
    //return crypto.SHA256('a').toString();
}

// 로그인
exports.login = async (ctx) => {
    // 파라미터 받기
    let { id, pw } = ctx.request.body;

    // 비밀번호 암호화
    pw = mkPwd(pw);

    let conn, rows, result;
    try{
        let sql = 'SELECT accountid, name, phone, wallet, CASE WHEN count(*) = 1 THEN "true" ELSE "false" END AS isMember FROM users WHERE accountid="'+id+'" AND password="'+pw+'"';
        conn = await pool.getConnection();
        rows = await conn.query(sql);
        result = rows[0];
        if (result.isMember === 'true') {
            result.code = "200";
            result.mes = "SUCCESS";
            ctx.body = result;
        } else {
            result.code = "201";
            result.mes = "FAIL - This ID is not Admin";
            ctx.body = result;
        }
        ctx.body = result;
    }
    catch(err){
        result = {code:"400", msg:"FAIL"};
        ctx.body = result;
    }
    finally{
        if (conn) conn.release();
    }
}

// 회원가입
exports.signup = async (ctx) => {
    // 파라미터 받기
    let { id, pw, name, phone } = ctx.request.body;

    // 비밀번호 암호화
    pw = mkPwd(pw);
    
    let conn, rows, result;
    try{
        // DB 연결
        conn = await pool.getConnection();

        // ID 중복 확인
        let sql = 'SELECT CASE WHEN count(*) = 1 THEN "true" ELSE "false" END AS isMember FROM users WHERE accountid="'+id+'"';
        rows = await conn.query(sql);
        result = rows[0];
        
        // ID 중복 확인 후 처리
        if (result.isMember === 'true') {
            result = {code:"201", msg:"FAIL - ID Already Exist"};
            ctx.body = result;
        } else {
            sql = 'INSERT INTO users ( accountid, password, name, phone ) values ( "'+id+'", "'+pw+'", "'+name+'", "'+phone+'" )';
            await conn.query(sql);
            result = {code:"200", msg:"SUCCESS"};
            ctx.body = result;
        }
    }
    catch(err){
        result = {code:"400", msg:"FAIL"};
        ctx.body = result;
    }
    finally{
        if (conn) conn.release();
    }
}
