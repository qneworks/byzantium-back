/* eslint-disable no-undef */

/*******************************************************************
 * 디버깅시 console에 라인 표시를 위한 설정
 * *****************************************************************/
Object.defineProperty(global, '__stack', {
  get: function () {
    var orig = Error.prepareStackTrace;
    Error.prepareStackTrace = (_, stack) => stack;
    var err = new Error;
    Error.captureStackTrace(err, arguments.callee);
    var stack = err.stack;
    Error.prepareStackTrace = orig;
    return stack;
  }
});

Object.defineProperty(global, '__line', {
  get: () => __stack[1].getLineNumber()
});

Object.defineProperty(global, '__file', {
  get: () => __filename
});

// global.__debug = (filename, line) => {
//   const time = require('moment')().format('YYYY-MM-DD HH:mm:SS')
//   return `${filename}:${line}(${time})`
// };

Object.defineProperty(global, '__debug', {
  get: () => (filename, line) => {
    const time = require('moment')().format('YYYY-MM-DD HH:mm:SS')
    return `${filename}:${line}(${time})`
  }
});
/*********************************************************************/


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
  // console.log('Listening to port 8800');
  console.log(__debug(__filename, __line), 'Listening to port 8800')
});

/*
  Database, Koa 연동 BigInt 오류에 처리 방법
  https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/BigInt
  BigInt는 직렬화할 수 없기 때문에, JSON.stringify()에 BigInt를 포함한 값을 전달한다면 TypeError가 발생합니다.
  대신, 필요한 경우 자신만의 toJSON 메서드를 만들 수 있습니다.
*/
BigInt.prototype.toJSON = () => this.toString();