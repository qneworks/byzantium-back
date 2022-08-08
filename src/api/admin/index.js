const Router = require('koa-router');
const controller = require('./admin.controller');
const router = new Router();

// 관리자 로그인
router.post('/login', controller.login);

module.exports = router;