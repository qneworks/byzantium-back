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
    host : 'smtp.gmail.com',
    port : 587,
    secure : false,
    user : '',
    pass : '',

    // 전송 옵션
    from : '',
    subsject : '새로운 임시 비밀번호',
    
    // 메일 계정 정보
    service : 'Naver',
    host : 'smtp.naver.com',
    port : 465,
    secure : false,
    user : '',
    pass : '',

    // 전송 옵션
    from : '',
    subject : '새로운 임시 비밀번호',
    */
   // 메일 계정 정보
   service : 'Naver',
   host : 'smtp.naver.com',
   port : 465,
   secure : false,
   user : 'hit910@naver.com',
   pass : 'inteak152412@',

   // 전송 옵션
   from : 'hit910@naver.com',
   subsject : '새로운 임시 비밀번호',
  },
  jwt: {
    secretKey: '738c9f2a8bab78f34044879b2fd14c0a8f79c04a',
  },
};
