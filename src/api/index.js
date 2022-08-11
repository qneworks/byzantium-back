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

    // 검증이 필요한 애들.... 아직 화면이 없어서 비움..
    let pages = []
    if (pages.length > 0 && path.includes(pages)) {
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
