function enemyFactory(idEnemy, game, x, y, positionOfEnemy)
{
    idEnemy = (currentWorld-1) * 5 + idEnemy;

    gravity = (idEnemy == 2) ? 0 : 300;

	var dropListFoe = dropList.slime;

	switch(idEnemy) 
    {
        case 1:
            dropListFoe = dropList.slime;
            break;
        case 2:
            dropListFoe = dropList.bat;
            break;
        case 3:
            dropListFoe = dropList.spikySlime;
            break;
        case 4:
            dropListFoe = dropList.zombie;
            break;
        case 5:
            dropListFoe = dropList.carnivorPlant;
            break;
        case 6:
            dropListFoe = dropList.skeleton;
            break;
        case 7:
            dropListFoe = dropList.mummy;
            break;
        case 8:
            dropListFoe = dropList.pyramidRock;
            break;
        case 9:
            dropListFoe = dropList.desertSoul;
            break;
        case 10:
            dropListFoe = dropList.golem;
            break;
        default:
            dropListFoe = dropList.skeleton;
            break;
    }

    return new Enemy(game, x, y, enemiesList.Enemies[idEnemy -1], positionOfEnemy, gravity, dropListFoe);
}

function setFoeText(positionOfMonster, nameFoe, hp, maxHp)
{
	return game.add.text(20, 100 + (positionOfMonster * 50),  nameFoe + " " + hp + " / " + maxHp, { font: "48px bold mecharegular"} );
}

function setFoeTextDead(positionOfMonster, nameLoot)
{
    return game.add.text(20, 100 + (positionOfMonster * 50),  nameLoot, { font: "48px bold mecharegular"} );
}