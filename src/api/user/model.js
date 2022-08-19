const mail = require('../../utils/mail');
const maria = require('../../utils/mariaDB');
const svc = require('../../utils/service');
const lang = require('../../config/lang');
const tronweb = require('../../tronWeb/tronWeb');

const { TB, SELECT, UPDATE, INSERT } = maria;

// 로그인
exports.signin = async (ctx) => {
  let { email, password } = ctx.request.body;
  //password = svc.makePassword(password, 'other');
  // const sql = `
  //       SELECT 
  //           accountid, 
  //           name,  
  //           auth
  //       FROM 
  //           users 
  //       WHERE 
  //           auth="user" 
  //           AND accountid="${email}" 
  //           AND password="${password}"
  //   `;

  const field = 'accountid, name, auth'
  const where = `auth="user" AND accountid="${email}" AND password="${password}"`
  const sql = SELECT(field, TB.USERS, where)
  console.dir(sql)
  const rows = await maria.select(sql);
  const bool = !!rows.value;

  // JWT
  if (bool) {
    let token = await svc.makeToken(rows.value.accountid, rows.value.name);
    ctx.cookies.set("token", token, {
      maxAge: 1000 * 60 * 60 * 24 * 3,
      httpOnly: true,
    });
  } else {
    rows.code = "1";
    rows.message = lang.ACCUONT.DISAGREEMENT;
  }
  ctx.body = rows;
}

// 회원가입
exports.signup = async (ctx) => {
  let { email, password, name, phone } = ctx.request.body;
  //password = svc.makePassword(password, 'other');

  // 아이디 중복확인
  const field = 'IF(count(accountid) > 0, "Y", "N") AS isMember'
  const where = `accountid="${email}"`
  const sql = SELECT(field, TB.USERS, where)
  // let sql = `SELECT IF(count(accountid) > 0, "Y", "N") AS isMember FROM users WHERE accountid="${email}"`;
  let rows = await maria.select(sql);

  if (rows.value.isMember === 'N') {
    // 지갑 생성
    const wallet = JSON.stringify(await tronweb.createAccount());
    /*
    const wallet = await tronweb.createAccount();
    console.dir(wallet);
    let savWallet = wallet;
    delete savWallet.privateKey;
    console.dir(savWallet);
    savWallet = JSON.stringify(savWallet);
    */

    // const usql = `INSERT INTO users ( accountid, password, name, phone, wallet ) values ( '${email}', '${password}', '${name}', '${phone}', '${wallet}' )`;
    const values = `'${email}', '${password}', '${name}', '${phone}', '${wallet}'`;
    const usql = INSERT('accountid, password, name, phone, wallet', TB.USERS, values);
    rows = await maria.insert(usql);

  } else {
    rows.code = '1';
    rows.message = lang.ACCUONT.ALREADY_EXIXT;
  }
  ctx.body = rows;
}

// 아이디 찾기
exports.findId = async (ctx) => {
  let { phone } = ctx.request.body;

  // const sql = `SELECT accountid FROM users WHERE phone="${phone}"`;
  const sql = SELECT('accountid', TB.USERS, `phone="${phone}"`);
  const rows = await maria.selectList(sql);
  ctx.body = rows;
}

// 비밀번호 찾기
exports.findPassword = async (ctx) => {
  let { email } = ctx.request.body;

  // let sql = `SELECT password, IF(COUNT(accountid) > 0, "Y", "N") AS isMember FROM users WHERE accountid="${email}"`;
  const sql = SELECT('password, IF(COUNT(accountid) > 0, "Y", "N") AS isMember', TB.USERS, `accountid="${email}"`);
  let rows = await maria.select(sql);

  // 비밀번호 메일로 보내기
  if (rows.value.isMember === 'Y') {
    //let newPw = rows.value.password;
    let newPw = svc.makePassword(rows.value.password, 'find');
    let hashPw = svc.makePassword(newPw, 'other');

    // 생성한 비밀번호 DB저장
    // const usql = `UPDATE users SET password = "${hashPw}" WHERE accountid = "${email}"`;
    const usql = UPDATE(`password = "${hashPw}"`, TB.USERS, `accountid = "${email}"`);
    rows = await maria.update(usql);

    // 메일 전송
    mail.sendMail(email, newPw);

  } else {
    rows.code = '1';
    rows.message = lang.ACCUONT.IS_NOT_MEMBER;
  }
  ctx.body = rows;
}

// 사용자 정보조회
exports.userInfo = async (ctx) => {
  let { email } = ctx.request.body;

  // const sql = `SELECT accountid, password, name, phone, wallet IF(COUNT(accountid) > 0, "Y", "N") AS isMember FROM users WHERE accountid="${email}"`;
  const field = 'accountid, password, name, phone, wallet IF(COUNT(accountid) > 0, "Y", "N") AS isMember';
  const sql = SELECT(field, TB.USERS, `accountid="${email}"`)
  const rows = await maria.select(sql);

  // 비밀번호 메일로 보내기
  if (rows.value.isMember === 'N') {
    rows.code = '1';
    rows.message = lang.ACCUONT.IS_NOT_MEMBER;
  }
  ctx.body = rows;
}

// 사용자 정보변경
exports.userUpdate = async (ctx) => {
  // 사용자 정보 변경 페이지가 어떻게 구성될지 모르겠다.... 우선은 이름이랑 비밀번호만...
  let { email, password, name } = ctx.request.body;

  const newPw = svc.makePassword(password, 'other');

  // const sql = `UPDATE users SET name = "${name}", password = "${newPw}" WHERE accountid = "${email}"`;
  const sql = UPDATE(`name = "${name}", password = "${newPw}"`, TB.USERS, `accountid = "${email}"`);
  const rows = await maria.update(sql);
  ctx.body = rows;
}