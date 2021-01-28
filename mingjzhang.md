## 构建步骤

### 1.安装依赖模块

```
npm install/yarn install
会生成node_modules文件夹，并将相关文件下载到node_modules文件夹中

```

### 2. 开发前公共依赖资源预编译(代码已经自动完成了,没必要提前编译了)

```
npm run dll/yarn dll

```

### 3. 本地开发环境

```
npm run start/yarn start

```
### 4. 打包到线上环境（包括生产和测试环境）

```

npm run build/yarn build # 快速打包 60s
npm run build:prod/yarn build:prod # 生产 200s
npm run build:analysis/yarn build:analysis # 可以查看打包大小
npm run build:all/yarn build:all # 生产加可以查看打包大小

```

#### build 之后可以本地预览，

```
npm run server/yarn server

```

### 其他

```
手动在 chrome 打开 http://localhost:8080

```

## 知识框架

```
前端框架：react
脚手架: UI:antd; Router:react-router; Redux:react-redux(rematch); Tttp:axios; Chart:bizcharts; Map:baiduMap;

```

## 项目结构及说明
```bash
├── a           入口html
├── b              入口html 
	├── c             入口html
	├── d	        入口html
	├── d               入口html
		├── d														入口html
		├── d												入口html
			├── d       	                              入口html
			├── d              												入口html 
				├── d    	            入口html
				├──  d    	        入口html
					├── d	  							入口html
						├── d                 			  入口html
						├── d        							  入口html
				├── d    	        入口html
				├── d    	        		入口html
				├── d    	        		入口html
	├── d           入口html
	├── d        入口html
	├── d           入口html
├──  d   入口html	  	
	 
```