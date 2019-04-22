module.exports = function (api) {
  api.cache(true);

  const presets = ['@babel/preset-env'];
  const plugins = [
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-transform-runtime',
    'babel-plugin-wildcard',
    ["babel-plugin-inline-import", {
      "extensions": [
        ".sql"
      ]
    }],
  ];

  return {
    presets,
    plugins,
  };
};