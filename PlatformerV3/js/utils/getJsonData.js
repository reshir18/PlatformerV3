var swordList = 'TEMP';
var dropList = 'TEMP';
var shieldList = 'TEMP';
var lootInfo = 'TEMP';
var enemiesList = 'TEMP';
var worldData = 'TEMP';
function InitializeJson()
{	
	loadJSON("assets/Json/Swords.json",function(response) {
    	swordList = JSON.parse(response);
 	});

 	loadJSON("assets/Json/Loots.json",function(response) {
       	dropList = JSON.parse(response).Loots[0];
  });

  loadJSON("assets/Json/LootsCraft.json",function(response) {
     	lootInfo = JSON.parse(response);
  });

  loadJSON("assets/Json/Shields.json",function(response) {
  	shieldList = JSON.parse(response);
 	});	

  loadJSON("assets/Json/Enemies.json",function(response) {
      enemiesList = JSON.parse(response);
  });

  loadJSON("assets/Json/Worlds.json",function(response) {
      worldData = JSON.parse(response);
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

function getWorldData()
{
  return worldData.Worlds[currentWorld - 1];
}