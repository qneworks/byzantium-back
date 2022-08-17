const svc = require('../../utils/service');
const maria = require('../../utils/mariaDB');
const lang = require('../../config/lang');
const tronweb = require('../../tronWeb/tronWeb');
const { all } = require('.');

// 로그인
exports.signin = async (ctx) => {
    let { email, password } = ctx.request.body;
    password = svc.makePassword(password, 'other');

    const sql = `SELECT accountid, name, phone, auth, wallet, CASE WHEN count(*) = 1 THEN "true" ELSE "false" END AS admitYn FROM users WHERE auth="admin" AND accountid="${email}" AND password="${password}"`;
    const rows = await maria.select(sql);
    console.log(sql);

    // JWT 
    if (rows.value.admitYn === 'true') {
        rows.value.wallet = JSON.parse(rows.value.wallet);
        let token = await svc.makeToken(rows.value.accountid, rows.value.name);
        ctx.cookies.set('token', token, {
            maxAge : 1000 * 60 * 60 * 24 * 3,
            httpOnly : true,
        });
    } else {
        rows.code = '1';
        rows.message = lang.ACCUONT.DISAGREEMENT;
    }
    ctx.body = rows;
}

// 주문확인
exports.order = async (ctx) => {
    let { start, end, searchkey, searchvalue, page, limit } = ctx.request.query;
    
    let rowNum = (Number(page)-1) * Number(limit);
    let sql =  ``;
    sql += `SELECT `;
    sql += `@ROWNUM:=@ROWNUM + 1 AS num, `;
    sql += `t.orderid, `;
    sql += `IF(t.category = 'sell', '팝니다', '삽니다') AS category, `;
    sql += `(SELECT name FROM users u WHERE u.userid = t.userid) AS userid, `;
    sql += `(SELECT name FROM users u WHERE u.userid = t.buyer) AS buyer, `;
    sql += `t.coin, `;
    sql += `t.price, `;
    sql += `t.bankinfo, `;
    sql += `(SELECT bank_owner FROM users u WHERE u.userid = t.buyer) AS owner, `;
    sql += `t.ctime, `;
    sql += `t.status `;
    sql += `FROM `;
    sql += `trans t, `;
    sql += `(SELECT @ROWNUM:=${rowNum}) AS R `;
    sql += `WHERE `;
    sql += `DATE_FORMAT(t.ctime, '%Y%m%d') between '${start}' AND '${end}' `
    
    // 필터
    if (searchkey === 'owner' && !searchkey) {
        sql += ` AND (SELECT bank_owner FROM users u WHERE u.userid = t.buyer) = '${searchvalue}' `;
    } else if (searchkey === 'buyer' && !searchkey) {
        sql += ` AND (SELECT name FROM users u WHERE u.userid = t.buyer) = '${searchvalue}' `;
    } else if (searchkey === 'userid' && !searchkey) {
        sql += ` AND (SELECT name FROM users u WHERE u.userid = t.userid) = '${searchvalue}' `;
    }

    // 페이징
    sql += `LIMIT ${rowNum}, ${limit}`
    console.log(sql);
    const rows = await maria.selectList(sql);
    ctx.body = rows;
}

// 회원현황
exports.membership = async (ctx) => {
    let { filter, value } = ctx.request.body;

    let sql = `@ROWNUM:=@ROWNUM+1 AS num, accountid, name, phone, auth, wallet, coin, ctype, referee, block FROM users, (SELECT @ROWNUM:=0) AS R WHERE auth="user" `;
    if (filter === 'name' && !value) {
        sql += `AND name = "${value}"`;
    } else if (filter === 'aa' && !value) {
        sql += `AND name = "${value}"`;
    }

    const rows = await maria.selectList(sql);
    ctx.body = rows;
}

exports.tronTest = async () => {
    console.log('Tron Token Test!');

    const account = await tronweb.createAccount();
    console.dir(account);
    //await tronweb.isConnect();
}


exports.createToken = async () => {
    const account = await tronweb.getAccount();
    console.dir(account);

    const result = await tronweb.createToken();
    console.dir(result);

    

    return null;
}