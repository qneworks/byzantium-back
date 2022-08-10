const Koa = require("koa");
const Router = require("koa-router");
const user = require("./user");
const admin = require("./admin");

const app = new Koa();
const router = new Router();

router.use("/user", user.routes());
router.use("/admin", admin.routes());
app.use(router.routes()).use(router.allowedMethods());

module.exports = router;
