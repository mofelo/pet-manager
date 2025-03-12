const Router = require('koa-router')
const Pet = require('../models/petSchema')
const request = require('@/utils/request') // 导入请求模块

const router = new Router()
router.prefix('/pet')

// 获取宠物列表
router.get('/list', async ctx => {
  try {
    const params = ctx.request.query
    const pets = await request({
      url: '/pets/list',
      method: 'get',
      data: params,
      mock: true,
    })
    ctx.body = { status: 'success', data: pets }
  } catch (error) {
    ctx.body = { status: 'error', message: error.message }
  }
})

// 添加新宠物
router.post('/add', async ctx => {
  try {
    const newPet = ctx.request.body
    const savedPet = await request({
      url: '/pets/add',
      method: 'post',
      data: newPet,
    })
    ctx.body = { status: 'success', data: savedPet }
  } catch (error) {
    ctx.body = { status: 'error', message: error.message }
  }
})

// 更新宠物
router.put('/:id', async ctx => {
  try {
    const updatedPet = ctx.request.body
    const petId = ctx.params.id
    const savedPet = await request({
      url: `/pets/update/${petId}`,
      method: 'put',
      data: updatedPet,
    })
    ctx.body = { status: 'success', data: savedPet }
  } catch (error) {
    ctx.body = { status: 'error', message: error.message }
  }
})

// 删除宠物
router.delete('/:id', async ctx => {
  try {
    const petId = ctx.params.id
    await request({
      url: `/pets/delete/${petId}`,
      method: 'delete',
    })
    ctx.body = { status: 'success', message: '宠物已删除' }
  } catch (error) {
    ctx.body = { status: 'error', message: error.message }
  }
})

module.exports = router
