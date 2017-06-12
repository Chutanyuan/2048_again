/**
 * Created by user_kevin on 17/6/11.
 */
var game = new Phaser.Game(240,400,Phaser.AUTO,'game');
game.States = {};
game.States.boot = function () {
    this.preload = function () {
        game.load.image('loading','res/preloader.gif');
    };
    this.create = function () {
        game.state.start('preload');
    };
};
game.States.preload = function () {
    this.preload = function () {
        var preloadSprite = game.add.image(10,game.height-40,'loading');
        game.load.setPreloadSprite(preloadSprite);
        game.load.image('background', 'res/bg.png');
        game.load.image('btnRestart', 'res/btn-restart.png');
        game.load.image('btnStart', 'res/btn-start.png');
        game.load.image('btnTryagain', 'res/btn-tryagain.png');
        game.load.image('logo', 'res/logo.png');
    };
    this.create = function () {
        game.state.start('main');
    }
};
game.States.main = function () {
    this.create = function () {
        game.add.tileSprite(0,0,game.width,game.height,'background');
        /**
         * logo 初始坐标为 左上角 reset 重新设置坐标点 game.add 之后可以拿到 logo 的宽高了 以此来做适配
         * */
        var logo = game.add.image(0,0,'logo');
        logo.reset((game.width-logo.width)/2,(game.height-logo.height)/2-50);
        var startBtn = game.add.button(0,0,'btnStart',this.startBtnAction,this);
        startBtn.reset(game.width/2-startBtn.width/2,game.height/2-startBtn.height/2+100);
    };
    this.startBtnAction = function () {
      game.state.start('start');
    }
};
game.States.start = function () {
    this.create = function () {
        /** init */
        this.initUI();
        this.initGameBounds();
    };
    this.update = function () {

    };
    /**
     * 初始游戏区域背景
     * */
    this.initGameBounds = function () {
        var mainInterfaceSprite = game.add.sprite(10,80);
        var mainInterfaceGraphics = game.add.graphics(0,0);
        mainInterfaceSprite.addChild(mainInterfaceGraphics);
        mainInterfaceGraphics.beginFill(0xADA79A,0.5);
        mainInterfaceGraphics.drawRoundedRect(0,0,220,220,10);
        mainInterfaceGraphics.endFill();

    };
    /**
     * 初始背景 当前分数和最高分数
     * */
    this.initUI = function () {
        this.score = 0;
        this.best = 0;
        game.add.tileSprite(0,0,game.width,game.height,'background');
        var styleOne = {
            font:'12px',
            fill:'#4db3b3',
            boundsAlignH:'center'};
        var styleTwo = {
            font: 'bold 20px Arial',
            fill: '#ffffff',
            boundsAlignH: 'center'};
        var scoreSprite = game.add.sprite(10,10);
        var scoreGraphics = game.add.graphics(0,0);
        scoreSprite.addChild(scoreGraphics);
        scoreGraphics.lineStyle(5,0xa1c5c5);
        scoreGraphics.beginFill(0x383838);
        scoreGraphics.drawRoundedRect(0,0,70,50,10);
        scoreGraphics.endFill();
        var scoreTitle = game.add.text(0,5,'SCORE',styleOne);
        scoreTitle.setTextBounds(0,0,70,50);
        scoreSprite.addChild(scoreTitle);
        this.scoreText = game.add.text(0,20,this.score,styleTwo);
        this.scoreText.setTextBounds(0,0,70,50);
        scoreSprite.addChild(this.scoreText);

        var bestSprite = game.add.sprite(90,10);
        var bestGraphics = game.add.graphics(0,0);
        bestSprite.addChild(bestGraphics);
        bestGraphics.lineStyle(5,0xa1c5c5);
        bestGraphics.beginFill(0x383838,0.5);
        bestGraphics.drawRoundedRect(0,0,70,50,10);
        bestGraphics.endFill();
        var bestTitle = game.add.text(0,5,'BEST',styleOne);
        bestTitle.setTextBounds(0,0,70,50);
        bestSprite.addChild(bestTitle);
        this.bestText = game.add.text(0,20,this.best,styleTwo);
        this.bestText.setTextBounds(0,0,70,50);
        bestSprite.addChild(this.bestText);
        game.add.button(180,15,'btnRestart',this.rerunGame,this);
    };
    this.rerunGame = function (button, pointer, isOver) {

    };
};
game.state.add('boot',game.States.boot);
game.state.add('preload',game.States.preload);
game.state.add('main',game.States.main);
game.state.add('start',game.States.start);

game.state.start('boot');