const Router = require('koa-router');
const controller = require('./controller');
const router = new Router();

// 사용자 로그인
router.post('/login', controller.login);

// 사용자 회원가입
router.put('/signup', controller.signup);

// 사용자 아이디 찾기
router.get('/findId', controller.findId);

// 사용자 비밀번호 찾기
router.get('/findPassword', controller.findPassword);

module.exports = router;