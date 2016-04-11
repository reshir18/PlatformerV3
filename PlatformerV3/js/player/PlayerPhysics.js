function setPlayerPhysics(player)
{
	player.normalGravity = 325;
	player.waterGravity = 200;
    player.scale.setTo(1.2,1.2);
    player.body.gravity.y = player.normalGravity;
    player.velocityJump = 302;
    player.velocityWaterJump = 150;
    player.climbSpeed = 100;
    player.body.collideWorldBounds = true;
}