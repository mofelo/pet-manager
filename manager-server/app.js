// 配置 module-alias
require('module-alias/register');
require('module-alias')({
    alias: {
        '@': __dirname // 将 @ 指向项目根目录
    }
});

// 加载环境变量
const dotenv = require('dotenv');
dotenv.config();

// 引入必要的模块
const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const log4js = require('./utils/log4j');
const Router = require('koa-router');
const connectToDatabase = require('./config/db');
const jwt = require('jsonwebtoken');
const koajwt = require('koa-jwt');
const pets = require('./routes/pet');
const adoptions = require('./routes/adoptions');
const userRoutes = require('./routes/users');
const menuRoutes = require('./routes/menu');
const util = require('./utils/util');
// 引入 User 模型
const User = require('./models/userSchema'); 

// 初始化路由
const router = new Router();
router.prefix('/api');

// 数据库连接
connectToDatabase()
  .then(() => {
    log4js.info('数据库连接成功');
  })
  .catch(err => {
    log4js.error('数据库连接失败', err);
    process.exit(1);
  });

// 中间件配置
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text'],
  })
);
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));
app.use(
  views(__dirname + '/views', {
    extension: 'pug',
  })
);

// 增强版日志中间件
app.use(async (ctx, next) => {
  log4js.info(`Request Method: ${ctx.method}`);
  log4js.info(`Request URL: ${ctx.url}`);
  log4js.info(`get params: ${JSON.stringify(ctx.request.query)}`);
  log4js.info(`post params: ${JSON.stringify(ctx.request.body)}`);
  await next().catch(err => {
    if (err.status === 401) {
      ctx.body = util.fail('Token 验证失败', util.CODE.AUTH_ERROR);
    }
  });
});

// jwt 验证中间件
app.use(async (ctx, next) => {
  const token = ctx.request.header['authorization'];
  if (token) {
    try {
      const decoded = jwt.verify(token.replace('Bearer ', ''), 'petchong');
      const userId = decoded.userId;
      const user = await User.findById(userId);
      if (user) {
        ctx.state.user = user;
        ctx.state.userRole = user.role;
      } else {
        ctx.state.user = null;
        ctx.state.userRole = null;
      }
    } catch (error) {
      log4js.error('Token 验证出错:', error);
    }
  }
  await next();
});

app.use(
  koajwt({ secret: 'petchong' }).unless({
    path: [/^\/api\/users\/login/],
  })
);

// 新增 CORS 中间件
const cors = require('@koa/cors');
app.use(cors({ origin: ctx => ctx.request.header.origin, credentials: true }));

// 路由挂载
app.use(router.routes());
app.use(userRoutes.routes()).use(userRoutes.allowedMethods());
app.use(menuRoutes.routes()).use(menuRoutes.allowedMethods());
app.use(pets.routes()).use(pets.allowedMethods());
app.use(adoptions.routes()).use(adoptions.allowedMethods());
app.use(router.allowedMethods());

// 统一错误处理
app.on('error', (err, ctx) => {
  log4js.error(`[${ctx.status}] ${err.stack}`);
  ctx.body = { code: ctx.status, message: err.message };
});

// 启动应用
const port = process.env.PORT || 3000;
app.listen(port, () => {
  log4js.info(`Server is running on port ${port}`);
});

module.exports = app;