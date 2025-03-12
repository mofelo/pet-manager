const Router = require('koa-router');
const Adoption = require('../models/adoptionSchema'); // 假设你有一个领养申请模型
const router = new Router();

router.prefix('/adoptions');

// 获取领养申请列表
router.get('/', async (ctx) => {
  try {
    const adoptions = await Adoption.find();
    ctx.body = { status: 'success', data: adoptions };
  } catch (error) {
    ctx.body = { status: 'error', message: error.message };
  }
});

// 审核领养申请
router.put('/:id', async (ctx) => {
  try {
    const updatedAdoption = await Adoption.findByIdAndUpdate(ctx.params.id, ctx.request.body, { new: true });
    ctx.body = { status: 'success', data: updatedAdoption };
  } catch (error) {
    ctx.body = { status: 'error', message: error.message };
  }
});

module.exports = router; 