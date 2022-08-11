const mail = require('../../utils/mail');
const connon = require('../../utils/mariaDB');
const svc = require('../../utils/service');


// 로그인
exports.login = async (ctx) => {
    let { email, password } = ctx.request.body;
    password = svc.makePassword(password, 'other');

    let sql = `SELECT accountid, name, phone, wallet, IF(COUNT(accountid) > 0, "Y", "N") AS admitYn FROM users WHERE auth="user" AND accountid="${email}" AND password="${password}"`;
    let rows = await connon.select(sql);

    // JWT 
    if (rows.data.admitYn === 'Y') {
        let token = await svc.makeToken(rows.data.accountid, rows.data.name);
        ctx.cookies.set('token', token, {
            maxAge : 1000 * 60 * 60 * 24 * 3,
            httpOnly : true,
        });
    }
    ctx.body = rows;
}

// 회원가입
exports.signup = async (ctx) => {
    console.dir(ctx.request.body)
    let { email, password, name, phone } = ctx.request.body;
    password = svc.makePassword(password, 'other');

    // 아이디 중복확인
    let sql = `SELECT IF(count(accountid) > 0, "Y", "N") AS isMember FROM users WHERE accountid="${email}"`;
    let rows = await connon.select(sql);

    if (rows.data.isMember === 'N') {
        sql = `INSERT INTO users ( accountid, password, name, phone ) values ( "${email}", "${password}", "${name}", "${phone}" )`;
        rows = await connon.insert(sql);

    } else {
        rows.code = '1';
        rows.msg = '이미 존재하는 계정입니다.';
    }
    ctx.body = rows;
}

// 아이디 찾기
exports.findId = async (ctx) => {
    let { phone } = ctx.request.body;

    let sql = `SELECT accountid FROM users WHERE phone="${phone}"`;
    let rows = await connon.selectList(sql);
    ctx.body = rows;
}

// 비밀번호 찾기
exports.findPassword = async (ctx) => {
    let { email } = ctx.request.body;

    let sql = `SELECT password, IF(COUNT(accountid) > 0, "Y", "N") AS isMember FROM users WHERE accountid="${email}"`;
    let rows = await connon.select(sql);

    // 비밀번호 메일로 보내기
    if (rows.data.isMember === 'Y') {
        //let newPw = rows.data.password;
        let newPw = svc.makePassword(rows.data.password, 'find');
        let hashPw = svc.makePassword(newPw, 'other');

        console.log(hashPw)
        
        // 생성한 비밀번호 DB저장
        sql = `UPDATE users SET password = "${hashPw}" WHERE accountid = "${email}"`;
        rows = await connon.update(sql);
        
        // 메일 전송
        mail.sendMail(email, newPw);
        
    } else {
        rows.code = '1';
        rows.msg = '로그인 정보가 잘못되었습니다.';
    }
    ctx.body = rows;
}