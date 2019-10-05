# PC微信前端管理平台
>声明
>> + 本工具通过HTTP API接口方式管理PC微信,便捷高效管理信息
>> + 可用于归集信息整体及智能回复服务,提高生活生产效率
>> + 请勿用于非法用途，违者后果自负
>> + 请规范使用,切忌骚乱用户,发送频率限制3秒一条
>> + 共同营造良好的微信用户环境


> + 前端功能还很简陋,只能抽出点时间来做,欢迎大家提交完善代码


+ 演示地址：[https://pchook.github.io/WechatHttpApiWeb/vue/](https://pchook.github.io/WechatHttpApiWeb/vue/ "demo")

+ 代码地址：[https://github.com/pchook/WechatHttpApiWeb](https://github.com/pchook/WechatHttpApiWeb "GITHUB仓库")

> + 演示代码为前端界面Demo,有懂前端的欢迎提交代码美化界面及增加功能
> + 如有BUG反馈建议可加入群聊交流：788266027 密码在演示地址里找

[点击链接加入群聊【微信前端管理平台】](https://jq.qq.com/?_wv=1027&k=5tzz5cr "QQ群")

### 接口服务使用文档
##### 开启服务

在release中 [点击下载](https://github.com/pchook/WechatHttpApiWeb/releases "下载apiServer")
+ 适用于pc wechat 2.6.8.52 [下载2.6.8.52](https://objectstorage.ap-tokyo-1.oraclecloud.com/n/nrk1kfwvmooh/b/osc/o/weixin%2FWeChatSetup2.6.8.52.exe "wechat2.6.8.52")
+ 解压后运行 apiServer/WechatHttpApi.exe
+ 开启HttpApi接口服务，默认监听14080端口
+ api地址为：http://127.0.0.1:14080
+ 无法访问代表没有开启服务

##### 说明

+ 请放心使用,服务位于本机,与作者无任何通讯
+ 已开启跨域限制,防止其他网页获取您的wxid
+ 请开启相关防火墙以防止他人访问本机服务
+ 请确认从GitHub下载服务工具,勿使用其他修改破解版本
+ 以免运行异常或信息泄露

> ### API列表
#### 获取自己的wxid,为空代表没有登陆
```
/my
返回：
{"wxid":"weixin"}
可用于判断是否登陆
```
#### 获取好友列表,包括好友、群组、公众号
```
/user
返回：
[
    {
        "wxid": "filehelper",
        "nickName": "文件传输助手",
        "reMark": ""
    },
    {
        "wxid": "weixinguanhaozhushou",
        "nickName": "微信公众平台",
        "reMark": ""
    },
    {
        "wxid": "gh_f0a92aa7146c",
        "nickName": "微信收款助手",
        "reMark": ""
    }
]
```
#### 获取消息列表
```
/msg
可选参数：id=xxx
返回：
[
    {
        "id": 1,//每次启动时从1开始计算
        "time": 1570197934,//消息时间
        "type": 1,//类型，见底下附录，目前只解析文本
        "wxid": "weixin",//发送方,系统、群、公众号、好友等
        "sender": "",//群聊时的发送人
        "msg": "Hello World",//消息内容,类型为1时文本
        "membercount": "2"//消息参与人数,一般为2人,群聊为多人
    }
]
不提供参数时,返回距最后收到消息3分钟内的列表
提供id参数时，返回大于该id的最近3分钟的消息
```
#### 发消息
```
/send
参数：wxid=filehelper&msg=Hello
可选参数：atid=xxx
返回
{"wxid":"filehelper","msg":"Hello"}
群聊时艾特群员(艾特的消息内容里自己加入@名称 消息)
请规范使用,切忌骚乱用户,发送频率限制3秒一条
```
#### 获取群成员
```
/group
参数：groupid=xxx
返回：[{ "wxid":"id1","nickName": "name1"},{ "wxid":"id2","nickName": "name2"}
```
#### 获取token
```
http://140.238.32.85?wxid=filehelper
返回：{"wxid":"filehelper","token":"token"}
获取token有效期3天
```



## 附件

1. 消息类型

|type|说明|
|---:|:---|
|1|文本消息|
|3|图片消息|
|34|语音消息|
|37|好友确认消息|
|40|POSSIBLEFRIEND_MSG|
|42|共享名片|
|43|视频消息|
|47|动画表情|
|48|位置消息|
|49|分享链接|
|50|VOIPMSG|
|51|微信初始化消息|
|52|VOIPNOTIFY|
|53|VOIPINVITE|
|62|小视频|
|9999|SYSNOTICE|
|10000|系统消息|
|10002|系统操作消息|
