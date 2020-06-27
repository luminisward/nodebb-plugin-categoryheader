const SocketPlugins = require.main.require('./src/socket.io/plugins');

const socketMethods = require('./websockets');

const plugin = {};

plugin.init = async () => {
  SocketPlugins.categoryheader = socketMethods;
};

module.exports = plugin;
