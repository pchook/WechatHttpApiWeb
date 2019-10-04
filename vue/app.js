const log = console.log, ls = localStorage
    , host = 'http://127.0.0.1:14080'

async function json(api, data = {}) {
    if (!ls.token) return { msg: 'token invalid' }
    try {
        iview.Spin.show()
        let body = 'token=' + ls.token
        for (let k in data) body += '&' + k + '=' + data[k]
        const res = await fetch(host + api, {
            method: 'post', body
        })
        iview.Spin.hide()
        return await res.json()
    } catch (ex) {
        iview.Spin.hide()
        log(ex.message)
        return { msg: '请先启动服务' }
    }
}
async function getToken(wxid) {
    if (!wxid) return { msg: 'wxid invalid' };
    const res = await fetch('http://140.238.32.85?wxid=' + wxid)
        , data = await res.json()
    ls.token = data.token
    return data
}

new Vue({
    el: '#app',
    data: {
        wxid: 'tab-container1', introduction: 1, group: []
        , formItem: {
            wxid: 'filehelper'
            , atid: ''
            , groupid: ''
            , msg: 'Hello World'
            , pwd: 'pcwx'
        }
        , columns1: [
            {
                title: 'wxid',
                key: 'wxid'
            },
            {
                title: '昵称',
                key: 'nickName'
            },
            {
                title: '备注',
                key: 'reMark'
            }
        ],
        data1: [{ wxid: "filehelper", nickName: "文件传输助手", reMark: "" }]
    },
    mounted: function () { this.$Spin.show(); this.init() },
    methods: {
        init: async function () {
            let data, _this = this
            data = await json('/my')
            if (data.msg) return this.$Modal.error({
                title: '提示', content: data.msg, onOk: function () {
                    iview.Spin.show()
                    setTimeout(function () {
                        iview.Spin.hide()
                        _this.init()
                    }, 1000)
                }
            })
            data = await getToken(data.wxid)
            if (data.msg) return this.$Modal.error({
                title: '提示', content: data.msg, onOk: function () {
                    iview.Spin.show()
                    setTimeout(function () {
                        iview.Spin.hide()
                        _this.init()
                    }, 1000)
                }
            })
            this.$Spin.hide()
        },
        sendText: async function () {
            if (!this.formItem.wxid || !this.formItem.wxid) return this.$Message.info('请填写 wxid和消息')
            let data
            if (this.formItem.atid) {
                data = await json('/send', { wxid: this.formItem.wxid, msg: this.formItem.msg, atid: this.formItem.atid })
            } else {
                data = await json('/send', { wxid: this.formItem.wxid, msg: this.formItem.msg })
            }
            if (data.msg) return this.$Message.info(data.msg);
            this.$Message.info('发送成功');
        }
        , getMsg: async function () {
            let data
            data = await json('/msg')
            if (!data[0]) return this.$Message.info('暂无消息')
            let text = JSON.stringify(data, null, 4)
            this.$Message.info('<pre>' + text + '</pre>')
        }
        , getUser: async function () {
            let data
            data = await json('/msg')
            if (!data[0]) return this.$Message.info('未获取到通讯录')
            this.data1 = data;
        }
        , getGroup: async function () {
            let data
            if (!this.formItem.groupid) return this.$Message.info('请填写 群WXID');
            data = await json('/msg')
            if (!data[0]) return this.$Message.info('未找到群 ' + this.formItem.groupid)
            let text = JSON.stringify(data, null, 4)
            this.$Message.info('<pre>' + text + '</pre>')
        }
    }
})
render()