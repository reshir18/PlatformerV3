var normalTint = 0xFFFFFF;
var burnTint = 0xFF0000;
var magnetTint = 0xAAAAAA;
var breathLoop;
Player = function (game, x, y)
{
    Phaser.Sprite.call(this, game, x, y, 'perso');

    this.inventoryAfterPurchase = "Data";
    this.canBuyItem = "Data";
    this.enableBody = true;
    this.game.physics.arcade.enable(this);
    this.inputEnabled = true;

    setPlayerInputs(this);
    setPlayerPhysics(this);
    loadGame();

    this.canSaveGame = false;
    this.canExecuteOptionAction = false;

    this.maxHp = 150;
    this.hp = this.maxHp;

    setPlayerPowerUp(this);
    setPlayerInventory(this);

    this.leftDirection = -1;
    this.rightDirection = 1;
    this.lastDirection = this.leftDirection;

    this.orbsArray = [];
    this.keysArray = [];
    this.locksArray = [];
    this.darkCoinsArray = [];
    this.skyCoinsArray = [];
    this.goldCoinsArray = [];
    this.goldCoinsNumber = 0;
    this.darkCoinsNumber = 0;
    this.skyCoinsNumber = 0;
    this.groundState = 'ground';

    this.worldPositionX = 0;
    this.worldPositionY = 0;

    this.setAllAnimations();
    this.jumpKey.onDown.add(this.baseJump,this);
    this.normalStateKey.onDown.add(this.switchPowerUpNormal,this);
    this.powerUpKey.onDown.add(this.saveTheGame,this);
    this.muteSound.onDown.add(muteGame,this);
    checkWaterCapacity(this, breathLoop);
    //Attribute All Power Ups unlocked
    if(getData(4))
        this.windStateKey.onDown.add(this.switchPowerUpWind,this);
    if(getData(9))
        this.fireStateKey.onDown.add(this.switchPowerUpFire,this);
    if(!getData(14))
        this.waterStateKey.onDown.add(this.switchPowerUpWater,this);
    if(!getData(19))
        this.earthStateKey.onDown.add(this.switchPowerUpEarth,this);
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function()
{
    this.body.velocity.x = 0;

    if (this.leftKey.isDown)
    {
        //  Move to the left
        this.lastDirection = this.leftDirection;
        this.body.velocity.x = -250;
        this.animations.play('left');
    }
    else if (this.rightKey.isDown)
    {
        //  Move to the right
        this.lastDirection = this.rightDirection;
        this.body.velocity.x = 250;
        this.animations.play('right');
    }
    else
    {
        this.animations.stop();
        this.frame = 2;
    }
    this.body.gravity.y = this.fly ? 0 : this.normalGravity;
    if(!this.fly)
        this.body.gravity.y = this.water ? this.waterGravity : this.normalGravity;
};

Player.prototype.heal = function(amount)
{
    if(this.hp == this.maxHp)
        return false;
    if(this.hp + amount > this.maxHp)
        this.hp = this.maxHp;
    else
        this.hp += amount;
    gameHud.refreshHearts();
    return true;
};

Player.prototype.setAllAnimations = function()
{
    this.animations.add('left', [4, 5, 6, 7], 10, true);
    this.animations.add('right', [8, 9, 10, 11], 10, true);
};

Player.prototype.checkDarkCoins = function()
{
    return this.darkCoinsNumber == 8;
};

Player.prototype.checkSkyCoins = function()
{
    return this.skyCoinsNumber == 4;
};

Player.prototype.baseJump = function()
{
    if(this.body.onFloor() || this.body.touching.down)
        this.body.velocity.y = - this.velocityJump;
};
Player.prototype.waterJump = function()
{
    this.body.velocity.y = - this.velocityWaterJump;
    this.groundState = 'waterExit';
};

Player.prototype.windJump = function()
{
    if(!(this.body.onFloor() || this.body.touching.down) && this.jumpCount == 0)
        this.jumpCount++;
    if(this.body.onFloor() || this.body.touching.down || (this.jumpCount < this.jumpCountMax && !this.fly))
    {
        this.jumpCount++;
        this.body.velocity.y = - this.velocityJump;
    }
};

Player.prototype.climbUp = function()
{
    this.body.velocity.y = - this.climbSpeed;
    this.frame = 12;
};

Player.prototype.switchFlyMode = function()
{
    if(this.body.onFloor() || this.body.touching.down || this.fly)
        this.fly = !this.fly;
};

Player.prototype.switchBurnMode = function()
{
    if(this.tint == burnTint)
        this.tint = normalTint;
    else
        this.tint = burnTint;
    this.burnMode = !this.burnMode;
};

Player.prototype.switchMagnetMode = function()
{
    if(this.tint == magnetTint)
        this.tint = normalTint;
    else
        this.tint = magnetTint;
    this.magnetMode = !this.magnetMode;
};

Player.prototype.switchGhostMode = function()
{
    if(this.alpha == 0.5)
        this.alpha = 1;
    else
        this.alpha = 0.5;
    this.ghostMode = !this.ghostMode;
};

Player.prototype.switchPowerUpEarth = function()
{
    this.setPowerModeToNormal('persoEarth');
    this.powerUpKey.onDown.add(this.switchMagnetMode,this);
    this.projectilHasGravity = false;
    checkWaterCapacity(this, breathLoop);
    if(!getData(27))
        this.resistance = 0.25;
};

Player.prototype.switchPowerUpWater = function()
{
    this.setPowerModeToNormal('persoWater');
    this.canBreathUnderwater = true;
    this.nbProjectilesSameTime = 5;
    checkWaterCapacity(this, breathLoop);
    if(!getData(26))
        this.powerUpKey.onDown.add(this.switchGhostMode,this);
};

Player.prototype.switchPowerUpFire = function()
{
    this.setPowerModeToNormal('persoFire');
    this.powerUpKey.onDown.add(this.switchBurnMode,this);
    checkWaterCapacity(this, breathLoop);

    if(!getData(25))
       this.canSwimLava = true;
};

Player.prototype.switchPowerUpWind = function()
{
    this.setPowerModeToNormal('persoWind');
    this.speedProjectile = 400;
    this.jumpKey.onDown.add(this.windJump,this);
    checkWaterCapacity(this, breathLoop);

    if(!getData(24))
        this.powerUpKey.onDown.add(this.switchFlyMode,this);

};

Player.prototype.switchPowerUpNormal = function()
{
    this.setPowerModeToNormal('perso');
    this.powerUpKey.onDown.add(this.saveTheGame,this);
    this.game.miniMap.visible = true;
    this.game.miniMapPlayerPosition.visible = true;
    checkWaterCapacity(this, breathLoop);

};

Player.prototype.setPowerModeToNormal = function(texture)
{
    this.loadTexture(texture, this.frame);
    this.setAllAnimations();
    this.tint = normalTint;
    this.alpha = 1;
    this.fly = false;
    removePowerUp(this);
    gameHud.refreshPowerUpInfos();

};

Player.prototype.saveTheGame = function()
{
    if(this.canSaveGame)
    {
        saveGame();
        saveInventory(JSON.stringify(this.inventory));
    }
    else if(this.canExecuteOptionAction && optionAction != "None")
        deleteGameSave();
};

Player.prototype.playerDrowned = function(p, w)
{
    gameOver('Noyade');
};
