import hark from "./vendor/hark.js";

const domain = "meet.jit.si";
const options = {
  roomName: "gambuzinos",
  width: 800,
  height: 600,
  parentNode: document.querySelector("#meeting"),
  interfaceConfigOverwrite: {
    SHOW_JITSI_WATERMARK: false,
    SHOW_WATERMARK_FOR_GUESTS: false,
    SHOW_CHROME_EXTENSION_BANNER: false,
    TOOLBAR_BUTTONS: [
      "microphone",
      "camera",
      "hangup",
      "profile",
      "recording",
      "livestreaming",
      "sharedvideo",
      "settings",
      "raisehand",
      "videoquality",
      "filmstrip",
      "invite",
      "feedback",
      "stats",
      "shortcuts",
      "tileview",
      "videobackgroundblur",
      "download",
      "help",
      "mute-everyone",
      "security",
    ],
  },
};

document.querySelector("#chat").style.display = "block";

export default async function (context, self) {
  const api = new JitsiMeetExternalAPI(domain, options);

  api.executeCommand("displayName", localStorage.getItem("username"));

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    const speechEvents = new hark(stream, options);

    speechEvents.on("speaking", () => {
      context.socket.emit("playerHasSpoken", {
        playerId: context.socket.id,
      });
    });

    speechEvents.on("stopped_speaking", () => {});
  } catch (error) {
    console.log("navigator.getUserMedia error: ", error);
  }

  document.querySelector("#chatMessage").addEventListener("keydown", (e) => {
    e.stopPropagation();
    if (e.key === "Enter") {
      const message = document.querySelector("#chatMessage").value;

      const ballonMessage = `
      <section class="-right">
      <span>${localStorage.getItem("username")}:</span>
      <div class="nes-balloon from-left">
        <p>${message}</p>
      </div>
        
      </section>`;

      if (message !== "") {
        document
          .querySelector("#chatMessageSection")
          .insertAdjacentHTML("beforeend", ballonMessage);
        context.socket.emit("playerSentChatMessage", {
          playerId: context.socket.id,
          message: message,
        });

        document.querySelector("#chatMessage").value = "";
      }
    }
  });

  context.socket.on("showChatMessage", (response) => {
    const ballonMessage = `
    <section class="-left">
    <span>${response.username}:</span>
      <div class="nes-balloon from-right">
        <p>${response.message}</p>
      </div>
    </section>`;

    document
      .querySelector("#chatMessageSection")
      .insertAdjacentHTML("beforeend", ballonMessage);
  });
}
