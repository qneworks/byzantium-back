module.exports = {
  // DB 정보
  database: {
    hostname: 'qneworks.cxffxhtv6bbi.ap-northeast-2.rds.amazonaws.com',
    port: '3306',
    username: 'qneworks',
    password: 'qneworks1412!',
    database: 'byzantium',
    limit: 5,
  },
  // 메일 정보 AWS 메일서버
  mail: {
    /*
    // 메일 계정 정보
    service : 'gmail',
    port : 587,
    host : 'smtp.gmail.com',
    user : '',
    pass : '',

    // 전송 옵션
    from : '',
    
    // 메일 계정 정보
    service : 'Naver',
    port : 465,
    host : 'smtp.naver.com',
    user : '',
    pass : '',

    // 전송 옵션
    from : '',
    */
  },
  jwt: {
    secretKey: '738c9f2a8bab78f34044879b2fd14c0a8f79c04a',
  },
  tron: {
    secretKey: '738c9f2a8bab78f34044879b2fd14c0a8f79c04a',
    apiKey: '0e976043-a5f1-4f5c-872c-baec0a22990d',
    adminAddr: 'TTCn7Brdc41eGEPxUAN9NvmymRad5tTeR5' // base58
  }

};
