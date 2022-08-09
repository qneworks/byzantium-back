//const mariadb = require('mariadb');
const mailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

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
      },
      config.jwt.secretKey
    );
    return token;
  },
};
