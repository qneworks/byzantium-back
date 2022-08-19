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