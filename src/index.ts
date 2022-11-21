const load = async () => {
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


  (window as any).PEX.actions$.ofType('[Home] Screen state').subscribe( (action: any) => {

  });

  (window as any).PEX.actions$.ofType('[Conference] Connect Success').subscribe( (action: any) => {

  });
  
  (window as any).PEX.actions$.ofType('[Conference] Disconnect').subscribe(() => {

  });
  
}

(window as any).PEX.pluginAPI.registerPlugin({
  id: 'interpretation-plugin',
  load: load,
  unload: () => console.log('Plugin Anonymizer', 'Unloaded')
});