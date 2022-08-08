const crypto = require('crypto-js');
const utils = require('../../utils/utils');
const connon = require('../../utils/common');


exports.login = async (ctx) => {
    // 파라미터 받기
    let { accountid, password } = ctx.request.body;

    // 비밀번호 암호화
    password = utils.makePassword(password);

    // sql
    let sql = 'SELECT accountid, name, phone, wallet, CASE WHEN count(*) = 1 THEN "true" ELSE "false" END AS isMember FROM users WHERE auth="admin" AND accountid="'+accountid+'" AND password="'+password+'"';
    let result = await connon.query(sql);

    if (result.isMember === 'true') {
        result.code = "200";
        result.mes = "SUCCESS";
    } else {
        //throw {code:"201", msg:"FAIL - This ID Not Exist"};
        result = {code:"201", msg:"로그인 정보가 잘못되었습니다."};
    }
    ctx.body = result;
}
