const path = require("path");
const webpack = require("webpack");
const dir = dir => path.resolve(__dirname, "..", dir);
const genWbpackConfigENVwithNODEenv = (env, debug = true) => {
  return {
    plugins: [
      new webpack.DefinePlugin({
        __ENV__: JSON.stringify(env),
        __DEBUG__: debug
      })
    ]
  };
};

exports.filenamep = "zhidaokp";
exports.chunkhash = ".[chunkhash]"; // hash值 .[chunkhash].child
exports.contenthash= '.[contenthash]'
exports.PUBLIC_PATH = "/webstatic/"; //传到服务器路径
exports.dir = dir;
exports.genENV = genWbpackConfigENVwithNODEenv;
