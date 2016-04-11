//BATTLES ENEMIES COORD: y: 4; x: 6-8-10
var World1 = function (game) { }

World1.prototype =
{
    preload: function () { 

        this.game.load.tilemap('map1', 'TiledMap/level1-1.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.tilemap('map2', 'TiledMap/level1-2.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.tilemap('map3', 'TiledMap/level1-3.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.tilemap('map4', 'TiledMap/level1-4.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.tilemap('mapBattle', 'TiledMap/level1-battle.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('world1Tiles', 'assets/Tiles/world1Tiles.png');
        background = this.game.load.image('plain', 'assets/Background/world1.png');
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        setWorld(1);
        this.player = new Player(this.game, 140, 140);
        //this.game.add.existing(this.player);
        this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);
        
    },
    render : function()
    {
        if(enemies.children[0])
        {
            for(en of enemies.children)
            {
                this.game.debug.geom(en.seeLineFloor);
                this.game.debug.geom(en.seeLineWall);

            }
        }
        for (portal of portals.children) 
                game.debug.body(portal);
        
    },
    create: function () {
        //LEVEL1 = 0 --- 0
        //LEVEL2 = 2 --- 50
        //LEVEL3 = 5 --- 50 + 47
        //LEVEL4 = 6 --- 50 + 47 + 12
        //Level5 = Nan - 50 + 47 + 12 + 53
        var map;
        var layer;
        var ladders;
        var spikes;
        var goldCoins;
        var darkCoins;
        var skyCoins;
        var keys;
        var locks;
        var orbs;
        var portals;
        var powerUp;
        var blocks;
        var potions;
        var watersTop;
        var lavasTop;
        var cages;
        var enemies;
        var foes;
        var maxEnemiesType = 2;
        var oldmap = ["map1",0,0,140,140];
        var nbFoes;
        this.changeMap('map1',0,0, true);

    },
    update: function () {
        

        this.game.physics.arcade.collide(this.player, layer);
        
        this.game.physics.arcade.collide(blocks, layer);
        
        this.game.physics.arcade.collide(enemies, layer);
        
        this.game.physics.arcade.collide(foes, layer);

        for(en of enemies.children)
            if(layer)
                moveEnemy(en, layer);

        
        this.game.physics.arcade.overlap(this.player, enemies, this.enterBattle, null, this);

        this.game.physics.arcade.overlap(this.player, keys, collectKeys, null, this);

        this.game.physics.arcade.overlap(this.player, orbs, getOrbs, null, this);

        this.game.physics.arcade.overlap(this.player, darkCoins, collectDarkCoins, null, this);

        this.game.physics.arcade.overlap(this.player, skyCoins, collectSkyCoins, null, this);

        this.game.physics.arcade.overlap(this.player, goldCoins, collectGoldCoins, null, this);

        this.game.physics.arcade.overlap(this.player, watersTop, waterContact, null, this);
        
        this.game.physics.arcade.overlap(this.player, lavasTop, lavaContact, null, this);

        this.game.physics.arcade.overlap(this.player, potions, collectPotions, null, this);
            
        if(this.player.water)    
            this.game.physics.arcade.overlap(this.player, waterExits, waterContactExit, null, this);

        if(this.player.lava)    
            this.game.physics.arcade.overlap(this.player, lavaExits, lavaContactExit, null, this);
   
        this.game.physics.arcade.overlap(this.player, blocks, moveBlock, null, this);

        //POWER UP + WATER
        if(!this.player.ghostMode)
            this.game.physics.arcade.collide(this.player, locks, openLocks, null, this);

         //POWER UP + WATER
        if(!this.player.ghostMode)
            this.game.physics.arcade.collide(this.player, cages);
        
        this.game.physics.arcade.collide(this.player, blocks, burnBlock, null, this);
        
        this.game.physics.arcade.collide(this.player, powerUp, getPowerUp1, null, this);

        this.game.physics.arcade.overlap(this.player, spikes, takeDamages, null, this);

        this.game.physics.arcade.overlap(this.player, portals, this.changeLevel, null, this);
            
        if (this.player.climbKey && this.player.climbKey.isDown && this.game.physics.arcade.overlap(this.player, ladders))
            this.player.climbUp();
    
        if(this.player.body.onFloor())
            this.player.jumpCount = 0;

    },
    changeLevel: function(player, portal)
    {
        if(portal.name !== "normalMap")
            maxEnemiesType = parseInt(portal.name.substring(3)) + 1;
        if(portal.name == "map1")
            this.changeMap('map1', 0, 0);
        if(portal.name == "map2")
            this.changeMap('map2', 2, 50);
        if(portal.name == "map3")
            this.changeMap('map3', 5, 50 + 47);
        if(portal.name == "map4")
            this.changeMap('map4', 6, 50 + 47 + 12);
        if(portal.name == "map5" && this.player.checkSkyCoins())
            this.changeMap('map5', 8, 50 + 47 + 12 + 53)
        if(portal.name == "normalMap")
        {
            for(f of foes.children)
            {
                foes.children[0].destroy();
            }
            this.changeMap();
        }
            
    },
    enterBattle: function(player, foe)
    {
        oldmap = ["map" + (maxEnemiesType - 1),oldmap[1],oldmap[2],foe.body.x,foe.body.y, foe.mobPositionInWorld];
        foe.destroy();
        this.changeMap('mapBattle');
        
    },
    changeMap: function (mapDraw,firstRedCoinposition, firstCoinposition, firstTime) {
        
        if(!firstTime)
        {
            game.world.removeAll();
            
        }
        else
            maxEnemiesType = 2;

        this.game.add.existing(this.player);

        returnFromBattle = false;
        if(!mapDraw)
        {
            returnFromBattle = true;
            mapDraw = oldmap[0];
            firstRedCoinposition = oldmap[1];
            firstCoinposition = oldmap[2];
            this.player.body.x = oldmap[3];
            this.player.body.y = oldmap[4] - 40;
        }
        else if(mapDraw !== "mapBattle")
        {
            oldmap = [mapDraw,firstRedCoinposition,firstCoinposition,0,0,0];
        }
        map = this.game.add.tilemap(mapDraw);
        background = game.add.sprite(0, 0, 'plain');

        map.addTilesetImage('world1Tiles');

        map.setCollisionBetween(1, 3);
        map.setCollisionBetween(8, 11);
        map.setCollisionBetween(29, 30);

        layer = map.createLayer('layerGround');

        layer.resizeWorld();

        background.height = game.world.height;
        background.width = game.world.width;
        background.smoothed = false;

        setMapAndLayer(map,layer);
        
        foes = this.game.add.group();
        foes.enableBody = true;
        
        enemies = this.game.add.group();
        enemies.enableBody = true;

        potions = this.game.add.group();
        potions.enableBody = true;

        if(mapDraw == 'mapBattle')
        {
            this.player.body.x = 250;
            this.player.body.y = 250;
            nbFoes = parseInt(Math.floor((Math.random() * 3) + 1));
            potionGift = 0;

            for (var i = 0; i < nbFoes; i++)
            {
                foeType = parseInt(Math.floor((Math.random() * maxEnemiesType) + 1));
                potionGift += foeType;
                posX = (6.15 + (i*2)) * 70;
                posY = 280 - (70 * i);
                foes.add(enemyFactory(foeType, this.game, posX, posY, i))
            }
            battleDatas.setInfos(nbFoes, potionGift, potions, foes.children);
                
        }
        else
        {
            mobPos = 0;
            map.createFromObjects('layerObj', 32, 'slime', 0, true, false, enemies);
            for(e of enemies.children)
            {
                    e.seeLineFloor = new Phaser.Line();
                    e.seeLineWall = new Phaser.Line();
                    e.seeLineFloor.start.set(e.body.x + 22, e.body.y + 14);
                    e.moveDirection = -1;
                    e.seeLineFloor.end.set(e.body.x - 65, e.body.y + 70);
                    layer.getRayCastTiles(e.seeLineFloor, 4, false, false);
                    e.mobPositionInWorld = mobPos;
                    mobPos++;   
            }
            if(returnFromBattle)
                enemies.children[oldmap[5]].destroy();  
        }

        //SET KEYS ***********************************************************
        keys = this.game.add.group();
        keys.enableBody = true;
        generateKeys(keys, this.player);

        //SET LOCKS***************************************************************
        locks = this.game.add.group();
        locks.enableBody = true;
        generateLocks(locks, this.player);

        blocks = this.game.add.group();
        blocks.enableBody = true;
        generateBurningBlocks(blocks)

        //SET PORTALS***************************************************************
        portals = this.game.add.group();
        portals.enableBody = true;
        map.createFromObjects('layerObj', 12, 'portal', 0, true, false, portals);
        for (portal of portals.children) 
                portal.body.setSize(30, 30, 20, 15);

        //SET COLLECTIBLES***********************************************************
        goldCoins = this.game.add.group();
        goldCoins.enableBody = true;
        darkCoins = this.game.add.group();
        darkCoins.enableBody = true;
        skyCoins = this.game.add.group();
        skyCoins.enableBody = true;

        orbs = this.game.add.group();
        orbs.enableBody = true;
        
        powerUp = this.game.add.group();
        if(mapDraw.valueOf() === "map2" && !getData(4))
        {
            powerUp.enableBody = true;
            map.createFromObjects('layerObj', 22, 'powersUp', 0, true, false, powerUp);
        }

        generateOrbs(orbs, this.player);

        generateCoins(goldCoins, darkCoins, skyCoins, this.player, firstCoinposition, firstRedCoinposition);

        //SET LADDERS***************************************************************
        ladders = this.game.add.group();
        ladders.enableBody = true;
        map.createFromObjects('layerObj', 20, 'ladder', 1, true, false, ladders);
         for (ladder of ladders.children) 
                if(ladder.name == 'top')
                    ladder.frame = 0;

        //SET TRAPS***************************************************************
        spikes = this.game.add.group();
        spikes.enableBody = true;
        map.createFromObjects('layerObj', 21, 'spikes', 0, true, false, spikes);

        cages = this.game.add.group();
        cages.enableBody = true;
        map.createFromObjects('layerObj', 27, 'powerUpBlocks', 2, true, false, cages);
        for (cage of cages.children) 
                cage.body.immovable = true;

        this.player.bringToTop();

        watersTop = this.game.add.group();
        watersTop.enableBody = true;

        waterExits = this.game.add.group();
        waterExits.enableBody = true;

        lavasTop = this.game.add.group();
        lavasTop.enableBody = true;

        lavaExits = this.game.add.group();
        lavaExits.enableBody = true;

        generateWaters(watersTop, this.game.add.group(), waterExits);
        generateLavas(lavasTop, this.game.add.group(), lavaExits);

        setHud(this.player);
    }
}