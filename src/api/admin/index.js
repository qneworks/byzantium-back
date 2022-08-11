const Router = require('koa-router');
const model = require('./model');
const router = new Router();

// 관리자 로그인
router.post('/login', model.login);

module.exports = router;