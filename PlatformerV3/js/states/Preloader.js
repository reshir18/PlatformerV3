var preload = function(game){}
 
preload.prototype = 
{
    preload: function()
    { 
            playerHeight = 47.5;
            
            //PERSONNAGES************************************************************
            this.game.load.spritesheet('perso', 'assets/character/Perso.png', 32, playerHeight);
            this.game.load.spritesheet('persoWind', 'assets/character/PersoWind.png', 32, playerHeight);
            this.game.load.spritesheet('persoFire', 'assets/character/PersoFire.png', 32, playerHeight);
            this.game.load.spritesheet('persoWater', 'assets/character/PersoWater.png', 32, playerHeight);
            this.game.load.spritesheet('persoEarth', 'assets/character/PersoEarth.png', 32, playerHeight);

            //COLLECTIBLES************************************************************
            this.game.load.spritesheet('coins', 'assets/Collectibles/coins.png',35,35);
            this.game.load.spritesheet('keys', 'assets/Objects/keys.png',30,20);
            this.game.load.spritesheet('locks', 'assets/Objects/locks.png',70,70);
            this.game.load.spritesheet('orbs', 'assets/Orbs/orbs.png',64,64);
            this.game.load.spritesheet('powersUp', 'assets/Objects/powersUp.png', 32, 32);
            this.game.load.spritesheet('potions', 'assets/Potions/potions.png', 35, 35);
            this.game.load.image('emptyOrb', 'assets/Orbs/EmptyOrb.png');

            //MAP INTERACTIBLE********************************************************
            this.game.load.spritesheet('liquidTop', 'assets/Tiles/liquidTop.png',70,40);
            this.game.load.spritesheet('liquid', 'assets/Tiles/liquid.png',70,70);
            this.game.load.image('portal', 'assets/Objects/portal.png');
            this.game.load.spritesheet('ladder', 'assets/Objects/ladders.png',70,70);
            this.game.load.spritesheet('deleteOptions', 'assets/Objects/deleteOptions.png',70,70);
            this.game.load.image('cage', 'assets/Tiles/cage.png');
            this.game.load.image('savePoints', 'assets/Objects/savePoints.png');
            this.game.load.spritesheet('powerUpBlocks', 'assets/Tiles/powerUpBlocks.png',70,70);

            //TRAPS**********************************************************************
            this.game.load.image('spikes', 'assets/Traps/spikes.png');

            //HUD**********************************************************************
            this.game.load.image('heart', 'assets/Hud/heart.png');
            this.game.load.image('outline', 'assets/Hud/outlineSelected.png');
            this.game.load.spritesheet('powersUpHud', 'assets/Hud/powersUp.png', 32, 32);
            this.game.load.spritesheet('commandsHud', 'assets/Hud/menuCommands.png', 80, 80);
            this.game.load.spritesheet('swordChoices', 'assets/Equipement/SwordsCraft.png', 15, 45);
            this.game.load.spritesheet('shieldChoices', 'assets/Equipement/ShieldsCraft.png', 25, 32);
            this.game.load.image('baseEquipement', 'assets/Hud/baseEquipement.png');
            this.game.load.text('gameplayInfo', 'assets/Texts/infoGameplayTutoWorld.txt');

            //PARTICLE SYSTEM************************************************************
            this.game.load.image('stars', 'assets/Particles/star.png');
            this.game.load.image('starsDark', 'assets/Particles/starDark.png');
            this.game.load.image('starsSky', 'assets/Particles/starSky.png');

            //OTHERS**************************************************************************
            this.game.load.image('cloud_2', 'assets/Decors/cloud_2.png');

            //ENEMIES******************************************************************************
            //*********************** World 1 *****************************************************
            this.game.load.image('slime', 'assets/Enemies/slime.png');
            this.game.load.image('bat', 'assets/Enemies/bat2.png');
            this.game.load.image('zombie', 'assets/Enemies/zombie.png');
            this.game.load.image('spikySlime', 'assets/Enemies/spikySlime.png');
            this.game.load.image('carnivorPlant', 'assets/Enemies/carnivorPlant.png');
            //*********************** World 2 *****************************************************
            this.game.load.image('skeleton', 'assets/Enemies/skeleton.png');
            this.game.load.image('mummy', 'assets/Enemies/mummy.png');
            this.game.load.image('pyramidRock', 'assets/Enemies/pyramidRock.png');
            this.game.load.image('desertSoul', 'assets/Enemies/desertSoul.png');
            this.game.load.image('golem', 'assets/Enemies/golem.png');
            //*********************** World 3 *****************************************************
            this.game.load.image('wolf', 'assets/Enemies/wolf.png');

            this.game.stage.backgroundColor = '#3BB9FF';
            this.game.world.setBounds(0, 0, 3500, 3500);
            cursors = this.game.input.keyboard.createCursorKeys();
    },
    create: function()
    {
        this.game.state.start('World0');
    }
}