const Router = require('koa-router');
const connAdmin = require('../admin/admin.js')
const connUser = require('../user/user.js')
const api = new Router();



// 관리자 로그인
api.post('/admin/login', connAdmin.login);





// 사용자 로그인
api.post('/user/login', connUser.login);

// 사용자 회원가입
api.post('/user/signup', connUser.signup);

// 사용자 비밀번호 찾기
api.post('/user/findPw', connUser.findPw);


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