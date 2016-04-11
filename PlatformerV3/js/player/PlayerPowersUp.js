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
	}
	else if(player.water)
	{
		player.jumpKey.onDown.remove(player.baseJump,player);
    	player.jumpKey.onDown.remove(player.windJump,player);
    	if(!breathLoop)
    		breathLoop = player.game.time.events.loop(Phaser.Timer.SECOND * 10, player.playerDrowned, player);
	}
}

function checkLavaCapacity(player)
{
    if(player.lava && !player.canSwimLava)
        gameOver();
}

function removePowerUp(player)
{
	player.resistance = 1;
    player.ghostMode = false;
    player.burnMode = false;
    player.canSwimLava = false;
    player.magnetMode = false;
    player.canBreathUnderwater = false;  
    player.jumpKey.onDown.remove(player.windJump,player);
    player.powerUpKey.onDown.remove(player.switchFlyMode,player);
    player.powerUpKey.onDown.remove(player.switchGhostMode,player);
    player.powerUpKey.onDown.remove(player.switchBurnMode,player);
    player.powerUpKey.onDown.remove(player.switchMagnetMode,player);
    player.jumpKey.onDown.add(player.baseJump,player);
    player.magnetBlock = null;
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
    player.rockMode = false;
    player.canSwimLava = false;
    player.canBreathUnderwater = false;
}


    