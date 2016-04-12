Enemy = function (game, x, y, stats, pos, hasGravity, lootList) 
{
    Phaser.Sprite.call(this, game, x, y, stats.imgFoe);
    
    this.enableBody = true;
    //this.anchor.setTo(.5,.5);
    this.game.physics.arcade.enable(this);
    this.body.gravity.y = hasGravity;
    this.timeAttack = null
    this.inputEnabled = true;
    this.positionFoe = pos;
    this.stats = stats;
    this.lootList = lootList;
    this.mobDirection = -8;
 
    this.maxHp = Math.floor((Math.random() * (this.stats.hp * 2)) + this.stats.hp - 2);
    this.hp = this.maxHp; 
    this.att = this.stats.attack;
    this.def = this.stats.defense;
    this.speed = this.stats.speed;
    this.monsterText = setFoeText(this.positionFoe, this.stats.nameMob, this.hp, this.maxHp);

    this.takeDamagesAndDie = function(dmg)
    {
        this.hp -= (dmg - this.def);
        if(this.hp <= 0)
        {
            this.monsterText.setText(getLootItem(this.drop.id).name);
        }
        else
        {
            strMonster = this.stats.nameMob + " " + this.hp + " / " + this.maxHp;
            this.monsterText.setText(strMonster);
        }
        return this.hp <= 0;   
    };

    this.canAttack = function(turn)
    {
        return turn % this.speed == 0
    }

    this.setDrop = function()
    {
        
        var rdn = Math.floor((Math.random() * 100) + 1); 
        for (item of this.lootList)
        {
            if(rdn <= item.percent)
            {
                return item;
            }
        }
    };

    this.monsterText.fixedToCamera = true;
    this.drop = this.setDrop();
    console.log(getLootItem(this.drop.id).name);
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() 
{
    
};

moveEnemy = function(mob, layer)
{ 
    if(checkEnemycollide(mob))
    {
        mob.moveDirection = mob.moveDirection * -1;
        
        if(mob.moveDirection > 0)
        {
            mob.scale.x =-1;
            mob.mobDirection = 48;
        } 
        else
        {
            mob.scale.x =1;
            mob.mobDirection = -8;

        }
    }

    mob.body.x += mob.moveDirection;
    mob.seeLineFloor.start.set(mob.body.x + 22, mob.body.y + 14);
    mob.seeLineFloor.end.set(mob.body.x + 65 * mob.moveDirection, mob.body.y + 70);
    mob.seeLineWall.start.set(mob.body.x + 22, mob.body.y + 14);
    mob.seeLineWall.end.set(mob.body.x + mob.mobDirection , mob.body.y + 14);
}

checkEnemycollide = function(mob)
{
    collideFloor = layer.getRayCastTiles(mob.seeLineFloor, 4, false, false).length > 0;
    collideWall = layer.getRayCastTiles(mob.seeLineWall, 4, false, false).length > 0;
    return (!collideFloor || collideWall);
}