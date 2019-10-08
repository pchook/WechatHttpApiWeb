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
        var i = 0, port = 14080;
        while (i++ < 3) {
            //服务的会首先使用14080端口,被占用后依次递增
            //如果连续3个端口无法访问就不在继续了
            let p = port++
            if (!await CheckServer(p)) break//无法连接的端口,跳过
            let wxid = await CheckLogin(p)
            if (!wxid) break//检查是否已经登陆了,没登陆跳过
            if (!mywxs[p]) mywxs[p] = {}
            mywxs[p].wxid = wxid
            //获取token,并保存token,已经有了就不需要获取了
            if (!mywxs[p].token) mywxs[p].token = await GetToken(wxid)
            if (!mywxs[p].token) break
            //获取消息
            let datas = await GetMsg(p, mywxs[p].token, mywxs[p].id)
            //正常应该是数组,如果有msg,说明获取消息失败,先清空token试试
            if (datas.msg) mywxs[p].token = null
            //记下最新的id,通过这个id去获取最新消息
            if (datas[0]) mywxs[p].id = datas[0].id, onmsg(datas)
        }
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