const mariadb = require('mariadb');
const datasource = require('./datasource.js');
const crypto = require("crypto-js");

const pool = mariadb.createPool({
    host: datasource.hostname,
    port: datasource.port,
    user: datasource.username,
    password: datasource.password,
    database: datasource.database,
    connectionLimit: datasource.limit
});

const mkPwd = (pw) => {
    return crypto.SHA256('a').toString();
}

// 로그인
exports.login = async (ctx) => {
    let { id, pw } = ctx.request.body;
    //pw = mkPwd(pw);
    let conn, rows, result;
    try{
        let sql = 'SELECT accountid, name, phone, wallet, CASE WHEN count(*) = 1 THEN "true" ELSE "false" END AS isMember FROM users WHERE accountid="'+id+'" AND password="'+pw+'"';
        conn = await pool.getConnection();
        rows = await conn.query(sql);
        result = {accountid, name, phone, wallet, isMember} = rows[0];
        result.code = "200";
        result.mes = "SUCCESS";
        /*
        result = {
                accountid:rows[0].accountid, 
                name:rows[0].name, 
                phone:rows[0].phone, 
                wallet:rows[0].wallet, 
                isMember:rows[0].isMember, 
                code:"200", 
                msg:"SUCCESS"
            };
        */
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
    let { id, pw, name, phone } = ctx.request.body;
    //pw = mkPwd(pw);
    let conn, rows, result;
    try{
        let sql = 'INSERT INTO users ( accountid, password, name, phone ) values ( "'+id+'", "'+pw+'", "'+name+'", "'+phone+'" )';
        conn = await pool.getConnection();
        rows = await conn.query(sql);
        result = {code:"200", msg:"SUCCESS"};
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
