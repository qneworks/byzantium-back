const svc = require('../../utils/service');
const maria = require('../../utils/mariaDB');
const lang = require('../../config/lang');
const tronweb = require('../../tronWeb/tronWeb');

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