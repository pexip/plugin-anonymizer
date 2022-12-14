# Plugin anonymizer

This plugin that helps to anonymize the user's display names. This way, when a user connects, the meeting host will change the username of all connected participants to something as Anonymous_3245.

## Prerequisites

The only prerequisite for building this project is to have `node` and `npm` in your system. At this moment we are using the following versions:

- node: `16.14.2`
- npm:  `8.5.0`

Other `node` and `npm` could work, but it's recommended to use the same versions.

## Generate a production package

For generating the production package we need follow the next steps:

Install the `node` dependencies:

    $ npm install

Build a production package:

    $ npm run build

This will create a  `dist` folder with the follow architecture:

```
📁 dist
↳ 📁 plugins
  ↳ 📁 anonymizer
    ↳ 📄 index.js
    ↳ 📄 index.js.LICENSE.txt
    ↳ 📄 plugin.json
```

The main files are these two:

- `index.js`: Contains the whole minified JavaScript code for this plugin.
  
- `plugin.json`: Defines the plugin configuration. In the following section we will learn how to modify these values.


## Configure the plugin

This plugin allow to configure its behavior. It can be done by modifying the file `plugin.json`:

| Parameter         | Type                    | Description  |
| ----------------- | ----------------------- | ------------ |
| prefix     | number                 | Prefix to include to the participant name. For example, if the prefix is`anonymous_`, the username could be `anonymous_2342`. |


## Testing in local

The first step before testing in local is to configure the file `.npmrc`. In this file we will have to define the following parameters:

- `CONFERENCING_NODE_URL`: The URL of the Conferencing Node that you want to use for testing.
- `PORT`: The local port for using for the interpreter.

The first step is to compile the node dependencies:

    $ npm install

If we want to launch it, we will use the following command:

    $ npm run start

## Add a new configuration parameter (developers only)

Suppose that your are developing a new functionality for this plugin and you need to add a new configuration parameter to the `plugin.json` file.

The first step is to add the new parameter to the file `src/config/config.ts`.

Now we need to recreate the file `config-ti.ts` through the following command:

    $ npx ts-interface-builder src/config/config.ts

Now the plugin will check if this parameter exists, is valid and display an error message if necessary.

Don't forget to modify the template located in `templates/plugin.json`.
