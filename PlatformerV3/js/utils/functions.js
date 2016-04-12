function collectKeys (player, keys) 
{
	var res = keys.name.substring(0, keys.name.length - 3);
	console.log(res.valueOf());
	if(!player.keysArray[res.valueOf()])
	{
		player.keysArray[res.valueOf()] = res.valueOf();
		gameHud.refreshKeysAdd(res);
		keys.kill();
	}
}
function openLocks (player, locks) 
{
	var res = locks.name.substring(0, locks.name.length - 5);

	console.log(res.valueOf());
	if(player.keysArray[res.valueOf()])
	{
		player.keysArray[res.valueOf()] = false;
		player.locksArray[res.valueOf() + locks.name.substring(locks.name.length - 1)] = true;
		locks.kill();
		gameHud.refreshKeys();
	}
}
function collectGoldCoins (player, coin) 
{
	player.goldCoinsNumber++;
	player.goldCoinsArray[coin.coinNumber] = true;
	coin.kill();
	gameHud.refreshGoldCoinNumber();
	particleBurst(coin, 'stars');
}

function collectDarkCoins (player, coin) 
{
	player.darkCoinsNumber++;
	player.goldCoinsNumber+=2;
	player.darkCoinsArray[coin.coinNumber] = true;
	coin.kill();
	gameHud.refreshDarkCoinNumber();
	particleBurst(coin, 'starsDark');
}

function collectSkyCoins (player, coin) 
{
	player.goldCoinsNumber+=5;
	player.skyCoinsNumber++;
	player.skyCoinsArray[coin.coinNumber - 1] = true;
	coin.kill();
	particleBurst(coin, 'starsSky');
}

function collectPotions(player, potion)
{
	var amount = 0;
	pot = battleDatas.getPotionName();
	if(pot == "healPotion")
		amount = 50;
	if(pot == "fairyPotion")
		player.maxHp += 50;
	if(pot == "halfPotion")
		amount = player.maxHp * 0.5;
	if(pot == "maxPotion" || pot == "fairyPotion")
		amount = player.maxHp;
	killCollectedObject(potion, player.heal(amount));

}

function getPowerUp1 (player, wind) 
{
	player.windStateKey.onDown.add(player.switchPowerUpWind,player);
	player.switchPowerUpWind();
	insertArray(4);
	wind.kill();
}

function getPowerUp1Plus (player, wind) 
{
	player.powerUpKey.onDown.add(player.switchFlyMode,player);
	insertArray(24);
	wind.kill();
}

function getPowerUp2 (player, fire) 
{
	player.fireStateKey.onDown.add(player.switchPowerUpFire,player);
	player.switchPowerUpFire();
	insertArray(9);
	fire.kill();
}

function getPowerUp2Plus (player, fire) 
{
	player.canSwimLava = true;
	insertArray(25);
	fire.kill();
}

function getPowerUp3 (player, water) 
{
	player.waterStateKey.onDown.add(player.switchPowerUpWater,player);
	player.canBreathUnderwater = true;
	insertArray(14);
	water.kill();
}

function getPowerUp3Plus (player, water) 
{
	player.powerUpKey.onDown.add(player.switchGhostMode,player);
	insertArray(26);
	water.kill();
}

function getPowerUp4 (player, earth) 
{
	player.earthStateKey.onDown.add(player.switchPowerUpEarth,player);
	player.powerUpKey.onDown.add(player.switchRockMode,player);
	insertArray(19);
	earth.kill();
}

function getPowerUp4Plus (player, earth) 
{
	player.resistance = 0.25;
	insertArray(27);
	earth.kill();
}

function getOrbs(p, d)
{
	if(d.key == "emptyOrb")
	{
		d.kill();
	}
	else if(d.name == "PureOrb")
	{
		insertArray((currentWorld-1) * 5)
		d.kill();
	}
	else if(d.name == "DarkOrb" && p.checkDarkCoins())
	{
		insertArray(((currentWorld-1) * 5) + 1)
		d.kill();
	}
	else if(d.name == "VenomOrb" && p.goldCoinsNumber >= 100)
	{
		insertArray(((currentWorld-1) * 5) + 2)
		d.kill();
	}
	else if(d.name == "SkyOrb")
	{
		insertArray(((currentWorld-1) * 5) + 3)
		d.kill();
	}
}

function showInfos(player,sign)
{
	var ind = parseInt(sign.name.substring(sign.name.length - 1));
	if(ind != gameHud.indTextSign)
		showHintOnHud(ind);
}

function takeDamages(player, trap)
{
	player.hp -= 1 * player.resistance;
	gameHud.refreshHearts();
	//console.log(player.hp);
	if(player.hp < 0)
	{
		gameOver();
	}
}



function changeScene (game, scene) 
{
	game.state.start(scene);
}

function killCollectedObject(objectToKill, condition)
{
	if(condition)
		objectToKill.kill();
}

function burnBlock(player, block)
{
	killCollectedObject(block, player.burnMode);
}



function moveBlock(p, b)
{
	//b.body.gravity.y = 400;
	p.magnetBlock = null;
	if(!p.magnetMode)
		b.body.immovable = true;
	else
	{
		b.body.immovable = false;
		b.body.velocity.x + (400 * p.lastDirection);
		p.magnetBlock = b;
	}
}

function waterContact (p, w)
{
    if(p.groundState == 'ground'){
        p.groundState = 'waterEnter';
        p.body.y += 10;
        console.log('ENTER WATER');
        p.water = true
        p.jumpKey.onDown.remove(p.baseJump,p);
        p.jumpKey.onDown.add(p.waterJump,p);
        if(!p.canBreathUnderwater)
            breathLoop = this.game.time.events.loop(Phaser.Timer.SECOND * 10, p.playerDrowned, this);
    }
}

function waterContactExit (p, w)
{
    if(p.groundState == 'waterExit'){
        p.groundState = 'ground';
        p.body.y -= 70;
        console.log('EXIT WATER');
        p.water = false;
        if(p.key == 'persoWind')
            p.jumpKey.onDown.add(p.windJump,p);
        else
            p.jumpKey.onDown.add(p.baseJump,p);
        p.jumpKey.onDown.remove(p.waterJump,p);
        if(breathLoop)
            this.game.time.events.remove(breathLoop);
    } 
}

function lavaContact (p, l)
{
    if(!p.canSwimLava)
        gameOver();
    else
        p.lava = true;
}

function lavaContactExit (p, l)
{
    p.lava = false;
}

function particleBurst(obj, img) {

	emitter = game.add.emitter(0, 0, 100);
    emitter.makeParticles(img);
    emitter.gravity = 200;
    emitter.x = obj.x + 17.5;
    emitter.y = obj.y + 17.5;

    emitter.start(true, 4000, null, 10);

    game.time.events.add(500, destroyEmitter, this);
}

function destroyEmitter() {
    emitter.destroy();
}