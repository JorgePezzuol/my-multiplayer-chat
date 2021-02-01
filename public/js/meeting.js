export default function (context, self) {
  const domain = "meet.jit.si";
  const options = {
    roomName: "JorgePezzuol",
    width: 800,
    height: 600,
    parentNode: document.querySelector("#meeting"),
    interfaceConfigOverwrite: {
      SHOW_JITSI_WATERMARK: false,
      SHOW_WATERMARK_FOR_GUESTS: false,
    },
  };
  const api = new JitsiMeetExternalAPI(domain, options);
}
