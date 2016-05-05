var textWeigthFont = "40px bold mecharegular";
var currentHud;
var gameHud;
var playHud =
{
    player: 'none',
    heartGroup: 'none',
    currentPowerUpGroup: 'none',
    goldCoinsGroup: 'none',
    darkCoinsGroup: 'none',
    keysGroup: 'none',
    hintTextGroup: 'none',
    indTextSign: 'none',
    worldInfoTextGroup: 'none',
    currentLevel: 0,
    currentWorld: 0,
    refreshAll: function()
    {
    	this.refreshHearts();
    	this.refreshPowerUpInfos();
    	this.refreshGoldCoinNumber();
        this.refreshDarkCoinNumber();
    	this.refreshKeys();
    },
    showHideAll: function(visible)
    {
        this.heartGroup.visible = visible;
        this.currentPowerUpGroup.visible = visible;
        this.goldCoinsGroup.visible = visible;
        this.darkCoinsGroup.visible = visible;
        this.keysGroup.visible = visible;
        this.hintTextGroup.visible = visible;
    },
    refreshHintInfo: function()
    {
        if(this.indTextSign == 9)
            this.hintTextGroup.removeAll();
        else
            this.hintTextGroup.children[0].text = textTutoHint[this.indTextSign];
    },
    refreshWorldInfo: function(portal, aliasName)
    {
        if(aliasName)
            txtNameWorld = aliasName
        else
        {
            var minimumOrbsNeeded = requiredOrbForWorlds[portal.name.substring(5) - 1];
            txtNameWorld = (minimumOrbsNeeded <= getOrbsCount()) ? getSpecificWorldData(parseInt(portal.name.substring(5)) - 1).name : "Manque " + (minimumOrbsNeeded - getOrbsCount()) + " orb(s)"; 
        }
        
        var portalText = game.add.text(portal.body.x , portal.body.y - 40, txtNameWorld, { font: "30px mecharegular"} );
    },
    refreshHearts: function()
    {
		var nbLive = Math.floor(this.player.hp/50);
        var firstLife = 50;
        if(this.player.hp % 50 != 0)
            nbLive ++;
        var len = this.heartGroup.children.length;
		var tempHeart = this.heartGroup.children[len - 1];
		if(nbLive > len)
        {
            for (heart of this.heartGroup.children) 
                heart.alpha = 1;
            for(var i = len ; i < nbLive ; i++)
            {
                tempHeart = game.add.sprite((i + 1) * 35 , 35, 'heart');
                tempHeart.fixedToCamera = true;
                this.heartGroup.add(tempHeart);
            }
        }
        if(nbLive < len)
		{
			this.heartGroup.remove(tempHeart);
			if(len == 0)
				return;
			tempHeart = this.heartGroup.children[len - 1];
		}
        if(nbLive - 1 != this.heartGroup.children.length)
		  var firstLife = this.player.hp % 50;
		if(tempHeart)
			tempHeart.alpha = firstLife / 50;
        if(this.player.hp == this.player.maxHp)
            tempHeart.alpha = 1;

    },
    refreshPowerUpInfos: function()
    {
		var puKey = this.player.key.substring(5);
		if(puKey == 'Wind')
			this.currentPowerUpGroup.children[1].frame = 1;
		else if(puKey == 'Fire')
			this.currentPowerUpGroup.children[1].frame = 2;
		else if(puKey == 'Water')
			this.currentPowerUpGroup.children[1].frame = 3;
		else if(puKey == 'Earth')
			this.currentPowerUpGroup.children[1].frame = 4;
		else 
			this.currentPowerUpGroup.children[1].frame = 0;
    },
    refreshGoldCoinNumber: function()
    {
		this.goldCoinsGroup.children[1].text = this.player.goldCoinsNumber.toString();
    },
    refreshDarkCoinNumber: function()
    {
		this.darkCoinsGroup.children[1].text = this.player.darkCoinsNumber.toString();
    },
    refreshKeys: function()
    {
       this.keysGroup.removeAll();
       for (key in this.player.keysArray){
            if(this.player.keysArray[key])
                this.refreshKeysAdd(key);
       }
            
    },
    refreshKeysAdd: function(color)
    {
        var posX = game.width - (400 + (this.keysGroup.children.length * 40));
        var frameImg = 0;
        if(color == 'blue')
            frameImg = 1;
        else if(color == 'green')
            frameImg = 2;
        else if(color == 'yellow')
            frameImg = 3;

        var keyImage = game.add.sprite(posX , 40 , 'keys', frameImg);
        keyImage.name = color;
        keyImage.fixedToCamera = true;
        this.keysGroup.add(keyImage);
    },
    refreshAirBar: function()
    {
        game.airBar.visible = true;
        game.airMeter.destroy();
        var airMeterLength = (breathLoop.timer.duration / 10000) * (game.width / 2);
        var airBmd = game.add.bitmapData(game.width / 2, 20);
        var grd = airBmd.ctx.createLinearGradient(0,0,200,0);
        grd.addColorStop(0,"#000028");
        grd.addColorStop(1,"#00A0FF");
        airBmd.ctx.fillStyle = grd;
        airBmd.ctx.fillRect(2,2, airMeterLength - 4, 16);
        game.airMeter = game.add.sprite(0 + (game.width / 4), game.height - 50 ,airBmd);
        game.airMeter.fixedToCamera = true;
    }
}

var pauseHud = 
{
    player: 'none',
    textGroup: 'none',
    isOnSign: false,
    indTextSign: 'none',
    commandGroup: 'none',
    currentLevel: 0,
    currentWorld: 'MainWorld',
    showAll: function()
    {
        this.showMasterLayout();
        this.showLayout0();
        this.showText();
    },
    showHideAll: function(visible)
    {
        this.commandGroup.visible = visible;
        this.textGroup.visible = visible;
    },
    showText: function(text, hasWeapon, hasColor)
    {
        this.textGroup.removeAll();
        if(!text)
        {
            text = "Reprendre\n" + this.currentWorld;
            if(this.currentLevel > 0)
                text += " - " + this.currentLevel;
        }

        var textColorFill = "#000000";
        if(hasColor)
            textColorFill = hasColor;

        var bmpText = game.add.text(game.camera.x + 250, game.camera.y + 100,  text, { font: textWeigthFont, fill:textColorFill} );
        bmpText.fixedToCamera = true;
        this.textGroup.add(bmpText); 

        if(hasWeapon)
        {
            var bmpTextInfoWeapon = game.add.text(game.camera.x + 200 , game.camera.y + 350,  hasWeapon, { font: textWeigthFont} );
            bmpTextInfoWeapon.fixedToCamera = true;
            this.textGroup.add(bmpTextInfoWeapon);
        } 
    },
    showLayout0: function()
    {
        this.showMasterLayout();
        for(var i = 1; i < 5; i++)
        {
            var img = game.add.sprite(game.camera.x + ((i+1) * 120)  - 80, game.camera.y + 250, 'commandsHud',i);
            img.fixedToCamera = true;
            this.commandGroup.add(img);
        }

        img = game.add.sprite(game.camera.x + 240  - 80, game.camera.y + 250, 'outline');
        img.fixedToCamera = true;
        this.commandGroup.add(img);
    },
    showLayout1: function()
    {
        
        this.showMasterLayout();
        this.showText("Retour");
        var img = game.add.sprite(game.camera.x + 240 , game.camera.y + 250, 'commandsHud',1);
        img.fixedToCamera = true;
        this.commandGroup.add(img);
        for(var i = 5; i < 7; i++)
        {
            img = game.add.sprite(game.camera.x + ((i-2) * 120) , game.camera.y + 250, 'commandsHud',i);
            img.fixedToCamera = true;
            this.commandGroup.add(img);
        }

        img = game.add.sprite(game.camera.x + 240 , game.camera.y + 250, 'outline');
        img.fixedToCamera = true;
        this.commandGroup.add(img);
    },
    showLayout2: function(isSword, idItem)
    {
        this.player.canBuyItem = false;
        if(!idItem || idItem == 0 )
        {
            this.showMasterLayout();
            this.showText("Retour");
            var img = game.add.sprite(game.camera.x + 350 , game.camera.y + 250, 'commandsHud',1);
            img.fixedToCamera = true;
            this.commandGroup.add(img);
            img = game.add.sprite(game.camera.x + 350 , game.camera.y + 250, 'outline');
            img.fixedToCamera = true;
            this.commandGroup.add(img);
            return;
        }
        this.showMasterLayout();
        img = game.add.image(game.camera.x + 350 , game.camera.y + 250, 'baseEquipement');
        img.fixedToCamera = true;
        this.commandGroup.add(img);
        var textColorFill = "#000000";
        if(isSword)
        {
            
            var itemShow = getSword(idItem);
            img = game.add.sprite(game.camera.x + 382 , game.camera.y + 267, 'swordChoices',idItem - 1);
            img.fixedToCamera = true;
            this.commandGroup.add(img);
            efect = "Dommages: " + itemShow.damages;
            if(this.player.sword.damages == itemShow.damages)
                textColorFill = "#0000FF";
        }
        else
        {
            img = game.add.sprite(game.camera.x + 377 , game.camera.y + 275, 'shieldChoices',idItem - 1);
            img.fixedToCamera = true;
            this.commandGroup.add(img);
            var itemShow = getShield(idItem);
            efect = "Résistance: " + itemShow.protect;
            if(this.player.shield.protect == itemShow.protect)
                textColorFill = "#0000FF";
        }
        img = game.add.sprite(game.camera.x + 350 , game.camera.y + 250, 'outline');
        img.fixedToCamera = true;
        this.commandGroup.add(img);
        lootText = "Matériel requis: \n";
        lootPlayer = this.player.loot;
        this.player.inventoryAfterPurchase = lootPlayer.slice();
        var resCount = 0;
        for(c of itemShow.craft)
        {
            l = getLootItem(c.idItem);
            lootText += l.name + ": " + c.qts + " -> ";
            if(c.qts <= lootPlayer[c.idItem])
            {
                lootText += "Complet ! \n";
                this.player.inventoryAfterPurchase[c.idItem] -= c.qts;
            }
            else
            {
                nbI = c.qts - lootPlayer[c.idItem];
                lootText += "manque: " + nbI + "\n";
                resCount++;
                //textColorFill = "#FF0000";
            }
            
        }
        this.player.canBuyItem = resCount == 0;

        this.showText(itemShow.name + "\n" + efect, lootText, textColorFill);
        this.moveMenu(game.camera.x + 350, true);
    },
    showLayout3: function(inventorySelect)
    {
        this.showMasterLayout();
        var img = game.add.sprite(game.camera.x + 240 , game.camera.y + 250, 'commandsHud',1);
        img.fixedToCamera = true;
        this.commandGroup.add(img);
        img = game.add.sprite(game.camera.x + 240 , game.camera.y + 250, 'outline');
        img.fixedToCamera = true;
        this.commandGroup.add(img);
        if(inventorySelect == 0)
        {
            var lootText = "Inventaire" + "\n";
            lootText += "Épée: " + this.player.sword.name + "\n";
            lootText += "Bouclier: " + this.player.shield.name + "\n";
        }
        if(inventorySelect == 1)
        {
            var lootText = "Orbs au total" + "\n";
            lootText += getOrbsCount() + " orbs(s) " + "\n";
        }
        if(inventorySelect > 1)
        {
            currentWorldDataCheck = inventorySelect - 1;
            var lootText = "Orbs du world" + currentWorldDataCheck + "\n";
            lootText += "Orb pur: " + getData((currentWorldDataCheck - 1) * 5) + "\n";
            lootText += "Orb obscur: " + getData((currentWorldDataCheck - 1) * 5 + 1) + "\n";
            lootText += "Orb venom: " + getData((currentWorldDataCheck - 1) * 5 + 2) + "\n";
        }
        
        this.showText("Retour", lootText);
    },
    showMasterLayout: function()
    {
        this.commandGroup.removeAll();
        var img = game.add.sprite(game.camera.x + 40 , game.camera.y + 100, 'commandsHud',0);
        img.fixedToCamera = true;
        this.commandGroup.add(img);
        img = game.add.sprite(game.camera.x + 680 , game.camera.y + 100, 'commandsHud',7);
        img.fixedToCamera = true;
        this.commandGroup.add(img);
    },
    moveMenu: function(newPosition, reset)
    {
        var len = this.commandGroup.children.length;
        var outline = this.commandGroup.children[len - 1];
        if(reset)
            outline.x = newPosition;
        else
            outline.x += (newPosition * 120);

    },
    refreshAirBar: function(visibility)
    {
        if(!visibility || !breathLoop || this.player.canBreathUnderwater )
            visibility = false
        game.airBar.visible = visibility;
        game.airMeter.visible = visibility;
    }
}

function setHud(player)
{
    gameHud = playHud;
	gameHud.player = player;
    pauseHud.player = player;
	generateHudHealth(game.add.group());
	generateHudPowerUp(game.add.group());
	generateHudGoldCoin(game.add.group());
    generateHudDarkCoin(game.add.group());
	generateHudKeys(game.add.group());
    generateHudHint(game.add.group())
    generateHudAirBar();
	
}
function unPauseGame()
{
    gameHud.showHideAll(false);
    gameHud = playHud;
    gameHud.showHideAll(true);
    game.paused = false;  
    pauseHud.refreshAirBar(true); 
}

function setPausedHud()
{
    playHud.showHideAll(false);
    pauseHud.textGroup = game.add.group();
    pauseHud.commandGroup = game.add.group();
    gameHud = pauseHud;
    pauseHud.showAll();
    game.paused = true;
    pauseHud.refreshAirBar(false);
}



function changeWeapon(isSword, index)
{
    gameHud.showLayout2(isSword, index);
}

function showHintOnHud(ind)
{
    gameHud.indTextSign = ind;
    gameHud.refreshHintInfo();
}

function generateHudAirBar()
{
    var airBarBmd = game.add.bitmapData(game.width / 2, 20);
    airBarBmd.ctx.fillStyle = '#000';
    airBarBmd.ctx.fillRect(0,0, game.width, 20);
    airBarBmd.ctx.fillStyle = '#FFF';
    airBarBmd.ctx.globalAlpha = 0.5;
    airBarBmd.ctx.fillRect(2,2, (game.width / 2) - 4, 16);
    var airBmd = game.add.bitmapData(game.width / 2, 20);
    airBmd.ctx.fillStyle = '#0000FF';
    airBmd.ctx.fillRect(2,2, (game.width / 2) - 4, 16);
    game.airBar = game.add.sprite(0 + (game.width / 4), game.height - 50 , airBarBmd);
    game.airMeter = game.add.sprite(0 + (game.width / 4), game.height - 50 , airBmd);
    game.airBar.fixedToCamera = true;
    game.airBar.visible = false;
    game.airMeter.fixedToCamera = true;
    game.airMeter.visible = false;
}

function generateWorldInfo(group)
{
    playHud.worldInfoTextGroup = group;
}

function generateHudHealth(group)
{
	playHud.heartGroup = group;
    
    var nbLive = Math.floor(gameHud.player.hp/50);
    var firstLife = gameHud.player.hp % 50;
    for(var i = 0; i < nbLive; i++)
    {
        var heart = game.add.sprite((i+1) * 35 , 35, 'heart');
        heart.fixedToCamera = true;
        group.add(heart);
    }
    if(firstLife != 0)
    {
        console.log(firstLife / 50);
        var heart = game.add.sprite((i+1) * 35 , 35, 'heart');
        heart.fixedToCamera = true;
        heart.alpha = firstLife / 50;
        group.add(heart);
    }
}

function generateHudPowerUp(group)
{
	playHud.currentPowerUpGroup = group;
	var bmpText = game.add.text(game.width - 180 , 35, "élément: ", { font: "30px mecharegular"} );
	var power = game.add.sprite(game.width - 80 , 35, 'powersUpHud', 0);
    bmpText.fixedToCamera = true;
    power.fixedToCamera = true;
    group.add(bmpText);
    group.add(power);
    playHud.refreshPowerUpInfos();
}

function generateHudGoldCoin(group)
{
	playHud.goldCoinsGroup = group;

	var coinImage = game.add.sprite(game.width - 340 , 35, 'coins', 0);
	var numberText = game.add.text(game.width - 300 , 35, gameHud.player.goldCoinsNumber.toString(), { font: "30px mecharegular"} );
    
    coinImage.fixedToCamera = true;
    numberText.fixedToCamera = true;
    
    group.add(coinImage);
    group.add(numberText);
}

function generateHudDarkCoin(group)
{
	playHud.darkCoinsGroup = group;

	var coinImage = game.add.sprite(game.width - 260 , 35, 'coins', 1);
	var numberText = game.add.text(game.width - 220 , 35, gameHud.player.darkCoinsNumber.toString(), { font: "30px mecharegular"} );
    
    coinImage.fixedToCamera = true;
    numberText.fixedToCamera = true;
    
    group.add(coinImage);
    group.add(numberText);
}

function generateHudKeys(group)
{
    playHud.keysGroup = group;
    playHud.refreshKeys();
}

function generateHudHint(group)
{
    playHud.hintTextGroup = group;
    playHud.indTextSign = 0;
    if(getData(28))
            playHud.indTextSign = 9;
    var hintText = game.add.text(50, 100,  textTutoHint[playHud.indTextSign], { font: "32px mecharegular"} );
    hintText.fixedToCamera = true;
    group.add(hintText); 
}
