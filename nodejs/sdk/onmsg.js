const log = console.log
    , fs = require('fs')
function onmsg(datas) {
    //对消息数组进行处理
    for (let o of datas) {
        if (o.type != 1) continue//不是文本消息直接跳过
        log(`收到(${o.wxid})的文本消息`, o.msg)
        write(`[${o.wxid}][${o.sender}]:${o.msg}`)
    }
    //返回值会在运行情况中的onmsg字段显示
    //可以返回处理成功的记录等,内容尽量短
    return '已处理数量:' + datas.length
}
//消息写到文件里看看
function write(msg) {
    fs.appendFile(`msg.${time()}.txt`, msg + '\r\n\r\n', function () { });
}
function time() {
    var now = new Date();
    var y = now.getFullYear();
    var m = now.getMonth() + 1;
    var d = now.getDate();
    return `${y}${m < 10 ? "0" + m : m}${d < 10 ? "0" + d : d}`
}
module.exports = onmsg