import Game from "./game.js";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "game-container",
  pixelArt: false,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
    },
  },
  scene: [Game],
};

// open modal to enter username and start game
Array.from(document.querySelectorAll(".close-modal")).forEach((element) => {
  element.addEventListener("click", () => {
    document.querySelector("#UsernameModal").style.display = "none";
  });
});

document.querySelector("#UsernameModal").style.display = "block";

document
  .querySelector("#btn-save-username")
  .addEventListener("click", (evt) => {
    if (document.querySelector("#username").value !== "") {
      localStorage.setItem(
        "username",
        document.querySelector("#username").value
      );
      document.querySelector("#UsernameModal").style.display = "none";
      startGame();
      document.querySelector("#btn-show-game").style.display = "block";
    }
  });

document.querySelector("#btn-show-game").addEventListener("click", (event) => {
  event.preventDefault();

  const gameDiv = document.querySelector("#game-container");
  if (gameDiv.style.display === "none") {
    gameDiv.style.display = "block";
  } else {
    gameDiv.style.display = "none";
  }

  const meetingDiv = document.querySelector("#meeting");
  if (meetingDiv.style.display === "none") {
    meetingDiv.style.display = "block";
  } else {
    meetingDiv.style.display = "none";
  }
});

function startGame() {
  const game = new Phaser.Game(config);
}
