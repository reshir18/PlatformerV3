Projectile = function (game, x, y, isfromMob, mobTarget, bd)
{
    Phaser.Sprite.call(this, game, x, y, 'ball', isfromMob ? 0 : 1);
    this.enableBody = true;
    this.game.physics.arcade.enable(this);
    this.body.gravity.y = 50;
    this.target = gameHud.player;
    this.attFunction = isfromMob ? this.hurtPlayer : this.hurtMob;
    this.isfromMob = isfromMob;
    this.mobTarget = mobTarget;
    this.battle = bd;
    this.setBallDirection();
};

Projectile.prototype = Object.create(Phaser.Sprite.prototype);
Projectile.prototype.constructor = Projectile;

Projectile.prototype.update = function()
{
    this.body.velocity.x = 0;
    this.body.velocity.y = 50;
    this.body.velocity.x = ((100 + player.level * 25) + Math.floor((Math.random() * 150) + 1)) * this.dirProjectile;
    game.physics.arcade.overlap(this, this.isfromMob ? this.target : this.mobTarget, this.attFunction, null, this);
};

Projectile.prototype.hurtPlayer = function()
{
    this.target.hp -= Math.max(0.5,(mob.att - this.target.shield.protect) * this.target.resistance);
    gameHud.refreshHearts();
    if(this.target.hp < 0)
        gameOver('Mort au combat');
    this.destroy();

};

Projectile.prototype.hurtMob = function(projectile, mobT)
{
    if(mobT.takeDamagesAndDie(this.target.sword.damages))
        this.battle.hurtMobToDeath(mobT);
    this.destroy();
};

Projectile.prototype.setBallDirection = function()
{
    if(!this.isfromMob && this.mobTarget.length > 0)
    {
        var idxLastMobPositionX = this.mobTarget[this.mobTarget.length -1].body.x;
    }
    this.dirProjectile = 1;
    if((this.isfromMob && this.target.body.x < mob.body.x) || (!this.isfromMob && this.target.body.x > idxLastMobPositionX))
        this.dirProjectile = -1;
};