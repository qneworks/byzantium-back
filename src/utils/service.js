const jwt = require('jsonwebtoken');
const crypto = require('crypto-js');
const utils = require('./utils');
const config = require('../config/config');

// 비밀번호 생성
exports.makePassword = (password, type) => {
  if (type === 'find') {
    const chars =
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
    let randomstring = '';
    for (let i = 0; i < 6; i++) {
      const rnum = Math.floor(Math.random() * chars.length);
      randomstring += chars.substring(rnum, rnum + 1);
    }
    return randomstring;
  } else {
    //return crypto.SHA256(password).toString();
    return password;
  }
};

// 로그인 토큰 생성
exports.makeToken = async (accountid, name) => {
  return jwt.sign(
    {
      accountid: accountid,
      name: name,
      exp: Date.now() + 1000 * 60 * 60 * 24,
    },
    config.jwt.secretKey
  );
};

// 로그인 토큰 검증
exports.verifyToken = async (ctx) => {
  let loginId = ctx.cookies.get('loginId');
  let token = ctx.cookies.get('token');

  let deCode = jwt.verify(token, config.jwt.secretKey);
  let exp = deCode.exp;
  let id = deCode.accountid;

  let returnData = utils.dataSet;
  if (exp < Date.now()) {
    returnData.code = '1';
    returnData.msg = '토큰이 만료되었습니다.';
  }
  if (loginId !== id) {
    returnData.code = '1';
    returnData.msg = '계정 정보가 일치하지 않습니다.';
  }

  returnData.code = '0';
  returnData.msg = '정상.';

  // test
  returnData.code = '1';
  returnData.msg = '토큰이 만료되었습니다.';
  return returnData;
};
