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
var gameDataArray = null;
var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
if(isChrome)
{
	//chrome.storage.sync.clear(function (){});
	var objectKey1 = 'OrbOfGodsDatas';
	var objectKey2 = 'inventoryPlayer';

	var objSaveChrome= {};
	gameDataArray = getGameSave();
	loadGameChrome();
}
      
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

var requiredOrbForWorlds = [0,2,4,6,9];
var currentWorld = 0;
var game;
var textTutoHint;
var battleDatas = new BattleDatas();
var portalCoord = [0,0, false];
var optionAction = "None";

function createNewGame()
{
	game = new Phaser.Game(800, 600, Phaser.CANVAS, "game");        
    InitializeJson();
    
    game.state.add('Boot', boot, false);
    game.state.add('Preloader', preload, false);
    game.state.add('World0', World0, false);
    game.state.add('World1', World1, false);
    game.state.add('OptionWorld', OptionWorld, false);
    game.state.start('Boot');
    //showNotific8({title:'Start game', content:'Go !', life:2500, color:'cerulean'});
}

function loadGame() 
{
	gameDataArray = getGameSave();
	if(isChrome)
	{
		loadGameChrome();
	}
}

function setWorld(w)
{
	currentWorld = w;
	textTutoHint = game.cache.getText('gameplayInfo').split(';');
}

function gameOver(textDead)
{
	game.world.removeAll();
	game.destroy();
	document.body.innerHTML = '';
	var para = document.createElement("span");
	para.setAttribute("id", "notific8Span");
	document.body.appendChild(para);
	createNewGame();
	if(textDead)
		showNotific8({title:'Game Over', content:textDead, life:2500, color:'cerulean'});
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
		gameOver();
	}
	else
	{
		location.reload();
	}
}

function setCookie(cname,cvalue) 
{
	if(isChrome)
	{
		var objectKey = cname;

		var objSave= {};

		objSave[objectKey] = cvalue;

		chrome.storage.sync.set(objSave, function() {});
        return;
	}
	var expires = "expires=Sun, 12 Feb 2017 00:00:00 UTC";
	document.cookie = cname+"="+cvalue+"; "+expires;
}

function getCookie(cname) 
{
	if(isChrome)
	{
		console.log('Data get = ' + objSaveChrome[cname]);
		return objSaveChrome[cname];
	}
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
	if(SavedNumber && SavedNumber !="")
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
}

function saveGame()
{
	var arrayTemp = gameDataArray.slice();
    var saveDecimalValue = parseInt(arrayTemp.reverse().join(''),2);
    setCookie("OrbOfGodsDatas", saveDecimalValue);
	showNotific8({title:'Save', content:'game saved !', life:2500, color:'onyx'});
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

function setOptionAction(player,option)
{
	optionAction = option.name;
}

function deleteGameSave()
{
	if(isChrome)
		deleteSaveChrome(optionAction);
	else
		deleteSave(optionAction)
	optionAction = "None";
	showNotific8({title:'Data deleted', content:'Good luck', life:2500, color:'onyx'});
}
function deleteSave(option)
{
	var expires = "expires=Thu, 01 Jan 1970 00:00:01 UTC";
	var deleteName = "None";
	if(option == "save")
	{
		var deleteName = "OrbOfGodsDatas";
	}
	if(option == "inventory")
	{
		var deleteName = "inventoryPlayer";
	}
	if(option == "all")
	{
		document.cookie = "OrbOfGodsDatas=None; "+expires;
		var deleteName = "inventoryPlayer";
	}
	document.cookie = deleteName+"=None; "+expires;
}

function deleteSaveChrome(option)
{
	if(option == "save")
	{
		chrome.storage.sync.remove("OrbOfGodsDatas", function (){});
	}
	if(option == "inventory")
	{
		chrome.storage.sync.remove("inventoryPlayer", function (){});
	}
	if(option == "all")
	{
		chrome.storage.sync.clear(function (){});
	}
}

function loadGameChrome()
{
	var gameSaveChrome = '';
	chrome.storage.sync.get('OrbOfGodsDatas', function(items) 
	{
		gameSaveChrome = items['OrbOfGodsDatas'];
		objSaveChrome[objectKey1] = gameSaveChrome;
	});

	var inventorySaveChrome = '';
	chrome.storage.sync.get('inventoryPlayer', function(items) 
	{
		inventorySaveChrome = items['inventoryPlayer'];
		objSaveChrome[objectKey2] = inventorySaveChrome;

	});

	chrome.storage.onChanged.addListener(function(changes, namespace) 
	{
        for (key in changes) 
        {
          var storageChange = changes[key];
          console.log('Storage key "%s" in namespace "%s" changed. ' +
                      'Old value was "%s", new value is "%s".',
                      key,
                      namespace,
                      storageChange.oldValue,
                      storageChange.newValue);
        }
    });
}
