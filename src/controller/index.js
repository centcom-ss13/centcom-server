const index = {
  method: 'GET',
  path: '/',
  handler: function () {
    return 'Hello world!';
  },
  options: {
    auth: false,
  },
};

export default [
  index,
];