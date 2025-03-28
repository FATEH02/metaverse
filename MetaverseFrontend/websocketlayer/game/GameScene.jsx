import Phaser from "phaser";

class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.players = {}; 
  }

  preload() {
    this.load.image("tiles1", "/websocketlayer/assets/grasslands.png");
    this.load.image("tiles2", "/websocketlayer/assets/interiors.png");
    this.load.tilemapTiledJSON("map", "/websocketlayer/assets/map10.json");

    this.load.spritesheet(
      "player",
      "/websocketlayer/public/sprites/characters/Character_003.png",
      {
        frameWidth: 32,
        frameHeight: 37,
        margin: 8,
        spacing: 0,
      }
    );

    this.load.image("background", "/websocketlayer/assets/grass.png");
  }
  create() {
    const map = this.make.tilemap({ key: "map" });

    const tileset1 = map.addTilesetImage("tiles1", "tiles1");
    // const tileset2 = map.addTilesetImage("tiles2", "tiles2");

    map.createLayer("Tile Layer 1", tileset1, 0, 0);
    const layer2 = map.createLayer("Tile Layer 2", tileset1, 0, 0);

    this.player = this.physics.add.sprite(300, 300, "player");
    this.cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.collider(this.player, layer2);
    layer2.setCollisionBetween(11, 13);
    this.player.setOrigin(1, 1);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player);

    this.setupWebSocket();

    
    //! Defining character animations
    this.anims.create({
      key: "walk-down",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-left",
      frames: this.anims.generateFrameNumbers("player", { start: 4, end: 7 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-right",
      frames: this.anims.generateFrameNumbers("player", { start: 8, end: 11 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-up",
      frames: this.anims.generateFrameNumbers("player", { start: 12, end: 15 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  setupWebSocket() {
    this.socket = new WebSocket("ws://localhost:3000");

    this.socket.onopen = () => {
      this.socket.send(
        JSON.stringify({
          type: "join",
          payload: {
            spaceId: localStorage.getItem("spaceid"),
            token: localStorage.getItem("token"),
          },
        })
      );
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      //  console.log(data.type);

      switch (data.type) {
        case "space-joined":
          console.log(`space joined ${data.payload.user}`);

          this.player.setPosition(data.payload.spawn.x, data.payload.spawn.y);
          data.payload.users.forEach((user) => this.addOtherPlayer(user));
          break;

        case "user-joined":
          console.log(`player joinded:${data.payload}`);
          this.addOtherPlayer(data.payload);
          break;

        case "move":
          if (this.players[data.payload.userId]) {
            console.log("another player moveddd:", data.payload.X);
            this.players[data.payload.userId].setPosition(
              data.payload.x,
              data.payload.y
            );

            this.updateOtherPlayerAnimation(
              this.players[data.payload.userId],
              data.payload.dx,
              data.payload.dy
            );
          }
          break;

        case "user-left":
          if (this.players[data.payload.userId]) {
            this.players[data.payload.userId].destroy();
            delete this.players[data.payload.userId];
          }
          break;
      }
    };
  }

  addOtherPlayer(user) {
    if (!this.players[user.userId]) {
      this.players[user.userId] = this.add.sprite(user.x, user.y, "player");
    }
  }

  update() {
    let moved = false;
    let dx = 0,
      dy = 0;

    this.player.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-200);
      this.player.anims.play("walk-left", true);
      moved = true;
      dx = -1;
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(200);
      this.player.anims.play("walk-right", true);
      moved = true;
      dx = 1;
    } else if (this.cursors.up.isDown) {
      this.player.setVelocityY(-200);
      this.player.anims.play("walk-up", true);
      moved = true;
      dy = -1;
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(200);
      this.player.anims.play("walk-down", true);
      moved = true;
      dy = 1;
    } else {
      this.player.anims.stop();
    }

    if (moved) {
      this.socket.send(
        JSON.stringify({
          type: "move",
          payload: {
            x: Math.round(this.player.x),
            y: Math.round(this.player.y),
            dx: dx,
            dy: dy,
          },
        })
      );
    }
  }

  updateOtherPlayerAnimation(player, dx, dy) {
    if (dx === -1) {
      player.anims.play("walk-left", true);
    } else if (dx === 1) {
      player.anims.play("walk-right", true);
    } else if (dy === -1) {
      player.anims.play("walk-up", true);
    } else if (dy === 1) {
      player.anims.play("walk-down", true);
    } else {
      player.anims.stop();
    }
  }
}

export default GameScene;
