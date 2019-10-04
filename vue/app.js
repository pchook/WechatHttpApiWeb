const log = console.log, ls = localStorage
,host = 'http://127.0.0.1:14080'

async function json(api, body = {}) {
    if(!ls.token)return {msg:'token invalid'}
    const res = await fetch(host + api, {
        method: 'post',
        body: JSON.stringify(body)
    }), data = await res.json()
    return data
}
async function getToken(url, body = {}) {
    body.token = ls.token
    const res = await fetch(ls.host + url, {
        method: 'post',
        body: JSON.stringify(body)
    })
        , data = await res.json()
    if (data.msg == 'need token') {
        await Vue.$messagebox.confirm('是否前往登录?', '需要登录')
        //location.href=''
        alert('lo')
    }
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
    methods: {
        handleClick: function () {
            this.$Message.info('Clicked ok');
        }
        , downClick: async function () {
            await this.$Modal.confirm({
                title: '提示', content: '确认要下载吗？'
                , ok() {
                    this.$Message.info('Clicked ok');
                },
                on() {
                    this.$Modal.success({ title: '提示', content: '正在下载...' });
                }
            })
        }
        , getGroup: async function () {
            this.data1 = await json('guest/group?id=666')
        }
    }
})
render()