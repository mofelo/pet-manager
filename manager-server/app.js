// app.js

const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const log4js = require('./utils/log4j')
const Router = require('koa-router')
const connectToDatabase = require('./config/db')
const Pet = require('./models/petSchema')
const jwt = require('jsonwebtoken')
const koajwt = require('koa-jwt')
const pets = require('./routes/pet')
const adoptions = require('./routes/adoptions')
const userRoutes = require('./routes/users')
const menuRoutes = require('./routes/menu')
const util = require('./utils/util')

// 初始化路由
const router = new Router()
// const users = require('./routes/users');
const menu = require('./routes/menu') // 菜单路由

require('./routes/pet')(router) // 宠物路由
require('./routes/adoptions')(router) // 领养申请路由



// 导入菜单模型
const Menu = require('./models/menuSchema')

// 导入宠物模型
const createPetRouter = require('./routes/pet') // 导入函数
const petRouter = createPetRouter() // 调用函数创建router实例
app.use(petRouter.routes()).use(petRouter.allowedMethods())
const Router = require('koa-router')
const Pet = require('../models/petSchema')

const createPetRouter = () => {
  const router = new Router()
  router.prefix('/pet')

  // 定义路由...

  return router
}

module.exports = createPetRouter



// 导入领养申请模型
const Adoption = require('./models/adoptionSchema')

// 导入日志配置
log4js.info('日志配置成功')

// 连接数据库
connectToDatabase()
  .then(() => {
    log4js.info('数据库连接成功')
  })
  .catch(err => {
    log4js.error('数据库连接失败', err)
    process.exit(1)
  })

// 中间件加载顺序优化
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text'],
  })
)
app.use(json())
app.use(logger())

// 静态资源
app.use(require('koa-static')(__dirname + '/public'))

// 视图模板
app.use(
  views(__dirname + '/views', {
    extension: 'pug',
  })
)
// 增强版日志中间件
app.use(async (ctx, next) => {
  log4js.info(`Request Method: ${ctx.method}`)
  log4js.info(`Request URL: ${ctx.url}`)
  log4js.info(`get params: ${JSON.stringify(ctx.request.query)}`)
  log4js.info(`post params: ${JSON.stringify(ctx.request.body)}`)
  await next().catch(err => {
    if (err.status === '401') {
      ctx.body = util.fail('Token 验证失败', util.CODE.AUTH_ERROR)
    }
  })
})

// jwt 验证中间件
app.use(async (ctx, next) => {
  const token = ctx.request.header['authorization']
  if (token) {
    try {
      const decoded = jwt.verify(token.replace('Bearer ', ''), 'petchong')
      const userId = decoded.data.userId
      const user = await User.findById(userId)
      if (user) {
        ctx.state.user = user
        ctx.state.userRole = user.role
      } else {
        ctx.state.user = null
        ctx.state.userRole = null
      }
    } catch (error) {
      log4js.error('Token 验证出错:', error)
    }
  }
  await next()
})

app.use(
  koajwt({ secret: 'petchong' }).unless({
    path: [/^\/api\/users\/login/],
  })
)

// 应用路由
app.use(router.routes()).use(router.allowedMethods())

// 统一错误处理
app.on('error', (err, ctx) => {
  log4js.error(`[${ctx.status}] ${err.stack}`)
  ctx.body = { code: ctx.status, message: err.message }
})

// 初始化路由后立即连接数据库（保留单实例）
connectToDatabase()
  .then(() => log4js.info('数据库连接成功'))
  .catch(err => {
    log4js.error('数据库连接失败', err)
    process.exit(1)
  })

// 中间件顺序调整（移除重复配置）
app.use(bodyparser({ enableTypes: ['json', 'form', 'text'] }))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))
app.use(views(__dirname + '/views', { extension: 'pug' }))

// 新增CORS中间件
const cors = require('@koa/cors')
app.use(cors({ origin: ctx => ctx.request.header.origin, credentials: true }))

// 合并增强版日志中间件
app.use(async (ctx, next) => {
  log4js.info(`Request Method: ${ctx.method}`)
  log4js.info(`Request URL: ${ctx.url}`)
  await next().catch(err => {
    if (err.status === 401) {
      ctx.body = util.fail('Token验证失败', util.CODE.AUTH_ERROR)
    }
  })
})

// 优化JWT验证中间件
app.use(async (ctx, next) => {
  const token = ctx.request.header['authorization']
  if (token) {
    try {
      const decoded = jwt.verify(token.replace('Bearer ', ''), 'petchong')
      ctx.state.user = await User.findById(decoded.data.userId)
      ctx.state.userRole = ctx.state.user?.role
    } catch (error) {
      log4js.error('Token验证出错:', error)
      ctx.throw(401, '无效令牌')
    }
  }
  await next()
})

// 统一路由配置（移除重复挂载）
router.prefix('/api')
app
  .use(router.routes())
  .use(userRoutes.routes())
  .use(menuRoutes.routes())
  .use(pets.routes())
  .use(adoptions.routes())
  .use(router.allowedMethods())

// 静态资源
app.use(require('koa-static')(__dirname + '/public'))

// 视图模板
app.use(
  views(__dirname + '/views', {
    extension: 'pug',
  })
)

// 增强版日志中间件
app.use(async (ctx, next) => {
  log4js.info(`Request Method: ${ctx.method}`)
  log4js.info(`Request URL: ${ctx.url}`)
  log4js.info(`get params: ${JSON.stringify(ctx.request.query)}`)
  log4js.info(`post params: ${JSON.stringify(ctx.request.body)}`)
  await next().catch(err => {
    if (err.status === '401') {
      ctx.body = util.fail('Token 验证失败', util.CODE.AUTH_ERROR)
    }
  })
})

// jwt 验证中间件
app.use(async (ctx, next) => {
  const token = ctx.request.header['authorization']
  if (token) {
    try {
      const decoded = jwt.verify(token.replace('Bearer ', ''), 'petchong')
      const userId = decoded.data.userId
      const user = await User.findById(userId)
      if (user) {
        ctx.state.user = user
        ctx.state.userRole = user.role
      } else {
        ctx.state.user = null
        ctx.state.userRole = null
      }
    } catch (error) {
      log4js.error('Token 验证出错:', error)
    }
  }
  await next()
})

app.use(
  koajwt({ secret: 'petchong' }).unless({
    path: [/^\/api\/users\/login/],
  })
)

// API路由配置
router.prefix('/api')

// 挂载用户路由
app.use(userRoutes.routes()).use(userRoutes.allowedMethods())

// 挂载菜单路由
app.use(menuRoutes.routes()).use(menuRoutes.allowedMethods())

// 挂载宠物路由
app.use(pets.routes()).use(pets.allowedMethods())

// 挂载领养申请路由
app.use(adoptions.routes()).use(adoptions.allowedMethods())

// 应用路由
app.use(router.routes()).use(router.allowedMethods())

// 统一错误处理
app.on('error', (err, ctx) => {
  log4js.error(`[${ctx.status}] ${err.stack}`)
  ctx.body = { code: ctx.status, message: err.message }
})

// 启动应用
const port = process.env.PORT || 3000
app.listen(port, () => {
  log4js.info(`Server is running on port ${port}`)
})

module.exports = app
