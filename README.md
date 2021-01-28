# 提供功能

- PWA、代码分割、HMR 热替换、dllPlugin 静态资源预编译、HappyPack 多线程构建、ES6+语法等

## 构建步骤

### 1.安装依赖模块

```
npm install/yarn install
```

### 2. 开发前公共依赖资源预编译(代码已经自动完成了,没必要提前编译了)

```
npm run dll/yarn dll
```

### 3. 本地开发环境

```
npm run start/yarn start
# 切换环境到 config/envrionment.js 中修改相应的环境值
```

### 4. 打包到线上环境（包括生产和测试环境）

```bash
npm run build/yarn build # 快速打包 60s
npm run build:prod/yarn build:prod # 生产 200s
npm run build:analysis/yarn build:analysis # 可以查看打包大小
npm run build:all/yarn build:all # 生产加可以查看打包大小
```

#### build 之后可以本地预览，

本地会自动 jsonp 调用 Test.htm 的接口

```
npm run server/yarn server
```

```
一键格式化src、mock目录下的所有.jsx/.js/.css/.less文件
npm run prettier/yarn prettier
```

### 5. 打包并且提交 svn 和当前目录 src 文件夹内容

##### 需要手动创建 build-config.js
内容
```js
module.exports = { 
  javaGitBranch: "idas_V2019.01.30", // git 线上分支, 必须
  javaWebPackageName: "sdas-web"// java 存放前端代码的 web包, 必须
}; 

```

### 其他

手动在 chrome 打开 http://localhost:8080

## 更新日志

- 201901-25 18045835
  <br/>1. 修改 package.json 命令
  <br/>2. 修改 webpack 打包配置
  <br/>3. 修改 antd-theme 覆盖文件 antd-theme.less
  <br/>4. 修改路由,统一由一个 json 数组维护
  <br/>5. 加入 gulp,打包提交
  <br/>6. `src/routers`路由写法更改，改成维护一个数组
- 2019-01-21
  <br/>1.
- 2019-01-10
  <br/>1.修改 passport.js 缺少对接系统接口
  <br/>2.新增 doc 说明
- 2019-01-09
  <br/>1.引入了 rematch,轻度封装了 store,可以分 model 构建,提高开发速度不影响之前的开发方式
  <br/>2.路由升级到最新的 react-router4,修改页面的注入的方式
- 2019-01-07
  <br/>1.webpack 升级为 4.x，更新相关配置和插件修改
  <br/>2.babel 升级到 7, 相关插件也升级到最新版本
  <br/>3.HMR 热更新现在使用了 webpack-dev-middleware 和 webpack-hot-middleware 的配置方式
  <br/>4.开发环境加入了最新的 HappyPack 插件
  <br/>5.Eslint 现在会根据 pretter 风格进行代码检测，不符合的会在控制台输出 warning
  <br/>6.代码分割使用了 react-loadable,异步加载时有 loading 动画
  <br/>7.加入了 dllPlugin 静态资源预编译（仅开发环境生效）, 所以需要手动先 **npm run dll**，再 **npm run dev**

  <br/>8.babel-react eslint 插件目前使用 8.x 版本，9.0 与 prettier 格式化不符
  <br/>9.内置了 PWA 功能, webpack.prd.config.js 中的 PUBLIC\*PATH 和 public/manifest.json 中的 start_url 需保持一致
  <br/>10.React 新增到 16.6 版本,redux 升级到 4.0
  <br/>11.完全拷贝了 create-react-app 的 registerServiceWorker.js, 那个写得比较好。处理了开发环境和生产环境的差异。<br/>12.增加了 prettier 自动代码格式化，npm run prettier 将自动按照 prettier 风格对{src,mock}/\*\*/\_.{js,jsx,css,less}的文件进行格式化
  <br/>13.配置了 Antd 自定义主题所需的代码
  <br/>14.设置测试环境变量和配置，来方便开发
