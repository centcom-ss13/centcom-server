const getServers = {
  method: 'GET',
  path: '/servers',
  handler: async function (request, h) {
    return [];
  },
  options: {
    auth: false,
  },
};

export default [
  getServers,
];