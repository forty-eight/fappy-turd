var stage, w, h, loader, pipe1height, pipe2height, pipe3height, startX, startY, wiggleDelta, topFill, background, bird, ground, pipe, bottomPipe, pipes, rotationDelta, counter, counterOutline, highScore, highScoreOutline, started = !1,
    startJump = !1,
    jumpAmount = 120,
    jumpTime = 266,
    dead = !1,
    KEYCODE_SPACE = 32,
    gap = 250,
    masterPipeDelay = 1.5,
    pipeDelay = masterPipeDelay,
    restartable = !1,
    counterShow = !1;

document.onkeydown = handleKeyDown;

function init() {
    stage = new createjs.Stage("fappy-turd");
    createjs.Touch.enable(stage);
    w = stage.canvas.width;
    h = stage.canvas.height;
    manifest = [{
        src: "static/img/poop.png",
        id: "bird"
    }, {
        src: "static/img/background.png",
        id: "background"
    }, {
        src: "static/img/ground.png",
        id: "ground"
    }, {
        src: "static/img/penish.png",
        id: "pipe"
    }, {
        src: "static/img/restart.png",
        id: "start"
    }, {
        src: "static/img/score.png",
        id: "score"
    }, {
        src: "static/img/share.png",
        id: "share"
    }, {
        src: "static/fonts/FB.eot"
    }, {
        src: "static/fonts/FB.svg"
    }, {
        src: "static/fonts/FB.ttf"
    }, {
        src: "static/fonts/FB.woff"
    }];
    loader = new createjs.LoadQueue(!1);
    loader.addEventListener("complete",
        handleComplete);
    loader.loadManifest(manifest)
}

function handleComplete() {
    background = new createjs.Shape;
    background.graphics.beginBitmapFill(loader.getResult("background")).drawRect(0, 0, w, h);
    background.y = 0;
    var a = loader.getResult("ground");
    ground = new createjs.Shape;
    ground.graphics.beginBitmapFill(a).drawRect(0, 0, w + a.width, a.height);
    ground.tileW = a.width;
    ground.y = h - a.height;
    a = new createjs.SpriteSheet({
        images: [loader.getResult("bird")],
        frames: {
            width: 92,
            height: 64,
            regX: 46,
            regY: 32,
            count: 3
        },
        animations: {
            fly: [0, 2, "fly", 0.21],
            dive: [1,
                1, "dive", 1
            ]
        }
    });
    bird = new createjs.Sprite(a, "fly");
    startX = w / 2 - 46;
    startY = 512;
    wiggleDelta = 18;
    bird.setTransform(startX, startY, 1, 1);
    bird.framerate = 30;
    createjs.Tween.get(bird, {
        loop: !0
    }).to({
        y: startY + wiggleDelta
    }, 380, createjs.Ease.sineInOut).to({
        y: startY
    }, 380, createjs.Ease.sineInOut);
    stage.addChild(background);
    topFill = new createjs.Graphics;
    topFill.beginFill("#70c5ce").rect(0, 0, w, 0);
    topFill = new createjs.Shape(topFill);
    stage.addChild(topFill);
    pipes = new createjs.Container;
    stage.addChild(pipes);
    stage.addChild(bird, ground);
    stage.addEventListener("stagemousedown", handleJumpStart);
    bottomFill = new createjs.Graphics;
    bottomFill.beginFill("#ded895").rect(0, h, w, 0);
    bottomFill = new createjs.Shape(bottomFill);
    stage.addChild(bottomFill);
    counter = createText(!1, "#ffffff", 1, "86px");
    counterOutline = createText(!0, "#000000", 1, "86px");
    highScore = createText(!1, "#ffffff", 0, "60px");
    highScoreOutline = createText(!0, "#000000", 0, "60px");
    stage.addChild(counter, counterOutline);
    createjs.Ticker.timingMode =
        createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", tick);
    setHeight();
    supports_html5_storage() ? (a = localStorage.getItem("highScore")) ? (highScore.text = a, highScoreOutline.text = a) : localStorage.setItem("highScore", 0) : (a = document.cookie.replace(/(?:(?:^|.*;\s*)highScore\s*\=\s*([^;]*).*$)|^.*$/, "$1")) ? (highScore.text = a, highScoreOutline.text = a) : document.cookie = "highScore=0"
}

function handleKeyDown(a) {
    a || (a = window.event);
    switch (a.keyCode) {
    case KEYCODE_SPACE:
        spacebar()
    }
}

function spacebar() {
    handleJumpStart();
    dead && restartable && (restart(), restartable = !1)
}

function handleJumpStart() {
    dead || (createjs.Tween.removeTweens(bird), bird.gotoAndPlay("jump"), startJump = !0, started || (counterShow = started = !0))
}

function diveBird() {
    bird.gotoAndPlay("dive")
}

function restart() {
    pipes.removeAllChildren();
    createjs.Tween.get(start).to({
        y: start.y + 10
    }, 50).call(removeStart);
    counter.text = 0;
    counterOutline.text = 0;
    counterOutline.alpha = 0;
    counter.alpha = 0;
    counter.font = "86px 'Flappy Bird'";
    counterOutline.font = counter.font;
    counter.y = 150;
    counterOutline.y = counter.y;
    counterShow = !1;
    highScore.alpha = 0;
    highScoreOutline.alpha = 0;
    pipeDelay = masterPipeDelay;
    startJump = started = dead = !1;
    createjs.Tween.removeTweens(bird);
    bird.x = startX;
    bird.y = startY;
    bird.rotation = 0;
    createjs.Tween.get(bird, {
        loop: !0
    }).to({
        y: startY + wiggleDelta
    }, 380, createjs.Ease.sineInOut).to({
        y: startY
    }, 380, createjs.Ease.sineInOut)
}

function die() {
    dead = !0;
    bird.gotoAndPlay("dive");
    ga("send", "event", "Flappy Bird", "Score", counter.text, counter.text);
    counter.text > highScore.text && (highScore.text = counter.text, highScoreOutline.text = counterOutline.text, supports_html5_storage() ? localStorage.setItem("highScore", counter.text) : document.cookie = "highScore=" + counter.text);
    createjs.Tween.removeTweens(bird);
    createjs.Tween.get(bird).wait(0).to({
        y: bird.y + 200,
        rotation: 90
    }, 380 / 1.5, createjs.Ease.linear).call(diveBird).to({
        y: ground.y - 30
    }, (h - (bird.y +
        200)) / 1.5, createjs.Ease.linear);
    createjs.Tween.get(stage).to({
        alpha: 0
    }, 100).to({
        alpha: 1
    }, 100);
    score = addImageAtCenter("score", 0, -150);
    start = addImageAtCenter("start", 0, 50);
    share = addImageAtCenter("share", 0, 150);
    stage.removeChild(counter, counterOutline);
    stage.addChild(score);
    stage.addChild(start);
    stage.addChild(share);
    counter.y += 160;
    counter.font = "60px 'Flappy Bird'";
    counterOutline.y = counter.y;
    counterOutline.font = "60px 'Flappy Bird'";
    counter.alpha = 0;
    counterOutline.alpha = 0;
    highScore.y = counter.y + 80;
    highScoreOutline.y =
        highScore.y;
    stage.addChild(counter, counterOutline, highScore, highScoreOutline);
    dropIn(score);
    dropIn(start);
    dropIn(counter);
    dropIn(counterOutline);
    dropIn(highScore);
    dropIn(highScoreOutline);
    createjs.Tween.get(share).to({
        alpha: 1,
        y: share.y + 50
    }, 400, createjs.Ease.sineIn).call(addClickToStart)
}

function removeStart() {
    stage.removeChild(start);
    stage.removeChild(share);
    stage.removeChild(score)
}

function addClickToStart(a) {
    start.addEventListener("click", restart);
    share.addEventListener("click", goShare);
    restartable = !0
}

function dropIn(a) {
    createjs.Tween.get(a).to({
        alpha: 1,
        y: a.y + 50
    }, 400, createjs.Ease.sineIn)
}

function addImageAtCenter(a, c, d) {
    a = new createjs.Bitmap(loader.getResult(a));
    a.alpha = 0;
    a.x = w / 2 - a.image.width / 2 + c;
    a.y = h / 2 - a.image.height / 2 + d;
    return a
}

function createText(a, c, d, b) {
    b = new createjs.Text(0, b + " 'Flappy Bird'", c);
    a && (b.outline = 5);
    b.color = c;
    b.textAlign = "center";
    b.x = w / 2;
    b.y = 150;
    b.alpha = d;
    return b
}

function goShare() {
    window.open("https://twitter.com/share?url=http%3A%2F%2Ffappyturd.com&text=I scored " + (1 == counter.text ? "1 point" : counter.text + " points") + " on Fappy Turd.")
}

function supports_html5_storage() {
    try {
        return localStorage.setItem("test", "foo"), "localStorage" in window && null !== window.localStorage
    } catch (a) {
        return !1
    }
}

function tick(a) {
    var c = a.delta / 1E3,
        d = pipes.getNumChildren();
    bird.y > ground.y - 40 && (dead || die(), bird.y > ground.y - 30 && createjs.Tween.removeTweens(bird));
    dead || (ground.x = (ground.x - 300 * c) % ground.tileW);
    if (started && !dead) {
        0 > pipeDelay ? (pipe = new createjs.Bitmap(loader.getResult("pipe")), pipe.x = w + 600, pipe.y = (ground.y - 2 * gap) * Math.random() + 1.5 * gap, pipes.addChild(pipe), pipe2 = new createjs.Bitmap(loader.getResult("pipe")), pipe2.scaleX = -1, pipe2.rotation = 180, pipe2.x = pipe.x, pipe2.y = pipe.y - gap, pipes.addChild(pipe2),
            pipeDelay = masterPipeDelay) : pipeDelay -= 1 * c;
        for (var b = 0; b < d; b++)
            if (pipe = pipes.getChildAt(b)) {
                var e = ndgmr.checkRectCollision(pipe, bird, 1, !0);
                e && 8 < e.width && 8 < e.height && die();
                pipe.x -= 300 * c;
                338 >= pipe.x && 0 == pipe.rotation && "counted" != pipe.name && (pipe.name = "counted", counter.text += 1, counterOutline.text += 1);
                pipe.x + pipe.image.width <= -pipe.w && pipes.removeChild(pipe)
            }
        counterShow && (counter.alpha = 1, counterOutline.alpha = 1, counterShow = !1)
    }!0 == startJump && (startJump = !1, bird.framerate = 60, bird.gotoAndPlay("fly"), rotationDelta =
        0 > bird.roation ? (-bird.rotation - 20) / 5 : (bird.rotation + 20) / 5, -200 > bird.y && (bird.y = -200), createjs.Tween.get(bird).to({
            y: bird.y - rotationDelta,
            rotation: -20
        }, rotationDelta, createjs.Ease.linear).to({
            y: bird.y - jumpAmount,
            rotation: -20
        }, jumpTime - rotationDelta, createjs.Ease.quadOut).to({
            y: bird.y
        }, jumpTime, createjs.Ease.quadIn).to({
            y: bird.y + 200,
            rotation: 90
        }, 380 / 1.5, createjs.Ease.linear).call(diveBird).to({
            y: ground.y - 30
        }, (h - (bird.y + 200)) / 1.5, createjs.Ease.linear));
    stage.update(a)
};