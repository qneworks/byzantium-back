const Router = require('koa-router');
const conn = require('../database/user.js')
const api = new Router();

// 로그인
api.post('/login', conn.login);

// 회원가입
api.post('/signup', conn.signup);


/*
api.post('/login', (ctx) => {
    //console.log(ctx.request.body);
    //api.post('/user', usrData);
    conn.login(ctx.request.body).then((result) => {
        console.log(result);
        ctx.body = result;
    })
});
*/

module.exports = api;