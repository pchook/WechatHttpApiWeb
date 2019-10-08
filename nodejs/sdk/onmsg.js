const log = console.log
function onmsg(datas) {
    //对消息数组进行处理
    for (let o of datas) {
        log(`收到(${o.wxid})的消息`, o.msg)
    }

}

module.exports = onmsg