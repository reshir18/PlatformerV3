var World0 = function (game) { }

World0.prototype =
{
    preload: function () { 

        this.game.load.tilemap('map', 'TiledMap/mainWorld.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.tilemap('tutoMap', 'TiledMap/tutoWorld.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('world1Tiles', 'assets/Tiles/world1Tiles.png');
        this.game.load.image('world2Tiles', 'assets/Tiles/world2Tiles.png');
        this.game.load.image('world3Tiles', 'assets/Tiles/world3Tiles.png');
        this.game.load.image('sign', 'assets/Objects/sign.png');
        setWorld(6);
        
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
        if(getData(28))
            this.player = new Player(this.game, 140, 1900);
        else
            this.player = new Player(this.game, 140, 140);
        this.game.add.existing(this.player);

        this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);        

    },
    render : function()
    {
        for (portal of portals.children) 
            game.debug.body(portal);
        game.debug.body(this.player);
    },
    create: function () {
        
        var map;
        var layer;
        var ladders;
        var spikes;
        var coins;
        var keys;
        var locks;
        var orbs;
        var portals;
        var watersTop;
        var lavasTop;
        var signs
        this.loadMap();
    },
    update: function () 
    {
        this.game.physics.arcade.collide(this.player, layer);

        this.game.physics.arcade.overlap(this.player, keys, collectKeys, null, this);
        
        this.game.physics.arcade.overlap(this.player, signs, showInfos, null, this);

        this.game.physics.arcade.overlap(this.player, watersTop, waterContact, null, this);
            
        if(this.player.water)
            this.game.physics.arcade.overlap(this.player, waterExits, waterContactExit, null, this);

        //POWER UP + WATER
        if(!this.player.ghostMode)
            this.game.physics.arcade.collide(this.player, locks, openLocks, null, this);
        
        this.game.physics.arcade.collide(this.player, blocks, burnBlock, null, this);

        this.game.physics.arcade.overlap(this.player, portals, this.changeLevel, null, this);
            
        if (this.player.climbKey && this.player.climbKey.isDown && this.game.physics.arcade.overlap(this.player, ladders))
            this.player.climbUp();

        if(this.player.body.onFloor())
            this.player.jumpCount = 0;

    },
    changeLevel: function(player, portal)
    {
    	//game.world.removeAll();
        if(portal.name == "mainWorld")
        {
            insertArray(28);
            loadGame();
            this.loadMap();
        }
        else if(getOrbsCount(portal.name.substring(5)))
        {
            this.game.world.removeAll();
            this.game.state.start(portal.name);
        }
            
        
    },
    loadMap: function () 
    {
        game.world.removeAll();
        this.game.add.existing(this.player);

        if(!getData(28))
            map = this.game.add.tilemap('tutoMap');
        else
            map = this.game.add.tilemap('map');

        map.addTilesetImage('world1Tiles');
        map.addTilesetImage('world2Tiles');
        map.addTilesetImage('world3Tiles');

        map.setCollisionBetween(1, 9);

        layer = map.createLayer('layerGround');

        layer.resizeWorld();

        setMapAndLayer(map,layer);

        //SET KEYS ***********************************************************
        keys = this.game.add.group();
        keys.enableBody = true;
        map.createFromObjects('layerObj', 10, 'keys', 0, true, false, keys);
        map.createFromObjects('layerObj', 10 + 1, 'keys', 1, true, false, keys);
        map.createFromObjects('layerObj', 10 + 2, 'keys', 2, true, false, keys);
        map.createFromObjects('layerObj', 10 + 3, 'keys', 3, true, false, keys);

        for (var i = 0, len = keys.children.length; i < len; i++) 
        {
            var res = keys.children[i].name.substring(0, keys.children[i].name.length - 3);
            killCollectedObject(keys.children[i], this.player.keysArray[res.valueOf()]);
        }

        //SET LOCKS***************************************************************
        locks = this.game.add.group();
        locks.enableBody = true;
        map.createFromObjects('layerObj', 14, 'locks', 0, true, false, locks);
        map.createFromObjects('layerObj', 14 + 1, 'locks', 1, true, false, locks);
        map.createFromObjects('layerObj', 14 + 2, 'locks', 2, true, false, locks);
        map.createFromObjects('layerObj', 14 + 3, 'locks', 3, true, false, locks);
        
        for (var i = 0, len = locks.children.length; i < len;i++) 
        {
            var l = locks.children[i];  
            l.body.immovable = true;
            var res = l.name.substring(0, l.name.length - 5);
            killCollectedObject(l, this.player.locksArray[res.valueOf() + l.name.substring(l.name.length - 1)] );
        }

        coins = this.game.add.group();
        coins.enableBody = true;

        map.createFromObjects('layerObj', 19, 'coins', 0, true, false, coins);
        map.createFromObjects('layerObj', 19 + 1, 'coins', 1, true, false, coins);
        map.createFromObjects('layerObj', 19 + 2, 'coins', 2, true, false, coins);

        signs = this.game.add.group();
        signs.enableBody = true;
        map.createFromObjects('layerObj', 27, 'sign', 2, true, false, signs);


        blocks = this.game.add.group();
        blocks.enableBody = true;

        map.createFromObjects('layerObj', 22, 'powerUpBlocks', 0, true, false, blocks);

        for (var i = 0, len = blocks.children.length; i < len;i++) 
        {  
            blocks.children[i].body.immovable = true;
        }

        //SET PORTALS***************************************************************
        portals = this.game.add.group();
        portals.enableBody = true;
        map.createFromObjects('layerObj', 18, 'portal', 0, true, false, portals);
        for (portal of portals.children) 
                portal.body.setSize(30, 30, 20, 15);

        //SET LADDERS***************************************************************
        ladders = this.game.add.group();
        ladders.enableBody = true;
        map.createFromObjects('layerObj', 28, 'ladder', 0, true, false, ladders);
        for (ladder of ladders.children) 
            if(ladder.name == 'top')
                ladder.frame = 0;

        this.player.bringToTop();

        watersTop = this.game.add.group();
        watersTop.enableBody = true;

        waterExits = this.game.add.group();
        waterExits.enableBody = true;
        
        map.createFromObjects('layerObj', 23, 'liquidTop', 0, true, false, watersTop);
        map.createFromObjects('layerObj', 25, 'liquid', 0, true, false, this.game.add.group());

        for (var i = 0, len = watersTop.children.length; i < len;i++) {  
            watersTop.children[i].body.immovable = true;
            var exitBlock = game.add.sprite(watersTop.children[i].body.x , watersTop.children[i].body.y - 60, 'cloud_2');
            exitBlock.alpha = 0;
            waterExits.add(exitBlock);
        }

        setHud(this.player);
    }
}