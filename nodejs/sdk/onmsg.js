const log = console.log
function onmsg(datas) {
    //对消息数组进行处理
    for (let o of datas) {
        if (o.type != 1) continue//不是文本消息直接跳过
        log(`收到(${o.wxid})的文本消息`, o.msg)
    }

}

module.exports = onmsg