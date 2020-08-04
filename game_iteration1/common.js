//
// Asset loader
//

var Loader = {
    images: {}
};

Loader.loadImage = function (key, src) {
    var img = new Image();

    var d = new Promise(function (resolve, reject) {
        img.onload = function () {
            this.images[key] = img;
            resolve(img);
        }.bind(this);

        img.onerror = function () {
            reject('Could not load image: ' + src);
        };
    }.bind(this));

    img.src = src;
    return d;
};

Loader.getImage = function (key) {
    return (key in this.images) ? this.images[key] : null;
};

//
// Keyboard handler
//
var Mouse = {};
Mouse.click = false;
Mouse.listenForEvents = function () {
	console.log("on_click?");
    window.addEventListener('click', this._onClick.bind(this));

}
Mouse._onClick = function (event) {
//	console.log("ok2",event);
	//console.log(this);
	Mouse.x = event.screenX
	Mouse.click = true;
};

var Keyboard = {};


Keyboard.LeftPressed = false;
Keyboard.LeftReleased = false;
Keyboard.RightPressed = false;
Keyboard.RightReleased = false;
Keyboard.UpPressed = false;
Keyboard.UpReleased = false;
Keyboard.DownPressed = false;
Keyboard.DownReleased = false;

Keyboard.EnterPressed = false;
Keyboard.EnterReleased = false;

Keyboard.LEFT = 37;
Keyboard.RIGHT = 39;
Keyboard.UP = 38;
Keyboard.DOWN = 40;
Keyboard.ENTER = 13;

Keyboard._keys = {};

Keyboard.listenForEvents = function (keys) {
    window.addEventListener('keydown', this._onKeyDown.bind(this));
    window.addEventListener('keyup', this._onKeyUp.bind(this));
    keys.forEach(function (key) {
        this._keys[key] = false;
    }.bind(this));
}

Keyboard._onKeyDown = function (event) {
    var keyCode = event.keyCode;
	
	if (keyCode == Keyboard.LEFT){
		Keyboard.LeftPressed = true;
	}
	
	if (keyCode == Keyboard.RIGHT){
		Keyboard.RightPressed = true;
	}
	
	if (keyCode == Keyboard.UP){
		Keyboard.UpPressed = true;
	}
	
	if (keyCode == Keyboard.DOWN){
		Keyboard.DownPressed = true;
	}
	
	if (keyCode == Keyboard.ENTER){
		Keyboard.EnterPressed = true;
	}
	
    if (keyCode in this._keys) {
        event.preventDefault();
        this._keys[keyCode] = true;
    }
};

Keyboard._onKeyUp = function (event) {
    var keyCode = event.keyCode;
	if (keyCode == Keyboard.LEFT){
		Keyboard.LeftReleased = false;
		Keyboard.LeftPressed = false;
	}
	if (keyCode == Keyboard.RIGHT){
		Keyboard.RightReleased = false;
		Keyboard.RightPressed = false;
	}
	if (keyCode == Keyboard.UP){
		Keyboard.UpReleased = false;
		Keyboard.UpPressed = false;
	}
	if (keyCode == Keyboard.DOWN){
		Keyboard.DownReleased = false;
		Keyboard.DownPressed = false;
	}
	if (keyCode == Keyboard.ENTER){
		Keyboard.EnterReleased = false;
		Keyboard.EnterPressed = false;
	}
    if (keyCode in this._keys) {
        event.preventDefault();
        this._keys[keyCode] = false;
    }
};

Keyboard.isDown = function (keyCode) {
    if (!keyCode in this._keys) {
        throw new Error('Keycode ' + keyCode + ' is not being listened to');
    }
    return this._keys[keyCode];
};

//
// Game object
//

var Game = {};

Game.run = function (context) {
    this.ctx = context;
    this._previousElapsed = 0;

    var p = this.load();
    Promise.all(p).then(function (loaded) {
        this.init();
        window.requestAnimationFrame(this.tick);
    }.bind(this));
};

Game.tick = function (elapsed) {
    window.requestAnimationFrame(this.tick);

    // clear previous frame
    this.ctx.clearRect(0, 0, 512, 512);

    // compute delta time in seconds -- also cap it
    var delta = (elapsed - this._previousElapsed) / 1000.0;
    delta = Math.min(delta, 0.25); // maximum delta of 250 ms
    this._previousElapsed = elapsed;
	//this.animation();
    this.update(delta);
    this.render();
}.bind(Game);

// override these methods to create the demo
Game.init = function () {};
Game.update = function (delta) {};
Game.render = function () {};

//
// start up function
//

window.onload = function () {
    var context = document.getElementById('demo').getContext('2d');
    Game.run(context);
};