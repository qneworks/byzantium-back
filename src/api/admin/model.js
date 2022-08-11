const svc = require('../../utils/service');
const connon = require('../../utils/mariaDB');


// 로그인
exports.login = async (ctx) => {
    let { accountid, password } = ctx.request.body;
    password = svc.makePassword(password, 'other');

    let sql = `SELECT accountid, name, phone, wallet, CASE WHEN count(*) = 1 THEN "true" ELSE "false" END AS isMember FROM users WHERE auth="admin" AND accountid="${accountid}" AND password="${password}"`;
    let rows = await connon.select(sql);
    ctx.body = rows;
}
