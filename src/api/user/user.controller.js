const crypto = require('crypto-js');
const utils = require('../../utils/utils');
const connon = require('../../utils/common');


exports.login = async (ctx) => {
    // 파라미터 받기
    let { accountid, password } = ctx.request.body;
    
    // 비밀번호 암호화
    password = utils.makePassword(password);

    // sql
    let sql = 'SELECT accountid, name, phone, wallet, CASE WHEN count(*) = 1 THEN "true" ELSE "false" END AS isMember FROM users WHERE auth="user" AND accountid="'+accountid+'" AND password="'+password+'"';
    let result = await connon.query(sql);

    if (result.isMember === 'true') {
        result.code = "200";
        result.mes = "성공";
        let token = utils.makeToken(result.accountid, result.name);
        //result.token = token;

        // 쿠키에 저장이 안된다....?
        ctx.cookies.set('token', token, {
            maxAge : 1000 * 60 * 60 * 24 * 3,
            httpOnly : true,
        });
    } else {
        //throw {code:"201", msg:"FAIL - This ID Not Exist"};
        result = {code:"201", msg:"로그인 정보가 잘못되었습니다."};
    }
    ctx.body = result;
}

// 회원가입
exports.signup = async (ctx) => {
     // 파라미터 받기
     let { accountid, password, name, phone } = ctx.request.body;

     // 비밀번호 암호화
     password = utils.makePassword(password);

     // sql
     let sql = 'SELECT CASE WHEN count(*) = 1 THEN "true" ELSE "false" END AS isMember FROM users WHERE accountid="'+accountid+'"';
     let result = await connon.query(sql);

     if (result.isMember === 'true') {
        //throw {code:"201", msg:"FAIL - ID Already Exist"};
        result = {code:"201", msg:"이미 존재하는 계정입니다."};
    } else {
        sql = 'INSERT INTO users ( accountid, password, name, phone ) values ( "'+accountid+'", "'+password+'", "'+name+'", "'+phone+'" )';
        result = await connon.query(sql);
        result = {code:"200", msg:"성공"};
    }
    ctx.body = result;
}

// 비밀번호 찾기
exports.findPassword = async (ctx) => {
    // 파라미터 받기
    let { accountid } = ctx.request.body;

    // sql
    let sql = 'SELECT password, CASE WHEN count(*) = 1 THEN "true" ELSE "false" END AS isMember FROM users WHERE accountid="'+accountid+'"';
    let result = await connon.query(sql);

    // ID 확인 후 처리
    if (result.isMember === 'true') {
        let newPw = result.password;
        let mailer = utils.createMailer();
        let mailerOption = utils.setMailerOption(accountid, newPw);
        result = await connon.sendMail(mailer, mailerOption);
    } else {
        //throw {code:"201", msg:"FAIL - This ID Not Exist"};
        result = {code:"201", msg:"로그인 정보가 잘못되었습니다."};
    }
    ctx.body = result;
}