var burningBlockGroup;

function firePowerUpReady(group)
{
	burningBlockGroup = group;
}

function checkWaterCapacity(player, loop)
{
    checkLavaCapacity(player);

	if(loop && player.canBreathUnderwater)
	{
		player.game.time.events.remove(loop);
		breathLoop = null;
        game.airBar.visible = false;
        game.airMeter.visible = false;
	}
	else if(player.water)
	{
		player.jumpKey.onDown.remove(player.baseJump,player);
    	player.jumpKey.onDown.remove(player.windJump,player);
    	if(!breathLoop && !player.canBreathUnderwater)
        {
    		breathLoop = player.game.time.events.loop(Phaser.Timer.SECOND * 10, player.playerDrowned, player);
        }
	}
}

function checkLavaCapacity(player)
{
    if(player.lava && !player.canSwimLava)
        gameOver('Mauvaise idée');
}

function removePowerUp(player)
{
	player.resistance = 1;
    player.ghostMode = false;
    player.burnMode = false;
    player.canSwimLava = false;
    player.magnetMode = false;
    player.canBreathUnderwater = false;
    this.game.miniMap.visible = false;
    this.game.miniMapPlayerPosition.visible = false;
    player.jumpKey.onDown.remove(player.windJump,player);
    player.powerUpKey.onDown.remove(player.switchFlyMode,player);
    player.powerUpKey.onDown.remove(player.switchGhostMode,player);
    player.powerUpKey.onDown.remove(player.switchBurnMode,player);
    player.powerUpKey.onDown.remove(player.switchMagnetMode,player);
    player.powerUpKey.onDown.remove(player.saveTheGame,player);
    player.jumpKey.onDown.add(player.baseJump,player);
    player.speedProjectile = 200;
    player.nbProjectilesSameTime = 1;
    player.projectilHasGravity = true;
}

function setPlayerPowerUp(player)
{
    player.fly = false;
    player.water = false;
    player.lava = false;
    player.resistance = 1;
    player.jumpCountMax  = 2;
    player.jumpCount = 0;
    player.ghostMode = false;
    player.burnMode = false;
    player.magnetMode = false;
    player.canSwimLava = false;
    player.canBreathUnderwater = false;
    player.nbProjectilesSameTime = 1;
    player.speedProjectile = 200;
    player.projectilHasGravity = true;
}
