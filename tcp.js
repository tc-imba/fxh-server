const net = require('net');
const Data = require('./data');
const fs = require('fs');
const bmp = require('./bmp');

//const HOST = '45.76.213.89';
const HOST = '192.168.0.121';
const PORT = 6969;

let last_sock = null;
let bmp_index = -1;
let bmp_buf = null;

// 创建一个TCP服务器实例，调用listen函数开始监听指定端口
// 传入net.createServer()的回调函数将作为”connection“事件的处理函数
// 在每一个“connection”事件中，该回调函数接收到的socket对象是唯一的
net.createServer(function (sock) {

    // 我们获得一个连接 - 该连接自动关联一个socket对象
    console.log('CONNECTED: ' +
        sock.remoteAddress + ':' + sock.remotePort);
    last_sock = sock;
    //bmp_index = -1;
    let prev_data = null;

    // 为这个socket实例添加一个"data"事件处理函数
    sock.on('data', async function (data) {
        console.log('DATA ' + sock.remoteAddress + ':' + sock.remotePort + ' ' + data);
        try {
            data = JSON.parse(data);
            console.log(data);
        } catch (e) {
            data = data.toString();
            if (data === 'bmpstart') {
                bmp_index = 0;
                bmp_buf = Buffer.alloc(320 * 240 * 2);
                const files = fs.readdirSync('imgs');
                files.forEach(file => fs.unlinkSync(file));
                console.log(data);
            } else if (data === 'bmpend') {
                bmp_index = -1;
                console.log(data);
            } else if (bmp_index >= 0 && bmp_index < 240) {
                const pieces = 3;
                const len = 320 * pieces * 2;
                if (data.length < len) {
                    if (data.length > 1300) {
                        prev_data = data;
                        return;
                    } else {
                        data = prev_data + data;
                    }
                }
                const buf = Buffer.from(data, 'base64');
                buf.copy(bmp_buf, 320 * pieces * 2 * bmp_index, 0, 320 * pieces * 2);
                const bmp_data = bmp.bmp(bmp_buf);
                fs.writeFileSync(`imgs/${bmp_index}.bmp`, bmp_data);
                ++bmp_index;
                console.log(bmp_index, buf.length, buf);
            } else {
                console.log('not parsed', data);
            }
            return;
        }
        try {
            data = new Data({
                humanity: data.Humanity || 0,
                temperature: data.Temp || 0,
                luminance: data.Luminance || 0,
                moisture: data.Soil_Mois || 0,
            });
            await data.save();
        } catch (e) {
            console.error(e);
        }
    });

    // 为这个socket实例添加一个"close"事件处理函数
    sock.on('close', function (data) {
        console.log('CLOSED: ' +
            sock.remoteAddress + ':' + sock.remotePort);
        last_sock = null;
        //bmp_index = -1;
    });

    sock.on('error', function (err) {
        console.log('ERROR: ' +
            sock.remoteAddress + ':' + sock.remotePort + ' ' + err);
    })

}).listen(PORT, HOST);

console.log('TCP server listening on ' + HOST + ':' + PORT);

module.exports = {
    send: (str) => {
        if (last_sock) {
            try {
                last_sock.write(str);
                console.log(`TCP send ${str}: success`);
            } catch (e) {
                console.log(`TCP send ${str}: error (${e})`);
            }
        } else {
            console.log(`TCP send ${str}: no connection`);
        }
    }
};