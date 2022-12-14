const path = require('path');

const GenerateJsonPlugin = require('generate-json-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

const package = require('./package.json');
const pluginJson = require('./templates/plugin.json');

const conferencingNodeUrl = process.env.npm_config_conferencing_node_url;
const port = process.env.npm_config_port;

pluginJson.version = package.version;

module.exports = {
  devServer: {
    headers: {
      'content-type': '',
      'Content-Type': '',
    },
    port: port,
    compress: false, // needed for SSE support
    server: {
      type: 'https'
    },
    open: true,
    devMiddleware: {
      publicPath: '/webapp2/custom_configuration/plugins/anonymizer'
    },
    proxy: [
      {
        context: ['**', '!/webapp2/custom_configuration/**'],
        target: conferencingNodeUrl, // Conferencing Node URL
        secure: false
      }
    ],
    static: {
      directory: path.join(__dirname, "dev-assets"),
      publicPath: '/webapp2/custom_configuration'
    }
  },
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.css$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist/plugins/anonymizer'),
    publicPath: ''
  },
  plugins: [
    new GenerateJsonPlugin('plugin.json', pluginJson, null, 2)
  ],
  // Disable the performance message for now
  performance: {
    hints: false
  }
};