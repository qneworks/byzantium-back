const Koa = require('koa');
const Router = require('koa-router');
const user = require('./user');
const admin = require('./admin');
const svc = require('../utils/service');

const app = new Koa();
const router = new Router();

// 로그인 토큰 검증
router.use('/', async (ctx, next) => {
    let path = ctx.path;

    // 경로에 user, admin 있을 때만...
    if (path.includes('user', 'admin')) {
        let res = await svc.verifyToken(ctx);
        if (res.code === "0") {
            await next();
        } else {
            ctx.body = res;
        }
    } else {
        await next();
    }
})

router.use('/user', user.routes());
router.use('/admin', admin.routes());
app.use(router.routes()).use(router.allowedMethods());

module.exports = router;
