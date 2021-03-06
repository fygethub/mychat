let express = require('express');
app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

let webpack = require('webpack');
let config = require('./webpack.dev');
let compiler = webpack(config);
let logger = require('./node/service/logger')("index");
//也可以直接require
require('./node/service/logger');
let path = require('path');
let numUsers = 0;
let Users = [];
var cdr = require("child_process")
var webpackDevOptions = {
    noInfo: false,
    historyApiFallback: true,
    publicPath: config.output.publicPath,
    headers: {
        'Access-Control-Allow-Origin': '*',
    }

}



//var httpProxy = require('http-proxy');
//httpProxy.createProxyServer({target:'http://localhost:3000'}).listen(8080);






//提供静态文件服务，这样就能找到你的`js`文件
app.use(express.static(__dirname));
app.use(require('webpack-dev-middleware')(compiler,webpackDevOptions));
app.use(require('webpack-hot-middleware')(compiler));
//app.use(require('webpack-dev-server')(compiler,config.devServer));

app.all('*', function(req, res, next) {
    logger.info("通过设置头信息,同意跨域访问")
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    if (req.method == "OPTIONS") res.send(200); /*让options请求快速返回*/
    else next();
})

app.get('/', (req, res) => {
    //res.send('<h1>Hello world</h1>');//发送到页面
    logger.info("跳转到注册页面")
    res.sendFile(__dirname + '/dist/view/home.html');
})

/*用户连接以后*/
io.on('connection', function(socket) {
    var addedUser = false;
    logger.info("用户连接成功")

    //监听客户端添加用户的时候
    socket.on('add user', function(usermsg) {
        var username = usermsg.username,
            hpic = usermsg.hpic;
        if (addedUser) return;
        logger.info("添加用户", username, hpic)

        addedUser = true;
        var user = {};
        user.username = username;
        user.hpic = hpic;
        Users.push(user);
        logger.info("当前在线用户",Users)
        //储存用户在socket上
        socket.username = username;
        socket.hpic = hpic;
        ++numUsers;
        socket.emit('login', {
            numUsers: numUsers,
            Users: Users
        });
        logger.info("广播用户进入聊天室", username);
        //向其他用户广播 socket.broadcast.emit() 向其他socket 发送数据出去当前socket
        socket.broadcast.emit('user joined', {
            username: socket.username,
            numUsers: numUsers,
            hpic :hpic
        })
    })

    //返回聊天信息
    socket.on('chat messages', msg => {
        msg.time = new Date().toLocaleString();
        msg.hpic = socket.hpic;
        logger.info("返回聊天信息", msg);
        io.emit('chat message', msg);
    })

    socket.on('disconnect', function() {
        logger.info("用户退出", socket.username);
        if (addedUser) {
            --numUsers;
            del_user(socket.username);
            logger.info("用户退出,剩余用户",Users);
            //广播用户离开了
            socket.broadcast.emit('user left', {
                username: socket.username,
                numUsers: numUsers,
                Users: Users
            })
        }
    })
})

/*从数组中删除用户*/
function del_user(username) {
    Users = Users.filter(function(item) {
        return item.username != username;
    })
   
}
/*判断是否用户名已存在*/
function isExit(username) {
    var _Users = Users.filter(function(item) {
        return item.username != username;
    });
    //console.log(_Users.length,Users.length);
    //如果用户不为0 且过滤后人数不等于当前人数 说明用户已经存在
    return Users.length != 0 && _Users.length !== Users.length;
}

/*返回当前系统时间*/
app.get('/get_time', function(req, res) {
    logger.info("返回当前系统时间");
    res.json({
        time: new Date().toLocaleString()
    });
})

/*判断用户名是否存在*/
app.get('/isExit', function(req, res) {
    //获取前台数据
    var name = req.query.username;
    logger.info("判断用户是否存在", name);
    res.json({
        isExit: isExit(name)
    });
})
cdr.exec("start http://localhost:3000");
http.listen(3000, function() {
    console.log('listening on * :3000');
})
