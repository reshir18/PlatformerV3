function setPlayerInventory(player)
{
	var inventory = getInventory();
    if(inventory)
    {
        inventory = JSON.parse(inventory);
        player.inventory = inventory;
        console.log(inventory);
        player.sword = swordList.Swords[player.inventory.Inventory[0].sword];
        console.log(player.sword.damages);
        player.shield = shieldList.Shields[player.inventory.Inventory[0].shield];
        console.log(player.shield.protect);
        player.loot = player.inventory.Inventory[0].loot;
        console.log(player.loot);
        player.level = player.inventory.Inventory[0].level;
    }
    else
 	loadJSON("assets/Json/PlayerInventory.json",function(response) {
    	inventory = JSON.parse(response);
    	player.inventory = inventory;
    	console.log(inventory);
        player.sword = swordList.Swords[player.inventory.Inventory[0].sword];
        console.log(player.sword.damages);
        player.shield = shieldList.Shields[player.inventory.Inventory[0].shield];
        console.log(player.shield.protect);
        player.loot = player.inventory.Inventory[0].loot;
        console.log(player.loot);
        player.level = player.inventory.Inventory[0].level;
 	});
}