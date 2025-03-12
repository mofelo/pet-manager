/**
 * 维护宠物ID自增长表（原用户ID计数器改造）
 */
const mongoose = require('mongoose')

const counterSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    enum: ['petId', 'adoptionId'], // 支持多种ID类型
    default: 'petId',
  },
  sequence_value: {
    type: Number,
    default: 1000, // 宠物ID从1000开始自增
  },
})

// 添加静态方法用于获取下一个序列值
counterSchema.statics.getNextSequence = async function (name) {
  const ret = await this.findOneAndUpdate(
    { _id: name },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  )
  return ret.sequence_value
}

module.exports = mongoose.model('Counter', counterSchema, 'counters')
