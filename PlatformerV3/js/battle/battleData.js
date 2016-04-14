BattleDatas = function() {
    this.nbFoes = 0;
    this.potion = "---";
    this.potionMap = "null";
    this.potionSpriteId = -1;
    this.isOnBattle = false;
    this.selectedEnemie = -1;
    this.arrayFoe = null;
    this.minMonster = 0;
    this.maxMonster = this.nbFoes - 1;
    this.selectedTarget = null;
    this.attackTurn = 0;
};
 
BattleDatas.prototype.constructor = BattleDatas;

BattleDatas.prototype.killMonster = function(x, y) 
{
    this.nbFoes --;

    if(this.nbFoes == 0)
    {
        this.isOnBattle = false;
        this.selectedTarget.visible = false;
        if(this.potion !== "---")
            this.makePotion(x, y);
    }
    else
    {
        this.maxMonster = this.nbFoes - 1;
        this.setEnemie(1);
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
    this.selectedTarget = game.add.sprite(0 , 0 , 'outline');
    this.selectedTarget.visible = false;
    this.selectedEnemie = -1;
    this.attackTurn = 0;

};

BattleDatas.prototype.makePotion = function(x, y) 
{
    p = game.add.sprite(x , y, 'potions', this.potionSpriteId);
    this.potionMap.add(p);
};

BattleDatas.prototype.setTargetPosition = function() 
{
   this.selectedTarget.x = this.arrayFoe[this.selectedEnemie].body.x - 20;
   this.selectedTarget.y = this.arrayFoe[this.selectedEnemie].body.y - 20;
};

BattleDatas.prototype.setEnemie =  function (direction)
{
    if(direction == 0 && this.selectedEnemie >= 0)
    {   
        this.battleAction();  
        return;
    }
    if(this.selectedEnemie == -1)
    {
        this.selectedTarget.visible = true;
        this.selectedEnemie = 0;

    }
    else
        this.selectedEnemie += direction;
    
    
    if(this.selectedEnemie < this.minMonster)
    {
        this.selectedEnemie = this.maxMonster;
    }
    else if(this.selectedEnemie > this.maxMonster)
    {
        this.selectedEnemie = 0;
    }
    if(!this.arrayFoe[this.selectedEnemie])
    {
        this.setEnemie(direction);
    }
    this.setTargetPosition(); 
}



BattleDatas.prototype.battleAction = function()
{
	player = gameHud.player;
    selectedFoe = this.arrayFoe[this.selectedEnemie];
	if(selectedFoe && selectedFoe.takeDamagesAndDie(player.sword.damages))
	{
		player.loot[selectedFoe.drop.id] ++;
        foePotionX = selectedFoe.body.x;
        foePotionY = selectedFoe.body.y - 70;
        selectedFoe.destroy();

		this.killMonster(foePotionX, foePotionY);
        console.log(this.arrayFoe);
		var jsonV = JSON.stringify(player.inventory);
		var vJson = JSON.parse(jsonV);
		console.log(this);
		saveInventory(jsonV);
	}
    else if(selectedFoe)
    {
        this.attackTurn++;
            for(mob of this.arrayFoe)
                if(mob.canAttack(this.attackTurn))
                    this.attackPlayer(mob);
    }
};

BattleDatas.prototype.attackPlayer = function(mob)
{
    p = gameHud.player;
    if (mob.body.gravity.y != 0)
        mob.body.velocity.y -= 120;
    p.hp -= Math.max(0,(mob.att - p.shield.protect) * p.resistance);
    gameHud.refreshHearts();
    if(p.hp < 0)
        gameOver();
}