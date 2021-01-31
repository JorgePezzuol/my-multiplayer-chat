document.addEventListener("DOMContentLoaded", () => {
  const domain = "meet.jit.si";
  const options = {
    roomName: "JorgePezzuol",
    width: 800,
    height: 600,
    parentNode: document.querySelector("#meeting"),
  };
  const api = new JitsiMeetExternalAPI(domain, options);
  //console.log(api.getParticipantsInfo());

  api.addEventListener("participantJoined", function (event) {
    //console.log(api.getParticipantsInfo());
    console.log("aqui");
    console.log(event.displayName);
  });
});
