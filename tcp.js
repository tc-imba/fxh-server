const net = require('net');
const Data = require('./data');

const HOST = '192.168.0.121';
const PORT = 6969;

let last_sock = null;

// 创建一个TCP服务器实例，调用listen函数开始监听指定端口
// 传入net.createServer()的回调函数将作为”connection“事件的处理函数
// 在每一个“connection”事件中，该回调函数接收到的socket对象是唯一的
net.createServer(function (sock) {

    // 我们获得一个连接 - 该连接自动关联一个socket对象
    console.log('CONNECTED: ' +
        sock.remoteAddress + ':' + sock.remotePort);
    last_sock = sock;

    // 为这个socket实例添加一个"data"事件处理函数
    sock.on('data', async function (data) {
        console.log('DATA ' + sock.remoteAddress + ': ' + data);
        try {
            data = JSON.parse(data);
            console.log(data);
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

        // 回发该数据，客户端将收到来自服务端的数据
        //sock.write('You said "' + data + '"');
    });

    // 为这个socket实例添加一个"close"事件处理函数
    sock.on('close', function (data) {
        console.log('CLOSED: ' +
            sock.remoteAddress + ' ' + sock.remotePort);
        last_sock = null;
    });

}).listen(PORT, HOST);

console.log('TCP server listening on ' + HOST + ':' + PORT);

module.exports = {
    water: () => {
        if (last_sock) {
            try {
                last_sock.send('water');
                console.log('TCP water: success');
            } catch (e) {
                console.log('TCP water: error (', e, ')');
            }
        } else {
            console.log('TCP water: no connection');
        }
    }
};