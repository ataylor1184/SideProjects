var map = {
    cols: 12,
    rows: 12,
    tsize: 64,
    layers: [[
        3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
        3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
        3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
        3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
        3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
        3, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 3,
        3, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 3,
        3, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 3,
        3, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 3,
        3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 3,
        3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 3,
        3, 3, 3, 1, 1, 2, 3, 3, 3, 3, 3, 3
    ], [
        4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4,
        4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
        4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
        4, 0, 0, 5, 0, 0, 0, 0, 0, 5, 0, 4,
        4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
        4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
        4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
        4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
        4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
        4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
        4, 4, 4, 0, 5, 4, 4, 4, 4, 4, 4, 4,
        4, 4, 4, 0, 0, 3, 3, 3, 3, 3, 3, 3
    ]],
    getTile: function (layer, col, row) {
        return this.layers[layer][row * map.cols + col];
    },
    isSolidTileAtXY: function (x, y) {
        var col = Math.floor(x / this.tsize);
        var row = Math.floor(y / this.tsize);

        // tiles 3 and 5 are solid -- the rest are walkable
        // loop through all layers and return TRUE if any tile is solid
        return this.layers.reduce(function (res, layer, index) {
            var tile = this.getTile(index, col, row);
            var isSolid = tile === 3 || tile === 5;
            return res || isSolid;
        }.bind(this), false);
    },
    getCol: function (x) {
        return Math.floor(x / this.tsize);
    },
    getRow: function (y) {
        return Math.floor(y / this.tsize);
    },
    getX: function (col) {
        return col * this.tsize;
    },
    getY: function (row) {
        return row * this.tsize;
    }
};

function Camera(map, width, height) {
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
    this.maxX = map.cols * map.tsize - width;
    this.maxY = map.rows * map.tsize - height;
}

Camera.prototype.follow = function (sprite) {
    this.following = sprite;
    sprite.screenX = 0;
    sprite.screenY = 0;
};

Camera.prototype.update = function () {
    // assume followed sprite should be placed at the center of the screen
    // whenever possible
    this.following.screenX = this.width / 2;
    this.following.screenY = this.height / 2;

    // make the camera follow the sprite
    this.x = this.following.x - this.width / 2;
    this.y = this.following.y - this.height / 2;
    // clamp values
    this.x = Math.max(0, Math.min(this.x, this.maxX));
    this.y = Math.max(0, Math.min(this.y, this.maxY));

    // in map corners, the sprite cannot be placed in the center of the screen
    // and we have to change its screen coordinates

    // left and right sides
    if (this.following.x < this.width / 2 ||
        this.following.x > this.maxX + this.width / 2) {
        this.following.screenX = this.following.x - this.x;
    }
    // top and bottom sides
    if (this.following.y < this.height / 2 ||
        this.following.y > this.maxY + this.height / 2) {
        this.following.screenY = this.following.y - this.y;
    }
};

function Hero(map, x, y) {
    this.map = map;
    this.x = x;
    this.y = y;
    this.width = map.tsize;
    this.height = map.tsize;

    this.image = Loader.getImage('hero');
}

//Hero.SPEED = 256; // pixels per second

Hero.prototype.move = function (delta, dirx, diry) {
    // move hero
    this.x += dirx;
    this.y += diry;
    // check if we walked into a non-walkable tile
    this._collide(dirx, diry);

    // clamp values
    //var maxX = this.map.cols * this.map.tsize;
    //var maxY = this.map.rows * this.map.tsize;
    //this.x = Math.max(0, Math.min(this.x, maxX));
    //this.y = Math.max(0, Math.min(this.y, maxY));
};

Hero.prototype._collide = function (dirx, diry) {
    var row, col;
    // -1 in right and bottom is because image ranges from 0..63
    // and not up to 64
    var left = this.x - this.width / 2;
    var right = this.x + this.width / 2 - 1;
    var top = this.y - this.height / 2;
    var bottom = this.y + this.height / 2 - 1;

    // check for collisions on sprite sides
    var collision =
        this.map.isSolidTileAtXY(left, top) ||
        this.map.isSolidTileAtXY(right, top) ||
        this.map.isSolidTileAtXY(right, bottom) ||
        this.map.isSolidTileAtXY(left, bottom);
    if (!collision) { return; }

    if (diry > 0) {
        row = this.map.getRow(bottom);
        this.y = -this.height / 2 + this.map.getY(row);
    }
    else if (diry < 0) {
        row = this.map.getRow(top);
        this.y = this.height / 2 + this.map.getY(row + 1);
    }
    else if (dirx > 0) {
        col = this.map.getCol(right);
        this.x = -this.width / 2 + this.map.getX(col);
    }
    else if (dirx < 0) {
        col = this.map.getCol(left);
        this.x = this.width / 2 + this.map.getX(col + 1);
    }
};

Game.load = function () {
    return [
        Loader.loadImage('tiles', 'tiles.png'),
		
        Loader.loadImage('hero', 'char__images/Front Idle.png'),
		Loader.loadImage('FS1', 'char__images/Front Step1.png'),
		Loader.loadImage('FS2', 'char__images/Front Step2.png'),
		Loader.loadImage('BI', 'char__images/Back Idle.png'),
		Loader.loadImage('BS1', 'char__images/Back Step1.png'),
		Loader.loadImage('BS2', 'char__images/Back Step2.png'),
		Loader.loadImage('LI', 'char__images/Left Idle.png'),
		Loader.loadImage('LS1', 'char__images/Left Step1.png'),
		Loader.loadImage('LS2', 'char__images/Left Step2.png'),
		Loader.loadImage('RI', 'char__images/Right Idle.png'),
		Loader.loadImage('RS1', 'char__images/Right Step1.png'),
		Loader.loadImage('RS2', 'char__images/Right Step2.png'),
		
		Loader.loadImage('tilesblue', 'tilesblue.png'),
		Loader.loadImage('tilesred', 'tilesred.png')
		
    ];
};

Game.init = function () {
    Keyboard.listenForEvents(
        [Keyboard.LEFT, Keyboard.RIGHT, Keyboard.UP, Keyboard.DOWN]);
	Mouse.listenForEvents();
    this.tileAtlas = Loader.getImage('tiles');
	this.blueAtlas = Loader.getImage('tilesblue');
	this.redAtlas = Loader.getImage('tilesred');
    this.hero = new Hero(map, 160, 160);
    this.camera = new Camera(map, 512, 512);
    this.camera.follow(this.hero);
	this.movePhase = false;
	this.needsrender = true;
	this.realTime = animation_ticks();
};

function animation_ticks() {
	//Self adjusting clock
	//changing the interval updates how fast the animation ticks will be
	//1000 = 1 second 
	//https://stackoverflow.com/questions/29971898/how-to-create-an-accurate-timer-in-javascript
	var interval = 200; // ms
	var expected = Date.now() + interval;
	setTimeout(step, interval);
	function step() {
		var dt = Date.now() - expected; // the drift (positive for overshooting)
		if (dt > interval) {
			// something really bad happened. Maybe the browser (tab) was inactive?
			// possibly special handling to avoid futile "catch up" run
		}
		
		expected += interval;
		var adjusted_elapsed_time = setTimeout(step, Math.max(0, interval - dt)); // take into account drift
		Game.animation_update(adjusted_elapsed_time);
	}
}


Game.update = function (delta) {
	//console.log(this.currentTime);
    // handle hero movement with arrow keys
    if (Keyboard.LeftPressed == true && Keyboard.LeftReleased == false) {

		var dirx = 0;
		var diry = 0;
		Keyboard.LeftReleased = true;
		if (this.movePhase == true){
			Keyboard.MoveLeft = true;
		}
		
		if (Keyboard.LeftPressed){
		dirx = -64; 
		}
		Keyboard.LeftPressed = false;
		this.hero.move(delta, dirx, diry);
		this.hero.image = Loader.getImage('LI');
		//this.camera.update();
		}
		
	if (Keyboard.RightPressed == true && Keyboard.RightReleased == false) {
		var dirx = 0;
		var diry = 0;
		Keyboard.RightReleased = true;
		if (this.movePhase == true){
			Keyboard.MoveRight = true;
		}
		
		if (Keyboard.RightPressed){
		dirx = 64; 
		}
		Keyboard.RightPressed = false;
		this.hero.move(delta, dirx, diry);
			this.hero.image = Loader.getImage('RI');
	    //this.camera.update();
		}
		
	if (Keyboard.UpPressed == true && Keyboard.UpReleased == false) {
		Keyboard.UpReleased = true;
		var dirx = 0;
		var diry = 0;
		if (this.movePhase == true){
			Keyboard.MoveUp = true;
		}
		if (Keyboard.UpPressed){
		diry = -64; 
		}
		Keyboard.UpPressed = false;
		this.hero.move(delta, dirx, diry);
		this.hero.image = Loader.getImage('BI');
		//this.camera.update();
		}
	if (Keyboard.DownPressed == true && Keyboard.DownReleased == false) {
		Keyboard.DownReleased = true;
		var dirx = 0;
		var diry = 0;
		if (this.movePhase == true){
			Keyboard.MoveDown = true;
		}
		if (Keyboard.DownPressed){
		diry = 64; 
		}
		Keyboard.DownPressed = false;
		this.hero.move(delta, dirx, diry);
		this.hero.image = Loader.getImage('hero');
			//this.camera.update();
		}
	if (Keyboard.EnterPressed == true && Keyboard.EnterReleased == false) {
		//not sure this condition is ever met
		Keyboard.EnterReleased = true;
		
		
		Keyboard.DownPressed = false;

		}
	
	if (Mouse.click == true){
		//console.log("???????");
		//console.log(this.hero.x);
	
	//	console.log("we did it");
	//	console.log(this.hero.x);
		var colx = this.hero.x;
		var coly = this.hero.y;
		var testx = map.getCol(colx);
		var testy = map.getRow(coly);
		
		var herox = map.getCol(this.hero.x);
		var heroy = map.getCol(this.hero.y);
		
		
		//console.log(colx);
		//console.log(coly);
	//	console.log("hi");
		var tile = map.getTile(0,testx,testy);
	    console.log(tile);
		console.log(this.hero.y);
		tile += 1;
		Mouse.click = false;
		console.log(Game.ctx);
		Game.movePhase = true;
		Game.needsrender = false;
		//console.log("hey");
	//	console.log(this.camera.x);
	//	console.log(testx);
	//	console.log(testy);
		this.hero.bluelist = [];
		this.hero.redlist = [];
		
		this.hero.bluetilehighlight = function(x,y){
			var x_value = ((herox-x)*64) - Game.camera.x ;
			var y_value = ((heroy-y)*64) - Game.camera.y ;
			var tiletype = map.getTile(0,(herox-x),(heroy-y)) - 1;
			var temp = [];
			temp.push(x_value,y_value,tiletype);
			this.bluelist.push(temp);
			
		};
		
		this.hero.redtilehighlight = function(x,y){
			var x_value = ((herox-x)*64) - Game.camera.x ;
			var y_value = ((heroy-y)*64) - Game.camera.y ;
			var tiletype = map.getTile(0,(herox-x),(heroy-y)) - 1;
			var temp = [];
			temp.push(x_value,y_value,tiletype);
			this.redlist.push(temp);
			
		};
		
		this.hero.currenttile = []
		console.log(this.hero.currenttile);
		this.hero.currenttile.push(((herox*64) - Game.camera.x)); 
		this.hero.currenttile.push(((heroy*64) - Game.camera.y));
		this.hero.currenttile.push( map.getTile(0,(herox),(heroy)) - 1);
		//console.log("hijjjjj");

		
		this.hero.bluetilehighlight(1,0);
		this.hero.bluetilehighlight(2,0);
		this.hero.bluetilehighlight(-1,0);
		this.hero.bluetilehighlight(-2,0);
		this.hero.bluetilehighlight(0,1);
		this.hero.bluetilehighlight(0,2);
		this.hero.bluetilehighlight(0,-1);
		this.hero.bluetilehighlight(0,-2);
		this.hero.bluetilehighlight(1,1);
		this.hero.bluetilehighlight(-1,1);
		this.hero.bluetilehighlight(1,-1);
		this.hero.bluetilehighlight(-1,-1);
		
		this.hero.redtilehighlight(3,0);
		this.hero.redtilehighlight(-3,0);
		this.hero.redtilehighlight(0,3);
		this.hero.redtilehighlight(0,-3);
		this.hero.redtilehighlight(2,1);
		this.hero.redtilehighlight(2,-1);
		this.hero.redtilehighlight(1,-2);
		this.hero.redtilehighlight(1,2);
		this.hero.redtilehighlight(-1,-2);
		this.hero.redtilehighlight(-1,2);
		this.hero.redtilehighlight(-2,1);
		this.hero.redtilehighlight(-2,-1);
		
		
		

		
	}
	
	if(this.movePhase == false){
		this.camera.update();
		
	}

};

Game.animation_update = function(time){
	//alternate images
	//maybe add in a third set of images to smooth it out more
	//and do time %2, %3 or something
	//attack phase images ...
	//move phase images ... 
	//idle
	if (time % 2 == 0){
			if (this.hero.image == Loader.getImage('LI')){
				
				this.hero.image = Loader.getImage('LS1');
			}
			if (this.hero.image == Loader.getImage('LS1')){
				
				this.hero.image = Loader.getImage('LS2');
		}
			
			if (this.hero.image == Loader.getImage('RI')){
				
				this.hero.image = Loader.getImage('RS1');
			}
			if (this.hero.image == Loader.getImage('RS1')){
				
				this.hero.image = Loader.getImage('RS2');
		}
			
			if (this.hero.image == Loader.getImage('hero')){
				
				this.hero.image = Loader.getImage('FS1');
			}
			if (this.hero.image == Loader.getImage('FS1')){
				
				this.hero.image = Loader.getImage('FS2');
		}
	
			if (this.hero.image == Loader.getImage('BI')){
				
				this.hero.image = Loader.getImage('BS1');
			}
			if (this.hero.image == Loader.getImage('BS1')){
				
				this.hero.image = Loader.getImage('BS2');
		}
	
	}
	else{
		if (this.hero.image == Loader.getImage('LS2')){
			this.hero.image = Loader.getImage('LS1');
		}
		if (this.hero.image == Loader.getImage('LI')){
			this.hero.image = Loader.getImage('LS2');
		}
		if (this.hero.image == Loader.getImage('RS2')){
			this.hero.image = Loader.getImage('RS1');
		}
		if (this.hero.image == Loader.getImage('RI')){
			this.hero.image = Loader.getImage('RS2');
		}
				if (this.hero.image == Loader.getImage('FS2')){
			this.hero.image = Loader.getImage('FS1');
		}
		if (this.hero.image == Loader.getImage('hero')){
			this.hero.image = Loader.getImage('FS2');
		}
				if (this.hero.image == Loader.getImage('BS2')){
			this.hero.image = Loader.getImage('BS1');
		}
		if (this.hero.image == Loader.getImage('BI')){
			this.hero.image = Loader.getImage('BS2');
		}
	}

	
}

Game._drawLayer = function (layer) {
    var startCol = Math.floor(this.camera.x / map.tsize);
    var endCol = startCol + (this.camera.width / map.tsize);
    var startRow = Math.floor(this.camera.y / map.tsize);
    var endRow = startRow + (this.camera.height / map.tsize);
    var offsetX = -this.camera.x + startCol * map.tsize;
    var offsetY = -this.camera.y + startRow * map.tsize;

    for (var c = startCol; c <= endCol; c++) {
        for (var r = startRow; r <= endRow; r++) {
            var tile = map.getTile(layer, c, r);
            var x = (c - startCol) * map.tsize + offsetX;
            var y = (r - startRow) * map.tsize + offsetY;
            if (tile !== 0) { // 0 => empty tile
                this.ctx.drawImage(
                    this.tileAtlas, // image
                    (tile - 1) * map.tsize, // source x
                    0, // source y
                    map.tsize, // source width
                    map.tsize, // source height
                    Math.round(x),  // target x
                    Math.round(y), // target y
                    map.tsize, // target width
                    map.tsize // target height
                );
            }
        }
    }
};

Game._drawGrid = function () {
        var width = map.cols * map.tsize;
    var height = map.rows * map.tsize;
    var x, y;
    for (var r = 0; r < map.rows; r++) {
        x = - this.camera.x;
        y = r * map.tsize - this.camera.y;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(width, y);
        this.ctx.stroke();
    }
    for (var c = 0; c < map.cols; c++) {
        x = c * map.tsize - this.camera.x;
        y = - this.camera.y;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x, height);
        this.ctx.stroke();
    }
};

Game.render = function () {
    // draw map background layer
	if(this.needsrender == true){
			this._drawLayer(0);

    // draw main character
    this.ctx.drawImage(
        this.hero.image,
        this.hero.screenX - this.hero.width / 2,
        this.hero.screenY - this.hero.height / 2);
		
	this._drawLayer(1);     // draw map top layer

    	
		
	}

		
	if (this.movePhase == true){
		this._drawLayer(0);
		this.ctx.drawImage(
        this.hero.image,
        this.hero.screenX - 32,
        this.hero.screenY - 32);
		

		for (i = 0; i< this.hero.bluelist.length; i++){
			if (this.hero.bluelist[i][2] < 2){
			Game.ctx.drawImage(
                    this.blueAtlas, // image
                    (this.hero.bluelist[i][2]) * map.tsize, // source x
                    0, // source y
                    map.tsize, // source width
                    map.tsize, // source height
                    Math.round(this.hero.bluelist[i][0]),  // target x
                    Math.round(this.hero.bluelist[i][1]), // target y
                    map.tsize, // target width
                    map.tsize // target height
                );
		}
		}
		
		
		
		for (i = 0; i< this.hero.redlist.length; i++){
			if (this.hero.redlist[i][2] < 2){
			Game.ctx.drawImage(
                    this.redAtlas, // image
                    (this.hero.redlist[i][2]) * map.tsize, // source x
                    0, // source y
                    map.tsize, // source width
                    map.tsize, // source height
                    Math.round(this.hero.redlist[i][0]),  // target x
                    Math.round(this.hero.redlist[i][1]), // target y
                    map.tsize, // target width
                    map.tsize // target height
                );
		}
		}
		
		
		
		
		if(Keyboard.MoveRight == true){

			
			
			Game.ctx.drawImage(
                    this.tileAtlas, // image
                    (this.hero.currenttile[2]) * map.tsize, // source x
                    0, // source y
                    map.tsize, // source width
                    map.tsize, // source height
                    Math.round(this.hero.currenttile[0]),  // target x
                    Math.round(this.hero.currenttile[1]), // target y
                    map.tsize, // target width
                    map.tsize // target height
                );	
			
		    
			
			this.hero.screenX = this.hero.screenX + 64 ;
			this.hero.screenY = this.hero.screenY;
			Keyboard.MoveRight = false;

		}
		
		
		if(Keyboard.MoveLeft == true){
		//	console.log("hiiiii");
			Game.ctx.drawImage(
                    this.tileAtlas, // image
                    (this.hero.currenttile[2]) * map.tsize, // source x
                    0, // source y
                    map.tsize, // source width
                    map.tsize, // source height
                    Math.round(this.hero.currenttile[0]),  // target x
                    Math.round(this.hero.currenttile[1]), // target y
                    map.tsize, // target width
                    map.tsize // target height
                );	

			this.hero.screenX = this.hero.screenX - 64 ;			
			this.hero.screenY = this.hero.screenY;
			Keyboard.MoveLeft = false;


		}
		
		if(Keyboard.MoveUp == true){
			//console.log("hiiiii");
			Game.ctx.drawImage(
                    this.tileAtlas, // image
                    (this.hero.currenttile[2]) * map.tsize, // source x
                    0, // source y
                    map.tsize, // source width
                    map.tsize, // source height
                    Math.round(this.hero.currenttile[0]),  // target x
                    Math.round(this.hero.currenttile[1]), // target y
                    map.tsize, // target width
                    map.tsize // target height
                );	

			this.hero.screenX = this.hero.screenX ;			
			this.hero.screenY = this.hero.screenY - 64;
			Keyboard.MoveUp = false;


		}
		
		
		
		if(Keyboard.MoveDown == true){
			Game.ctx.drawImage(
                    this.tileAtlas, // image
                    (this.hero.currenttile[2]) * map.tsize, // source x
                    0, // source y
                    map.tsize, // source width
                    map.tsize, // source height
                    Math.round(this.hero.currenttile[0]),  // target x
                    Math.round(this.hero.currenttile[1]), // target y
                    map.tsize, // target width
                    map.tsize // target height
                );	

			this.hero.screenX = this.hero.screenX ;			
			this.hero.screenY = this.hero.screenY + 64;
			Keyboard.MoveDown = false;


		}
		
		
		this.ctx.drawImage(
        this.hero.image,
        this.hero.screenX - 32,
        this.hero.screenY - 32);
		
		this._drawLayer(1);
		
	};
	

	

	

	this._drawGrid();
};