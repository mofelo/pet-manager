/*
 * 数据库连接
 *
 */

const mongoose = require('mongoose');
const config = require('./index');
const log4js = require('./../utils/log4j');

async function connectToDatabase() {
  try {
    // 连接到 MongoDB 数据库
    await mongoose.connect(config.URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const db = mongoose.connection;

    // 监听数据库连接事件
    db.on('error', (err) => {
      log4js.error('****数据库连接失败', err);
      mongoose.disconnect(); // 如果连接失败，断开连接
    });

    db.on('connected', () => {
      log4js.info('***数据库连接成功***');
    });

    db.on('disconnected', () => {
      log4js.info('***数据库连接断开***');
      // 自动重连逻辑
      mongoose
        .connect(config.URL, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        })
        .catch((reconnectErr) => {
          log4js.error('重新连接数据库失败:', reconnectErr);
        });
    });

    return db;
  } catch (error) {
    log4js.error('****数据库连接失败', error);
    throw error;
  }
}

// 导出连接方法
module.exports = connectToDatabase;