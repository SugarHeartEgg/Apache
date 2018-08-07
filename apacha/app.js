// 导入模板
let fs = require("fs");
let http = require("http");
let path = require("path");


//引入第三方模块  npm
const mime = require("mime");


// 记录网站根目录
let rootPath = (__dirname, "www"); //console.log(rootPath);

// 创建服务器
let server = http.createServer((request, response) => {
    // response.end("hello wold");
    // 生成地址
    let targetPath = path.join(rootPath, request.url);
    // 判断路径是否存在
    // 存在
    if (fs.existsSync(targetPath)) {
        // 文件还是文件夹
        fs.stat(targetPath, (err, stats) => {
            //是文件直接读取并返回
            if (stats.isFile()) {
                // console.log(mime.getType(targetPath));
                response.setHeader("ocontent-type", mime.getType(targetPath));
                fs.readFile(targetPath, (err, data) => {
                    // 数据读取完毕
                    response.end(data);
                })
            }
            // 是文件夹  就渲染出列表
            if (stats.isDirectory()) {
                // 读取文件夹信息
                fs.readdir(targetPath, (err, files) => {
                    let tem = '';
                    // 遍历
                    for (let i = 0; i < files.length; i++) {
                        tem += `
                        <li>
                            <a href="${request.url}${request.url=='/'?'':'/'}${files[i]}">${files[i]}</a>
                        </li>
                        `
                    }
                    // 读取完之后在返回
                    response.end(`
                    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
                    <html>
                    
                    <head>
                        <title>Index of/ </title>
                    </head>
                    
                    <body>
                        <h1>Index of ${request.url}</h1>
                        <ul>
                            ${tem}
                        </ul>
                    </body>
                    
                    </html>
                    `);
                })
            }
        });

    } else {
        // 不存在  404
        response.statusCode = 404;
        // 解决乱码
        response.setHeader("content-type", "text/html;charset=utf-8");
        response.end(`
        <!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
            <html><head>
            <title>404 Not Found</title>
            </head><body>
            <h1>Not Found</h1>
            <p>你请求的${request.url}不在服务器上!请检查一下哈!</p>
            </body></html>
        `);
    }
});
// 监听
server.listen(8989, "127.0.0.1", () => console.log("开启成功"));