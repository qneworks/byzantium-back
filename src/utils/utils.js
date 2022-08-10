//const mariadb = require('mariadb');
const mailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const moment = require("moment");

module.exports = {
  /*
    createPool() {
        const pool = mariadb.createPool({
            host: config.hostname,
            port: config.port,
            user: config.username,
            password: config.password,
            database: config.database,
            connectionLimit: config.limit
        });
        return pool
    },
    */
  createMailer() {
    return mailer.createTransport({
      service: config.mail.service,
      port: config.mail.port,
      host: config.mail.host,
      auth: {
        user: config.mail.user,
        pass: config.mail.pass,
      },
    });
  },
  setMailerOption(to, msg) {
    return {
      from: config.mail.from,
      to: to,
      subject: config.mail.subject,
      text: msg,
    };
  },
  makePassword(password) {
    return password;
    //return crypto.SHA256(password).toString();
  },
  makeToken(accountid, name) {
    const token = jwt.sign(
      {
        accountid: accountid,
        name: name,
        //exp: Date.now() +1000 * 60 * 60 * 24 // 24시간
        exp: Date.now() +1000 * 60 * 60 * 10
      },
      config.jwt.secretKey
    );
    return token;
  },
  verifyToken(ctx, key) {
    let loginId = ctx.cookis.get('loginId');
    let token = ctx.cookis.get('token');

    let deCode = jwt.verify(token, key);
    let exp = deCode.exp;
    let id = deCode.accountid;

    if (exp < Date.now()) {
      return {result : false, msg : "토근 만료"};
    }
    if (loginId !== id) {
      return {result : false, msg : "ID 불일치"};
    }

    return {result : true, msg : "정상"};
  }
};
