export function _update(context) {
  if (context.player) {
    const speed = 120;
    context.player.body.setVelocity(0);

    if (context.keyA.isDown) {
      context.player.body.setVelocityX(-speed);
    }

    // Horizontal movement
    if (context.keyA.isDown) {
      context.player.body.setVelocityX(-speed);
    } else if (context.keyD.isDown) {
      context.player.body.setVelocityX(speed);
    }
    if (context.keyW.isDown) {
      context.player.body.setVelocityY(-speed);
    } else if (context.keyS.isDown) {
      context.player.body.setVelocityY(speed);
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    context.player.body.velocity.normalize().scale(speed);

    if (context.keyA.isDown) {
      context.player.anims.play("misa-left-walk", true);
      context.socket.emit("playerMovement", {
        x: context.player.x,
        y: context.player.y,
        animation: "misa-left-walk",
      });

      // console.log(context.otherPlayers);
      // context.text.x = Math.floor(context.player.x - 30);
      // context.text.y = Math.floor(context.player.y - 30);

    } else if (context.keyD.isDown) {
      context.player.anims.play("misa-right-walk", true);
      context.socket.emit("playerMovement", {
        x: context.player.x,
        y: context.player.y,
        animation: "misa-right-walk",
      });
    } else if (context.keyW.isDown) {
      context.player.anims.play("misa-back-walk", true);
      context.socket.emit("playerMovement", {
        x: context.player.x,
        y: context.player.y,
        animation: "misa-back-walk",
      });
    } else if (context.keyS.isDown) {
      context.player.anims.play("misa-front-walk", true);
      context.socket.emit("playerMovement", {
        x: context.player.x,
        y: context.player.y,
        animation: "misa-front-walk",
      });
    } else {
      context.player.anims.stop();
      context.socket.emit("playerMovement", {
        x: context.player.x,
        y: context.player.y,
        animation: "",
      });
    }
  }
}
