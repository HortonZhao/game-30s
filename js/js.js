var whiteBall = document.getElementsByClassName('white')[0];
var spanTimer = document.getElementById('timer');
var flag = true;
var num = 0;
var runTimer = null;
var isHisCreated = false;
var movePlus = {
    outer: document.getElementsByClassName('outer')[0],
    iWidth: document.getElementsByClassName('outer')[0].offsetWidth,
    iHeight: document.getElementsByClassName('outer')[0].offsetHeight,
    ispeedX: 5,
    ispeedY: 5,
};
var yellowArr = [];
var his = [];
var highest = 0;
var interval = undefined;
if (movePlus.iWidth < movePlus.iHeight) {
    interval = 2000;
} else {
    interval = 1000;
}

function gamestart() {
    this.movePlus = {
        outer: document.getElementsByClassName('outer')[0],
        iWidth: document.getElementsByClassName('outer')[0].offsetWidth,
        iHeight: document.getElementsByClassName('outer')[0].offsetHeight,
        ispeedX: 5,
        ispeedY: 5,
    }
    this.flag = true;
    this.creatBall(this.movePlus);
    this.dragwhiteBall(this.movePlus);
    this.timerRun();
}

function timerRun() {
    num = 0;
    spanTimer.innerHTML = '坚持了' + num + '秒！'
    runTimer = setInterval(function () {
        num++;
        spanTimer.innerHTML = '坚持了' + num + '秒！';
        if (num > highest) {
            highest = num;
            document.getElementById('highest').innerHTML = '最高纪录：' + highest + '秒';
        }
    }, 1000)
}

function creatBall(obj) {
    var plus = obj;
    function Yellow(plus) {
        //黄色小球基础信息
        this.ball = document.createElement('div');
        this.ball.className = 'yellow';
        plus.outer.appendChild(this.ball);
        this.sumWidth = Math.floor(Math.random() * (plus.iWidth - this.ball.offsetWidth));
        this.ball.style.left = this.sumWidth + 'px';
        this.speedX = Math.floor(Math.random() * plus.ispeedX) + 1;
        this.speedY = Math.floor(Math.random() * plus.ispeedY) + 1;
        this.iWidth = plus.iWidth;
        this.iHeight = plus.iHeight;
    }
    var that = this;
    //创建黄色小球
    var yellowBall = new Yellow(plus);
    //将黄色小球添加到数组中
    this.yellowArr.push(yellowBall);
    //写个定时器，每隔2s产生一个黄色小球
    this.creatTimer = setInterval(function () {
        var yellowBall = new Yellow(plus);
        that.yellowArr.push(yellowBall);
    }, interval)

    this.moveBall();
}


function moveBall() {
    var that = this;
    //黄色小球不停移动的
    this.gotimer = setInterval(function () {
        for (var i = 0; i < that.yellowArr.length; i++) {
            //在进行移动前，判断下是否触碰了白色小球
            that.crashCheck(that.yellowArr[i]);
            //移动黄色小球
            var newLeft = that.yellowArr[i].speedX + that.yellowArr[i].ball.offsetLeft;
            var newTop = that.yellowArr[i].speedY + that.yellowArr[i].ball.offsetTop;
            //如果碰到墙壁，该方向的速度要取反
            if (newLeft < 0 || newLeft > (that.yellowArr[i].iWidth - that.yellowArr[i].ball.offsetWidth)) {
                that.yellowArr[i].speedX *= -1;
            } else if (newTop < 0 || newTop > (that.yellowArr[i].iHeight - that.yellowArr[i].ball.offsetHeight)) {
                that.yellowArr[i].speedY *= -1;
            }
            //重新设置小球的位置
            that.yellowArr[i].ball.style.left = newLeft + 'px';
            that.yellowArr[i].ball.style.top = newTop + 'px';
        }
    }, 10)
}



function dragwhiteBall(obj) {
    //鼠标拖拽效果
    var that = this;
    this.whiteBall.onpointerdown = function (e) {
        var ePageX = Math.round(e.pageX);
        var ePageY = Math.round(e.pageY);
        document.onpointermove = function (e) {
            that.whiteBall.style.left = Math.round(e.pageX) - ePageX + that.whiteBall.offsetLeft + 'px';
            that.whiteBall.style.top = Math.round(e.pageY) - ePageY + that.whiteBall.offsetTop + 'px';
            ePageX = Math.round(e.pageX);
            ePageY = Math.round(e.pageY);
            if (that.whiteBall.offsetLeft < 0 && that.flag) {
                //如果超出了左边边线,游戏结束
                that.gameOver()
            } else if (that.whiteBall.offsetLeft > (obj.iWidth - that.whiteBall.offsetWidth) && that.flag) {
                //如果超出了右边边线,游戏结束
                that.gameOver()
            } else if (that.whiteBall.offsetTop < 0 && that.flag) {
                //如果超出了上边边线,游戏结束
                that.gameOver()
            } else if (that.whiteBall.offsetTop > (obj.iHeight - that.whiteBall.offsetHeight) && that.flag) {
                //如果超出了下边边线,游戏结束
                that.gameOver()
            }
        }
        document.onpointerup = function (e) {
            document.onpointermove = null;
        }
    }
}


function crashCheck(yellow) {
    //判断下白色小球是否碰到黄色小球，是的话，游戏结束
    var yellowX1 = yellow.ball.offsetLeft + Math.floor(yellow.ball.offsetWidth / 2);
    var yellowY1 = yellow.ball.offsetTop + Math.floor(yellow.ball.offsetWidth / 2);
    var whiteX2 = this.whiteBall.offsetLeft + Math.floor(this.whiteBall.offsetWidth / 2);
    var whiteY2 = this.whiteBall.offsetTop + Math.floor(this.whiteBall.offsetWidth / 2);
    var dx = Math.abs(yellowX1 - whiteX2);
    var dy = Math.abs(yellowY1 - whiteY2);
    var dis = Math.floor(Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)));
    var R = this.whiteBall.offsetWidth / 2 + yellow.ball.offsetWidth / 2;
    if (dis < R && this.flag) {
        this.gameOver()
    }
}

function clearTimer() {
    clearInterval(this.gotimer);
    clearInterval(this.runTimer);
    clearInterval(this.creatTimer);
}
function reset() {
    this.clearTimer();
    this.flag = false;
    document.onpointerup = function (e) {
        document.onpointermove = null;
    }
    for (var i = 0; i < this.yellowArr.length; i++) {
        this.movePlus.outer.removeChild(this.yellowArr[i].ball);
    }
    this.yellowArr = [];
}
function showHis() {
    document.getElementById("startpage").style.display = "none";
    document.getElementById("hispage").style.display = "flex";
    document.getElementById("returnbtn").addEventListener("click", function () {
        showRestart();
    });
    var hislist = document.getElementById("hislist");
    hislist.innerHTML = "";
    hislist.innerHTML = "<tr><th>分数</th><th>时间</th></tr>";
    for (var i of this.his) {
        hislist.innerHTML += "<tr><td>" + i.score + "</td><td>" + i.time + "</td></tr>";
    }
}
function createHis() {
    if (this.isHisCreated) {
        return;
    }
    this.isHisCreated = true;
    var hisbtn = document.createElement('button');
    hisbtn.id = "hisbtn";
    hisbtn.className = "btn";
    hisbtn.innerText = "历史记录";
    document.getElementById("btncontainer").appendChild(hisbtn);
    hisbtn.addEventListener("click", function () {
        showHis();
    });
}
function showRestart() {
    document.getElementById("hispage").style.display = "none";
    document.getElementById("gamepage").style.display = "none";
    document.getElementById("startbtn").innerText = "重新开始";
    document.getElementById("startpage").style.display = "flex";
    document.getElementById("highest").innerHTML = "最高纪录：" + highest + "秒";
    this.createHis();
}
function recordHis() {
    const now = new Date();
    const formattedTime = now.toLocaleString('zh-cn', { hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    if (this.his.length > 10) {
        this.his.pop();
    }
    this.his.unshift({ score: num, time: formattedTime });
}
function gameOver() {
    this.reset();
    this.showRestart();
    recordHis();
}

document.getElementById("gamepage").style.display = "none";
document.getElementById("hispage").style.display = "none";
document.getElementById("startbtn").addEventListener("click", function () {
    document.getElementById("gamepage").style.display = "flex";
    whiteBall.style.left = "50%";
    whiteBall.style.top = "50%";
    whiteBall.style.left = whiteBall.offsetLeft - whiteBall.offsetWidth / 2 + "px";
    whiteBall.style.top = whiteBall.offsetTop - whiteBall.offsetHeight / 2 + "px";
    document.getElementById("startpage").style.display = "none";
    gamestart();
});