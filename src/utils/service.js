const jwt = require('jsonwebtoken');
const crypto = require('crypto-js');
const utils = require('./utils');
const config = require('../config/config');
const lang = require('../config/lang');

// 비밀번호 생성
exports.makePassword = (password, type) => {
  if (type === 'find') {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
    let randomstring = '';
    for (let i = 0; i < 6; i++) {
      const rnum = Math.floor(Math.random() * chars.length);
      randomstring += chars.substring(rnum, rnum + 1);
    }
    return randomstring;
  } else {
    return crypto.SHA256(password).toString();
    //return password;
  }
};

// 로그인 토큰 생성
exports.makeToken = async (accountid) => {
  return jwt.sign(
    {
      // 토큰으로 검증할 데이터
      accountid: accountid,
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
    returnData.msg = lang.JWS.EXPIRE;
  }
  if (loginId !== id) {
    returnData.code = '1';
    returnData.msg = lang.JWS.DISAGREEMENT;
  }

  returnData.code = '0';
  returnData.msg = lang.SUCCESS;
  return returnData;
};
