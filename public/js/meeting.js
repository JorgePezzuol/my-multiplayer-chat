import hark from "./vendor/hark.js";

const domain = "meet.jit.si";
const options = {
  roomName: "jorgepezzuol_",
  width: 800,
  height: 600,
  parentNode: document.querySelector("#meeting"),
  interfaceConfigOverwrite: {
    SHOW_JITSI_WATERMARK: false,
    SHOW_WATERMARK_FOR_GUESTS: false,
  },
};

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
      context.isSpeaking = true;
      context.socket.emit("playerHasSpoken", {
        playerId: context.socket.id,
        isSpeaking: context.isSpeaking,
      });
    });

    speechEvents.on("stopped_speaking", () => {});
  } catch (error) {
    console.log("navigator.getUserMedia error: ", error);
  }
}
