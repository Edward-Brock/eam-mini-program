const fs = require('fs'); //引入nodejs fs文件模块

// 写文件
const writeFile = (path, data) => {
	// process.cwd()方法是流程模块的内置应用程序编程接口，用于获取node.js流程的当前工作目录。
	fs.writeFile(`${process.cwd()}${path}`, data, (err) => {
		if (err) throw err;
	});
}
//配置信息
const CONFIG = {
	// 开发环境
	'dev': {
		title: 'TITLE',
		baseURL: 'BASEURL'
	},
	// 生产环境
	'prod': {
		title: 'TITLE',
		baseURL: 'BASEURL'
	}
}

const env = process.env.NODE_ENV.replace(/\'/g, '').replace(' ', ''); //当前执行环境
const ITEM = CONFIG[env]; //当前环境的配置信息

// 修改project.config.json里面的appid
// fs.readFile(`${process.cwd()}/project.config.json`, (err, data) => {
//   if (err) throw err;
//   let _data = JSON.parse(data.toString());
//   _data.appid = ITEM.appid;
//   writeFile(`/project.config.json`, JSON.stringify(_data, null, 2));
// });

let configString = '';
Object.keys(ITEM).forEach(key => {
	configString += `module.exports.${key} = '${ITEM[key]}';\n`;
})
// 自动写入需要配置的config.js文件
writeFile(`/miniprogram/utils/config.js`, configString);
