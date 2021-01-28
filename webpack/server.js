const path = require("path");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const merge = require("webpack-merge");
const webpack = require("webpack");
const pathConfig = require("./webpack.path.config");
const webpackConfig = require("./webpack.dev.config.js");
const dllConfig = require("./webpack.dll.config.js");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const env = process.env.NODE_ENV;
const PORT = 8080;
const app = express();

if (!fs.existsSync(path.join(__dirname, "../public/dll/vendor.dll.js"))) {
  console.log("----不存在dll 公共资源目录, 将自动构建-----");
  webpack(dllConfig, function(err, stats) {
    if (err) throw new Error("webpack:dll build", err);
    console.log(stats.toString({ chunks: false, color: true }));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    // 本地预览模拟线上
    if (env === "production") {
      app.use(express.static("dist"));
      app.get("*", function(req, res) {
        res.sendFile(path.join(__dirname, "../dist", "index.html"));
      });
    } else {
      // 本地开发
      const compiler = webpack(webpackConfig);
      app.use(express.static("public"));
      app.use(
        webpackDevMiddleware(compiler, {
          // 挂载webpack小型服务器
          publicPath: webpackConfig.output.publicPath, // 对应webpack配置中的publicPath
          quiet: true, // 是否不输出启动时的相关信息
          stats: {
            colors: true, // 不同信息不同颜色
            timings: true // 输出各步骤消耗的时间
          }
        })
      );
      // 挂载HMR热更新中间件
      app.use(webpackHotMiddleware(compiler));
      // 所有请求都返回index.html
      app.get("*", (req, res, next) => {
        const filename = path.join(webpackConfig.output.path, "index.html");
        // 由于index.html是由html-webpack-plugin生成到内存中的，所以使用下面的方式获取
        compiler.outputFileSystem.readFile(filename, (err, result) => {
          if (err) {
            return next(err);
          }
          res.set("content-type", "text/html");
          res.send(result);
          res.end();
        });
      });
    }
    /** 启动服务 **/
    app.listen(PORT, () => {
      console.log(
        `本地服务启动地址: http://localhost:${PORT}${
          env === "production" ? "/webstatic" : ""
        }`
      );
    });
  });
} else {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  // 本地预览模拟线上
  if (env === "production") {
    app.use(express.static("dist"));
    app.get("*", function(req, res) {
      res.sendFile(path.join(__dirname, "../dist", "index.html"));
    });
  } else {
    // 本地开发
    const compiler = webpack(webpackConfig);
    app.use(express.static("public"));
    app.use(
      webpackDevMiddleware(compiler, {
        // 挂载webpack小型服务器
        publicPath: webpackConfig.output.publicPath, // 对应webpack配置中的publicPath
        quiet: true, // 是否不输出启动时的相关信息
        stats: {
          colors: true, // 不同信息不同颜色
          timings: true // 输出各步骤消耗的时间
        }
      })
    );
    // 挂载HMR热更新中间件
    app.use(webpackHotMiddleware(compiler));
    // 所有请求都返回index.html
    app.get("*", (req, res, next) => {
      const filename = path.join(webpackConfig.output.path, "index.html");
      // 由于index.html是由html-webpack-plugin生成到内存中的，所以使用下面的方式获取
      compiler.outputFileSystem.readFile(filename, (err, result) => {
        if (err) {
          return next(err);
        }
        res.set("content-type", "text/html");
        res.send(result);
        res.end();
      });
    });
  }
  /** 启动服务 **/
  app.listen(PORT, () => {
    console.log(
      `本地服务启动地址: http://localhost:${PORT}${
        env === "production" ? "/webstatic" : ""
      }`
    );
  });
}
