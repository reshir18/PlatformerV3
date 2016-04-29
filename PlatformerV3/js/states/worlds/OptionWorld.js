var OptionWorld = function (game) { }

OptionWorld.prototype =
{
    preload: function () { 

        this.game.load.tilemap('map', 'TiledMap/optionWorld.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('world5Tiles', 'assets/Tiles/world5Tiles.png');
        setWorld(6);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.player = new Player(this.game, 140, 140);

        this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);        

    },
    create: function () {
        this.game.miniMapSize = 4;
        var map;
        var layer;
        var ladders;
        var optionPoints
        this.loadMap();
    },
    update: function () 
    {
        this.game.physics.arcade.collide(this.player, layer);

        this.player.canExecuteOptionAction = this.game.physics.arcade.overlap(this.player, optionPoints, setOptionAction, null, this);
            
        if (this.player.climbKey && this.player.climbKey.isDown && this.game.physics.arcade.overlap(this.player, ladders))
            this.player.climbUp();

        if(this.player.body.onFloor())
            this.player.jumpCount = 0;

    },
    loadMap: function () 
    {
        this.game.add.existing(this.player);
        map = this.game.add.tilemap('map');

        map.addTilesetImage('world5Tiles');

        map.setCollisionBetween(1, 3);

        layer = map.createLayer('layerGround');

        layer.resizeWorld();

        setMapAndLayer(map,layer);
       
        //SET OPTIONS POINTS***************************************************************
        optionPoints = this.game.add.group();
        optionPoints.enableBody = true;
        map.createFromObjects('layerObj', 4, 'deleteOptions', 0, true, false, optionPoints);
        map.createFromObjects('layerObj', 5, 'deleteOptions', 1, true, false, optionPoints);
        map.createFromObjects('layerObj', 6, 'deleteOptions', 2, true, false, optionPoints);

        //SET LADDERS***************************************************************
        ladders = this.game.add.group();
        ladders.enableBody = true;
        map.createFromObjects('layerObj', 7, 'ladder', 1, true, false, ladders);
        for (ladder of ladders.children) 
            if(ladder.name == 'top')
                ladder.frame = 0;

        for (portal of portals.children) 
        {
            portal.body.setSize(30, 30, 20, 15);
            gameHud.refreshWorldInfo(portal);
        }

        this.player.bringToTop();

        setHud(this.player);

        for (optP of optionPoints.children) 
        {    
            gameHud.refreshWorldInfo(optP, optP.name);
        }

        this.game.map = map;
        var miniMapBmd = this.game.add.bitmapData((this.game.map.width + 2)* this.game.miniMapSize, (this.game.map.height + 2) * this.game.miniMapSize);
        miniMapBmd.ctx.fillStyle = '#FFF';
        miniMapBmd.ctx.globalAlpha = 0.5;
        miniMapBmd.ctx.fillRect(0,0, (this.game.map.width + 2)* this.game.miniMapSize, (this.game.map.height + 2) * this.game.miniMapSize);
        miniMapBmd.ctx.globalAlpha = 1;
        //Draw borders in black
        miniMapBmd.ctx.fillStyle = '#000';
        //Top border
        miniMapBmd.ctx.fillRect(0, 0, (this.game.map.width + 2) * this.game.miniMapSize, this.game.miniMapSize);
        //Bottom border
        miniMapBmd.ctx.fillRect(0, (this.game.map.height + 1) * this.game.miniMapSize, (this.game.map.width + 2) * this.game.miniMapSize, this.game.miniMapSize);
        //Left border
        miniMapBmd.ctx.fillRect(0, 0, this.game.miniMapSize, (this.game.map.height + 2) * this.game.miniMapSize);
        //Right border
        miniMapBmd.ctx.fillRect((this.game.map.width + 1) * this.game.miniMapSize, 0, this.game.miniMapSize, (this.game.map.height + 2) *  this.game.miniMapSize);
        for (l=0; l<this.game.map.layers.length; l++) 
        {
            for (y = 0; y < this.game.map.height; y++) 
            {      
                for (x = 0; x < this.game.map.width ; x++) 
                {
                    var tile = this.game.map.getTile(x, y, l);
                    if (tile && this.game.map.layers[l].name == 'layerGround') 
                    {
                        // fill a pixel in the minimap
                        miniMapBmd.ctx.fillStyle = '#808080';
                        miniMapBmd.ctx.fillRect((x + 1) * this.game.miniMapSize, (y + 1)* this.game.miniMapSize, this.game.miniMapSize, this.game.miniMapSize);         
                    }
                    /*else if ... other types of tiles*/      
                }   
            }
        }
        //Set the spwan place of the player
        miniMapBmd.ctx.fillStyle = '#f06';
        miniMapBmd.ctx.fillRect((this.player.body.x + 70) / 70  * this.game.miniMapSize, (this.player.body.y + 70) / 70 * this.game.miniMapSize, this.game.miniMapSize, this.game.miniMapSize);
        //this.game.miniMap = this.game.add.sprite(x, y, miniMapBmd);
        this.game.miniMap = this.game.add.sprite(x, this.game.height - (y * this.game.miniMapSize) - 20 , miniMapBmd);
        // dynamic bmd where I draw mobile stuff like friends and enemies 
        this.game.miniMapOverlay = this.game.add.bitmapData(this.game.map.width*this.game.miniMapSize, this.game.map.height*this.game.miniMapSize);
        //this.game.add.sprite(this.game.miniMap.x, this.game.miniMap.y, this.game.miniMapOverlay);
        this.game.miniMap.fixedToCamera = true;
        this.game.miniMap.visible = this.player.key == 'perso';
            
    }
}