const getServers = {
  method: 'GET',
  path: '/servers',
  handler: async function (request, h) {
    return [];
  },
};

export default [
  getServers,
];