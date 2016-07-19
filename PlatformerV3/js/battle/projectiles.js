Projectile = function (game, x, y, isfromMob, mobTarget, bd)
{
    Phaser.Sprite.call(this, game, x, y, 'ball');
    this.enableBody = true;
    this.game.physics.arcade.enable(this);
    this.body.gravity.y = 50;
    this.target = gameHud.player;
    this.fromTop = fromTop;
    this.attFunction = isfromMob ? this.hurtPlayer : this.hurtMob;
    this.isfromMob = isfromMob;
    this.mobTarget = mobTarget;
    this.battle = bd;
};

Projectile.prototype = Object.create(Phaser.Sprite.prototype);
Projectile.prototype.constructor = Projectile;

Projectile.prototype.update = function()
{
    this.body.velocity.x = 0;
    if(!this.isfromMob && this.mobTarget.length > 0)
    {
        var idxLastMobPositionX = this.mobTarget[this.mobTarget.length -1].body.x;
    }
    var dirProjectile = 1;
    if((this.isfromMob && this.target.body.x < mob.body.x) || (!this.isfromMob && this.target.body.x > idxLastMobPositionX))
        dirProjectile = -1;
    this.body.velocity.x = (200 + Math.floor((Math.random() * 150) + 1)) * dirProjectile;
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
};