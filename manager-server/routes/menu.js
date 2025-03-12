const Router = require('koa-router');
const router = new Router();
const mongoose = require('mongoose');
const Menu = require('../models/menuSchema');
const log4js = require('../utils/log4j');
const logger = log4js.getLogger('menu-router');

// 添加默认菜单数据
const defaultMenus = [
  {
    name: '宠物管理',
    path: '/pet',
    component: 'Pet',
    icon: 'pie-chart',
    children: [
      {
        name: '宠物列表',
        path: '/pet/list',
        component: 'PetList',
        icon: 'files',
      },
      {
        name: '宠物展示',
        path: '/pet/cards',
        component: 'PetCards',
        icon: 'files',
      },
    ],
  },
];

// 检查并添加默认菜单数据
Menu.find({}, async (err, menus) => {
  if (menus.length === 0) {
    await Menu.insertMany(defaultMenus);
    logger.info('默认菜单数据已添加');
  }
});

// 获取所有菜单
router.get('/menu', async (ctx) => {
  try {
    logger.info('收到获取菜单列表的请求');
    const menus = await Menu.find();
    ctx.body = { status: 'success', data: menus };
  } catch (error) {
    logger.error('获取菜单列表失败', error);
    ctx.status = 500;
    ctx.body = { status: 'error', message: error.message };
  }
});

// 获取单个菜单
router.get('/menu/:id', async (ctx) => {
  try {
    logger.info(`收到获取菜单详情的请求，ID: ${ctx.params.id}`);
    const menu = await Menu.findById(ctx.params.id);
    if (!menu) {
      ctx.status = 404;
      ctx.body = { status: 'error', message: '菜单未找到' };
      return;
    }
    ctx.body = { status: 'success', data: menu };
  } catch (error) {
    logger.error('获取菜单详情失败', error);
    ctx.status = 500;
    ctx.body = { status: 'error', message: error.message };
  }
});

// 添加菜单
router.post('/menu', async (ctx) => {
  try {
    logger.info('收到添加菜单的请求', ctx.request.body);
    const newMenu = new Menu({
      name: ctx.request.body.name,
      path: ctx.request.body.path,
      component: ctx.request.body.component,
      icon: ctx.request.body.icon,
      children: ctx.request.body.children || [],
    });

    const savedMenu = await newMenu.save();
    ctx.status = 201;
    ctx.body = { status: 'success', data: savedMenu };
  } catch (error) {
    logger.error('添加菜单失败', error);
    ctx.status = 500;
    ctx.body = { status: 'error', message: error.message };
  }
});

// 更新菜单
router.put('/menu/:id', async (ctx) => {
  try {
    logger.info(`收到更新菜单的请求，ID: ${ctx.params.id}`, ctx.request.body);
    const updatedMenu = await Menu.findByIdAndUpdate(
      ctx.params.id,
      ctx.request.body,
      { new: true }
    );

    if (!updatedMenu) {
      ctx.status = 404;
      ctx.body = { status: 'error', message: '菜单未找到' };
      return;
    }

    ctx.body = { status: 'success', data: updatedMenu };
  } catch (error) {
    logger.error('更新菜单失败', error);
    ctx.status = 500;
    ctx.body = { status: 'error', message: error.message };
  }
});

// 删除菜单
router.delete('/menu/:id', async (ctx) => {
  try {
    logger.info(`收到删除菜单的请求，ID: ${ctx.params.id}`);
    const deletedMenu = await Menu.findByIdAndDelete(ctx.params.id);

    if (!deletedMenu) {
      ctx.status = 404;
      ctx.body = { status: 'error', message: '菜单未找到' };
      return;
    }

    ctx.body = { status: 'success', message: '菜单已删除' };
  } catch (error) {
    logger.error('删除菜单失败', error);
    ctx.status = 500;
    ctx.body = { status: 'error', message: error.message };
  }
});

// 通用错误处理中间件
router.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = 500;
    ctx.body = { status: 'error', message: err.message };
    logger.error('未捕获的错误', err);
  }
});

module.exports = router;