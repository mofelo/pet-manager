const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: Number, required: true, unique: true },
  userName: { type: String, required: true, unique: true },
  userPwd: { type: String, required: true },
  userEmail: { type: String, required: true, unique: true },
  state: { type: Number, default: 1 }, // 1: active, 2: inactive
  role: { type: Number, default: 1 }, // 1: user, 0: admin
  // 其他字段...
});

module.exports = mongoose.model('User', userSchema); 