var Board = require("./grid.js");
var Main = require("./main.js");
Page({ 
  data: {
    hidden: false,
    start: "开始游戏",
    back:"后退",
    help:"帮助",
    boxwide:18,
    num: [],
    score: 0,
    step:0,
    bestScore: 0, // 最高分
    endMsg: '',
    over: false  // 游戏是否结束 
  },
  // 页面渲染完成
  onReady: function () {//后退
    if(!wx.getStorageSync("highScore"))
      wx.setStorageSync('highScore', 0);
    this.gameStart();
    //this.reback();
  },
  autostep:function(){
    var dec = this.data.main.automove();
    var data = this.data.main.move(dec);
    this.updateView(data);
  },
  reback:function(){
    this.setData({
      back:"后退",
    })
    var data = this.data.main.getback();
    this.backView(data);
  },
  gameStart: function() {  // 游戏开始
    var main = new Main(5);
    this.maxstep=0;
    this.setData({
      main: main,
      bestScore: wx.getStorageSync('highScore')
    });
    this.data.main.__proto__ = main.__proto__;
    this.setData({
      hidden: true,
      over: false,
      score: 0,
      step:0,
      num: this.data.main.board.grid
    });  
  },
  gameOver: function() {  // 游戏结束
    this.setData({
      over: true 
    });
  
    if (this.data.score >= 2048) {
      this.setData({ 
        endMsg: '恭喜达到2048！'
      });
      wx.setStorageSync('highScore', this.data.score);
    } else if (this.data.score > this.data.bestScore) {
      this.setData({
        endMsg: '创造新纪录！' 
      }); 
      wx.setStorageSync('highScore', this.data.score);
    } else {
      this.setData({
        endMsg: '游戏结束！'
      }); 
    } 
  },
  // 触摸
  touchStartX: 0,
  touchStartY: 0,
  touchEndX: 0,
  touchEndY: 0,
  touchStart: function(ev) { // 触摸开始坐标
    var touch = ev.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;

  },
  touchMove: function(ev) { // 触摸最后移动时的坐标
    var touch = ev.touches[0];
    this.touchEndX = touch.clientX;
    this.touchEndY = touch.clientY;
  },
  touchEnd: function() {
    var disX = this.touchStartX - this.touchEndX;
    var absdisX = Math.abs(disX);
    var disY = this.touchStartY - this.touchEndY;
    var absdisY = Math.abs(disY);

    if(this.data.main.isOver()) { // 游戏是否结束
      this.gameOver();
    } else {
      if (Math.max(absdisX, absdisY) > 10) { // 确定是否在滑动
          this.setData({
            start: "重新开始",
          });
        var direction = absdisX > absdisY ? (disX < 0 ? 1 : 3) : (disY < 0 ? 2 : 0);  // 确定移动方向
        var data = this.data.main.move(direction);
        this.updateView(data);
      }   
    }      
  },
  judge:0,
  maxstep:0,
  backView(data) {
    var max = 0;
    for(var i = 0; i < 5; i++)
      for(var j = 0; j < 5; j++)
        if(data[i][j] != "" && data[i][j] > max)
          max = data[i][j];
    if(this.judge==1){
      this.maxstep--;
      this.judge=0;
    }      
    
    var mx=this.maxstep;
    this.setData({
      num: data,
      score: max,
      step: mx
    });
  },
  updateView(data) {
    var max = 0;
    this.judge=1;
    for(var i = 0; i < 5; i++)
      for(var j = 0; j < 5; j++)
        if(data[i][j] != "" && data[i][j] > max)
          max = data[i][j];
    this.maxstep++;
    var mx=this.maxstep;
    this.setData({
      num: data,
      score: max,
      step: mx
    });
  },
  onShareAppMessage: function() {
    return {
      title: '2048小游戏',
      desc: '来试试你能达到多少分',
      path: '/page/user?id=123'
    }
  }
})