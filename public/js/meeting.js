export default function (context, self) {
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
  const api = new JitsiMeetExternalAPI(domain, options);
  api.executeCommand('displayName', localStorage.getItem("username"));

  api.addEventListener("incomingMessage", (event) => {
    alert(`From: ${event.from} Message: ${event.message} Socket: ${context.socket.id}`);
  });

}
