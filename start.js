const Koa = require('koa');
const Router = require('koa-router');
const glob = require("glob");
const logger = require('koa-logger');
const { resolve } = require('path');
const fs = require('fs');
var Mock = require('mockjs');

const app = new Koa();
const router = new Router({prefix: '/api'});
const routerMap = {};  // 存放路由映射

app.use(logger());

// 注册路由
glob.sync(resolve('./data', "**/*.json")).forEach((item, i) => {
  let apiJsonPath = item && item.split('/data')[1];
  let apiPath = apiJsonPath.replace('.json', '');

  router.get(apiPath, (ctx, next) => {
    try {
      let jsonStr =  Mock.mock(fs.readFileSync(item).toString());
      // 自定义响应体
      ctx.body = {
        data: Mock.mock(JSON.parse(jsonStr)),
        code: 200,
        message: 'success'
      }
    }catch(err) {
      ctx.throw('服务器错误', 500);
    }
  });

  // 记录路由
  routerMap[apiJsonPath] = apiPath;
});

fs.writeFile('./routerMap.json', JSON.stringify(routerMap, null , 4), err => {
  if(!err) {
    console.log('路由地图生成成功');
  }
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3006,(res)=>{
  console.log('mock 服务启动成功 => port : 3006');
});


