const load = async (participants$: any, conferenceDetails$: any) => {

  let response: Response;
  const filePath = './custom_configuration/plugins/anonymizer/plugin.json';
  try {
    response = await fetch(filePath);
  } catch {
    throw Error(`Cannot retrieve the file "${filePath}"`);
  }
  if (response.status != 200) {
    throw Error(`Cannot retrieve file "${filePath}"`);
  } 

  const json = await response.json();

  const configuration = json.configuration;

  const prefix = configuration.prefix;

  (window as any).PEX.actions$.ofType('[Conference] Connect Success').subscribe( (action: any) => {

    let participants: any = []
    participants$.subscribe((participantsArray: any) => {
      participants = participantsArray
    })

    const onParticipantCreate = (window as any).PEX.pexrtc.onParticipantCreate;
    const onParticipantUpdate = (window as any).PEX.pexrtc.onParticipantUpdate;

    (window as any).PEX.pexrtc.onParticipantCreate = (participant: any) => {
      if (!participant.overlay_text.match(new RegExp('^' + prefix))) {
        // Only change the overlay_text if we are the first HOST to join the meeting
        let hostParticipants = participants.filter((participant: any) => participant.role=="chair")
        hostParticipants.sort((a: any, b: any) => a.startTime - b.startTime)
        const myUuid = (window as any).PEX.pexrtc.uuid;
        const myRole = (window as any).PEX.pexrtc.role;
        let name = participant.overlay_text;
        if ((myRole == 'HOST') && (myUuid == participant.uuid ||
          (participant.role != 'chair' && (hostParticipants.length == 0 || hostParticipants[0]?.uuid == myUuid)))) {
          const random = Math.floor(Math.random() * 9999);
          const zerofilled = ('0000'+ random).slice(-4);
          const newName = prefix + zerofilled;
          (window as any).PEX.pexrtc.setParticipantText(participant.uuid, newName);
          participant.display_name = newName;
          participant.uri = newName;
          onParticipantCreate(participant);
        }
        // Don't trigger onParticipant create in this case. We will wait until the
        // overlay_text is updated by the host and call it in onParticipantUpdate.
        return;
      }
      participant.display_name = participant.overlay_text;
      participant.uri = participant.overlay_text;
      onParticipantCreate(participant);
    }

    (window as any).PEX.pexrtc.onParticipantUpdate = (participant: any) => {
      participant.display_name = participant.overlay_text;
      participant.uri = participant.overlay_text;
      onParticipantCreate(participant);
      onParticipantUpdate(participant);
    }

  });
  
}

(window as any).PEX.pluginAPI.registerPlugin({
  id: 'plugin-anonymizer',
  load: load,
  unload: () => console.log('Plugin Anonymizer', 'Unloaded')
});