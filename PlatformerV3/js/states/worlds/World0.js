var World0 = function (game) { }

World0.prototype =
{
    preload: function () {

        this.game.load.tilemap('map', 'TiledMap/mainWorld.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.tilemap('tutoMap', 'TiledMap/tutoWorld.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('world1Tiles', 'assets/Tiles/world1Tiles.png');
        this.game.load.image('world2Tiles', 'assets/Tiles/world2Tiles.png');
        this.game.load.image('world3Tiles', 'assets/Tiles/world3Tiles.png');
        this.game.load.image('world4Tiles', 'assets/Tiles/world4Tiles.png');
        this.game.load.image('world5Tiles', 'assets/Tiles/world5Tiles.png');
        this.game.load.spritesheet('world3TilesS', 'assets/Tiles/world3Tiles.png', 70, 70);
        game.load.audio('ambient', ['assets/audio/mainWorldAmbient.mp3', 'assets/audio/mainWorldAmbient.ogg']);
        this.game.load.image('sign', 'assets/Objects/sign.png');
        setWorld(6);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        if(portalCoord[2])
        {
            this.player = new Player(this.game, portalCoord[0], portalCoord[1]);
            portalCoord = [0,0,false];
        }
        else if(getData(28))
        {
            this.player = new Player(this.game, 140, 1900);
        }
        else
            this.player = new Player(this.game, 140, 140);

        this.game.add.existing(this.player);

        this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);

    },
    render : function()
    {
        if(breathLoop && !this.player.canBreathUnderwater)
            gameHud.refreshAirBar();
        /*for (portal of portals.children)
            game.debug.body(portal);
        game.debug.body(this.player);*/
    },
    create: function () {
        this.game.miniMapSize = 4;
        var map;
        var layer;
        var ladders;
        var spikes;
        var coins;
        var keys;
        var locks;
        var magnetBlock;
        var orbs;
        var portals;
        var watersTop;
        var lavasTop;
        var signs
        this.loadMap();
        music = game.add.audio('ambient');
        //music.play('', 0, 1, true);
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

        if(this.player.body.onFloor() || this.player.body.touching.down)
            this.player.jumpCount = 0;

        if(this.player.magnetMode)
            this.game.physics.arcade.collide(this.player, magnetBlock);

        movePlayerMinimap(this.player);


    },
    changeLevel: function(player, portal)
    {
    	//game.world.removeAll();
        gameHud.currentLevel = 0;
        if(portal.name == "mainWorld")
        {
            gameHud.currentWorld = "MainWorld";
            insertArray(28);
            saveGame();
            loadGame();
            this.loadMap();
        }
        if(portal.name == "OptionWorld")
        {
            gameHud.currentWorld = portal.name;
            this.game.state.start("OptionWorld");
        }
        else if(getOrbsCount(portal.name.substring(5)))
        {
            setMainWorldPortalCoord(portal);
            this.game.world.removeAll();
            setWorld(portal.name.substring(5));
            this.game.state.start("World1");
            pauseHud.currentWorld = getSpecificWorldData(parseInt(portal.name.substring(5)) - 1).name;
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
        map.addTilesetImage('world4Tiles');
        map.addTilesetImage('world5Tiles');

        map.setCollisionBetween(1, 9);
        map.setCollisionBetween(30, 35);

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

        map.createFromObjects('layerObj', 9, 'world3TilesS', 2, true, false, blocks);

        for (var i = 0, len = blocks.children.length; i < len;i++)
        {
            blocks.children[i].body.immovable = true;
        }

        //SET PORTALS***************************************************************
        portals = this.game.add.group();
        portals.enableBody = true;
        map.createFromObjects('layerObj', 18, 'portal', 0, true, false, portals);

        //SET LADDERS***************************************************************
        ladders = this.game.add.group();
        ladders.enableBody = true;
        map.createFromObjects('layerObj', 28, 'ladder', 1, true, false, ladders);
        for (ladder of ladders.children)
            if(ladder.name == 'top')
                ladder.frame = 0;

        magnetBlock = this.game.add.group();
        magnetBlock.enableBody = true;
        map.createFromObjects('layerObj', 29, 'powerUpBlocks', 1, true, false, magnetBlock);
        for (mBlock of magnetBlock.children)
                mBlock.body.immovable = true;

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
        if(getData(28))
        {
            for (portal of portals.children)
            {
                portal.body.setSize(30, 30, 20, 15);
                if(portal.name != "OptionWorld")
                    gameHud.refreshWorldInfo(portal);
                else
                    gameHud.refreshWorldInfo(portal, "Option World");

            }
        }
        this.game.map = map;
        generateMinimap(this.game, this.player.body, '#808080');
        this.game.miniMap.visible = this.player.key == 'perso';
        this.game.miniMapPlayerPosition.visible = this.player.key == 'perso';

    }
}