export default function (context, self) {
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
    //console.log(event.displayName);

    context.socket.emit("playerJoinsCall", event.displayName);

    //const style = { font: "16px Arial", fill: "#ff0044", wordWrap: true, wordWrapWidth: 30, align: "center", backgroundColor: "#ffff00" };
    //self.text = self.add.text(0, 0, event.displayName, style);
    
  });
}
