function collectKeys (player, keys) 
{
	var res = keys.name.substring(0, keys.name.length - 3);
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
	if(pot == enums.potionsName.Base)
		amount = 50;
	if(pot == enums.potionsName.Fairy)
		player.maxHp += 50;
	if(pot == enums.potionsName.Half)
		amount = player.maxHp * 0.5;
	if(pot == enums.potionsName.Max || pot == enums.potionsName.Fairy)
		amount = player.maxHp;
	killCollectedObject(potion, player.heal(amount));
}

function getPowersUp (player, power) 
{
	switch(power.name) 
	{
	    case "Wind":
	        player.switchPowerUpWind();
			player.windStateKey.onDown.add(player.switchPowerUpWind,player);
	        break;
	    case "Fire":
	    	player.switchPowerUpFire();
	    	player.fireStateKey.onDown.add(player.switchPowerUpFire,player);
	        break;
	    case "Water":
	    	player.switchPowerUpWater();
	    	player.waterStateKey.onDown.add(player.switchPowerUpWater,player);
	        break;
	    case "Earth":
	    	player.switchPowerUpEarth();
	    	player.earthStateKey.onDown.add(player.switchPowerUpEarth,player);
	        break;
	    case "WindPlus":
	        player.switchPowerUpWind();
	        player.powerUpKey.onDown.add(player.switchFlyMode,player);
	        break;
	    case "FirePlus":
	    	player.switchPowerUpFire();
	    	player.canSwimLava = true;
	        break;
	    case "WaterPlus":
	    	player.switchPowerUpWater();
	    	player.powerUpKey.onDown.add(player.switchGhostMode,player);
	        break;
	    case "EarthPlus":
	    	player.switchPowerUpEarth();
	    	player.resistance = 0.25;
	        break;
	    default:
	        break;
	}
	insertArray(power.indexSaveArray);
	power.kill();
}

function getOrbs(p, d)
{
	if(d.key == enums.orbsName.Empty)
	{
		d.kill();
	}
	else if(d.name == enums.orbsName.Pure)
	{
		insertArray((currentWorld-1) * 5)
		d.kill();
	}
	else if(d.name == enums.orbsName.Dark && p.checkDarkCoins())
	{
		insertArray(((currentWorld-1) * 5) + 1)
		d.kill();
	}
	else if(d.name == enums.orbsName.Venom && p.goldCoinsNumber >= 100)
	{
		insertArray(((currentWorld-1) * 5) + 2)
		d.kill();
	}
	else if(d.name == enums.orbsName.Sky)
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
	if(player.hp < 0)
	{
		gameOver();
	}
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