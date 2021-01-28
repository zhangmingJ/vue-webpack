const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const pathConfig = require("./webpack.path.config");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const TerserPlugin = require("terser-webpack-plugin");
const HappyPack = require("happypack");
const chalk = require("chalk");
const os = require("os");
const happyThreadPool = HappyPack.ThreadPool({size: os.cpus().length})
const theme = require('../package.json').theme;
const prdConfig = {
  mode: "production",
  devtool: 'cheap-module-source-map',
  entry: {
    app: pathConfig.dir("./src/main.js"),
  },
  
  output: {
    path: pathConfig.dir("./dist/webstatic"),
    publicPath: pathConfig.PUBLIC_PATH,
    filename: pathConfig.filenamep + "/[name]" + pathConfig.chunkhash + ".js",
    chunkFilename:
      pathConfig.filenamep + "/[name]" + pathConfig.chunkhash + ".js"
  },
  context: pathConfig.dir("./"),

  module: {
    rules: [
      {
        test: /\.vue$/,
        include: pathConfig.dir("./src"),
        use: "vue-loader"
      },
      {
        test: /\.(js|jsx)?$/,
        include: pathConfig.dir("./src"),
        use: "happypack/loader?id=babel"
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
        test: /\.(eot|woff|ttf|woff2|appcache|mp3|mp4|pdf)(\?|$)/,
        include: pathConfig.dir("./src"),
        use: ["file-loader?name=fonts/[name].[ext]"]
      },
      {
        // 图片解析
        test: /\.(png|jpg|gif|svg)$/,
        include: pathConfig.dir("./src"),
        use: ["url-loader?limit=8192&name=images/[name].[ext]"]
      }
    ]
  },

  plugins: [
  
    new VueLoaderPlugin(),
    //解决moment打包的时候把所有的语言都打包进去的问题
    new webpack.ContextReplacementPlugin(
      /moment[\\\/]locale$/,
      /^\.\/(zh-cn)$/
    ),  
   
    new HappyPack({
      id: 'babel', // 上面loader?后面指定的id
        loaders: ['babel-loader?cacheDirectory'], // 实际匹配处理的loader
        threadPool: happyThreadPool,
        // cache: true // 已被弃用
        verbose: true
    }),
    
    // 进度条
    new ProgressBarPlugin({
      format:
        "  build [:bar] " + chalk.green.bold(":percent") + " (:elapsed seconds)"
    }),
    new webpack.DefinePlugin({
      "process.env": JSON.stringify({
        PUBLIC_URL: pathConfig.PUBLIC_PATH + pathConfig.filenamep
      }),
      __DEBUG__: false
    }),
    /**
     * 打包前删除上一次打包留下的旧代码
     * **/
    new CleanWebpackPlugin(["dist"], {
      root: pathConfig.dir("./")
    }),
    /**
     * 提取CSS等样式生成单独的CSS文件
     * **/
    new MiniCssExtractPlugin({
      filename:pathConfig.filenamep + "/[name]" + pathConfig.chunkhash + ".css",
      chunkFilename:pathConfig.filenamep + "/[name]" + pathConfig.chunkhash + ".css"
    }),

    /**
     * 自动生成HTML，并注入各参数
     * **/
    new HtmlWebpackPlugin({
      filename: "../index.html", //生成的html存放路径，相对于 output.path
      template: pathConfig.dir("./public/index.ejs"), //html模板路径
      // chunks: ["app"],
      templateParameters: {
        //   // 自动替换index.ejs中的参数
        dll: "",
        manifest: ""
      },
     
      inject: true // 是否将js放在body的末尾
    }),
    // /**
    //  * 文件复制
    //  * 这里是用于把manifest.json打包时复制到/dist下 （PWA）
    //  * **/
    // new CopyWebpackPlugin([
    //   { from: "./public/manifest.json", to: "../manifest.json" }
    // ])
  ],

  resolve: {
    extensions: ["*", ".js", ".jsx", ".vue", ".less", ".css"], //后缀名自动补全
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
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: 'chunk-vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'initial'
        },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true
        }
      }
    },
    minimizer: [
      /* config.optimization.minimizer('terser') */
      new TerserPlugin({
        terserOptions: {
          ecma: undefined,
          warnings: false,
          parse: {},
          compress: {
            drop_console: true,
            drop_debugger: false,
            pure_funcs: ['console.log'], // 移除console
          },
        },
      }),
    ]
  },
};

// 分析
if (process.argv.includes("--analysis")) {
  prdConfig.plugins.push(new BundleAnalyzerPlugin());
}

// 去除 console.log,等操作
if (process.argv.includes("--terserconfig")) {
  console.log(123232)
  prdConfig.optimization = {
    minimizer: [
      new TerserPlugin({
        sourceMap: true, // Must be set to true if using source-maps in production
        terserOptions: {
          warnings: false,
          compress: {
            drop_console: true
          }
        }
      })
    ]
  };
}
module.exports = prdConfig;
