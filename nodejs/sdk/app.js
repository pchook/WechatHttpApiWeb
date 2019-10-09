const axios = require('axios')
    , delay = require('delay')
    , qs = require('qs')
    , onmsg = require('./onmsg')//消息处理函数
    , log = console.log
    , mywxs = {}
axios.interceptors.response.use(response => response)
async function run() {
    log('Start')
    while (true) {
        var i = 0, port = 14080, serverRun = {};
        while (i++ < 3) {
            //服务的会首先使用14080端口,被占用后依次递增
            //如果连续3个端口无法访问就不在继续了
            let p = port++
            if (!await CheckServer(p)) continue//无法连接的端口,跳过
            serverRun[p] = {}
            let wxid = await CheckLogin(p)
            if (!wxid) continue//检查是否已经登陆了,没登陆跳过
            if (!mywxs[p]) mywxs[p] = {}
            mywxs[p].wxid = wxid
            serverRun[p].wxid = wxid
            //获取token,并保存token,已经有了就不需要获取了
            if (!mywxs[p].token) mywxs[p].token = await GetToken(wxid)
            if (!mywxs[p].token) continue
            //获取消息
            let datas = await GetMsg(p, mywxs[p].token, mywxs[p].id)
            //正常应该是数组,如果有msg,说明获取消息失败,先清空token试试
            if (datas.msg) { log(datas.msg); mywxs[p].token = null; continue }
            //记下最新的id,通过这个id去获取最新消息
            //如果刚开始不存在id,忽略之前的消息,取最新的id来
            serverRun[p].id = mywxs[p].id || 0
            if (datas[0]) {
                mywxs[p].id = datas[0].id//最新消息的ID
                serverRun[p].num = datas.length//此次获取消息的长度
                serverRun[p].onmsg = `首次运行,忽略最新ID(${mywxs[p].id})之前的消息`
                if (!serverRun[p].id) continue//如果不存在旧消息id,说明是第一次,忽略运行前的消息     
                serverRun[p].onmsg = await onmsg(datas)//消息处理结果
                serverRun[p].id = mywxs[p].id
            }
        }
        log('运行情况', JSON.stringify(serverRun))
        await delay(3000)
    }
}
async function GetMsg(port, token, id = 0) {
    let msg = post(port, 'msg', { token, id })
    return msg
}
async function CheckLogin(port) {
    let d = await post(port, 'my');
    return d && d.wxid
}
async function CheckServer(port) {
    try {
        await axios.get(`http://127.0.0.1:${port}`, { timeout: 100 });
        return true
    } catch {
        delete mywxs[port]
        return false;
    }
}
async function post(port, api, data) {
    try {
        let response = await axios.post(`http://127.0.0.1:${port}/${api}`, qs.stringify(data));
        return response.data
    } catch (error) {
        log(error.message)
        return false;
    }
}
async function GetToken(wxid) {
    let url = 'http://140.238.32.85/?wxid=' + wxid
    try {
        let response = await axios.get(url);
        return response.data && response.data.token
    } catch (error) {
        log(error.message)
        return false;
    }
}
run()