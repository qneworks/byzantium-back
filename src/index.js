const Koa = require('koa');
const Router = require('koa-router');
const api = require('./api');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

app.use(bodyParser());
router.use('/api', api.routes());
app.use(router.routes()).use(router.allowedMethods());

app.listen(8800, () => {
    console.log('Listening to port 8800');
});