BattleDatas = function() {
    this.nbFoes = 0;
    this.potion = "---";
    this.potionMap = "null";
    this.potionSpriteId = -1;
    this.isOnBattle = false;
    this.selectedEnemie = -1;
    this.arrayFoe = null;
    this.arrayProjectiles = [];
    this.attackTurn = 0;
};

BattleDatas.prototype.constructor = BattleDatas;

BattleDatas.prototype.killMonster = function(x, y)
{
    this.nbFoes --;

    if(this.nbFoes == 0)
    {
        this.isOnBattle = false;
        if(this.potion !== "---")
            this.makePotion(x, y);
    }
};

BattleDatas.prototype.getPotionName = function()
{
    return this.potion;
};

BattleDatas.prototype.setPotion = function(idPotion)
{
	switch(idPotion)
    {
        case 1:
        case 2:
        case 3:
        default:
            this.potionSpriteId = -1;
            return enums.potionsName.None; //Rien
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        	this.potionSpriteId = 0;
        	return enums.potionsName.Base; // Normal (1 coeur)
        case 9:
        case 10:
        case 11:
        case 12:
            this.potionSpriteId = 1;
            return enums.potionsName.Half;// half (la moitié des vies)
        case 13:
        case 14:
        	this.potionSpriteId = 2;
        	return enums.potionsName.Max;// max (toute la vie)
    	case 15:
       		this.potionSpriteId = 3;
       		return enums.potionsName.Fairy;// Fairy (donne un coeur de plus et restaure toute la vie)
    }
};

BattleDatas.prototype.setInfos = function(nbFoes, idPotion, potionMap, arrayFoe)
{
    this.nbFoes = nbFoes;
    this.potion = this.setPotion(idPotion);
    this.potionMap = potionMap;
    this.isOnBattle = true;
    this.arrayFoe = arrayFoe;
    this.maxMonster = this.nbFoes - 1;
    this.attackTurn = 0;
    this.projectileGroup = game.add.group();
    //game.add(this.arrayProjectiles);
    //game.time.events.loop(Phaser.Timer.SECOND * 1.5, this.dropProjectile, this);

};

BattleDatas.prototype.makePotion = function(x, y)
{
    p = game.add.sprite(x , y, 'potions', this.potionSpriteId);
    this.potionMap.add(p);
};

BattleDatas.prototype.battleAction = function()
{
	player = gameHud.player;
    this.projectileGroup.add(new Projectile(game, gameHud.player.body.x, gameHud.player.body.y, false, this.arrayFoe, this));
    this.hurtMobStillAlive();
};

BattleDatas.prototype.attackPlayer = function(mob)
{
    this.projectileGroup.add(new Projectile(game, mob.body.x, mob.body.y, true, null, null));
}

/*BattleDatas.prototype.dropProjectile = function()
{
    //this.potionMap.add(new Projectile(game, gameHud.player.body.x, 50, true, true, null, null));
}*/

BattleDatas.prototype.hurtMobToDeath = function(mobT)
{
    player.loot[mobT.drop.id] ++;
    foePotionX = mobT.body.x;
    foePotionY = mobT.body.y - 70;
    mobT.destroy();

    this.killMonster(foePotionX, foePotionY);
    var jsonV = JSON.stringify(player.inventory);
    var vJson = JSON.parse(jsonV);
}

BattleDatas.prototype.hurtMobStillAlive = function()
{
    this.attackTurn++;
        for(mob of this.arrayFoe)
            if(mob.canAttack(this.attackTurn))
                this.attackPlayer(mob);
}