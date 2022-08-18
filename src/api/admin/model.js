const svc = require("../../utils/service");
const maria = require("../../utils/mariaDB");
const lang = require("../../config/lang");
const tronweb = require("../../tronWeb/tronWeb");

// 로그인
exports.signin = async (ctx) => {
  let { email, password } = ctx.request.body;
  //password = svc.makePassword(password, "other");

  const sql = `
    SELECT 
      accountid, 
      name,  
      auth
    FROM 
      users 
    WHERE 
      auth="admin" 
      AND accountid="${email}" 
      AND password="${password}"
  `;
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
  console.log(ctx.request.query)
  console.log(email)

  let sql = `
    SELECT 
      coin,
      wallet,
      bank_name,
      bank_no,
      bank_owner
    FROM 
      users
    WHERE 
      accountid = '${email}'
  `;
  console.log(sql);
  const rows = await maria.select(sql);
  ctx.body = rows;
};

exports.bankModify = async (ctx) => {
  let { email, bank_name, bank_no, bank_owner } = ctx.request.body;
  let sql = `
    UPDATE 
      users
    SET 
      bank_name = '${bank_name}',
      bank_no = '${bank_no}',
      bank_owner = '${bank_owner}'
    WHERE
      accountid = '${email}'
    `;

  let rows = await maria.update(sql);

  if (rows.code === "0") {
    sql = `
      SELECT 
        accountid, 
        name, 
        phone, 
        auth, 
        wallet, 
        CASE 
            WHEN count(accountid) = 1 THEN "true" 
            ELSE "false" 
        END AS admitYn,
        coin,
        bank_name,
        bank_owner,
        bank_no
      FROM 
        users 
      WHERE 
        auth="admin" 
        AND accountid="${email}" 
        `;
    rows = await maria.select(sql);
  }
  ctx.body = rows;
};

// 주문확인 where절 생성
const setOrderWhere = (start, end, searchkey, searchvalue) => {
  let filter = ``;
  if (searchkey === "owner" && !!searchvalue) {
    filter = ` AND (SELECT bank_owner FROM users u WHERE u.userid = t.buyer) LIKE '%${searchvalue}%' `;
  } else if (searchkey === "buyer" && !!searchvalue) {
    filter = ` AND (SELECT name FROM users u WHERE u.userid = t.buyer) LIKE '%${searchvalue}%' `;
  } else if (searchkey === "userid" && !!searchvalue) {
    filter = ` AND (SELECT name FROM users u WHERE u.userid = t.userid) LIKE '%${searchvalue}%' `;
  }

  let where = `
        DATE_FORMAT(t.ctime, '%Y%m%d') between '${start}' AND '${end}'
        ${filter}
    `;
  return where;
};

// 주문확인
exports.order = async (ctx) => {
  let { start, end, searchkey, searchvalue, page, limit } = ctx.request.query;
  let where = setOrderWhere(start, end, searchkey, searchvalue);

  // totalCnt가 List보다 아래에 있으면 에러남... 왜?
  // totalCnt
  let sql = `
        SELECT 
            COUNT(t.transid) AS totalCnt
        FROM 
            trans t
        WHERE 
            ${where}
    `;
  let totalCnt = Number((await maria.select(sql)).value.totalCnt);

  // List
  let rowNum = (Number(page) - 1) * Number(limit);
  sql = `
        SELECT 
            @ROWNUM:=@ROWNUM + 1 AS num,
            t.orderid,
            t.category,
            (SELECT name FROM users u WHERE u.userid = t.userid) AS userid,
            (SELECT name FROM users u WHERE u.userid = t.buyer) AS buyer,
            t.coin,
            t.price,
            t.bankinfo,
            (SELECT bank_owner FROM users u WHERE u.userid = t.buyer) AS owner,
            t.ctime,
            t.status
        FROM 
            trans t,
            (SELECT @ROWNUM:=${rowNum}) AS r
        WHERE 
            ${where}
        LIMIT ${rowNum}, ${limit}
    `;
  const rows = await maria.selectList(sql);
  rows.totalCnt = totalCnt;
  ctx.body = rows;
};

// 회원현황
exports.membership = async (ctx) => {
  let { searchkey, searchvalue, page, limit } = ctx.request.query;

  let where = ``;
  if (searchkey === "name" && !!searchvalue) {
    where = `AND name LIKE "%${searchvalue}%"`;
  } else if (searchkey === "referee" && !!searchvalue) {
    where = `AND referee LIKE "%${searchvalue}%"`;
  }

  // totalCnt
  let sql = `
        SELECT 
            COUNT(userid) AS totalCnt
        FROM 
            users
        WHERE 
            auth = 'user'
            ${where}
    `;
  let totalCnt = Number((await maria.select(sql)).value.totalCnt);

  // List
  let rowNum = (Number(page) - 1) * Number(limit);
  sql = `
        SELECT 
            @ROWNUM:=@ROWNUM + 1 AS num,
            accountid,
            name,
            phone,
            auth,
            wallet,
            coin,
            ctype,
            referee,
            block,
            ctime
        FROM
            users,
            (SELECT @ROWNUM:=${rowNum}) AS r
        WHERE
            auth = 'user'
            ${where}
        LIMIT ${rowNum}, ${limit}
    `;
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
