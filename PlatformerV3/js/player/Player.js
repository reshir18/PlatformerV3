var normalTint = 0xFFFFFF;
var burnTint = 0xFF0000;
var magnetTint = 0xAAAAAA;
var breathLoop;
Player = function (game, x, y) 
{
    Phaser.Sprite.call(this, game, x, y, 'perso');

    this.magnetBlock = null;
    this.inventoryAfterPurchase = "Data";
    this.canBuyItem = "Data";
    this.enableBody = true;
    this.game.physics.arcade.enable(this);
    this.inputEnabled = true;
    
    setPlayerInputs(this);

    setPlayerPhysics(this);

    this.canSaveGame = false;
    
    this.maxHp = 150;
    this.hp = this.maxHp;

    setPlayerPowerUp(this);

    setPlayerInventory(this);

    this.leftDirection = -1;
    this.rightDirection = 1;
    this.lastDirection = this.leftDirection;

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
    
    this.setAllAnimations = function()
    {
        this.animations.add('left', [4, 5, 6, 7], 10, true);
        this.animations.add('right', [8, 9, 10, 11], 10, true);
    };
    this.checkDarkCoins = function()
    {
        return this.darkCoinsNumber == 8;
    };
    this.checkSkyCoins = function()
    {
        return this.skyCoinsNumber == 4;
    };
    this.baseJump = function()
    {
        if(this.body.onFloor() || this.body.touching.down)
            this.body.velocity.y = - this.velocityJump;
    };
    this.waterJump = function()
    {
        this.body.velocity.y = - this.velocityWaterJump;
        this.groundState = 'waterExit';
    };

    this.windJump = function()
    {
        if(!(this.body.onFloor() || this.body.touching.down) && this.jumpCount == 0)
            this.jumpCount++;
        if(this.body.onFloor() || this.body.touching.down || (this.jumpCount < this.jumpCountMax && !this.fly))
        {
            this.jumpCount++;
            this.body.velocity.y = - this.velocityJump;  
        }
    };

    this.climbUp = function()
    {
        this.body.velocity.y = - this.climbSpeed;
        this.frame = 12;
    };

    this.switchFlyMode = function()
    {
        if(this.body.onFloor() || this.body.touching.down || this.fly)
            this.fly = !this.fly;
    };
    this.switchBurnMode = function()
    {
        if(this.tint == burnTint)
            this.tint = normalTint;
        else
            this.tint = burnTint;
        this.burnMode = !this.burnMode;
    };
    this.switchMagnetMode = function()
    {
        if(this.tint == magnetTint)
            this.tint = normalTint;
        else
            this.tint = magnetTint;
        this.magnetMode = !this.magnetMode;
    };
    this.switchGhostMode = function()
    {
        if(this.alpha == 0.5)
            this.alpha = 1;
        else
            this.alpha = 0.5;
        this.ghostMode = !this.ghostMode;
    };
    this.switchPowerUpEarth = function()
    {
        this.setPowerModeToNormal('persoEarth');
        this.powerUpKey.onDown.add(this.switchMagnetMode,this);
        checkWaterCapacity(this, breathLoop);

        if(!getData(27))
            this.resistance = 0.25;
    };
    this.switchPowerUpWater = function()
    {
        this.setPowerModeToNormal('persoWater');
        this.canBreathUnderwater = true;
        checkWaterCapacity(this, breathLoop);
        if(!getData(26))
            this.powerUpKey.onDown.add(this.switchGhostMode,this);
    };
    this.switchPowerUpFire = function()
    {
        this.setPowerModeToNormal('persoFire');
        this.powerUpKey.onDown.add(this.switchBurnMode,this);
        checkWaterCapacity(this, breathLoop);

        if(!getData(25))
           this.canSwimLava = true; 
    };
    this.switchPowerUpWind = function()
    {
        this.setPowerModeToNormal('persoWind');
        this.jumpKey.onDown.add(this.windJump,this);
        checkWaterCapacity(this, breathLoop);

        if(!getData(24))
            this.powerUpKey.onDown.add(this.switchFlyMode,this);

    };
    this.switchPowerUpNormal = function()
    {
        this.setPowerModeToNormal('perso');
        this.powerUpKey.onDown.add(this.saveTheGame,this);
        this.game.miniMap.visible = true;
        checkWaterCapacity(this, breathLoop);

    };
    this.setPowerModeToNormal = function(texture)
    {
        this.loadTexture(texture, this.frame);
        this.setAllAnimations();
        this.tint = normalTint;
        this.alpha = 1;
        this.fly = false;
        removePowerUp(this);
        gameHud.refreshPowerUpInfos();
    };
    this.heal = function(amount)
    {
        if(this.hp == this.maxHp)
            return false;
        if(this.hp + amount > this.maxHp)
            this.hp = this.maxHp;
        else
            this.hp += amount;
        gameHud.refreshHearts();
        return true;
    }

    this.saveTheGame = function()
    {
        if(this.canSaveGame)
        {
            saveGame();
            saveInventory(JSON.stringify(this.inventory));
        }
    }

    this.resetBlockPosition = function()
    {
        if(!this.magnetBlock)
            return;
        this.magnetBlock.reset(this.magnetBlock.defaultPosX, this.magnetBlock.defaultPosY);
    }

    this.playerDrowned = function(p, w)
    {
        gameOver('Noyade');
    };
    
    this.setAllAnimations();
    this.jumpKey.onDown.add(this.baseJump,this);
    this.normalStateKey.onDown.add(this.switchPowerUpNormal,this);
    this.powerUpKey.onDown.add(this.saveTheGame,this);
    this.powerUpKey2.onDown.add(this.resetBlockPosition,this);
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
