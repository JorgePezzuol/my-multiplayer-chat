export default class PlayerMovement {
  constructor(gameScene) {
    this.gameScene = gameScene;
  }

  init() {
    const gameSceneContext = this.gameScene;
    if (this.gameScene.player) {
      const speed = 100;
      this.gameScene.player.body.setVelocity(0);

      // Horizontal movement
      if (this.gameScene.cursors.left.isDown) {
        this.gameScene.player.body.setVelocityX(-speed);
      } else if (this.gameScene.cursors.right.isDown) {
        this.gameScene.player.body.setVelocityX(speed);
      }
      if (this.gameScene.cursors.up.isDown) {
        this.gameScene.player.body.setVelocityY(-speed);
      } else if (this.gameScene.cursors.down.isDown) {
        this.gameScene.player.body.setVelocityY(speed);
      }

      // Normalize and scale the velocity so that player can't move faster along a diagonal
      this.gameScene.player.body.velocity.normalize().scale(speed);

      if (this.gameScene.cursors.left.isDown) {
        this.gameScene.player.anims.play("misa-left-walk", true);
        this.gameScene.socket.emit("playerMovement", {
          x: gameSceneContext.player.x,
          y: gameSceneContext.player.y,
          animation: "misa-left-walk",
          username: localStorage.getItem("username"),
        });
      } else if (this.gameScene.cursors.right.isDown) {
        this.gameScene.player.anims.play("misa-right-walk", true);
        this.gameScene.socket.emit("playerMovement", {
          x: gameSceneContext.player.x,
          y: gameSceneContext.player.y,
          animation: "misa-right-walk",
          username: localStorage.getItem("username"),
        });
      } else if (this.gameScene.cursors.up.isDown) {
        this.gameScene.player.anims.play("misa-back-walk", true);
        this.gameScene.socket.emit("playerMovement", {
          x: gameSceneContext.player.x,
          y: gameSceneContext.player.y,
          animation: "misa-back-walk",
          username: localStorage.getItem("username"),
        });
      } else if (this.gameScene.cursors.down.isDown) {
        this.gameScene.player.anims.play("misa-front-walk", true);
        this.gameScene.socket.emit("playerMovement", {
          x: gameSceneContext.player.x,
          y: gameSceneContext.player.y,
          animation: "misa-front-walk",
          username: localStorage.getItem("username"),
        });
      } else {
        this.gameScene.player.anims.stop();
        this.gameScene.socket.emit("playerMovement", {
          x: gameSceneContext.player.x,
          y: gameSceneContext.player.y,
          animation: "",
          username: localStorage.getItem("username"),
        });
      }
      this.gameScene.player.username.x = this.gameScene.player.x - 30;
      this.gameScene.player.username.y = this.gameScene.player.y - 30;
    }
  }
}
