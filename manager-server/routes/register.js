// routes/register.js
const router = require('koa-router')();
const User = require('./../models/userSchema');
const utils = require('./../utils/util');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const log4js = require('./../utils/log4j');

router.prefix('/users');

router.post('/register', async (ctx) => {
    try {
        const { userName, userPwd } = ctx.request.body;
        const existingUser = await User.findOne({ userName });
        if (existingUser) {
            ctx.body = utils.fail("用户名已存在");
            return;
        }

        const hashedPassword = await bcrypt.hash(userPwd, 10);
        const newUser = new User({
            userName,
            userPwd: hashedPassword,
            role: 1
        });

        const savedUser = await newUser.save();
        const token = jwt.sign(
            {
                data: {
                    userId: savedUser._id,
                    userName: savedUser.userName,
                    role: savedUser.role
                }
            },
            'petchong',
            { expiresIn: '30m' }
        );

        ctx.body = utils.success({
            userInfo: {
                userId: savedUser._id,
                userName: savedUser.userName,
                role: savedUser.role
            },
            token
        });
    } catch (error) {
        log4js.error('用户注册出错:', error);
        ctx.body = utils.fail(error.message);
    }
});

module.exports = router;
