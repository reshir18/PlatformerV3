var boot = function(game)
{
    console.log("%cStarting my awesome game", "color:white; background:red");
};
  
boot.prototype = 
{
    preload: function()
    {
          
    },
    create: function()
    {

        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.setScreenSize();
        loadGame();
        
        this.game.state.start('Preloader', true, false);
    }
}