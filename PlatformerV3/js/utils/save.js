/*
{0, 1, 2, 3, 4} = monde 1
{5, 6, 7, 8, 9} = monde 2
{10, 11, 12, 13, 14} = monde 3
{15, 16, 17, 18, 19} = monde 4
{20, 21, 22, 23} = monde 5
24 = power up + vent
25 = power up + feu
26 = power up + eau
27 = power up + terre
28 = Fini tutoriel
29 = Boss World 5 mort
30 = 
31 = 
*/ 

document.addEventListener('DOMContentLoaded', function () {
  createNewGame();
});

document.addEventListener('keydown', function(event) {

	if(event.keyCode == 27 && !game.paused)
	{
		pauseGame();
	}
	else if(game.paused)
	{
		switch(event.keyCode) 
    	{
		    case 27:
		        unPauseGame();
		        break;
		    case 37:
		    	menuNavigation(-1);
		        break;
		    case 39:
		    	menuNavigation(1);
		        break;
		    case 13:
		    	menuNavigation(0);
		        break;
		    default:
		        break;
		}
	}
	else if(battleDatas.isOnBattle)
	{
		switch(event.keyCode) 
    	{
		    case 37:
		    	battleDatas.setEnemie(-1);
		        break;
		    case 39:
		    	battleDatas.setEnemie(1);
		        break;
		    case 13:
		    	battleDatas.setEnemie(0);
		        break;
		    default:
		        break;
		}
	}  
});

var gameDataArray = null;
var requiredOrbForWorlds = [0,0,4,6,9];
var currentWorld = 0;
var game;
var textTutoHint;
var battleDatas = new BattleDatas();
var portalCoord = [0,0, false];

function createNewGame()
{
	game = new Phaser.Game(800, 600, Phaser.CANVAS, "game");        
    InitializeJson();
    
    game.state.add('Boot', boot, false);
    game.state.add('Preloader', preload, false);
    game.state.add('World0', World0, false);
    game.state.add('World1', World1, false);
    game.state.start('Boot');
}

function loadGame() 
{
	gameDataArray = getGameSave();
}

function setWorld(w)
{
	currentWorld = w;
	textTutoHint = game.cache.getText('gameplayInfo').split(';');
}

function gameOver()
{
	game.world.removeAll();
	game.destroy();
	document.body.innerHTML = '';
	createNewGame();
}

function pauseGame()
{
	menuChoice = 0;
	currentMenuLayout = 0;
	setPausedHud();
}

function setMainWorldPortalCoord(portalObject)
{
	portalCoord = [portalObject.body.x - 100 ,portalObject.body.y, true];
}

function returnToMainWorld()
{
	if(portalCoord[2])
	{
		setPlayerInputsNull(gameHud.player);
		gameHud.player.body.velocity.y = 0;
	    gameHud.player.body.velocity.x = 0;
		game.paused = false;
		game.world.removeAll();
	    setWorld(6);
	    game.state.start("World0");
	}
	else
	{
		location.reload();
	}
}

function setCookie(cname,cvalue) 
{
	var expires = "expires=Sun, 12 Feb 2017 00:00:00 UTC";
	document.cookie = cname+"="+cvalue+"; "+expires;
}

function getCookie(cname) 
{
	var name = cname + "=";
	var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie(cname) 
{
    return getCookie(cname.valueOf());
}

function getGameSave()
{
	var SavedNumber = getCookie("OrbOfGodsDatas");
	if(SavedNumber !="")
	{
		var str = parseInt(SavedNumber).toString(2);
		var saveArray = str.split("").reverse();
		while(saveArray.length < 32)
			saveArray[saveArray.length] = "0";
		return saveArray;
	}

	else
	{
		//return ["0","0","0","0","1","0","0","0","0","0","0","0","0","0","0","0"];
		var temp = [];
		var posTemp = 32	
		while(posTemp--)
		{
			temp[posTemp] = "0";
		}
		return temp; 
	}
}

function getInventory()
{
	if (checkCookie("inventoryPlayer"))
	{
		return getCookie("inventoryPlayer");
	} 
	return false;
}
function insertArray(pos)
{
    gameDataArray[pos] = "1";
    saveGame();
}

function saveGame()
{
	var arrayTemp = gameDataArray.slice();
    var saveDecimalValue = parseInt(arrayTemp.reverse().join(''),2);
    setCookie("OrbOfGodsDatas", saveDecimalValue);
}

function saveInventory(inv)
{
	setCookie("inventoryPlayer", inv);
}

function getData(position)
{
    return gameDataArray[position] == "1";
}

function getOrbsCount(min)
{
	orbCount = 0;
	for(var i = 0; i < 21; i += 5)
		for(var j = 0; j < 3;j++)
			orbCount += parseInt(gameDataArray[i+j]);

	if(!min)
		return orbCount;
	return orbCount >= requiredOrbForWorlds[min - 1];
}

function loadJSON(file, callback) {   

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', file, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }