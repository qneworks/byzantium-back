const Router = require('koa-router');
const model = require('./model');
const router = new Router();

// 관리자 로그인
router.post('/signin', model.signin);

// 토큰 생성
router.get('/tronTest', model.tronTest);

// 토큰 생성
router.get('/createToken', model.createToken);

// 지갑 정보확인
//router.post('/getAccount', model.getAccount);

module.exports = router;