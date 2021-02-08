import GameScene from "./scenes/GameScene.js";

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
  scene: [GameScene],
};

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// open modal to enter username and start game
Array.from($$(".close-modal")).forEach((element) => {
  element.addEventListener("click", () => {
    $("#UsernameModal").style.display = "none";
  });
});

$("#UsernameModal").style.display = "block";

$("#btn-save-username").addEventListener("click", (evt) => {
  if ($("#username").value !== "") {
    localStorage.setItem("username", $("#username").value);
    $("#UsernameModal").style.display = "none";
    startGame();
    $("#btn-show-game").style.display = "block";
  }
});

$("#btn-show-game").addEventListener("click", (event) => {
  event.preventDefault();

  const gameDiv = $("#game-container");
  if (gameDiv.style.display === "none") {
    gameDiv.style.display = "block";
  } else {
    gameDiv.style.display = "none";
  }

  const meetingDiv = $("#meeting");
  if (meetingDiv.style.display === "none") {
    meetingDiv.style.display = "block";
  } else {
    meetingDiv.style.display = "none";
  }
});

function startGame() {
  const game = new Phaser.Game(config);
}
