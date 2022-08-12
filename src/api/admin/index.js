const Router = require('koa-router');
const model = require('./model');
const router = new Router();

// 관리자 로그인
router.post('/signin', model.signin);

module.exports = router;