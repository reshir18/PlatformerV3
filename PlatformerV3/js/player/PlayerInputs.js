function setPlayerInputs(player)
{
	player.jumpKey = player.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    player.climbKey = player.game.input.keyboard.addKey(Phaser.Keyboard.W);
    player.leftKey = player.game.input.keyboard.addKey(Phaser.Keyboard.A);
    player.rightKey = player.game.input.keyboard.addKey(Phaser.Keyboard.D);
    player.powerUpKey = player.game.input.keyboard.addKey(Phaser.Keyboard.Q);
    player.powerUpKey2 = player.game.input.keyboard.addKey(Phaser.Keyboard.E);
    player.normalStateKey = player.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    player.windStateKey = player.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
    player.fireStateKey = player.game.input.keyboard.addKey(Phaser.Keyboard.THREE);
    player.waterStateKey = player.game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
    player.earthStateKey = player.game.input.keyboard.addKey(Phaser.Keyboard.FIVE);
}