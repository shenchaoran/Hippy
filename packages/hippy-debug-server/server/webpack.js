const Webpack = require('webpack');
const WebpackDevServer = require('../webpack-dev-server/lib/Server');

const startWebpackDevServer = async (webpackConfig) => {
  const compiler = Webpack(webpackConfig);
  const server = new WebpackDevServer(webpackConfig.devServer, compiler);
  await server.start();
};

module.exports = { startWebpackDevServer };
