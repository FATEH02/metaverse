import React, { useEffect } from 'react';//importing the react
import Phaser, { AUTO } from 'phaser';//importing the phaser
import GameScene from  "../game/GameScene"//importing the gamescene

const GameContainer = () => {

  useEffect(() => {//runs one after react mounts this compnonets
    //configourations to run a phaser game
    const config = {
      type: Phaser.AUTO,  //webgl will be chosed if canvas not avaliable 
      width:window.innerWidth,   //Game canvas size
      height: window.innerHeight,   //game cavas height
      parent: 'game-container', 
      scene: [GameScene], //game logic
      physics: { //usaes arcasde physics which is simple and good for 2d games
        default: 'arcade',
        arcade: {
          debug: false
        }
      }
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="game-container" />;
};

export default GameContainer;
