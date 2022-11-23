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

  const pluginId = json.id;
  const configuration = json.configuration;

  const prefix = configuration.prefix;

  participants$.subscribe((participants: any) => {

    if (participants.length > 0) {
      // Get the current user
      const me = participants.find((participant: any) => participant.uuid === (window as any).PEX.selfUUID);
      // Check if the user has host permissions
      console.log('My User');
      console.log(me)
      if (me.role === 'chair') {
        participants.forEach((participant: any) => {
          console.log('One Participant');
          console.log(participant);
          // Check if the participant was already anonymizer
          if (!participant.name.match(new RegExp('^' + prefix))) {
            // Anonymize this user
            const path = '/participants/' + participant.uuid + '/overlaytext';;
            //(window as any).PEX.pluginAPI.sendRequest(path, { text: prefix + '123' });
            const random = Math.floor(Math.random() * 9999);
            const zerofilled = ('0000'+ random).slice(-4);
            (window as any).PEX.pexrtc.setParticipantText(participant.uuid, prefix + zerofilled);
          }         
        });
      }
    }
  });



  
  conferenceDetails$.subscribe((conferenceDetails: any) => {
    console.log('Obtaining confernece details');
    console.log(conferenceDetails);
  });

  (window as any).PEX.actions$.ofType('[Home] Screen state').subscribe( (action: any) => {

  });

  (window as any).PEX.actions$.ofType('[Conference] Connect Success').subscribe( (action: any) => {
    const onParticipantUpdate = (window as any).PEX.pexrtc.onParticipantUpdate;
    (window as any).PEX.pexrtc.onParticipantUpdate = (participant: any) => {
      participant.display_name = participant.overlay_text;
      participant.uri = participant.overlay_text;
      onParticipantUpdate(participant);
    }
  });
  
  (window as any).PEX.actions$.ofType('[Conference] Disconnect').subscribe(() => {

  });
  
}

(window as any).PEX.pluginAPI.registerPlugin({
  id: 'plugin-anonymizer',
  load: load,
  unload: () => console.log('Plugin Anonymizer', 'Unloaded')
});