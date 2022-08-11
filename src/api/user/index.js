const Router = require('koa-router');
const model = require('./model');
const router = new Router();

// 사용자 로그인
router.post('/login', model.login);

// 사용자 회원가입
router.put('/signup', model.signup);

// 사용자 아이디 찾기
router.get('/findId', model.findId);

// 사용자 비밀번호 찾기
router.get('/findPassword', model.findPassword);


module.exports = router;