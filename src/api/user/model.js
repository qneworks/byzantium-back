const mail = require('../../utils/mail');
const connon = require('../../utils/mariaDB');
const svc = require('../../utils/service');
const lang = require('../../config/lang');


// 로그인
exports.signin = async (ctx) => {
    let { email, password } = ctx.request.body;
    password = svc.makePassword(password, 'other');

    const sql = `SELECT accountid, name, phone, wallet, IF(COUNT(accountid) > 0, "Y", "N") AS admitYn FROM users WHERE auth="user" AND accountid="${email}" AND password="${password}"`;
    const rows = await connon.select(sql);

    // JWT 
    if (rows.value.admitYn === 'Y') {
        let token = await svc.makeToken(rows.value.accountid, rows.value.name);
        ctx.cookies.set('token', token, {
            maxAge : 1000 * 60 * 60 * 24 * 3,
            httpOnly : true,
        });
    }
    ctx.body = rows;
}

// 회원가입
exports.signup = async (ctx) => {
    let { email, password, name, phone } = ctx.request.body;
    password = svc.makePassword(password, 'other');

    // 아이디 중복확인
    let sql = `SELECT IF(count(accountid) > 0, "Y", "N") AS isMember FROM users WHERE accountid="${email}"`;
    let rows = await connon.select(sql);

    if (rows.value.isMember === 'N') {
        sql = `INSERT INTO users ( accountid, password, name, phone ) values ( "${email}", "${password}", "${name}", "${phone}" )`;
        rows = await connon.insert(sql);

    } else {
        rows.code = '1';
        rows.msg = lang.ACCUONT.ALREADY_EXIXT;
    }
    ctx.body = rows;
}

// 아이디 찾기
exports.findId = async (ctx) => {
    let { phone } = ctx.request.body;

    const sql = `SELECT accountid FROM users WHERE phone="${phone}"`;
    const rows = await connon.selectList(sql);
    ctx.body = rows;
}

// 비밀번호 찾기
exports.findPassword = async (ctx) => {
    let { email } = ctx.request.body;

    let sql = `SELECT password, IF(COUNT(accountid) > 0, "Y", "N") AS isMember FROM users WHERE accountid="${email}"`;
    let rows = await connon.select(sql);

    // 비밀번호 메일로 보내기
    if (rows.value.isMember === 'Y') {
        //let newPw = rows.value.password;
        let newPw = svc.makePassword(rows.value.password, 'find');
        let hashPw = svc.makePassword(newPw, 'other');

        // 생성한 비밀번호 DB저장
        sql = `UPDATE users SET password = "${hashPw}" WHERE accountid = "${email}"`;
        rows = await connon.update(sql);
        
        // 메일 전송
        mail.sendMail(email, newPw);
        
    } else {
        rows.code = '1';
        rows.msg = lang.ACCUONT.IS_NOT_MEMBER;
    }
    ctx.body = rows;
}

// 사용자 정보조회
exports.userInfo = async (ctx) => {
    let { email } = ctx.request.body;

    const sql = `SELECT accountid, password, name, phone, wallet IF(COUNT(accountid) > 0, "Y", "N") AS isMember FROM users WHERE accountid="${email}"`;
    const rows = await connon.select(sql);

    // 비밀번호 메일로 보내기
    if (rows.value.isMember === 'N') {
        rows.code = '1';
        rows.msg = lang.ACCUONT.IS_NOT_MEMBER;
    }
    ctx.body = rows;
}

// 사용자 정보변경
exports.userUpdate = async (ctx) => {
    // 사용자 정보 변경 페이지가 어떻게 구성될지 모르겠다.... 우선은 이름이랑 비밀번호만...
    let { email, password, name } = ctx.request.body;

    const newPw = svc.makePassword(password, 'other');

    const sql = `UPDATE users SET name = "${name}", password = "${newPw}" WHERE accountid = "${email}"`;
    const rows = await connon.update(sql);
    ctx.body = rows;
}