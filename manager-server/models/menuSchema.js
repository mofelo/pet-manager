const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  menuId: { type: String, required: true, unique: true },
  parentId: { type: String, required: true, default: '0' },
  menuType: {
    type: String,
    required: true,
    enum: ['directory', 'menu', 'button'],
    default: 'menu',
  },
  menuName: { type: String, required: true },
  menuCode: { type: String, required: true, unique: true },
  path: { type: String, required: true },
  icon: { type: String, required: true, default: '' },
  order: { type: Number, required: true, default: 0 },
  component: { type: String, required: true },
  functionDescription: { type: String, required: true },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Menu' }],
});

// 添加索引
menuSchema.index({ menuId: 1 });
menuSchema.index({ parentId: 1 });

// 预处理
menuSchema.pre('save', function(next) {
  if (!this.menuId) {
    this.menuId = mongoose.Types.ObjectId().toString(); // 自动生成 menuId
  }
  next();
});

// 静态方法
menuSchema.statics = {
  async getTopLevelMenus() {
    return this.find({ parentId: '0' }).sort({ order: 1 });
  },
  async getMenuById(menuId) {
    return this.findById(menuId);
  },
};

module.exports = mongoose.model('Menu', menuSchema);