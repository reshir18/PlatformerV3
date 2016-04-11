
var map;
var layer;
var fisrtKeyId = 4;
var fisrtLockId = fisrtKeyId + 4;

var firstCoinId = fisrtLockId + 5;
var firstOrbId = firstCoinId + 3;
var firstLiquidId = 28;

function setMapAndLayer(m,l)
{
	map = m;
	layer = l;
}

function setCoinNumber(children, pos, array)
{
    for (var i = 0, len = children.length; i < len; i++) {
        children[i].coinNumber = i + pos;
        killCollectedObject(children[i], array[i + pos])
    }
}

function generateBurningBlocks(block) 
{
    map.createFromObjects('layerObj', 26, 'powerUpBlocks', 0, true, false, block);
    for (var i = 0, len = block.children.length; i < len;i++) { 
        var bl = block.children[i]; 
        bl.body.immovable = true;
        bl.body.collideWorldBounds = true;
        bl.defaultPosY = bl.body.y;
        bl.defaultPosX = bl.body.x;
    }
}

function generateKeys(keys, player) 
{
    map.createFromObjects('layerObj', fisrtKeyId, 'keys', 0, true, false, keys);
    map.createFromObjects('layerObj', fisrtKeyId + 1, 'keys', 1, true, false, keys);
    map.createFromObjects('layerObj', fisrtKeyId + 2, 'keys', 2, true, false, keys);
    map.createFromObjects('layerObj', fisrtKeyId + 3, 'keys', 3, true, false, keys);

    for (var i = 0, len = keys.children.length; i < len; i++) {
        var res = keys.children[i].name.substring(0, keys.children[i].name.length - 3);
        killCollectedObject(keys.children[i], player.keysArray[res.valueOf()]);
    }
}

function generateLocks(locks, player) 
{
    map.createFromObjects('layerObj', fisrtLockId, 'locks', 0, true, false, locks);
    map.createFromObjects('layerObj', fisrtLockId + 1, 'locks', 1, true, false, locks);
    map.createFromObjects('layerObj', fisrtLockId + 2, 'locks', 2, true, false, locks);
    map.createFromObjects('layerObj', fisrtLockId + 3, 'locks', 3, true, false, locks);
    
    for (var i = 0, len = locks.children.length; i < len;i++) {
        var l = locks.children[i];  
        l.body.immovable = true;
        var res = l.name.substring(0, l.name.length - 5);
        killCollectedObject(l, player.locksArray[res.valueOf() + l.name.substring(l.name.length - 1)] );
    }
}

function generateOrbs(orbs, player) 
{
    //ORB CELESTE
    var positionFirstOrbInArray  = (currentWorld-1) * 5;
    if (getData(positionFirstOrbInArray + 3))
        map.createFromObjects('layerObj', firstOrbId + 3, 'emptyOrb', 0, true, false, orbs);
    else 
        map.createFromObjects('layerObj', firstOrbId + 3, 'orbs', 3, true, false, orbs);

    //ORB DES 100 PIECES
    if (getData(positionFirstOrbInArray + 2))
        map.createFromObjects('layerObj', firstOrbId + 2, 'emptyOrb', 0, true, false, orbs);
    else if (player.goldCoinsNumber >= 100)
        map.createFromObjects('layerObj', firstOrbId + 2, 'orbs', 0, true, false, orbs);
    else 
        map.createFromObjects('layerObj', firstOrbId + 2, 'orbs', 2, true, false, orbs);

    //ORB DES 8 PIECES MAUVES
    if (getData(positionFirstOrbInArray + 1))
        map.createFromObjects('layerObj', firstOrbId + 1, 'emptyOrb', 0, true, false, orbs);
    else if (player.checkDarkCoins())
        map.createFromObjects('layerObj', firstOrbId + 1, 'orbs', 0, true, false, orbs);
    else 
        map.createFromObjects('layerObj', firstOrbId + 1, 'orbs', 1, true, false, orbs);

    //ORB PRINCIPALE DU LEVEL
    if (getData(positionFirstOrbInArray)) 
        map.createFromObjects('layerObj', firstOrbId, 'emptyOrb', 0, true, false, orbs);
    else 
        map.createFromObjects('layerObj', firstOrbId, 'orbs', 0, true, false, orbs);
}

function generateCoins(gold, dark, sky, player, gPosition, dPosition) 
{
    map.createFromObjects('layerObj', firstCoinId, 'coins', 0, true, false, gold);
    map.createFromObjects('layerObj', firstCoinId + 1, 'coins', 1, true, false, dark);
    map.createFromObjects('layerObj', firstCoinId + 2, 'coins', 2, true, false, sky);

    setCoinNumber(gold.children, gPosition, player.goldCoinsArray);

    console.log(gold.children.length);

    setCoinNumber(dark.children, dPosition, player.darkCoinsArray);

    for (var i = 0, len = sky.children.length; i < len; i++) {
        sky.children[i].coinNumber = sky.children[i].name.substring(sky.children[i].name.length - 1);
        killCollectedObject(sky.children[i], player.skyCoinsArray[sky.children[i].coinNumber - 1]);
    }
}

function generateWaters(top, bottom, exit)
{
    map.createFromObjects('layerObj', firstLiquidId, 'liquidTop', 0, true, false, top);
    map.createFromObjects('layerObj', firstLiquidId + 2, 'liquid', 0, true, false, bottom);

    for (var i = 0, len = top.children.length; i < len;i++) {  
        top.children[i].body.immovable = true;
        var exitBlock = game.add.sprite(top.children[i].body.x , top.children[i].body.y - 60, 'cloud_2');
        exitBlock.alpha = 0;
        exit.add(exitBlock);
    }
}

function generateLavas(top, bottom, exit)
{
    map.createFromObjects('layerObj', firstLiquidId + 1, 'liquidTop', 1, true, false, top);
    map.createFromObjects('layerObj', firstLiquidId + 3, 'liquid', 1, true, false, bottom);

    for (var i = 0, len = top.children.length; i < len;i++) {  
        top.children[i].body.immovable = true;
        var exitBlock = game.add.sprite(top.children[i].body.x , top.children[i].body.y - 60, 'cloud_2');
        exitBlock.alpha = 0;
        exit.add(exitBlock);
        top.children[i].alpha = 0.8;
    }

    for (var i = 0, len = bottom.children.length; i < len;i++) {  
        bottom.children[i].alpha = 0.8;
    }
}