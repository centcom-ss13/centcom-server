const path = require('path');
var nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'production',
  entry: './src/index',
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  useBuiltIns: "entry",
                },
              ],
            ],
            plugins: [
              '@babel/plugin-proposal-object-rest-spread',
              '@babel/plugin-transform-runtime',
              'babel-plugin-wildcard',
              ["babel-plugin-inline-import", {
                "extensions": [
                  ".sql"
                ]
              }],
            ],
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.sql'],
    modules: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, './src'),
    ]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    library: "CentComServer",
    libraryTarget: "umd",
  },
};