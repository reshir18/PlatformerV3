var menuChoice = 0;
var currentMenuLayout = 0;
var menuTexts = ["Reprendre", "Crafting", "Inventaire", "Main World", "Retour", "Swords", "Shields"];

function menuNavigation(direction)
{
    if(direction == 0 && currentMenuLayout == 0)
    {   
        if(setSecondMenu(menuChoice))
            currentMenuLayout = 1;
        else
            currentMenuLayout = 4;
        menuChoice = 0;
        return;
    }
    else if(direction == 0 && currentMenuLayout == 1)
    {
        if(!setThirdMenu(menuChoice))
        {
            currentMenuLayout = 0;
        }
        else
        {
            currentMenuLayout = 1 + menuChoice;
        }
        menuChoice = 0;
        return;
    }
    else if(direction == 0 && currentMenuLayout == 4)
    {
        currentMenuLayout = 0;
        menuChoice = 0;
        gameHud.showLayout0();
        gameHud.textGroup.remove(gameHud.textGroup.children[1]);
        return;
    }
    else if(direction == 0 && currentMenuLayout >= 2)
    {
        if(!buyItem(menuChoice, currentMenuLayout == 2 ))
        {
            currentMenuLayout = 1;
            menuChoice = 0;
        }
        return;
    }
    
    menuChoice += direction;
    
    var minM = 0;
    if(currentMenuLayout == 0)
        maxM = 3;
    else if(currentMenuLayout == 1)
        maxM = 2;
    else if(currentMenuLayout == 2)
        maxM = swordList.Swords.length - 1;
    else if(currentMenuLayout == 3)
        maxM = shieldList.Shields.length - 1;
    else if(currentMenuLayout == 4)
        maxM = 6;
    else
        maxM = 0;
    if(menuChoice < minM)
    {
        menuChoice = maxM;
        gameHud.moveMenu(maxM);
    }
    else if(menuChoice > maxM)
    {
        menuChoice = minM;
        gameHud.moveMenu(maxM * -1);
    }
    else if(maxM > 0)
    {
        gameHud.moveMenu(direction);
    }
    if(currentMenuLayout < 2)
        gameHud.showText(menuTexts[menuChoice + currentMenuLayout * 4]);
    else if(currentMenuLayout < 4)
        changeWeapon(currentMenuLayout == 2, menuChoice);
    else if(currentMenuLayout == 4)
        gameHud.showLayout3(menuChoice);   
}

function setSecondMenu(c)
{
    if(c == 0)
        unPauseGame();
    else if(c == 1)
    {
        gameHud.showLayout1();
    }
    else if(c == 2)
    {
        gameHud.showLayout3(0);
        return false;
    }
    else if(c == 3)
    {
        //gameOver();
        returnToMainWorld();
        //alert(game);
    }

    return true; 
}
function setThirdMenu(c)
{
    if(c == 0)
    {
        gameHud.showLayout0();
        return false;
    }
    else
        gameHud.showLayout2();
    return true;
}

function buyItem(c, sword)
{
    if(c == 0)
    {
        gameHud.showLayout1();
        return false;
    }
    else if(!gameHud.player.canBuyItem)
        return true;
   
    else if(sword && gameHud.player.sword.damages < getSword(c).damages)
    {
        gameHud.player.sword = getSword(c);
        gameHud.player.inventory.Inventory[0].loot = gameHud.player.inventoryAfterPurchase;
        gameHud.player.loot = gameHud.player.inventoryAfterPurchase;
        gameHud.player.inventory.Inventory[0].sword = c;
        showNotific8({title:'New sword', content:getSword(c).name, life:2500, color:'pear'});
    }
    else if(!sword && gameHud.player.shield.protect < getShield(c).protect)
    {
        gameHud.player.shield = getShield(c);
        gameHud.player.inventory.Inventory[0].loot = gameHud.player.inventoryAfterPurchase;
        gameHud.player.loot = gameHud.player.inventoryAfterPurchase;
        gameHud.player.inventory.Inventory[0].shield = c;
        showNotific8({title:'New shield', content:getShield(c).name, life:2500, color:'pear'});
    }
    gameHud.showLayout2(sword, c);
    return true;
}