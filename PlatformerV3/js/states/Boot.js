var boot = function(game)
{
};
  
boot.prototype = 
{
    preload: function()
    {
          
    },
    create: function()
    {
        loadGame();
        this.game.state.start('Preloader', true, false);
    },
    init: function() 
    {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.setScreenSize();
    }
}