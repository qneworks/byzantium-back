const Router = require('koa-router');
const model = require('./model');
const router = new Router();

// 관리자 로그인
router.post('/signin', model.signin);

// 계좌정보 수정
router.get('/bank_info', model.bankinfo);

// 계좌정보 수정
router.patch('/bank_modify', model.bankModify);

// 주문확인
router.get('/trans', model.order);

// 회원현황
router.get('/membership', model.membership);






// 트론 테스트
router.get('/tronTest', model.tronTest);

module.exports = router;