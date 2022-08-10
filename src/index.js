const Koa = require('koa');
const Router = require('koa-router');
const api = require('./api');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

router.use('/api', api.routes());

app.listen(8800, () => {
    console.log('Listening to port 8800');
});