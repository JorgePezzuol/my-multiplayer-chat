export function _update(context) {
  if (context.player) {
    const speed = 100;
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
        username: localStorage.getItem("username"),
      });
    } else if (context.keyD.isDown) {
      context.player.anims.play("misa-right-walk", true);
      context.socket.emit("playerMovement", {
        x: context.player.x,
        y: context.player.y,
        animation: "misa-right-walk",
        username: localStorage.getItem("username"),
      });
    } else if (context.keyW.isDown) {
      context.player.anims.play("misa-back-walk", true);
      context.socket.emit("playerMovement", {
        x: context.player.x,
        y: context.player.y,
        animation: "misa-back-walk",
        username: localStorage.getItem("username"),
      });
    } else if (context.keyS.isDown) {
      context.player.anims.play("misa-front-walk", true);
      context.socket.emit("playerMovement", {
        x: context.player.x,
        y: context.player.y,
        animation: "misa-front-walk",
        username: localStorage.getItem("username"),
      });
    } else {
      context.player.anims.stop();
      context.socket.emit("playerMovement", {
        x: context.player.x,
        y: context.player.y,
        animation: "",
        username: localStorage.getItem("username"),
      });
    }

    context.player.username.x = context.player.x - 30;
    context.player.username.y = context.player.y - 30;
  }
}
