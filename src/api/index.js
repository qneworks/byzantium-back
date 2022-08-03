const Router = require('koa-router');
const api = new Router();

// 응답 데이터
const rtnData = ctx => {
    ctx.body = {
        method : ctx.method,
        path : ctx.path,
        params : ctx.params
    }
}
const usrData = ctx => {
    ctx.body = {
        method : ctx.method,
        path : ctx.path,
        params : [{'name':'An', 'age':'10'}, {'name':'Bn', 'age':'20'}]
    }
}

// 응답 전송
api.post('/', rtnData);
api.post('/user', usrData);

module.exports = api;