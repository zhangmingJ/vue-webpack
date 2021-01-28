const pathConfig = require("./webpack.path.config");
const webpack = require("webpack");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HappyPack = require("happypack");
const PUBLIC_PATH = "/";
const theme = require('../package.json').theme;

let baseConfig = {
  mode: "development",
  entry: [
    "webpack-hot-middleware/client?reload=true&path=/__webpack_hmr",
    pathConfig.dir("./src/main.js"),
    pathConfig.dir("./public/dll/vendor.dll.js")
  ],
  output: {
    path: __dirname + "/",
    publicPath: PUBLIC_PATH,
    filename: "[name].js",
    chunkFilename: "[id].js"
  },
  devtool: "inline-source-map",
  context: __dirname,
  module: {
    rules: [
      {
        test: /\.vue$/,
        include: pathConfig.dir("./src"),
        use: "vue-loader"
      },
      {
        // .js .jsx用babel解析
        test: /\.(js|jsx)?$/,
        use: ["happypack/loader"],

        include: pathConfig.dir("./src")
      },
      {
        // .css 解析
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            // options: {
            //   plugins: [require("autoprefixer")()]
            // }
            options:{
              ident:'postcss',
              plugins:()=>[
                require("autoprefixer")({
                  browsers: [
                      '>1%',
                      'last 4 versions',
                      'Firefox ESR',
                      'not ie < 9', 
                  ],
                  flexbox: 'no-2009',
                })
              ]
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: 'html-loader'
    }, 
      {
        // .less 解析 (用于解析antd的LESS文件)
        test: /\.less$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options:{
              ident:'postcss',
              plugins:()=>[
                require("autoprefixer")({
                  browsers: [
                      '>1%',
                      'last 4 versions',
                      'Firefox ESR',
                      'not ie < 9', 
                  ],
                  flexbox: 'no-2009',
                })
              ]
            }
          },
          { loader: "less-loader", options: {modifyVars: theme, javascriptEnabled: true } }
        ],
        include: pathConfig.dir("./node_modules")
      },
      {
        // .less 解析
        test: /\.less$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options:{
                ident:'postcss',
                plugins:()=>[
                  require("autoprefixer")({
                    browsers: [
                        '>1%',
                        'last 4 versions',
                        'Firefox ESR',
                        'not ie < 9', 
                    ],
                    flexbox: 'no-2009',
                  })
                ]
              }
          },
          { loader: "less-loader", options: { javascriptEnabled: true } }
        ],
        include: pathConfig.dir("./src")
      },
      {
        // 文件解析
        test: /\.(eot|woff|otf|ttf|woff2|appcache|mp3|mp4|pdf)(\?|$)/,
        include: pathConfig.dir("./src"),
        use: ["file-loader?name=assets/[name].[ext]"]
      },
      {
        // 图片解析
        test: /\.(png|jpg|gif|svg)(\?|$)/,
        include: pathConfig.dir("./src"),
        use: ["url-loader?name=assets/[name].[ext]"]
      }
    ]
  },

  plugins: [
    new VueLoaderPlugin(),
    // 进度bar
    new ProgressBarPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      "process.env": JSON.stringify({ PUBLIC_URL: PUBLIC_PATH }),
      __DEBUG__: true
    }),
    new webpack.DllReferencePlugin({
      context: pathConfig.dir("./webpack"),
      manifest: pathConfig.dir("./public/dll/vendor-manifest.json")
    }),
    new HappyPack({
      loaders: ["babel-loader"]
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: pathConfig.dir("./public/index.ejs"),
      inject: true,
      templateParameters: {
        dll: "<script src='/dll/vendor.dll.js'></script>",
        manifest: ""
      }
    })
  ],
  resolve: {
    extensions: [".js", ".jsx", ".less", ".css"], //后缀名自动补全
    alias: {
      src: pathConfig.dir("./src"),
      util: pathConfig.dir("./src/util"),
      store: pathConfig.dir("./src/store"),
      config: pathConfig.dir("./src/config"),
      view: pathConfig.dir("./src/view"),
      assets: pathConfig.dir("./src/assets"),
      components: pathConfig.dir("./src/components"),
      router: pathConfig.dir("./src/router")
    }
  }
};

module.exports = baseConfig;
