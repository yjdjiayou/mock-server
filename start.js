const Koa = require('koa');
const Router = require('koa-router');
const glob = require('glob');
const logger = require('koa-logger');
const { resolve } = require('path');
const fs = require('fs');
var Mock = require('mockjs');

const app = new Koa();
const router = new Router({ prefix: '/mock-server' });
const routerMap = {}; // 存放路由映射

app.use(logger());

// 注册路由
glob.sync(resolve(__dirname, './data', '**/*.js')).forEach((item, i) => {
  console.log('item=>', item);
let apiFilePath = item && item.split('/data')[1];
const moduleExport = require(item);
router.get(moduleExport.url, (ctx, next) => {
  try {
    // 自定义响应体
    ctx.body = {
      data: Mock.mock(moduleExport.template),
      code: 200,
      message: 'success',
    };
} catch (err) {
  ctx.throw('服务器错误', 500);
}
});

// 记录路由
routerMap[apiFilePath] = moduleExport.url;
});

fs.writeFile(resolve(__dirname, './routerMap.json'), JSON.stringify(routerMap, null, 4), err => {
  if (!err) {
  console.log('路由地图生成成功');
}
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(666, res => {
  console.log('mock 服务启动成功 => port : 666');
});
