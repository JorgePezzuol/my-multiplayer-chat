export function update() {

    if (this.player) {
      const speed = 120;
      this.player.body.setVelocity(0);

      if(this.keyA.isDown) {
        this.player.body.setVelocityX(-speed);
      }

      // Horizontal movement
      if (this.keyA.isDown) {
        this.player.body.setVelocityX(-speed);
      } else if (this.keyD.isDown) {
        this.player.body.setVelocityX(speed);
      }
      if (this.keyW.isDown) {
        this.player.body.setVelocityY(-speed);
      } else if (this.keyS.isDown) {
        this.player.body.setVelocityY(speed);
      }

      // Normalize and scale the velocity so that player can't move faster along a diagonal
      this.player.body.velocity.normalize().scale(speed);

      if (this.keyA.isDown) {
        this.player.anims.play("misa-left-walk", true);
        this.socket.emit("playerMovement", {
          x: this.player.x,
          y: this.player.y,
          animation: "misa-left-walk",
        });
      } else if (this.keyD.isDown) {
        this.player.anims.play("misa-right-walk", true);
        this.socket.emit("playerMovement", {
          x: this.player.x,
          y: this.player.y,
          animation: "misa-right-walk",
        });
      } else if (this.keyW.isDown) {
        this.player.anims.play("misa-back-walk", true);
        this.socket.emit("playerMovement", {
          x: this.player.x,
          y: this.player.y,
          animation: "misa-back-walk",
        });
      } else if (this.keyS.isDown) {
        this.player.anims.play("misa-front-walk", true);
        this.socket.emit("playerMovement", {
          x: this.player.x,
          y: this.player.y,
          animation: "misa-front-walk",
        });
      } else {
        this.player.anims.stop();
        this.socket.emit("playerMovement", {
          x: this.player.x,
          y: this.player.y,
          animation: "",
        });
      }
    }
}