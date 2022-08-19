const mailer = require('nodemailer');
const config = require('../config/config');
const lang = require('../config/lang');

// 메일 전송 객체 생성
const createMailer = async () => {
  return mailer.createTransport({
    service: config.mail.service,
    port: config.mail.port,
    host: config.mail.host,
    auth: {
      user: config.mail.user,
      pass: config.mail.pass,
    },
  });
};

// 메일 옵션
const setMailerOption = async (to, newPw) => {
  return {
    from: config.mail.from,
    to: to,
    subject: lang.MAIL.SUBJECT,
    html: lang.MAIL.CONTENT(newPw),
  };
};

// 메일 전송
module.exports.sendMail = async (accountid, newPw) => {
  let mailer = await createMailer();
  let option = await setMailerOption(accountid, newPw);

  mailer.sendMail(option, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log(info.response);
    }
  });
  mailer.close();
}