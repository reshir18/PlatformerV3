var swordList = 'TEMP';
var dropList = 'TEMP';
var shieldList = 'TEMP';
var lootInfo = 'TEMP';
var enemiesList = 'TEMP';
function InitializeJson()
{	
	loadJSON("assets/Items/Swords.json",function(response) {
    	swordList = JSON.parse(response);
 	});

 	loadJSON("assets/Items/Loots.json",function(response) {
       	dropList = JSON.parse(response).Loots[0];
  });

  loadJSON("assets/Items/LootsCraft.json",function(response) {
     	lootInfo = JSON.parse(response);
  });

  loadJSON("assets/Items/Shields.json",function(response) {
  	shieldList = JSON.parse(response);
 	});	

  loadJSON("assets/Items/Enemies.json",function(response) {
      enemiesList = JSON.parse(response);
  });
}

function getSword(swordId)
{
	return swordList.Swords[swordId];
}

function getShield(shieldId)
{
	return shieldList.Shields[shieldId];
}

function getLootItem(itemIdId)
{
	return lootInfo.Loots[itemIdId];
}