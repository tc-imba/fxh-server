const WIDTH = 320;
const HEIGHT = 240;
const IMAGE_SIZE = WIDTH * HEIGHT * 3;
const HEADER_SIZE = 14;
const INFO_SIZE = 40;
const FILE_SIZE = HEADER_SIZE + INFO_SIZE + IMAGE_SIZE;

module.exports = {
    bmp: (image_data) => {
        let new_image_data = Buffer.alloc(IMAGE_SIZE);
        for (let i = 0; i < WIDTH * HEIGHT; i++) {
            const RGB565 = image_data.readUInt16BE(i * 2);
            new_image_data.writeUInt8((RGB565 >> 11) << 3, i * 3);
            new_image_data.writeUInt8(((RGB565 & 0x7ff) >> 5) << 2, i * 3 + 1);
            new_image_data.writeUInt8((RGB565 & 0x1f) << 3, i * 3 + 2);
        }

        let buf = Buffer.alloc(FILE_SIZE);

        // Header (14 bytes)
        buf.write('BM', 0x0000); // 文件类型，必须是0x4d42，即字符串"BM"
        buf.writeUInt32LE(FILE_SIZE, 0x0002); // 整个文件大小
        buf.writeUInt32LE(0, 0x0006); // 保留字，为0
        buf.writeUInt32LE(HEADER_SIZE + INFO_SIZE, 0x000A); // 从文件头到实际的位图图像数据的偏移字节数

        // Info (40 bytes)
        buf.writeUInt32LE(INFO_SIZE, 0x000E); // 本结构的长度，值为40
        buf.writeInt32LE(WIDTH, 0x0012); // 图像的宽度是多少象素
        buf.writeInt32LE(HEIGHT, 0x0016); // 图像的高度是多少象素
        buf.writeUInt16LE(1, 0x001A); // 必须是1
        buf.writeUInt16LE(24, 0x001C); // 表示颜色时用到的位数，常用的值为1(黑白二色图)、4(16色图)、8(256色图)、24(真彩色图)
        buf.writeUInt32LE(0, 0x001E); // BI_BITFIELDS (565)
        buf.writeUInt32LE(IMAGE_SIZE, 0x0022); // 指定实际的位图图像数据占用的字节数
        buf.writeUInt32LE(0, 0x0026);
        buf.writeUInt32LE(0, 0x002A);
        buf.writeUInt32LE(0, 0x002E);
        buf.writeUInt32LE(0, 0x0032);

        // Image Data
        new_image_data.copy(buf, 0x0036);
        return buf;
    }
};



