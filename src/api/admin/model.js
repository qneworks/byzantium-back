const svc = require("../../utils/service");
const maria = require("../../utils/mariaDB");
const lang = require("../../config/lang");
const tronweb = require("../../tronWeb/tronWeb");

const { TB, SELECT, UPDATE, INSERT } = maria;

// 로그인
exports.signin = async (ctx) => {
  let { email, password } = ctx.request.body;
  //password = svc.makePassword(password, "other");

  const field = "accountid, name, auth";
  const where = `auth="admin" AND accountid="${email}" AND password="${password}"`;
  const sql = SELECT(field, TB.USERS, where);
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
};

// 계좌정보 조회
exports.bankinfo = async (ctx) => {
  let { email } = ctx.request.query;

  const field = "coin, wallet, bank_name, bank_no, bank_owner";
  const where = `accountid = '${email}'`;
  const sql = SELECT(field, TB.USERS, where);
  console.log(sql);
  const rows = await maria.select(sql);

  ctx.body = rows;
};

exports.bankModify = async (ctx) => {
  let { email, bank_name, bank_no, bank_owner } = ctx.request.body;

  const usql = UPDATE(
    `bank_name = '${bank_name}', bank_no = '${bank_no}', bank_owner = '${bank_owner}'`,
    TB.USERS,
    `accountid = "${email}"`
  );
  let rows = await maria.update(usql);

  ctx.body = rows;
};

exports.orderOutput = async (ctx) => {
  let { email, category, loginEmail, coin, price, bankinfo, txid, status, comm } = ctx.request.body;

  console.log('orderOutput in =================')

  const sql = SELECT (
    `MAX(transid)+1 AS transid`,
    TB.TRANS,
  )
  let transid = await (await maria.select(sql)).value.transid.toString();
  transid = transid.replace('n', '');
  console.dir(transid)
  
  const  isql = INSERT(
    `transid, userid, orderid, category, buyer, coin, price, bankinfo, txid, status, comm`,
    TB.TRANS,
    `${transid}, (select userid from users where accountid = '${email}'), date_format(now(), '%Y%m%d%H%i%s'),
    '${category}', (select userid from users where accountid = '${loginEmail}'), '${coin}', '${price}',
    (select concat(bank_name, '/', bank_no, '/', bank_owner) from users where accountid = '${loginEmail}'), '${txid}', '${status}', '${comm}'`
  );
  let rows = await maria.insert(isql);

  ctx.body = rows;
};

// 주문확인
exports.order = async (ctx) => {
  console.log("connect API order!");
  let { start, end, searchkey, searchvalue, page, limit } = ctx.request.query;
  let sField = searchkey === "owner" ? "bank_owner" : "name";
  let sWhere = searchkey === "userid" ? "userid" : "buyer";

  let field, sql, table, where;
  // totalCnt가 List보다 아래에 있으면 에러남... 왜?
  // totalCnt
  field = "COUNT(t.transid) AS totalCnt";
  where =
    `DATE_FORMAT(t.ctime, '%Y%m%d') between DATE_FORMAT('${start}', '%Y%m%d') AND DATE_FORMAT('${end}', '%Y%m%d') ` +
    `AND (SELECT ${sField} FROM users u WHERE u.userid = t.${sWhere}) LIKE '%${searchvalue}%'`;
  sql = SELECT(field, `trans t`, where);
  let totalCnt = Number((await maria.select(sql)).value.totalCnt);

  // List
  let rowNum = (Number(page) - 1) * Number(limit);
  field =
    `@ROWNUM:=@ROWNUM + 1 AS num, t.orderid, t.category, t.userid, ` +
    `(SELECT name FROM users u WHERE u.userid = t.userid) AS username, (SELECT name FROM users u WHERE u.userid = t.buyer) AS buyer, ` +
    `t.coin, t.price, t.bankinfo, (SELECT bank_owner FROM users u WHERE u.userid = t.buyer) AS owner, DATE_FORMAT(t.ctime, '%Y-%m-%d') AS ctime, t.status`;
  table = `trans t, (SELECT @ROWNUM:=${rowNum}) AS r`;
  where = where + ` LIMIT ${rowNum}, ${limit}`;
  sql = SELECT(field, table, where);
  console.log(sql);
  const rows = await maria.selectList(sql);

  rows.totalCnt = totalCnt;
  ctx.body = rows;
};

// 회원현황
exports.membership = async (ctx) => {
  let { searchkey, searchvalue, page, limit } = ctx.request.query;
  let field, sql, table, where;
  // totalCnt가 List보다 아래에 있으면 에러남... 왜?
  // totalCnt
  field = "COUNT(userid) AS totalCnt";
  where = `auth = 'user' AND ${searchkey} LIKE "%${searchvalue}%"`;
  sql = SELECT(field, TB.USERS, where);
  let totalCnt = Number((await maria.select(sql)).value.totalCnt);

  // List
  let rowNum = (Number(page) - 1) * Number(limit);
  field = `@ROWNUM:=@ROWNUM + 1 AS num, accountid, name, phone, auth, wallet, coin, ctype, referee, block, ctime`;
  table = `users, (SELECT @ROWNUM:=${rowNum}) AS r`;
  where = where + ` LIMIT ${rowNum}, ${limit}`;
  sql = SELECT(field, table, where);
  const rows = await maria.selectList(sql);

  rows.totalCnt = totalCnt;
  ctx.body = rows;
};

// 여기 아래로는 테스트용 ...
exports.tronTest = async () => {
  console.log("Tron Token Test!");

  const account = await tronweb.createAccount();
  console.dir(account);
  //await tronweb.isConnect();
};
