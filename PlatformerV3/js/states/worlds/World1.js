
var World1 = function (game) { }

World1.prototype =
{
    preload: function () { 
        tiledmapCommonStart = 'TiledMap/level';
        currentWorldData = getWorldData();
        this.game.load.tilemap('map1', tiledmapCommonStart + currentWorld + '-1.json', null, Phaser.Tilemap.TILED_JSON);
        /*this.game.load.tilemap('map2', tiledmapCommonStart + currentWorld + '-2.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.tilemap('map3', tiledmapCommonStart + currentWorld + '-3.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.tilemap('map4', tiledmapCommonStart + currentWorld + '-4.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.tilemap('mapBattle', tiledmapCommonStart + currentWorld + '-battle.json', null, Phaser.Tilemap.TILED_JSON);*/
        background = this.game.load.image('plain', 'assets/Background/world' + currentWorld +'.png');
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.player = new Player(this.game, 140, 140);
        this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);
        this.game.hasEmitter = false;

    },
    render : function()
    {
        if(breathLoop && !this.player.canBreathUnderwater)
            gameHud.refreshAirBar();
        this.game.debug.text('render FPS: ' + (this.game.time.fps || '--') , 2, 14, "#00ff00");
        if(enemies.children[0])
        {
            for(en of enemies.children)
            {
                this.game.debug.geom(en.seeLineFloor);
                this.game.debug.geom(en.seeLineWall);
            }
        }  
    },
    create: function () {
        this.game.miniMapSize = 4;
        this.game.time.advancedTiming = true;
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
        var savePoints;
        pauseHud.currentLevel = 1;
        this.changeMap('map1', true);
        this.game.miniMap.visible = true;
        

    },
    update: function () {
        
        this.game.physics.arcade.collide(this.player, layer);
        
        this.game.physics.arcade.collide(blocks, layer);
        
        this.game.physics.arcade.collide(enemies, layer);
        
        this.game.physics.arcade.collide(foes, layer);

        for(en of enemies.children)
            if(layer)
                moveEnemy(en, layer);
        
        this.player.canSaveGame = this.game.physics.arcade.overlap(this.player, savePoints);
    
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
        {
            this.game.physics.arcade.collide(this.player, locks, openLocks, null, this);
            this.game.physics.arcade.collide(this.player, cages);
            this.game.physics.arcade.overlap(this.player, spikes, takeDamages, null, this);
            this.game.physics.arcade.overlap(this.player, portals, this.changeLevel, null, this);
            this.game.physics.arcade.overlap(this.player, enemies, this.enterBattle, null, this);
        }
        
        this.game.physics.arcade.collide(this.player, blocks, burnBlock, null, this);
        
        this.game.physics.arcade.collide(this.player, powerUp, getPowersUp, null, this);
            
        if (this.player.climbKey && this.player.climbKey.isDown && this.game.physics.arcade.overlap(this.player, ladders))
            this.player.climbUp();
    
        if(this.player.body.onFloor() || this.player.body.touching.down)
            this.player.jumpCount = 0;

    },
    changeLevel: function(player, portal)
    {
        if(this.emitter)
            emitter.destroy();
        if(portal.name !== "normalMap")
        {
            maxEnemiesType = parseInt(portal.name.substring(3)) + 1;
            if(portal.name == "map5" && this.player.checkSkyCoins())
            {
                maxEnemiesType--;
                this.changeMap('map5')
            }
            else
            {
                pauseHud.currentLevel = parseInt(portal.name.substring(3));
                this.changeMap(portal.name);
            }
        }
        else
        {
            for(f of foes.children)
            {
                foes.children[0].destroy();
            }
            pauseHud.currentLevel = parseInt(portal.name.substring(3));
            this.changeMap();
        }
    },
    enterBattle: function(player, foe)
    {
        oldmap = ["map" + (maxEnemiesType - 1),oldmap[1],oldmap[2],foe.body.x,foe.body.y, foe.mobPositionInWorld];
        this.game.time.events.removeAll();
        foe.destroy();
        this.changeMap('mapBattle');
        
    },
    changeMap: function (mapDraw, firstTime) {
        
        firstGoldCoinPosition = 0;
        firstDarkCoinPosition = 0;
        currentMap = "map0";
        returnFromBattle = false;

        if(!firstTime)
            game.world.removeAll();
        else
            maxEnemiesType = 2;

        this.game.add.existing(this.player);

        if(!mapDraw)
        {
            returnFromBattle = true;
            battleDatas.isOnBattle = false;
            mapDraw = oldmap[0];
            firstGoldCoinPosition = oldmap[1];
            firstDarkCoinPosition = oldmap[2];
            this.player.body.x = oldmap[3];
            this.player.body.y = oldmap[4] - 40;
        }
        else if(mapDraw !== "mapBattle")
        {
            currentMap = mapDraw.substring(3);
            for (var i = 0; i < parseInt(currentMap) ; i++) 
            {
               firstGoldCoinPosition += currentWorldData.goldCoin[i].valueOf();
            };
            firstDarkCoinPosition = currentWorldData.darkCoin[currentMap-1];
            oldmap = [mapDraw,firstGoldCoinPosition,firstDarkCoinPosition,0,0,0];
        }
        
        map = this.game.add.tilemap(mapDraw);
        background = game.add.sprite(0, 0, 'plain');

        map.addTilesetImage('world'+ currentWorld +'Tiles');

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
            map.createFromObjects('layerObj', 32, currentWorldData.mobWorldMap, 0, true, false, enemies);
            for(e of enemies.children)
            {
                    e.seeLineFloor = new Phaser.Line();
                    e.seeLineWall = new Phaser.Line();
                    e.seeLineFloor.start.set(e.body.x + 22, e.body.y + 14);
                    e.moveDirection = -1;
                    e.seeLineFloor.end.set(e.body.x - 65, e.body.y + 70);
                    e.anchor.setTo(.5,0);
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

        //SET PORTALS***************************************************************
        portals = this.game.add.group();
        portals.enableBody = true;
        map.createFromObjects('layerObj', 12, 'portal', 0, true, false, portals);
        for (portal of portals.children)
        {
            portal.body.setSize(30, 30, 20, 15);
            if(portal.name == "map5" && !this.player.checkSkyCoins())
                portal.kill();
        } 

        //SAVES POINTS ************************************************************/
        savePoints = this.game.add.group();
        savePoints.enableBody = true;
        map.createFromObjects('layerObj', 33, 'savePoints', 0, true, false, savePoints);

        //SET COLLECTIBLES***********************************************************
        goldCoins = this.game.add.group();
        goldCoins.enableBody = true;
        darkCoins = this.game.add.group();
        darkCoins.enableBody = true;
        skyCoins = this.game.add.group();
        skyCoins.enableBody = true;

        orbs = this.game.add.group();
        orbs.enableBody = true;
        //currentWorldData.powerUpSpawnInfo[].valueOf()
        powerUp = this.game.add.group();
        if(mapDraw.valueOf() === currentWorldData.powerUpSpawnInfo[0].valueOf() && !getData(currentWorldData.powerUpSpawnInfo[1].valueOf()))
        {
            powerUp.enableBody = true;
            map.createFromObjects('layerObj', currentWorldData.powerUpSpawnInfo[2].valueOf(), 'powersUp', currentWorldData.powerUpSpawnInfo[3].valueOf(), true, false, powerUp);
            powerUp.children[0].indexSaveArray = currentWorldData.powerUpSpawnInfo[1].valueOf();
        }

        generateOrbs(orbs, this.player);

        generateCoins(goldCoins, darkCoins, skyCoins, this.player, firstGoldCoinPosition, firstDarkCoinPosition);

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

        blocks = this.game.add.group();
        blocks.enableBody = true;
        generateBurningBlocks(blocks);
        
        setHud(this.player);

        this.game.map = map;
        generateMinimap(this.game, this.player.body, currentWorldData.minimapTileColor);
        this.game.miniMap.visible = this.player.key == 'perso';
    }
}