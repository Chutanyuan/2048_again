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
        this.initUI();
        this.initGameBounds();
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
        /**
         * 多种颜色类别
         * */
        this.colors = {
            2: 0x49B4B4,
            4: 0x4DB574,
            8: 0x78B450,
            16: 0xC4C362,
            32: 0xCEA346,
            64: 0xDD8758,
            128: 0xBF71B3,
            256: 0x9F71BF,
            512: 0x7183BF,
            1024: 0x71BFAF,
            2048: 0xFF7C80
        };
        this.swipe = new Swipe(game,this.swipeCheck);
        this.rerunGame();
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
    this.update = function () {
        if (this.canSwipe) {
            this.swipe.check();
        }
    };
    this.rerunGame = function () {
        this.score = 0;
        this.scoreText.text = this.score;
        if (this.array){
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    if (this.array[i][j].sprite) {
                        this.array[i][j].sprite.kill();
                    }
                }
            }
        }
        /**
         * 一个 4*4 的数组
         * */
        this.array = [];
        for (var i = 0; i < 4; i++) {
            this.array[i] = [];
            for (var j = 0; j < 4; j++) {
                this.array[i][j] = {};
                this.array[i][j].value = 0;
                this.array[i][j].x = i;
                this.array[i][j].y = j;
            }
        }
        /**
         * 是否响应swipe
         * */
        this.canSwipe = true;
        /** 开始游戏 - 创建方块 */
        this.generateSquare();
    };
    /**
     * 随机创建一个方块
     * */
    this.generateSquare = function () {
        console.log('创建一个方块');
        var x = Math.floor(Math.random() * 4);
        var y = Math.floor(Math.random() * 4);
        while (this.array[x][y].value != 0) {
            x = Math.floor(Math.random() * 4);
            y = Math.floor(Math.random() * 4);
        }
        var value = 2;
        if (Math.random() > 0.5) {
            value = 4;
        }
        this.placeSquare(x, y, value);
    };
    /**
     * 根据 x,y 值放置一个 值为 value 的方块
     * */
    this.placeSquare = function (x, y, value) {
        var squareStyle = {font: "bold 20px Arial", fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle"};
        var square = game.add.sprite();
        square.reset(this.transX(x), this.transY(y));
        var squareBackground = game.add.graphics(-45 / 2, -45 / 2);
        squareBackground.beginFill(this.colors[value]);
        squareBackground.drawRoundedRect(0, 0, 45, 45, 5);
        squareBackground.endFill();
        square.addChild(squareBackground);
        var squareText = game.add.text(-45 / 2, -45 / 2, value, squareStyle);
        squareText.setTextBounds(0, 0, 45, 45);
        square.addChild(squareText);
        this.array[x][y].value = value;
        this.array[x][y].sprite = square;
        square.anchor.setTo(0.5, 0.5);
        square.scale.setTo(0.0, 0.0);
        var tween = game.add.tween(square.scale).to({x: 1.0, y: 1.0}, 100, Phaser.Easing.Sinusoidal.InOut, true);
        tween.onComplete.add(function () {

        }, this);
    };
    // 坐标转换
    this.transX = function (x) {
        return 10 + 8 * (x + 1) + x * 45 + 45 / 2;
    };
    this.transY = function (y) {
        return 80 + 8 * (y + 1) + y * 45 + 45 / 2;
    };

    this.swipeUp = function () {
        this.swipeInit();
        for (var i = 0; i < this.array.length; i++) {
            for (var j = 1; j < this.array.length; j++) {
                if (this.array[i][j].value != 0) {
                    var index = j - 1;
                    while (index > 0 && this.array[i][index].value == 0) {
                        index--;
                    }
                    this.swipeCommon(i, j, this.array[i][index], {x: this.transX(i), y: this.transY(index)},
                        index + 1 != j, this.array[i][index + 1], {x: this.transX(i), y: this.transY(index + 1)});
                }
            }
        }
        this.swipeDone();
    };
    this.swipeDown = function () {
        this.swipeInit();
        for (var i = 0; i < this.array.length; i++) {
            for (var j = this.array.length - 2; j >= 0; j--) {
                if (this.array[i][j].value != 0) {
                    var index = j + 1;
                    while (index < this.array.length - 1 && this.array[i][index].value == 0) {
                        index++;
                    }
                    this.swipeCommon(i, j, this.array[i][index], {x: this.transX(i), y: this.transY(index)},
                        index - 1 != j, this.array[i][index - 1], {x: this.transX(i), y: this.transY(index - 1)});
                }
            }
        }
        this.swipeDone();
    };
    this.swipeLeft = function () {
        this.swipeInit();
        for (var i = 1; i < this.array.length; i++) {
            for (var j = 0; j < this.array.length; j++) {
                if (this.array[i][j].value != 0) {
                    var index = i - 1;
                    while (index > 0 && this.array[index][j].value == 0) {
                        index--;
                    }
                    this.swipeCommon(i, j, this.array[index][j], {x: this.transX(index), y: this.transY(j)},
                        index + 1 != i, this.array[index + 1][j], {x: this.transX(index + 1), y: this.transY(j)});
                }
            }
        }
        this.swipeDone();
    };
    this.swipeRight = function () {
        this.swipeInit();
        for (var i = this.array.length - 2; i >= 0; i--) {
            for (var j = 0; j < this.array.length; j++) {
                if (this.array[i][j].value != 0) {
                    var index = i + 1;
                    while (index < this.array.length - 1 && this.array[index][j].value == 0) {
                        index++;
                    }
                    this.swipeCommon(i, j, this.array[index][j], {x: this.transX(index), y: this.transY(j)},
                        index - 1 != i, this.array[index - 1][j], {x: this.transX(index - 1), y: this.transY(j)});
                }
            }
        }
        this.swipeDone();
    };
    this.swipeInit = function () {
        this.canSwipe = false;
        game.time.events.add(Phaser.Timer.SECOND * 0.5, function () {
            if (!this.canSwipe) {
                this.canSwipe = true;
            }
        }, this);
    };
    this.swipeDone = function () {
        for (var i = 0; i < this.array.length; i++) {
            for (var j = 0; j < this.array.length; j++) {
                this.array[i][j].newNode = undefined;
            }
        }
    };
    this.swipeCommon = function (i, j, arrNode, posJson, condition, nextArrNode, nextPosJson) {
        var that = this;
        var duration = 100;
        // 遇到了可以合并的
        if (!arrNode.newNode && arrNode.value == this.array[i][j].value) {
            arrNode.value = arrNode.value * 2;
            arrNode.newNode = true;
            this.array[i][j].value = 0;
            this.score = this.score + arrNode.value;
            this.scoreText.text = this.score;
            if (this.score > this.best) {
                this.best = this.score;
                this.bestText.text = this.best;
            }
            // 渐渐透明后被kill掉
            var t1 = game.add.tween(arrNode.sprite).to({alpha: 0}, duration, Phaser.Easing.Linear.None, true);
            t1.onComplete.add(function () {
                this.sprite.kill();
                that.placeSquare(this.x, this.y, this.value);
                if (!that.canSwipe) {
                    that.canSwipe = true;
                    that.generateSquare();
                }
            }, arrNode);
            var t2 = game.add.tween(this.array[i][j].sprite).to({alpha: 0}, duration, Phaser.Easing.Linear.None, true);
            t2.onComplete.add(function () {
                this.kill();
                if (!that.canSwipe) {
                    that.canSwipe = true;
                    that.generateSquare();
                }
            }, this.array[i][j].sprite);
            game.add.tween(this.array[i][j].sprite).to(posJson, duration, Phaser.Easing.Linear.None, true);
            arrNode.sprite = this.array[i][j].sprite;
            this.array[i][j].sprite = undefined;
        } else if (arrNode.value == 0) {
            arrNode.value = this.array[i][j].value;
            this.array[i][j].value = 0;
            var t = game.add.tween(this.array[i][j].sprite).to(posJson, duration, Phaser.Easing.Linear.None, true);
            t.onComplete.add(function () {
                if (!that.canSwipe) {
                    that.canSwipe = true;
                    that.generateSquare();
                }
            });
            arrNode.sprite = this.array[i][j].sprite;
            this.array[i][j].sprite = undefined;
        } else if (condition) {
            nextArrNode.value = this.array[i][j].value;
            this.array[i][j].value = 0;
            var t = game.add.tween(this.array[i][j].sprite).to(nextPosJson, duration, Phaser.Easing.Linear.None, true);
            t.onComplete.add(function () {
                if (!that.canSwipe) {
                    that.canSwipe = true;
                    that.generateSquare();
                }
            });
            nextArrNode.sprite = this.array[i][j].sprite;
            this.array[i][j].sprite = undefined;
        }
    };

    this.swipeCheck = {
        up: this.swipeUp.bind(this),
        down: this.swipeDown.bind(this),
        left: this.swipeLeft.bind(this),
        right: this.swipeRight.bind(this)
    };
};
game.state.add('boot',game.States.boot);
game.state.add('preload',game.States.preload);
game.state.add('main',game.States.main);
game.state.add('start',game.States.start);

game.state.start('boot');