/* 
通用工具函数 
*/
const log4js = require('./log4j')

const CODE = {
  SUCCESS: 200,
  PARAM_ERROR: 10001, // 修正拼写错误
  USER_ACCOUNT_ERROR: 20001,// 账号或密码错误
  USER_LOGIN_ERROR: 30001,// 用户未登录  token 没有检测到会报错
  BUSINESS_ERROR: 40001,// 业务请求失败
  AUTH_ERROR: 500001, // 认证失败或TOKEN过期
}


module.exports = {
  /*
   * 分页结构封装
   * @param {number} pageNum 当前页码
   * @param {number} pageSize 每页条数
   */
  pager({ pageNum = 1, pageSize = 10 } = {}) {
    // 添加空对象默认值
    // 保持原有乘法转换但增加安全校验
    pageNum = isNaN(pageNum * 1) ? 1 : pageNum * 1
    pageSize = isNaN(pageSize * 1) ? 10 : pageSize * 1
    const skipIndex = (pageNum - 1) * pageSize
    return {
      page: { pageNum, pageSize },
      skipIndex,
    }
  },
  success(data = null, msg = '操作成功', code = CODE.SUCCESS) {
    log4js.debug(`成功响应：${msg}`) // 优化日志格式
    return { code, data, msg }
  },
  fail(msg = '请求失败', code = CODE.BUSINESS_ERROR, data = null) {
    log4js.error(`[${code}] ${msg}`) // 增强错误日志
    return { code, data, msg }
  },
  CODE
}
