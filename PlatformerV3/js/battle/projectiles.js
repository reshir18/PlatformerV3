Projectile = function (game, x, y, fromTop, damages) 
{
    Phaser.Sprite.call(this, game, x, y, 'ball');
    this.enableBody = true;
    this.game.physics.arcade.enable(this);
    this.body.gravity.y = 50;
    this.target = gameHud.player;
    this.fromTop = fromTop;
};

Projectile.prototype = Object.create(Phaser.Sprite.prototype);
Projectile.prototype.constructor = Projectile;

Projectile.prototype.update = function() 
{
    this.body.velocity.x = 0;
    if(!this.fromTop)
        this.body.velocity.x = (200 + Math.floor((Math.random() * 150) + 1)) * -1;

    game.physics.arcade.overlap(this.target, this, this.hurtPlayer, null, this);
};

Projectile.prototype.hurtPlayer = function() 
{
    if(this.fromTop)
        this.target.hp -= 10 * this.target.resistance;
    else
        this.target.hp -= Math.max(0.5,(mob.att - this.target.shield.protect) * this.target.resistance);
    gameHud.refreshHearts();
    if(this.target.hp < 0)
        gameOver('Mort au combat');
    this.destroy();

};