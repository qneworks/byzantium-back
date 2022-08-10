const crypto = require('crypto-js');
const utils = require('../../utils/utils');
const connon = require('../../utils/common');


// 로그인
exports.login = async (ctx) => {
    // 파라미터 받기
    let { accountid, password } = ctx.request.body;
    
    // 비밀번호 암호화
    password = utils.makePassword(password);

    // sql
    let sql = 'SELECT accountid, name, phone, wallet, IF(count(accountid) > 0, "Y", "N") AS admitYn FROM users WHERE auth="user" AND accountid="'+accountid+'" AND password="'+password+'"';

    // db 조회
    let rows = await connon.select(sql);

    // JWT 
    if (rows.data.admitYn === 'Y') {
        // 토큰 발행
        let token = utils.makeToken(rows.data.accountid, rows.data.name);

        // 쿠키에 저장
        ctx.cookies.set('token', token, {
            maxAge : 1000 * 60 * 60 * 24 * 3,
            httpOnly : true,
        });
    }

    // 응답
    ctx.body = rows;
}

// 회원가입
exports.signup = async (ctx) => {
    // 파라미터 받기
    let { accountid, password, name, phone } = ctx.request.body;

    // 비밀번호 암호화
    password = utils.makePassword(password);

    // 검증?
    let sql = 'SELECT IF(count(accountid) > 0, "Y", "N") AS isMember FROM users WHERE accountid="'+accountid+'"';
    let rows = await connon.select(sql);

    if (rows.data.isMember === 'N') {
        // inset 실행
        sql = 'INSERT INTO users ( accountid, password, name, phone ) values ( "'+accountid+'", "'+password+'", "'+name+'", "'+phone+'" )';
        rows = await connon.insert(sql);

    } else {
        rows.code = "1";
        rows.msg = "이미 존재하는 계정입니다.";
    }
    ctx.body = rows;
}

// 아이디 찾기
exports.findId = async (ctx) => {
    // 파라미터 받기
    let { phone } = ctx.request.body;

    // sql 생성
    let sql = 'SELECT accountid FROM users WHERE phone="'+phone+'"';

    // db 조회
    let rows = await connon.selectList(sql);
    
    // 응답
    ctx.body = rows;
}

// 비밀번호 찾기
exports.findPassword = async (ctx) => {
    // 파라미터 받기
    let { accountid } = ctx.request.body;

    // sql 생성
    let sql = 'SELECT password, IF(count(accountid) > 0, "Y", "N") AS isMember FROM users WHERE accountid="'+accountid+'"';

    // db 조회
    let rows = await connon.select(sql);

    // ID 확인 후 처리
    if (rows.data.isMember === 'Y') {
        let newPw = rows.data.password;
        let mailer = utils.createMailer();
        let mailerOption = utils.setMailerOption(accountid, newPw);
        rows = await connon.sendMail(mailer, mailerOption);
    } else {
        rows.code = "1";
        rows.msg = "로그인 정보가 잘못되었습니다.";
    }
    ctx.body = rows;
}